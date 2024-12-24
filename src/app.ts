import express = require("express");
import router from "./routes/pr.routes";

const app = express();

// Middleware for logging
app.use((req, res, next) => { 
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

app.use("/", router);

export default app;
