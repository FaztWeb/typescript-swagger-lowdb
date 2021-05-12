import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

type Task = {
  id: string;
  name: string;
  description: string;
};

type Schema = {
  tasks: Task[];
};

let db: lowdb.LowdbSync<Schema>;

export const createConnection = async () => {
  const adapter = new FileSync<Schema>("db.json");
  db = lowdb(adapter);
  db.defaults({ tasks: [] }).write();
};

export const getConnection = () => db;
