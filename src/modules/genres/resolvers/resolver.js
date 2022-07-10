import "dotenv/config";
import { sendRequest, sendRequestWithParsing } from "../../../sendRequest.js";
import { checkAuth } from "../../../checkAuthorization.js";
const url = process.env.GENRES_URL;
export const resolver = {
    Query: {
        genres: async () => {
            let genres = null;
            try {
                const answer = JSON.parse(await sendRequest(`${url}?limit=0`));
                const genresBody = JSON.parse(await sendRequest(`${url}?limit=${answer.total}`));
                genres = genresBody.items;
            } catch(err) {
                console.log(err);
            }
            return genres;
        },
        genre: async (obj, args) => {
            let genre = null;
            try {
                console.log(`${url}${args.id}`);
                const answer = await sendRequest(`${url}${args.id}`, "GET");
                genre = JSON.parse(answer);
                genre.year = parseInt(genre.year);
            } catch(err) {
                console.log(err);
            }
            return genre;
        },
    },
    Mutation: {
        createGenre: async (obj, args, context) => {
            checkAuth(context);
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
                console.log(body);
                answer = JSON.parse(await sendRequest(`${url}`, "POST", body, headers));
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
        deleteGenre: async (obj, args, context) => {
            checkAuth(context);
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
        updateGenre: (obj, args, context) => {
            checkAuth(context);
            const body = {
                name: args.genre.name,
                description: args.genre.description,
                country: args.genre.country,
                year: args.genre.year,
            };
            const headers = {
                "authorization": `${jwt}`,
            };
            try {
                const answer = sendRequest(`${url}${args.id}`, "PUT", body, headers);
            } catch(err) {
                console.log(err);
            }
            return "";
        },
    },
};
