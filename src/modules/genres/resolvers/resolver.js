import "dotenv/config";
import { sendRequest, sendRequestWithParsing } from "../../../sendRequest.js";
import { checkAuth } from "../../../checkAuthorization.js";
const url = process.env.GENRES_URL;
export const resolver = {
    Query: {
        genres: async () => {
            let genres = null;
            try {
                const answer = await sendRequestWithParsing(`${url}?limit=0`);
                genres = (await sendRequestWithParsing(`${url}?limit=${answer.total}`)).items;
            } catch(err) {
                console.log(err);
            }
            return genres;
        },
        genre: async (obj, args) => {
            let genre = null;
            try {
                genre = await sendRequestWithParsing(`${url}${args.id}`, "GET");
            } catch(err) {
                console.log(err);
            }
            return genre;
        },
    },
    Mutation: {
        createGenre: async (obj, args, context) => {
            await checkAuth(context);
            let answer = null;
            const body = {
                name: args.genre.name,
                description: args.genre.description,
                country: args.genre.country,
                year: args.genre.year,
            };
            const headers = {
                "authorization": `${context.token}`,
            };
            try {
                answer = await sendRequestWithParsing(`${url}`, "POST", body, headers);
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
        deleteGenre: async (obj, args, context) => {
            await checkAuth(context);
            let answer = null;
            const body = {};
            const headers = {
                "authorization": `${context.token}`,
            };
            try {
                answer = await sendRequestWithParsing(`${url}${args.id}`, "DELETE", body, headers);
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
        updateGenre: async (obj, args, context) => {
            await checkAuth(context);
            let answer = null;
            const body = {
                name: args.genre.name,
                description: args.genre.description,
                country: args.genre.country,
                year: args.genre.year,
            };
            const headers = {
                "authorization": `${context.token}`,
            };
            try {
                answer = await sendRequestWithParsing(`${url}${args.id}`, "PUT", body, headers);
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
    },
};
