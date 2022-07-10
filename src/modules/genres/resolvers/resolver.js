import "dotenv/config";
import { sendRequest } from "../../../sendRequest.js";
import { jwt } from "../../users/resolvers/resolver.js";
const url = process.env.GENRES_URL;
export const resolver = {
    Query: {
        genres: async () => {
            let genres = null;
            try {
                console.log(url);
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
        createGenre: (obj, args) => {
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
                console.log(body);
                const answer = sendRequest(`${url}`, "POST", body, headers);
            } catch(err) {
                console.log(err);
            }
            return "";
        },
        deleteGenre: (obj, args) => {
            const body = {};
            const headers = {
                "authorization": `${jwt}`,
            };
            try {
                const answer = sendRequest(`${url}${args.id}`, "DELETE", body, headers);
            } catch(err) {
                console.log(err);
            }
            return "";
        },
        updateGenre: (obj, args) => {
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
