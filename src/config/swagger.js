const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: `
## Finance Dashboard Backend API

A role-based finance management system with the following roles:
- **ADMIN**: Full access to everything
- **ANALYST**: Can view records, create/update/delete own records, access dashboard
- **VIEWER**: Can only view their own records

## Authentication
Use the **/api/auth/login** endpoint to get a JWT token.
Then click **Authorize** button and enter: \`Bearer <your_token>\`
      `,
      contact: {
        name: 'Finance Dashboard API',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token here',
        },
      },
      schemas: {
        // Auth schemas
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Admin' },
            email: { type: 'string', example: 'admin@test.com' },
            password: { type: 'string', example: 'admin123' },
            role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'], example: 'ADMIN' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@test.com' },
            password: { type: 'string', example: 'admin123' },
          },
        },
        // User schemas
        UpdateUserInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Updated Name' },
            email: { type: 'string', example: 'updated@test.com' },
            role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'] },
            isActive: { type: 'boolean', example: true },
          },
        },
        // Record schemas
        CreateRecordInput: {
          type: 'object',
          required: ['amount', 'type', 'category', 'date'],
          properties: {
            amount: { type: 'number', example: 5000 },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'INCOME' },
            category: { type: 'string', example: 'Salary' },
            date: { type: 'string', example: '2026-04-01' },
            notes: { type: 'string', example: 'Monthly salary' },
          },
        },
        UpdateRecordInput: {
          type: 'object',
          properties: {
            amount: { type: 'number', example: 6000 },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            category: { type: 'string', example: 'Freelance' },
            date: { type: 'string', example: '2026-04-01' },
            notes: { type: 'string', example: 'Updated notes' },
          },
        },
        // 
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Something went wrong' },
            errors: { type: 'object', nullable: true },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };