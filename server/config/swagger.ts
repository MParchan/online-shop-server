import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Online Shop API",
            version: "1.0.0",
            description: "API dokumentacja dla sklepu internetowego"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        servers: [
            {
                url:
                    process.env.NODE_ENV === "production"
                        ? "https://online-shop-server-pi.vercel.app/api/v1"
                        : "http://localhost:5001/api/v1"
            }
        ]
    },
    apis: ["./server/routes/*.ts"]
});
