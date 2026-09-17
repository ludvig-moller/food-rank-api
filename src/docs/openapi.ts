import z from "zod";
import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";
import { env } from "../config/env";

import "./restaurantDocs";
import "./dishDocs";
import "./reviewDocs";

extendZodWithOpenApi(z);

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Food Rank API",
      version: "1.0.0",
      description: "API for restaurants, dishes and reviews.",
    },
    tags: [
        {
            name: "Restaurants",
        },
        {
          name: "Dishes",
        },
        {
          name: "Reviews",
        },
    ],
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: "Local server",
      },
    ],
  });
}