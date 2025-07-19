import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createCorporateSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  gstin: z.string().min(1),
  active: z.boolean().default(true),
  purchaseOrders: z.array(z.object({
    number: z.string().min(1),
    total: z.number().positive(),
    balance: z.number().min(0),
    validUntil: z.string().min(1)
  })).optional()
});

const updateCorporateSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  gstin: z.string().min(1).optional(),
  active: z.boolean().optional()
});

export class CorporateController {
  async getCorporates(req: Request, res: Response) {
    try {
      const corporates = await prisma.corporate.findMany({
        include: {
          purchaseOrders: {
            select: {
              id: true,
              number: true,
              balance: true,
              total: true,
              validUntil: true
            }
          }
        },
        orderBy: { name: 'asc' }
      });

      // Transform the data to match frontend expectations
      const transformedCorporates = corporates.map(corporate => ({
        id: corporate.id,
        name: corporate.name,
        active: corporate.active,
        address: corporate.address,
        gstin: corporate.gstin,
        purchaseOrders: corporate.purchaseOrders.map(po => ({
          id: po.id,
          number: po.number,
          balance: po.balance,
          total: po.total,
          validUntil: po.validUntil.toISOString()
        }))
      }));

      res.json(transformedCorporates);
    } catch (error) {
      console.error('Error fetching corporates:', error);
      res.status(500).json({
        error: {
          message: 'Failed to fetch corporates',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async getCorporateById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const corporate = await prisma.corporate.findUnique({
        where: { id },
        include: {
          purchaseOrders: {
            select: {
              id: true,
              number: true,
              balance: true,
              total: true,
              validUntil: true
            }
          }
        }
      });

      if (!corporate) {
        return res.status(404).json({
          error: { message: 'Corporate not found' }
        });
      }

      // Transform the data to match frontend expectations
      const transformedCorporate = {
        id: corporate.id,
        name: corporate.name,
        active: corporate.active,
        address: corporate.address,
        gstin: corporate.gstin,
        purchaseOrders: corporate.purchaseOrders.map(po => ({
          id: po.id,
          number: po.number,
          balance: po.balance,
          total: po.total,
          validUntil: po.validUntil.toISOString()
        }))
      };

      res.json(transformedCorporate);
    } catch (error) {
      console.error('Error fetching corporate:', error);
      res.status(500).json({
        error: {
          message: 'Failed to fetch corporate',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async getPurchaseOrders(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const purchaseOrders = await prisma.purchaseOrder.findMany({
        where: { corporateId: id },
        select: {
          id: true,
          number: true,
          balance: true,
          total: true,
          validUntil: true
        },
        orderBy: { number: 'asc' }
      });

      // Transform the data to match frontend expectations
      const transformedPOs = purchaseOrders.map(po => ({
        id: po.id,
        number: po.number,
        balance: po.balance,
        total: po.total,
        validUntil: po.validUntil.toISOString()
      }));

      res.json(transformedPOs);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      res.status(500).json({
        error: {
          message: 'Failed to fetch purchase orders',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async createCorporate(req: Request, res: Response) {
    try {
      const data = createCorporateSchema.parse(req.body);

      const corporate = await prisma.$transaction(async (tx) => {
        const newCorporate = await tx.corporate.create({
          data: {
            name: data.name,
            address: data.address,
            gstin: data.gstin,
            active: data.active
          }
        });

        // Create purchase orders if provided
        if (data.purchaseOrders && data.purchaseOrders.length > 0) {
          await tx.purchaseOrder.createMany({
            data: data.purchaseOrders.map(po => ({
              corporateId: newCorporate.id,
              number: po.number,
              total: po.total,
              balance: po.balance,
              validUntil: new Date(po.validUntil)
            }))
          });
        }

        return newCorporate;
      });

      // Fetch the created corporate with purchase orders
      const createdCorporate = await prisma.corporate.findUnique({
        where: { id: corporate.id },
        include: {
          purchaseOrders: {
            select: {
              id: true,
              number: true,
              balance: true,
              total: true,
              validUntil: true
            }
          }
        }
      });

      if (!createdCorporate) {
        throw new Error('Failed to fetch created corporate');
      }

      // Transform the data to match frontend expectations
      const transformedCorporate = {
        id: createdCorporate.id,
        name: createdCorporate.name,
        active: createdCorporate.active,
        address: createdCorporate.address,
        gstin: createdCorporate.gstin,
        purchaseOrders: createdCorporate.purchaseOrders.map(po => ({
          id: po.id,
          number: po.number,
          balance: po.balance,
          total: po.total,
          validUntil: po.validUntil.toISOString()
        }))
      };

      res.status(201).json(transformedCorporate);
    } catch (error) {
      console.error('Error creating corporate:', error);
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
          message: 'Failed to create corporate',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async updateCorporate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = updateCorporateSchema.parse(req.body);

      const corporate = await prisma.corporate.update({
        where: { id },
        data,
        include: {
          purchaseOrders: {
            select: {
              id: true,
              number: true,
              balance: true,
              total: true,
              validUntil: true
            }
          }
        }
      });

      // Transform the data to match frontend expectations
      const transformedCorporate = {
        id: corporate.id,
        name: corporate.name,
        active: corporate.active,
        address: corporate.address,
        gstin: corporate.gstin,
        purchaseOrders: corporate.purchaseOrders.map(po => ({
          id: po.id,
          number: po.number,
          balance: po.balance,
          total: po.total,
          validUntil: po.validUntil.toISOString()
        }))
      };

      res.json(transformedCorporate);
    } catch (error) {
      console.error('Error updating corporate:', error);
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
          message: 'Failed to update corporate',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async deleteCorporate(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.corporate.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting corporate:', error);
      res.status(500).json({
        error: {
          message: 'Failed to delete corporate',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }
}