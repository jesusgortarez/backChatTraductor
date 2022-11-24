const express = require('express');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

app.get("/", (req, res) => {
    res.send("Bienvenido a la api de chat, la documentación se encuentra en /api-docs ");
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");

const PORT=process.env.PORT || 5000;

// settings
app.set('port', PORT); 
// middlewares
app.use(cors());
app.use(express.json());
// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/:universalURL", (req, res) => {
    res.send("404 URL NOT FOUND");
});
app.get("/:universalURL/:universalURL", (req, res) => {
    res.send("404 URL NOT FOUND");
});
app.get("/:universalURL/:universalURL/:universalURL", (req, res) => {
    res.send("404 URL NOT FOUND");
});

module.exports = app;
