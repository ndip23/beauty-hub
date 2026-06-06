// config/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Beautyhub API",
      version: "1.0.0",
      description:
        "A complete backend API for salon booking platform with user auth, appointments, messaging, and analytics",
      contact: {
        name: "Your Name",
        email: "your-email@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
      {
        url: "https://api.Beautyhub.site/",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API files where you will write JSDoc comments
  apis: [
    "./routes/*.js", // Your route files
    "./controllers/*.js", // Your controller functions (best place for JSDoc)
    "./models/*.js", // Optional: to pull schemas for request/response bodies
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
