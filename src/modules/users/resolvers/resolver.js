import "dotenv/config";
import { sendRequest, sendRequestWithParsing } from "../../../sendRequest.js"
const url = process.env.USERS_URL;
export let jwt = null;
export const resolver = {
    Query: {
        jwt: () => jwt,
        user: async (obj, args, context) => {
            let answer = null;
            try {
                answer = await sendRequestWithParsing(`${url}${args.id}`);
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
    },
    Mutation: {
        register: async (obj, args) => { 
            let answer = null;
            const body = {
                firstName: args.user.firstName,
                lastName: args.user.lastName,
                password: args.user.password,
                email: args.user.email,
            }
            try {
                answer = await sendRequestWithParsing(`${url}register`, "POST", body);
            } catch(err) {
                console.log(err.message);
            }
            return answer; 
        },
        login: async (obj, args) => { 
            let answer = null;
            const body = {
                password: args.password,
                email: args.email,
            }
            try {
                answer = await sendRequestWithParsing(`${url}login`, "POST",  body);
                jwt = answer["jwt"];
            } catch(err) {
                console.log(err.message);
            }
            return answer["jwt"]; 
        },
    },
};