import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create corporates
  const corporates = await prisma.corporate.createMany({
    data: [
      {
        id: 'corp_1',
        name: 'TechCorp India',
        address: 'Tech Park, Bangalore - 560001',
        gstin: '29ABCDE1234F1Z5',
        active: true
      },
      {
        id: 'corp_2',
        name: 'HealthPlus Solutions',
        address: 'Health Tower, Mumbai - 400001',
        gstin: '27FGHIJ5678K2L6',
        active: true
      },
      {
        id: 'corp_3',
        name: 'MediCore Enterprises',
        address: 'Medical Plaza, Delhi - 110001',
        gstin: '07KLMNO9012P3Q4',
        active: true
      }
    ]
  });

  // Create purchase orders
  const purchaseOrders = await prisma.purchaseOrder.createMany({
    data: [
      {
        id: 'po_1',
        corporateId: 'corp_1',
        number: 'PO-2024-001',
        total: 100000,
        balance: 50000,
        validUntil: new Date('2024-12-31')
      },
      {
        id: 'po_2',
        corporateId: 'corp_1',
        number: 'PO-2024-002',
        total: 150000,
        balance: 75000,
        validUntil: new Date('2024-12-31')
      },
      {
        id: 'po_3',
        corporateId: 'corp_2',
        number: 'PO-2024-003',
        total: 200000,
        balance: 100000,
        validUntil: new Date('2024-12-31')
      },
      {
        id: 'po_4',
        corporateId: 'corp_3',
        number: 'PO-2024-004',
        total: 80000,
        balance: 60000,
        validUntil: new Date('2024-12-31')
      }
    ]
  });

  // Create diagnostic centers
  const diagnosticCenters = await prisma.diagnosticCenter.createMany({
    data: [
      {
        id: 'dc_1',
        name: 'Apollo Diagnostics',
        locations: JSON.stringify(['Mumbai Central', 'Andheri', 'Bandra']),
        active: true
      },
      {
        id: 'dc_2',
        name: 'SRL Diagnostics',
        locations: JSON.stringify(['Worli', 'Lower Parel', 'Powai']),
        active: true
      },
      {
        id: 'dc_3',
        name: 'Thyrocare',
        locations: JSON.stringify(['Navi Mumbai', 'Thane', 'Vashi']),
        active: true
      }
    ]
  });

  // Create appointments
  const appointments = await prisma.appointment.createMany({
    data: [
      {
        id: 'apt_1',
        employeeName: 'Meghna Padwal',
        employeeId: 'EMP001',
        corporateId: 'corp_1',
        diagnosticCenterId: 'dc_1',
        appointmentDate: new Date('2024-07-12'),
        serviceRate: 1500,
        packageType: 'AHC',
        serviceType: 'Annual Health Checkup',
        status: 'MEDICAL_DONE',
        age: 28,
        gender: 'F'
      },
      {
        id: 'apt_2',
        employeeName: 'Nikita Rawat',
        employeeId: 'EMP002',
        corporateId: 'corp_1',
        diagnosticCenterId: 'dc_1',
        appointmentDate: new Date('2024-07-13'),
        serviceRate: 1200,
        packageType: 'PEC',
        serviceType: 'Pre-Employment Checkup',
        status: 'MEDICAL_DONE',
        age: 25,
        gender: 'F'
      },
      {
        id: 'apt_3',
        employeeName: 'Rajesh Kumar',
        employeeId: 'EMP003',
        corporateId: 'corp_1',
        diagnosticCenterId: 'dc_2',
        appointmentDate: new Date('2024-07-15'),
        serviceRate: 1500,
        packageType: 'AHC',
        serviceType: 'Annual Health Checkup',
        status: 'MEDICAL_DONE',
        age: 32,
        gender: 'M'
      },
      {
        id: 'apt_4',
        employeeName: 'Priya Sharma',
        employeeId: 'EMP004',
        corporateId: 'corp_2',
        diagnosticCenterId: 'dc_1',
        appointmentDate: new Date('2024-07-16'),
        serviceRate: 1800,
        packageType: 'AHC',
        serviceType: 'Executive Health Checkup',
        status: 'MEDICAL_DONE',
        age: 29,
        gender: 'F'
      },
      {
        id: 'apt_5',
        employeeName: 'Amit Verma',
        employeeId: 'EMP005',
        corporateId: 'corp_2',
        diagnosticCenterId: 'dc_2',
        appointmentDate: new Date('2024-07-17'),
        serviceRate: 1200,
        packageType: 'PEC',
        serviceType: 'Pre-Employment Checkup',
        status: 'MEDICAL_DONE',
        age: 26,
        gender: 'M'
      },
      {
        id: 'apt_6',
        employeeName: 'Sneha Patel',
        employeeId: 'EMP006',
        corporateId: 'corp_3',
        diagnosticCenterId: 'dc_3',
        appointmentDate: new Date('2024-07-18'),
        serviceRate: 1000,
        packageType: 'OPD',
        serviceType: 'General Consultation',
        status: 'MEDICAL_DONE',
        age: 24,
        gender: 'F'
      },
      {
        id: 'apt_7',
        employeeName: 'Rohit Singh',
        employeeId: 'EMP007',
        corporateId: 'corp_1',
        diagnosticCenterId: 'dc_1',
        appointmentDate: new Date('2024-07-19'),
        serviceRate: 1500,
        packageType: 'AHC',
        serviceType: 'Annual Health Checkup',
        status: 'PENDING',
        age: 30,
        gender: 'M'
      },
      {
        id: 'apt_8',
        employeeName: 'Kavya Nair',
        employeeId: 'EMP008',
        corporateId: 'corp_2',
        diagnosticCenterId: 'dc_2',
        appointmentDate: new Date('2024-07-20'),
        serviceRate: 1200,
        packageType: 'PEC',
        serviceType: 'Pre-Employment Checkup',
        status: 'PENDING',
        age: 27,
        gender: 'F'
      }
    ]
  });

  // Create some sample invoices
  const invoices = await prisma.invoice.createMany({
    data: [
      {
        id: 'inv_1',
        invoiceNumber: 'INV-2024-07-00001',
        corporate: 'TechCorp India',
        corporateId: 'corp_1',
        purchaseOrderId: 'po_1',
        subtotal: 2700,
        gstAmount: 486,
        total: 3186,
        dueDate: new Date('2024-08-15'),
        status: 'SENT',
        createdBy: 'admin'
      },
      {
        id: 'inv_2',
        invoiceNumber: 'INV-2024-07-00002',
        corporate: 'HealthPlus Solutions',
        corporateId: 'corp_2',
        purchaseOrderId: 'po_3',
        subtotal: 3000,
        gstAmount: 540,
        total: 3540,
        dueDate: new Date('2024-08-16'),
        status: 'DRAFT',
        createdBy: 'admin'
      }
    ]
  });

  // Create invoice-appointment relationships
  await prisma.invoiceAppointment.createMany({
    data: [
      {
        invoiceId: 'inv_1',
        appointmentId: 'apt_1'
      },
      {
        invoiceId: 'inv_1',
        appointmentId: 'apt_2'
      },
      {
        invoiceId: 'inv_2',
        appointmentId: 'apt_4'
      },
      {
        invoiceId: 'inv_2',
        appointmentId: 'apt_5'
      }
    ]
  });

  // Create some sample DC bills
  const dcBills = await prisma.dCBill.createMany({
    data: [
      {
        id: 'dc_1',
        docketNumber: 'DCK-2024-07-001',
        status: 'SUBMITTED',
        diagnosticCenter: 'Apollo Diagnostics',
        diagnosticCenterId: 'dc_1',
        location: 'Mumbai Central',
        period: '2024-07-01 to 2024-07-15',
        count: 1,
        amount: 1500,
        submittedDate: new Date('2024-07-16')
      },
      {
        id: 'dc_2',
        docketNumber: 'DCK-2024-07-002',
        status: 'DRAFT',
        diagnosticCenter: 'SRL Diagnostics',
        diagnosticCenterId: 'dc_2',
        location: 'Worli',
        period: '2024-07-01 to 2024-07-15',
        count: 1,
        amount: 1500
      }
    ]
  });

  // Create DC bill-appointment relationships
  await prisma.dCBillAppointment.createMany({
    data: [
      {
        dcBillId: 'dc_1',
        appointmentId: 'apt_3'
      },
      {
        dcBillId: 'dc_2',
        appointmentId: 'apt_5'
      }
    ]
  });

  console.log('✅ Database seeding completed!');
  console.log(`📊 Created:`);
  console.log(`   - ${corporates.count} corporates`);
  console.log(`   - ${purchaseOrders.count} purchase orders`);
  console.log(`   - ${diagnosticCenters.count} diagnostic centers`);
  console.log(`   - ${appointments.count} appointments`);
  console.log(`   - ${invoices.count} invoices`);
  console.log(`   - ${dcBills.count} DC bills`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });