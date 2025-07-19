import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createInvoiceSchema = z.object({
  corporate: z.string().min(1),
  corporateId: z.string().min(1),
  selectedPO: z.object({
    id: z.string(),
    number: z.string(),
    balance: z.number()
  }).optional(),
  appointmentIds: z.array(z.string()).min(1),
  subtotal: z.number().positive(),
  gstAmount: z.number().min(0),
  total: z.number().positive(),
  createdBy: z.string().min(1)
});

const updateInvoiceStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE'])
});

const invoiceFilterSchema = z.object({
  corporate: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

export class InvoiceController {
  async getInvoices(req: Request, res: Response): Promise<void> {
    try {
      const filters = invoiceFilterSchema.parse(req.query);
      const page = parseInt(filters.page || '1');
      const limit = parseInt(filters.limit || '10');
      const skip = (page - 1) * limit;

      const where: any = {};

      // Apply filters
      if (filters.corporate) {
        where.corporate = {
          contains: filters.corporate,
          mode: 'insensitive'
        };
      }

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.startDate) {
        where.createdDate = {
          ...where.createdDate,
          gte: new Date(filters.startDate)
        };
      }

      if (filters.endDate) {
        where.createdDate = {
          ...where.createdDate,
          lte: new Date(filters.endDate)
        };
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          include: {
            corporateRel: {
              select: { name: true, gstin: true }
            },
            selectedPO: {
              select: { id: true, number: true, balance: true }
            },
            appointments: {
              include: {
                appointment: {
                  select: {
                    id: true,
                    employeeName: true,
                    employeeId: true,
                    appointmentDate: true,
                    serviceRate: true,
                    packageType: true,
                    serviceType: true
                  }
                }
              }
            }
          },
          orderBy: { createdDate: 'desc' },
          skip,
          take: limit
        }),
        prisma.invoice.count({ where })
      ]);

      // Transform the data to match frontend expectations
      const transformedInvoices = invoices.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        corporate: invoice.corporate,
        corporateId: invoice.corporateId,
        selectedPO: invoice.selectedPO ? {
          id: invoice.selectedPO.id,
          number: invoice.selectedPO.number,
          balance: invoice.selectedPO.balance
        } : undefined,
        appointments: invoice.appointments.map(ia => ia.appointment),
        subtotal: invoice.subtotal,
        gstAmount: invoice.gstAmount,
        total: invoice.total,
        createdDate: invoice.createdDate.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        status: invoice.status,
        createdBy: invoice.createdBy
      }));

      res.json({
        invoices: transformedInvoices,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({
        error: {
          message: 'Failed to fetch invoices',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async getInvoiceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          corporateRel: {
            select: { name: true, gstin: true, address: true }
          },
          selectedPO: {
            select: { id: true, number: true, balance: true, total: true }
          },
          appointments: {
            include: {
              appointment: {
                select: {
                  id: true,
                  employeeName: true,
                  employeeId: true,
                  appointmentDate: true,
                  serviceRate: true,
                  packageType: true,
                  serviceType: true,
                  age: true,
                  gender: true
                }
              }
            }
          }
        }
      });

      if (!invoice) {
        res.status(404).json({
          error: { message: 'Invoice not found' }
        });
        return;
      }

      // Transform the data to match frontend expectations
      const transformedInvoice = {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        corporate: invoice.corporate,
        corporateId: invoice.corporateId,
        selectedPO: invoice.selectedPO ? {
          id: invoice.selectedPO.id,
          number: invoice.selectedPO.number,
          balance: invoice.selectedPO.balance,
          total: invoice.selectedPO.total
        } : undefined,
        appointments: invoice.appointments.map(ia => ia.appointment),
        subtotal: invoice.subtotal,
        gstAmount: invoice.gstAmount,
        total: invoice.total,
        createdDate: invoice.createdDate.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        status: invoice.status,
        createdBy: invoice.createdBy
      };

      res.json(transformedInvoice);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      res.status(500).json({
        error: {
          message: 'Failed to fetch invoice',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async createInvoice(req: Request, res: Response): Promise<void> {
    try {
      const data = createInvoiceSchema.parse(req.body);

      // Generate invoice number
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;

      // Create invoice in transaction
      const invoice = await prisma.$transaction(async (tx) => {
        const newInvoice = await tx.invoice.create({
          data: {
            invoiceNumber,
            corporate: data.corporate,
            corporateId: data.corporateId,
            purchaseOrderId: data.selectedPO?.id,
            subtotal: data.subtotal,
            gstAmount: data.gstAmount,
            total: data.total,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            status: 'DRAFT',
            createdBy: data.createdBy
          }
        });

        // Create invoice-appointment relationships
        await tx.invoiceAppointment.createMany({
          data: data.appointmentIds.map(appointmentId => ({
            invoiceId: newInvoice.id,
            appointmentId
          }))
        });

        return newInvoice;
      });

      // Fetch the created invoice with all relationships
      const createdInvoice = await prisma.invoice.findUnique({
        where: { id: invoice.id },
        include: {
          corporateRel: {
            select: { name: true, gstin: true }
          },
          selectedPO: {
            select: { id: true, number: true, balance: true }
          },
          appointments: {
            include: {
              appointment: {
                select: {
                  id: true,
                  employeeName: true,
                  employeeId: true,
                  appointmentDate: true,
                  serviceRate: true,
                  packageType: true,
                  serviceType: true
                }
              }
            }
          }
        }
      });

      if (!createdInvoice) {
        res.status(500).json({
          error: { message: 'Failed to fetch created invoice' }
        });
        return;
      }

      // Transform the data to match frontend expectations
      const transformedInvoice = {
        id: createdInvoice.id,
        invoiceNumber: createdInvoice.invoiceNumber,
        corporate: createdInvoice.corporate,
        corporateId: createdInvoice.corporateId,
        selectedPO: createdInvoice.selectedPO ? {
          id: createdInvoice.selectedPO.id,
          number: createdInvoice.selectedPO.number,
          balance: createdInvoice.selectedPO.balance
        } : undefined,
        appointments: createdInvoice.appointments.map(ia => ia.appointment),
        subtotal: createdInvoice.subtotal,
        gstAmount: createdInvoice.gstAmount,
        total: createdInvoice.total,
        createdDate: createdInvoice.createdDate.toISOString(),
        dueDate: createdInvoice.dueDate.toISOString(),
        status: createdInvoice.status,
        createdBy: createdInvoice.createdBy
      };

      res.status(201).json(transformedInvoice);
    } catch (error) {
      console.error('Error creating invoice:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: {
            message: 'Validation error',
            details: error.issues
          }
        });
        return;
      }
      res.status(500).json({
        error: {
          message: 'Failed to create invoice',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async updateInvoiceStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = updateInvoiceStatusSchema.parse(req.body);

      const invoice = await prisma.invoice.update({
        where: { id },
        data: { status: data.status },
        include: {
          corporateRel: {
            select: { name: true, gstin: true }
          },
          selectedPO: {
            select: { id: true, number: true, balance: true }
          },
          appointments: {
            include: {
              appointment: {
                select: {
                  id: true,
                  employeeName: true,
                  employeeId: true,
                  appointmentDate: true,
                  serviceRate: true,
                  packageType: true,
                  serviceType: true
                }
              }
            }
          }
        }
      });

      // Transform the data to match frontend expectations
      const transformedInvoice = {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        corporate: invoice.corporate,
        corporateId: invoice.corporateId,
        selectedPO: invoice.selectedPO ? {
          id: invoice.selectedPO.id,
          number: invoice.selectedPO.number,
          balance: invoice.selectedPO.balance
        } : undefined,
        appointments: invoice.appointments.map(ia => ia.appointment),
        subtotal: invoice.subtotal,
        gstAmount: invoice.gstAmount,
        total: invoice.total,
        createdDate: invoice.createdDate.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        status: invoice.status,
        createdBy: invoice.createdBy
      };

      res.json(transformedInvoice);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: {
            message: 'Validation error',
            details: error.issues
          }
        });
        return;
      }
      res.status(500).json({
        error: {
          message: 'Failed to update invoice status',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async deleteInvoice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.invoice.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      res.status(500).json({
        error: {
          message: 'Failed to delete invoice',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }
}