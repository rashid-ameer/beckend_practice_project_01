import express from "express";

const app = express();

// health check
app.use("/", (_, res) => {
  res.status(200).json({ health: "100%" });
});

export default app;
