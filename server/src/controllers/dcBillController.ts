import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Validation schemas
const createDCBillSchema = z.object({
  diagnosticCenter: z.string().min(1),
  diagnosticCenterId: z.string().optional(),
  location: z.string().min(1),
  appointmentIds: z.array(z.string()).min(1),
  period: z.string().optional()
});

const updateDCBillStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'PAID'])
});

const dcBillFilterSchema = z.object({
  diagnosticCenter: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'PAID']).optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

export class DCBillController {
  async getDCBills(req: Request, res: Response) {
    try {
      const filters = dcBillFilterSchema.parse(req.query);
      const page = parseInt(filters.page || '1');
      const limit = parseInt(filters.limit || '10');
      const skip = (page - 1) * limit;

      const where: any = {};

      // Apply filters
      if (filters.diagnosticCenter) {
        where.diagnosticCenter = {
          contains: filters.diagnosticCenter,
          mode: 'insensitive'
        };
      }

      if (filters.location) {
        where.location = {
          contains: filters.location,
          mode: 'insensitive'
        };
      }

      if (filters.status) {
        where.status = filters.status;
      }

      const [dcBills, total] = await Promise.all([
        prisma.dCBill.findMany({
          where,
          include: {
            diagnosticCenterRel: {
              select: { name: true, locations: true }
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
        prisma.dCBill.count({ where })
      ]);

      // Transform the data to match frontend expectations
      const transformedDCBills = dcBills.map(bill => ({
        id: bill.id,
        docketNumber: bill.docketNumber,
        status: bill.status === 'DRAFT' ? 'Draft' :
                bill.status === 'SUBMITTED' ? 'Submitted' :
                bill.status === 'APPROVED' ? 'Approved' : 'Paid',
        diagnosticCenter: bill.diagnosticCenter,
        location: bill.location,
        period: bill.period,
        appointmentIds: bill.appointments.map(ba => ba.appointmentId),
        count: bill.count,
        amount: bill.amount,
        createdDate: bill.createdDate.toISOString(),
        submittedDate: bill.submittedDate?.toISOString(),
        billFile: bill.billFileName ? {
          name: bill.billFileName,
          url: bill.billFileUrl || '',
          size: bill.billFileSize || 0
        } : undefined
      }));

      res.json({
        dcBills: transformedDCBills,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching DC bills:', error);
      res.status(500).json({
        error: {
          message: 'Failed to fetch DC bills',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async getDCBillById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const bill = await prisma.dCBill.findUnique({
        where: { id },
        include: {
          diagnosticCenterRel: {
            select: { name: true, locations: true }
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
                  corporate: {
                    select: { name: true }
                  }
                }
              }
            }
          }
        }
      });

      if (!bill) {
        return res.status(404).json({
          error: { message: 'DC Bill not found' }
        });
      }

      // Transform the data to match frontend expectations
      const transformedBill = {
        id: bill.id,
        docketNumber: bill.docketNumber,
        status: bill.status === 'DRAFT' ? 'Draft' :
                bill.status === 'SUBMITTED' ? 'Submitted' :
                bill.status === 'APPROVED' ? 'Approved' : 'Paid',
        diagnosticCenter: bill.diagnosticCenter,
        location: bill.location,
        period: bill.period,
        appointmentIds: bill.appointments.map(ba => ba.appointmentId),
        count: bill.count,
        amount: bill.amount,
        createdDate: bill.createdDate.toISOString(),
        submittedDate: bill.submittedDate?.toISOString(),
        billFile: bill.billFileName ? {
          name: bill.billFileName,
          url: bill.billFileUrl || '',
          size: bill.billFileSize || 0
        } : undefined,
        appointments: bill.appointments.map(ba => ba.appointment)
      };

      res.json(transformedBill);
    } catch (error) {
      console.error('Error fetching DC bill:', error);
      res.status(500).json({
        error: {
          message: 'Failed to fetch DC bill',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async createDCBill(req: Request, res: Response) {
    try {
      // Parse form data
      const appointmentIds = JSON.parse(req.body.appointmentIds || '[]');
      const data = createDCBillSchema.parse({
        ...req.body,
        appointmentIds
      });

      // Generate docket number
      const docketNumber = `DCK-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      // Calculate amount from appointments
      const appointments = await prisma.appointment.findMany({
        where: { id: { in: data.appointmentIds } },
        select: { serviceRate: true }
      });

      const totalAmount = appointments.reduce((sum, apt) => sum + apt.serviceRate, 0);

      // Handle file upload
      let billFile = null;
      if (req.file) {
        billFile = {
          name: req.file.originalname,
          url: `/uploads/dc-bills/${req.file.filename}`,
          size: req.file.size
        };
      }

      // Create DC bill in transaction
      const dcBill = await prisma.$transaction(async (tx) => {
        const newBill = await tx.dCBill.create({
          data: {
            docketNumber,
            status: 'DRAFT',
            diagnosticCenter: data.diagnosticCenter,
            diagnosticCenterId: data.diagnosticCenterId,
            location: data.location,
            period: data.period || `${new Date().toLocaleDateString()} - ${new Date().toLocaleDateString()}`,
            count: data.appointmentIds.length,
            amount: totalAmount,
            billFileName: billFile?.name,
            billFileUrl: billFile?.url,
            billFileSize: billFile?.size
          }
        });

        // Create DC bill-appointment relationships
        await tx.dCBillAppointment.createMany({
          data: data.appointmentIds.map(appointmentId => ({
            dcBillId: newBill.id,
            appointmentId
          }))
        });

        return newBill;
      });

      // Fetch the created DC bill with all relationships
      const createdBill = await prisma.dCBill.findUnique({
        where: { id: dcBill.id },
        include: {
          diagnosticCenterRel: {
            select: { name: true, locations: true }
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

      if (!createdBill) {
        throw new Error('Failed to fetch created DC bill');
      }

      // Transform the data to match frontend expectations
      const transformedBill = {
        id: createdBill.id,
        docketNumber: createdBill.docketNumber,
        status: createdBill.status === 'DRAFT' ? 'Draft' :
                createdBill.status === 'SUBMITTED' ? 'Submitted' :
                createdBill.status === 'APPROVED' ? 'Approved' : 'Paid',
        diagnosticCenter: createdBill.diagnosticCenter,
        location: createdBill.location,
        period: createdBill.period,
        appointmentIds: createdBill.appointments.map(ba => ba.appointmentId),
        count: createdBill.count,
        amount: createdBill.amount,
        createdDate: createdBill.createdDate.toISOString(),
        submittedDate: createdBill.submittedDate?.toISOString(),
        billFile: createdBill.billFileName ? {
          name: createdBill.billFileName,
          url: createdBill.billFileUrl || '',
          size: createdBill.billFileSize || 0
        } : undefined
      };

      res.status(201).json(transformedBill);
    } catch (error) {
      console.error('Error creating DC bill:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            message: 'Validation error',
            details: error.issues
          }
        });
      }
      res.status(500).json({
        error: {
          message: 'Failed to create DC bill',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async updateDCBillStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = updateDCBillStatusSchema.parse(req.body);

      const updateData: any = { status: data.status };
      if (data.status === 'SUBMITTED') {
        updateData.submittedDate = new Date();
      }

      const bill = await prisma.dCBill.update({
        where: { id },
        data: updateData,
        include: {
          diagnosticCenterRel: {
            select: { name: true, locations: true }
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
      const transformedBill = {
        id: bill.id,
        docketNumber: bill.docketNumber,
        status: bill.status === 'DRAFT' ? 'Draft' :
                bill.status === 'SUBMITTED' ? 'Submitted' :
                bill.status === 'APPROVED' ? 'Approved' : 'Paid',
        diagnosticCenter: bill.diagnosticCenter,
        location: bill.location,
        period: bill.period,
        appointmentIds: bill.appointments.map(ba => ba.appointmentId),
        count: bill.count,
        amount: bill.amount,
        createdDate: bill.createdDate.toISOString(),
        submittedDate: bill.submittedDate?.toISOString(),
        billFile: bill.billFileName ? {
          name: bill.billFileName,
          url: bill.billFileUrl || '',
          size: bill.billFileSize || 0
        } : undefined
      };

      res.json(transformedBill);
    } catch (error) {
      console.error('Error updating DC bill status:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            message: 'Validation error',
            details: error.issues
          }
        });
      }
      res.status(500).json({
        error: {
          message: 'Failed to update DC bill status',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async deleteDCBill(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get the bill to check for file
      const bill = await prisma.dCBill.findUnique({
        where: { id },
        select: { billFileUrl: true }
      });

      if (bill?.billFileUrl) {
        // Delete the file if it exists
        const filePath = path.join(process.cwd(), bill.billFileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await prisma.dCBill.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting DC bill:', error);
      res.status(500).json({
        error: {
          message: 'Failed to delete DC bill',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }
}