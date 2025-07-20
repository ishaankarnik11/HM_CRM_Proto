-- Health Meter CRM Database Initialization Script
-- This script sets up the basic database structure (optional)

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS hrm;
CREATE SCHEMA IF NOT EXISTS eligibility;
CREATE SCHEMA IF NOT EXISTS accounting;

-- Create tables for future use (currently using mock data)

-- Corporates table
CREATE TABLE IF NOT EXISTS corporates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    employee_count INTEGER DEFAULT 0,
    total_opd_wallet DECIMAL(15,2) DEFAULT 0,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Benefit Groups table
CREATE TABLE IF NOT EXISTS benefit_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    opd_wallet_allocation DECIMAL(10,2) DEFAULT 0,
    ahc_benefits JSONB DEFAULT '[]',
    opd_benefits JSONB DEFAULT '{}',
    family_coverage JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(20),
    corporate_id UUID REFERENCES corporates(id),
    department VARCHAR(100),
    designation VARCHAR(100),
    location VARCHAR(100),
    age INTEGER,
    joining_date DATE,
    service_period INTEGER,
    benefit_group_id UUID REFERENCES benefit_groups(id),
    ahc_benefit_status VARCHAR(50) DEFAULT 'Inactive',
    eligibility_status VARCHAR(50) DEFAULT 'Pending',
    next_ahc_due DATE,
    last_ahc_date DATE,
    passcode_status VARCHAR(50) DEFAULT 'Not Sent',
    benefit_source VARCHAR(100),
    opd_wallet_balance DECIMAL(10,2) DEFAULT 0,
    opd_wallet_allocated DECIMAL(10,2) DEFAULT 0,
    opd_wallet_used DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Eligibility Rules table
CREATE TABLE IF NOT EXISTS eligibility_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    conditions JSONB DEFAULT '[]',
    actions JSONB DEFAULT '[]',
    effective_date_range JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255)
);

-- OPD Transactions table
CREATE TABLE IF NOT EXISTS opd_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'Allocation', 'Expense'
    service_type VARCHAR(100),
    provider VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Approved',
    family_member VARCHAR(50) DEFAULT 'Self',
    balance DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Activities table
CREATE TABLE IF NOT EXISTS employee_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    performed_by VARCHAR(255),
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_corporate_id ON employees(corporate_id);
CREATE INDEX IF NOT EXISTS idx_employees_benefit_group_id ON employees(benefit_group_id);
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_opd_transactions_employee_id ON opd_transactions(employee_id);
CREATE INDEX IF NOT EXISTS idx_opd_transactions_date ON opd_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_employee_activities_employee_id ON employee_activities(employee_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_rules_active ON eligibility_rules(is_active);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_corporates_updated_at BEFORE UPDATE ON corporates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_benefit_groups_updated_at BEFORE UPDATE ON benefit_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eligibility_rules_updated_at BEFORE UPDATE ON eligibility_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default data (optional)
INSERT INTO corporates (name, code, employee_count, contact_person, email, phone, address) VALUES
('Tech Innovators Pvt Ltd', 'TECH', 450, 'Mr. Rajesh Kumar', 'hr@techinnovators.com', '+91-80-4567-8901', 'Electronic City, Bangalore, KA'),
('Raymond Limited', 'RAYMOND', 1250, 'Mr. Amit Kulkarni', 'hr@raymond.com', '+91-22-6654-3000', 'Plot No. 417, Udyog Vihar Phase IV, Gurgaon, HR'),
('Aadhar Housing Finance Limited (AHFL)', 'AHFL', 850, 'Mr. Subhash Gupta', 'hr@aadharhfc.com', '+91-22-4040-7000', 'Aadhar House, 4th Floor, Plot No. C-23, Bandra Kurla Complex, Mumbai, MH')
ON CONFLICT (code) DO NOTHING;

INSERT INTO benefit_groups (name, description, opd_wallet_allocation) VALUES
('Executive', 'Premium benefits for senior management', 25000),
('Premium', 'Enhanced benefits for middle management', 20000),
('Standard', 'Standard benefits for regular employees', 15000),
('Basic', 'Basic benefits for entry-level employees', 10000),
('Not Eligible', 'Employees not eligible for benefits', 0)
ON CONFLICT DO NOTHING;