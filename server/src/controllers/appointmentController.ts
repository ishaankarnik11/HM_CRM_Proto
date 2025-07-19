import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const searchAppointmentsSchema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  corporateId: z.string().min(1),
  serviceType: z.string().optional(),
  status: z.enum(['MEDICAL_DONE', 'PENDING', 'CANCELLED']).optional()
});

const searchDCAppointmentsSchema = z.object({
  diagnosticCenterId: z.string().min(1),
  location: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1)
});

const createAppointmentSchema = z.object({
  employeeName: z.string().min(1),
  employeeId: z.string().min(1),
  corporateId: z.string().min(1),
  appointmentDate: z.string().min(1),
  serviceRate: z.number().positive(),
  packageType: z.enum(['AHC', 'PEC', 'OPD']),
  serviceType: z.string().min(1),
  status: z.enum(['MEDICAL_DONE', 'PENDING', 'CANCELLED']).default('PENDING'),
  age: z.number().min(1).max(150).optional(),
  gender: z.enum(['M', 'F']).optional(),
  diagnosticCenterId: z.string().optional()
});

const updateAppointmentSchema = z.object({
  employeeName: z.string().min(1).optional(),
  employeeId: z.string().min(1).optional(),
  appointmentDate: z.string().min(1).optional(),
  serviceRate: z.number().positive().optional(),
  packageType: z.enum(['AHC', 'PEC', 'OPD']).optional(),
  serviceType: z.string().min(1).optional(),
  status: z.enum(['MEDICAL_DONE', 'PENDING', 'CANCELLED']).optional(),
  age: z.number().min(1).max(150).optional(),
  gender: z.enum(['M', 'F']).optional(),
  diagnosticCenterId: z.string().optional()
});

export class AppointmentController {
  async searchAppointments(req: Request, res: Response) {
    try {
      const params = searchAppointmentsSchema.parse(req.query);

      const where: any = {
        corporateId: params.corporateId,
        appointmentDate: {
          gte: new Date(params.startDate),
          lte: new Date(params.endDate)
        }
      };

      if (params.serviceType) {
        where.serviceType = {
          contains: params.serviceType,
          mode: 'insensitive'
        };
      }

      if (params.status) {
        where.status = params.status;
      }

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          corporate: {
            select: { name: true }
          },
          diagnosticCenter: {
            select: { name: true }
          }
        },
        orderBy: { appointmentDate: 'desc' }
      });

      // Transform the data to match frontend expectations
      const transformedAppointments = appointments.map(appointment => ({
        id: appointment.id,
        employeeName: appointment.employeeName,
        employeeId: appointment.employeeId,
        corporate: appointment.corporate.name,
        corporateId: appointment.corporateId,
        appointmentDate: appointment.appointmentDate.toISOString(),
        serviceRate: appointment.serviceRate,
        packageType: appointment.packageType,
        serviceType: appointment.serviceType,
        status: appointment.status === 'MEDICAL_DONE' ? 'Medical Done' : 
                appointment.status === 'PENDING' ? 'Pending' : 'Cancelled',
        age: appointment.age,
        gender: appointment.gender
      }));

      res.json(transformedAppointments);
    } catch (error) {
      console.error('Error searching appointments:', error);
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
          message: 'Failed to search appointments',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async searchDCAppointments(req: Request, res: Response) {
    try {
      const params = searchDCAppointmentsSchema.parse(req.query);

      const appointments = await prisma.appointment.findMany({
        where: {
          diagnosticCenterId: params.diagnosticCenterId,
          appointmentDate: {
            gte: new Date(params.startDate),
            lte: new Date(params.endDate)
          }
        },
        include: {
          corporate: {
            select: { name: true }
          },
          diagnosticCenter: {
            select: { name: true, locations: true }
          }
        },
        orderBy: { appointmentDate: 'desc' }
      });

      // Filter by location (since it's stored as JSON string in diagnostic center)
      const filteredAppointments = appointments.filter(appointment => {
        if (!appointment.diagnosticCenter) return false;
        try {
          const locations = JSON.parse(appointment.diagnosticCenter.locations);
          return locations.includes(params.location);
        } catch {
          return false;
        }
      });

      // Transform the data to match frontend expectations
      const transformedAppointments = filteredAppointments.map(appointment => ({
        id: appointment.id,
        employeeName: appointment.employeeName,
        employeeId: appointment.employeeId,
        corporate: appointment.corporate.name,
        corporateId: appointment.corporateId,
        appointmentDate: appointment.appointmentDate.toISOString(),
        serviceRate: appointment.serviceRate,
        packageType: appointment.packageType,
        serviceType: appointment.serviceType,
        status: appointment.status === 'MEDICAL_DONE' ? 'Medical Done' : 
                appointment.status === 'PENDING' ? 'Pending' : 'Cancelled',
        age: appointment.age,
        gender: appointment.gender
      }));

      res.json(transformedAppointments);
    } catch (error) {
      console.error('Error searching DC appointments:', error);
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
          message: 'Failed to search DC appointments',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async getAppointmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          corporate: {
            select: { name: true }
          },
          diagnosticCenter: {
            select: { name: true, locations: true }
          }
        }
      });

      if (!appointment) {
        return res.status(404).json({
          error: { message: 'Appointment not found' }
        });
      }

      // Transform the data to match frontend expectations
      const transformedAppointment = {
        id: appointment.id,
        employeeName: appointment.employeeName,
        employeeId: appointment.employeeId,
        corporate: appointment.corporate.name,
        corporateId: appointment.corporateId,
        appointmentDate: appointment.appointmentDate.toISOString(),
        serviceRate: appointment.serviceRate,
        packageType: appointment.packageType,
        serviceType: appointment.serviceType,
        status: appointment.status === 'MEDICAL_DONE' ? 'Medical Done' : 
                appointment.status === 'PENDING' ? 'Pending' : 'Cancelled',
        age: appointment.age,
        gender: appointment.gender
      };

      res.json(transformedAppointment);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      res.status(500).json({
        error: {
          message: 'Failed to fetch appointment',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async createAppointment(req: Request, res: Response) {
    try {
      const data = createAppointmentSchema.parse(req.body);

      const appointment = await prisma.appointment.create({
        data: {
          employeeName: data.employeeName,
          employeeId: data.employeeId,
          corporateId: data.corporateId,
          appointmentDate: new Date(data.appointmentDate),
          serviceRate: data.serviceRate,
          packageType: data.packageType,
          serviceType: data.serviceType,
          status: data.status,
          age: data.age,
          gender: data.gender,
          diagnosticCenterId: data.diagnosticCenterId
        },
        include: {
          corporate: {
            select: { name: true }
          },
          diagnosticCenter: {
            select: { name: true, locations: true }
          }
        }
      });

      // Transform the data to match frontend expectations
      const transformedAppointment = {
        id: appointment.id,
        employeeName: appointment.employeeName,
        employeeId: appointment.employeeId,
        corporate: appointment.corporate.name,
        corporateId: appointment.corporateId,
        appointmentDate: appointment.appointmentDate.toISOString(),
        serviceRate: appointment.serviceRate,
        packageType: appointment.packageType,
        serviceType: appointment.serviceType,
        status: appointment.status === 'MEDICAL_DONE' ? 'Medical Done' : 
                appointment.status === 'PENDING' ? 'Pending' : 'Cancelled',
        age: appointment.age,
        gender: appointment.gender
      };

      res.status(201).json(transformedAppointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
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
          message: 'Failed to create appointment',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async updateAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = updateAppointmentSchema.parse(req.body);

      const updateData: any = {};
      if (data.employeeName) updateData.employeeName = data.employeeName;
      if (data.employeeId) updateData.employeeId = data.employeeId;
      if (data.appointmentDate) updateData.appointmentDate = new Date(data.appointmentDate);
      if (data.serviceRate) updateData.serviceRate = data.serviceRate;
      if (data.packageType) updateData.packageType = data.packageType;
      if (data.serviceType) updateData.serviceType = data.serviceType;
      if (data.status) updateData.status = data.status;
      if (data.age !== undefined) updateData.age = data.age;
      if (data.gender !== undefined) updateData.gender = data.gender;
      if (data.diagnosticCenterId !== undefined) updateData.diagnosticCenterId = data.diagnosticCenterId;

      const appointment = await prisma.appointment.update({
        where: { id },
        data: updateData,
        include: {
          corporate: {
            select: { name: true }
          },
          diagnosticCenter: {
            select: { name: true, locations: true }
          }
        }
      });

      // Transform the data to match frontend expectations
      const transformedAppointment = {
        id: appointment.id,
        employeeName: appointment.employeeName,
        employeeId: appointment.employeeId,
        corporate: appointment.corporate.name,
        corporateId: appointment.corporateId,
        appointmentDate: appointment.appointmentDate.toISOString(),
        serviceRate: appointment.serviceRate,
        packageType: appointment.packageType,
        serviceType: appointment.serviceType,
        status: appointment.status === 'MEDICAL_DONE' ? 'Medical Done' : 
                appointment.status === 'PENDING' ? 'Pending' : 'Cancelled',
        age: appointment.age,
        gender: appointment.gender
      };

      res.json(transformedAppointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
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
          message: 'Failed to update appointment',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }

  async deleteAppointment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.appointment.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({
        error: {
          message: 'Failed to delete appointment',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }
}