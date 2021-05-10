import express from "express";
import cors from "cors";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { nanoid } from "nanoid";

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
