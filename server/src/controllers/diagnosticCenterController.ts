import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createDiagnosticCenterSchema = z.object({
  name: z.string().min(1),
  locations: z.array(z.string().min(1)),
  active: z.boolean().default(true)
});

const updateDiagnosticCenterSchema = z.object({
  name: z.string().min(1).optional(),
  locations: z.array(z.string().min(1)).optional(),
  active: z.boolean().optional()
});

export class DiagnosticCenterController {
  async getDiagnosticCenters(req: Request, res: Response) {
    try {
      const diagnosticCenters = await prisma.diagnosticCenter.findMany({
        orderBy: { name: 'asc' }
      });

      // Transform the data to match frontend expectations
      const transformedCenters = diagnosticCenters.map(center => ({
        id: center.id,
        name: center.name,
        locations: JSON.parse(center.locations),
        active: center.active
      }));

      res.json(transformedCenters);
    } catch (error) {
      console.error('Error fetching diagnostic centers:', error);
      res.status(500).json({
        error: {
          message: 'Failed to fetch diagnostic centers',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async getDiagnosticCenterById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const center = await prisma.diagnosticCenter.findUnique({
        where: { id }
      });

      if (!center) {
        return res.status(404).json({
          error: { message: 'Diagnostic center not found' }
        });
      }

      // Transform the data to match frontend expectations
      const transformedCenter = {
        id: center.id,
        name: center.name,
        locations: JSON.parse(center.locations),
        active: center.active
      };

      res.json(transformedCenter);
    } catch (error) {
      console.error('Error fetching diagnostic center:', error);
      res.status(500).json({
        error: {
          message: 'Failed to fetch diagnostic center',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async createDiagnosticCenter(req: Request, res: Response) {
    try {
      const data = createDiagnosticCenterSchema.parse(req.body);

      const center = await prisma.diagnosticCenter.create({
        data: {
          name: data.name,
          locations: JSON.stringify(data.locations),
          active: data.active
        }
      });

      // Transform the data to match frontend expectations
      const transformedCenter = {
        id: center.id,
        name: center.name,
        locations: JSON.parse(center.locations),
        active: center.active
      };

      res.status(201).json(transformedCenter);
    } catch (error) {
      console.error('Error creating diagnostic center:', error);
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
          message: 'Failed to create diagnostic center',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async updateDiagnosticCenter(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = updateDiagnosticCenterSchema.parse(req.body);

      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.locations) updateData.locations = JSON.stringify(data.locations);
      if (data.active !== undefined) updateData.active = data.active;

      const center = await prisma.diagnosticCenter.update({
        where: { id },
        data: updateData
      });

      // Transform the data to match frontend expectations
      const transformedCenter = {
        id: center.id,
        name: center.name,
        locations: JSON.parse(center.locations),
        active: center.active
      };

      res.json(transformedCenter);
    } catch (error) {
      console.error('Error updating diagnostic center:', error);
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
          message: 'Failed to update diagnostic center',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async deleteDiagnosticCenter(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.diagnosticCenter.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting diagnostic center:', error);
      res.status(500).json({
        error: {
          message: 'Failed to delete diagnostic center',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }
}