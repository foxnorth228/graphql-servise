import { sendRequest } from "./sendRequest.js";
import { UserInputError } from "apollo-server";
export async function checkObjectForId(url, ids) {
    let answer = true;
    for (let id of ids) {
        if(id === "") {
            continue;
        }
        let body = await sendRequest(`${url}${id}`);
        console.log(`body - ${body}`);
        body = JSON.parse(body);
        if(body.statusCode) {
            answer = false;
            break;
        }
    }
    return answer;
}

export async function getObjectForId(url, ids, recursiveProperty=[]) {
    let answer = [];
    console.log(ids);
    for (let id of ids) {
        if(id === "") {
            continue;
        }
        const body = JSON.parse(await sendRequest(`${url}${id}`));
        if(body["statusCode"]) {
            throw new UserInputError("Invalid argument value", {
                argumentsName: "id",
            });
        } else {
            answer.push(body);
        }
    }
    if(recursiveProperty.length !== 0) {
        const [url2, ids2] = recursiveProperty[0];
        for(let i = 0; i < answer.length; ++i) {
            answer[i][ids2] = answer[i][`${ids2}Ids`];
            const newElems = await getObjectForId(url2, answer[i][ids2], recursiveProperty.slice(1));
            for(let j = 0; j < answer[i][ids2].length; ++j) {
                answer[i][ids2][j] = newElems[j];
            }
        }
    }
    return answer;
}