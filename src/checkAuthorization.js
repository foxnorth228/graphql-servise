import "dotenv/config";
import { ForbiddenError } from "apollo-server";
import { sendRequestWithParsing } from "./sendRequest.js";
export async function checkAuth(token) {
    if(token === 'no') {
        throw new ForbiddenError("You didn't send token in headers. You can get a token with logging");
    } else {
        let answer = null;
        const headers = {
            "authorization": token,
        }
        try {
            answer = await sendRequestWithParsing(`${process.env.USERS_URL}verify`, "POST", {}, headers);
        } catch(err) {
            console.log(err);
        }
        if(answer.statusCode && [401, 403].includes(answer.statusCode)) {
            throw new ForbiddenError("Incorrect token");
        }
    }
};