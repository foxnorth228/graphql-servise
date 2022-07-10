import "dotenv/config";
import { checkAuth } from "../../../checkAuthorization.js";
import { deepUpdateProperties } from "../../../deepObjectCheckers.js";
import { sendRequest, sendRequestWithParsing } from "../../../sendRequest.js";
import { UserInputError, ForbiddenError } from "apollo-server";
import { checkObjectForId, getObjectForId, testObjectExisting } from "../../../checkObjectExisting.js";
const url = process.env.BANDS_URL;
export const resolver = {
    Query: {
        bands: async () => {
            let answer = null;
            try {
                answer = await sendRequestWithParsing(`${url}?limit=0`);
                answer = (await sendRequestWithParsing(`${url}?limit=${answer.total}`)).items;
            } catch(err) {
                console.log(err);
            }
            for (let el of answer) {
                await deepUpdateProperties(el, "genres", process.env.GENRES_URL);
            }
            return answer;
        },
        band: async (obj, args) => {
            let answer = null;
            try {
                answer = await sendRequestWithParsing(`${url}${args.id}`, "GET");
            } catch(err) {
                console.log(err);
            }
            await deepUpdateProperties(answer, "genres", process.env.GENRES_URL);
            return answer;
        },
    },
    Mutation: {
        createBand: async (obj, args, context) => {
            await checkAuth(context.token);
            let answer = null;
            const body = {
                name: args.band.name,
                origin: args.band.origin,
                members: args.band.members,
                website: args.band.website,
                genresIds: args.band.genres
            };
            const headers = {
                "authorization": `${context.token}`,
            };
            await testObjectExisting(process.env.GENRES_URL, body.genresIds);
            try {
                answer = await sendRequestWithParsing(`${url}`, "POST", body, headers);
                await deepUpdateProperties(answer, "genres", process.env.GENRES_URL);
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
        deleteBand: async (obj, args, context) => {
            await checkAuth(context.token);
            let answer = null;
            const body = {};
            const headers = {
                "authorization": context.token,
            };
            try {
                answer = await sendRequestWithParsing(`${url}${args.id}`, "DELETE", body, headers);
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
        updateBand: async (obj, args, context) => {
            await checkAuth(context.token);
            let answer = null;
            const body = {
                name: args.band.name,
                origin: args.band.origin,
                members: args.band.members,
                website: args.band.website,
                genresIds: args.band.genres
            };
            const headers = {
                "authorization": context.token,
            };
            await testObjectExisting(process.env.GENRES_URL, body.genresIds);
            try {
                answer = await sendRequestWithParsing(`${url}${args.id}`, "PUT", body, headers);
                await deepUpdateProperties(answer, "genres", process.env.GENRES_URL);
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
    },
};