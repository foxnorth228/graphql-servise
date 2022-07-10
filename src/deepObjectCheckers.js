import { getObjectForId } from "./checkObjectExisting.js";

export async function deepUpdateProperties(object, property, url) {
    object[property] = object[`${property}Ids`];
    const newBodies = await getObjectForId(url, object[property]);
    for (let i = 0; i < object[property].length; ++i) {
        object[property][i] = newBodies[i];
    }
}