import express from "express";
import cors from "cors";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { nanoid } from "nanoid";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

type Task = {
  id: string;
  name: string;
  description: string;
};

type Schema = {
  tasks: Task[];
};

const adapter = new FileSync<Schema>("db.json");

const db = lowdb(adapter);

db.defaults({ tasks: [] }).write();

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tasks API",
      version: "1.0.0",
      description: "A simple express library API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.get("/tasks", (req, res) => {
  const data = db.get("tasks").value();
  return res.json(data);
});

app.post("/tasks", async (req, res) => {
  const { name, description } = req.body;

  db.get("tasks").push({ name, description, id: nanoid() }).write();

  res.json({ success: true });
});

export default app;
