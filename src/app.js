import "dotenv/config";
import express from "express";
import database from "./config/database.js";
import Routes from "./routes/routes.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api", Routes());

const bootstrap = async () => {
  try {
    await database();
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log("Server is running", PORT);
    });
  } catch (message) {
    res.json({
      message,
    });
  }
};

bootstrap();
