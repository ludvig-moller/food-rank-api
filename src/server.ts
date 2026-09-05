import createDb from "./conifg/db";
import createApp from "./app";
import { env } from "./conifg/env";

const db = createDb(env.databasePath);
const app = createApp(db);

app.listen(env.port);
