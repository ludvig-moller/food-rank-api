import createDb from "./config/db";
import createApp from "./app";
import { env } from "./config/env";

const db = createDb(env.databasePath);
const app = createApp(db);

app.listen(env.port);
