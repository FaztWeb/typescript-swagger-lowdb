import app from "./app";
import { createConnection } from "./db";

createConnection();

app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
