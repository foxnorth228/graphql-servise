import { resolver } from "./resolvers/resolver.js";
import { createGraphqlSchema } from "../../createGraphqlSchema.js";
export const resolvers = resolver;
export const typeDefs = createGraphqlSchema(import.meta.url, "users");