import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "OpsFlow API is running"
    });
});

export default app;