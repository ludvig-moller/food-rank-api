
const errors: string[] = [];

// PORT
if (!process.env.PORT) {
    errors.push("PORT is required");
}

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    errors.push("PORT must be a vaild port number");
}

// DATABASE_PATH
if (!process.env.DATABASE_PATH) {
    errors.push("DATABASE_PATH is required");
}

const databasePath: string = process.env.DATABASE_PATH!;

if (errors.length > 0) {
  console.error("\nConfiguration errors:\n");

  for (const error of errors) {
    console.error(error);
  }

  console.error("\nPlease check your environment variables.\n");

  process.exit(1);
}

export const env = {
    port,
    databasePath,
};
