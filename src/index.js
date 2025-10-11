const express = require('express');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const app = express();
const specPath = path.join(__dirname, '..', 'doc', 'swagger_v1.yaml');
const file = fs.readFileSync(specPath, 'utf8');
const swaggerDocument = yaml.load(file);

// Redirect root to api-docs
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    console.log('Swagger UI available at http://localhost:3000/api-docs');
    console.log('Loading Swagger specification from:', specPath);
});