import { getObjectForId } from "./checkObjectExisting.js";

export async function deepUpdateProperties(object, property, url, recursiveProperty=[]) {
    object[property] = object[`${property}Ids`];
    const newBodies = await getObjectForId(url, object[property], recursiveProperty);
    for (let i = 0; i < object[property].length; ++i) {
        object[property][i] = newBodies[i];
    }
}