import { Client } from "pg";

const client: Client = new Client({
  user: "matos",
  host: "localhost",
  port: 5432,
  password: "1234",
  database: "matos",
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database conected");
};
export { startDatabase, client };
