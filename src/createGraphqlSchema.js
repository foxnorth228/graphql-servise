import { gql } from "apollo-server";
import { readFileSync } from "fs";
import { fileURLToPath } from 'url';
import { join } from "path";

export function createGraphqlSchema(url, path) {
    const __dirname = fileURLToPath(new URL('.', url));
    const schema = readFileSync(join(__dirname, `schemas/${path}.graphql`)).toString('utf-8');
    return gql`${schema}`;
}