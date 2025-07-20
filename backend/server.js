const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import mock data (converted from your frontend)
const mockData = require('./data/mockData');

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.get('/api/employees', (req, res) => {
  try {
    const { page = 1, limit = 20, corporate, search, status } = req.query;
    let employees = [...mockData.employees];
    
    // Filter by corporate
    if (corporate && corporate !== 'all') {
      employees = employees.filter(emp => emp.corporateId === corporate);
    }
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      employees = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.employeeId.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by status
    if (status && status !== 'all') {
      employees = employees.filter(emp => emp.eligibilityStatus === status);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedEmployees = employees.slice(startIndex, endIndex);
    
    res.json({
      employees: paginatedEmployees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: employees.length,
        totalPages: Math.ceil(employees.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/corporates', (req, res) => {
  try {
    res.json(mockData.corporates);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/eligibility-rules', (req, res) => {
  try {
    const { corporate } = req.query;
    let rules = [...mockData.eligibilityRules];
    
    if (corporate && corporate !== 'all') {
      rules = rules.filter(rule => 
        rule.conditions.some(condition => 
          condition.parameter === 'Corporate' && 
          condition.value === corporate
        )
      );
    }
    
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/benefit-groups', (req, res) => {
  try {
    res.json(mockData.benefitGroups);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/employees/:id/opd-transactions', (req, res) => {
  try {
    const { id } = req.params;
    const transactions = mockData.opdTransactions.filter(t => t.employeeId === id);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/employees/:id/activity-log', (req, res) => {
  try {
    const { id } = req.params;
    const activities = mockData.employeeActivities.filter(a => a.employeeId === id);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Health Meter CRM API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});