import { Handler } from "express";
import { nanoid } from "nanoid";
import { getConnection } from "../db";

export const getTasks: Handler = (req, res) => {
  const data = getConnection().get("tasks").value();
  return res.json(data);
};

export const createTask: Handler = (req, res) => {
  const { name, description } = req.body;

  const newTask = { name, description, id: nanoid() };

  try {
    getConnection().get("tasks").push(newTask).write();
    res.json(newTask);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getTask: Handler = (req, res) => {
  const taskFound = getConnection()
    .get("tasks")
    .find({ id: req.params.id })
    .value();

  if (!taskFound) return res.status(404).json({ msg: "Task was not found" });

  res.json(taskFound);
};

export const count: Handler = (req, res) => {
  const taskLength = getConnection().get("tasks").value().length;
  res.json(taskLength);
};

export const deleteTask: Handler = (req, res) => {
  const taskFound = getConnection()
    .get("tasks")
    .find({ id: req.params.id })
    .value();

  if (!taskFound) {
    return res.status(404).json({ msg: "Task was not found" });
  }

  const deletedTask = getConnection()
    .get("tasks")
    .remove({ id: req.params.id })
    .write();

  res.json(deletedTask);
};

export const updateTask: Handler = (req, res) => {
  try {
    const taskFound = getConnection()
      .get("tasks")
      .find({ id: req.params.id })
      .value();

    if (!taskFound) {
      return res.status(404).json({ msg: "Task was not found" });
    }

    const updatedTask = getConnection()
      .get("tasks")
      .find({ id: req.params.id })
      .assign(req.body)
      .write();

    res.json(updatedTask);
  } catch (error) {
    return res.status(500).send(error);
  }
};
