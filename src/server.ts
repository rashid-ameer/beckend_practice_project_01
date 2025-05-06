import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.status(200).json({ health: "100%" });
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
