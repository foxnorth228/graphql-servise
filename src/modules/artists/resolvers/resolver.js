import "dotenv/config";
import { checkAuth } from "../../../checkAuthorization.js";
import { deepUpdateProperties } from "../../../deepObjectCheckers.js";
import { sendRequest, sendRequestWithParsing } from "../../../sendRequest.js";
import { UserInputError, ForbiddenError } from "apollo-server";
import { checkObjectForId, getObjectForId, testObjectExisting } from "../../../checkObjectExisting.js";
import { jwt } from "../../users/resolvers/resolver.js"
const url = process.env.ARTISTS_URL;
export const resolver = {
    Query: {
        artists: async () => {
            let answer = null;
            try {
                answer = await sendRequestWithParsing(`${url}?limit=0`);
                answer = (await sendRequestWithParsing(`${url}?limit=${answer.total}`)).items;
            } catch(err) {
                console.log(err);
            }
            for (let el of answer) {
                await deepUpdateProperties(el, "bands", process.env.BANDS_URL, [[process.env.GENRES_URL, "genres"]]);
            }
            return answer;
        },
        artist: async (obj, args) => {
            let answer = null;
            try {
                answer = await sendRequestWithParsing(`${url}${args.id}`, "GET");
            } catch(err) {
                console.log(err);
            }
            await deepUpdateProperties(answer, "bands", process.env.BANDS_URL, [[process.env.GENRES_URL, "genres"]]);
            return answer;
        },
    },
    Mutation: {
        createArtist: async (obj, args, context) => {
            await checkAuth(context.token);
            let answer = null;
            const body = {
                firstName: args.artist.firstName,
                secondName: args.artist.secondName,
                middleName: args.artist.middleName,
                birthDate: args.artist.birthDate,
                birthPlace: args.artist.birthPlace,
                country: args.artist.country,
                bandsIds: args.artist.bands,
                instruments: args.artist.instruments,
            };
            const headers = {
                "authorization": context.token,
            };
            await testObjectExisting(process.env.BANDS_URL, body.bandsIds);
            try {
                answer = await sendRequestWithParsing(`${url}`, "POST", body, headers);
                await deepUpdateProperties(answer, "bands", process.env.BANDS_URL, [[process.env.GENRES_URL, "genres"]]);
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
        deleteArtist: async (obj, args, context) => {
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
        updateArtist: async (obj, args, context) => {
            await checkAuth(context.token);
            let answer = null;
            const body = {
                firstName: args.artist.firstName,
                secondName: args.artist.secondName,
                middleName: args.artist.middleName,
                birthDate: args.artist.birthDate,
                birthPlace: args.artist.birthPlace,
                country: args.artist.country,
                bandsIds: args.artist.bands,
                instruments: args.artist.instruments,
            };
            const headers = {
                "authorization": context.token,
            };
            await testObjectExisting(process.env.BANDS_URL, body.bandsIds);
            try {
                answer = await sendRequestWithParsing(`${url}${args.id}`, "PUT", body, headers);
                await deepUpdateProperties(answer, "bands", process.env.BANDS_URL, [[process.env.GENRES_URL, "genres"]]);
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
    },
};