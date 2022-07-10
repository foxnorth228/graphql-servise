import "dotenv/config";
import { sendRequest } from "../../../sendRequest.js"
const url = process.env.USERS_URL;
export let jwt = null;
export const resolver = {
    Query: {
        jwt: () => jwt,
        user:() => "name",
    },
    Mutation: {
        register: async (obj, args) => { 
            console.log(obj, args); 
            try {
                const body = {
                    firstName: args.firstName,
                    lastName: args.lastName,
                    password: args.password,
                    email: args.email,
                }
                console.log(body);
                console.log(`${url}register`);
                await sendRequest(`${url}register`, "POST", body);
            } catch(err) {
                console.log(err.message);
            }
            return args.name; 
        },
        login: async (obj, args, context) => { 
            console.log(obj, args); 
            console.log("context", context.token)
            try {
                const body = {
                    password: args.password,
                    email: args.email,
                }
                console.log(body);
                console.log(`${url}register`);
                const answer = await sendRequest(`${url}login`, "POST",  body);
                const jwtBody = JSON.parse(answer);
                jwt = jwtBody["jwt"];
                console.log(jwt);
            } catch(err) {
                console.log(err.message);
            }
            return args.name; 
        },
        verify: async () => {
            try {
                const body = {};
                const headers = {
                    'Authorization': `${jwt}`
                };
                await sendRequest(`${url}verify`, "POST", body, headers);
            } catch(err) {
                console.log(err.message);
            }
            return ""; 
        }
    },
};