import "dotenv/config";
import { sendRequest } from "../../../sendRequest.js";
import { UserInputError, ForbiddenError } from "apollo-server";
import { checkObjectForId, getObjectForId } from "../../../checkObjectExisting.js";
import { jwt } from "../../users/resolvers/resolver.js"
const url = process.env.BANDS_URL;
export const resolver = {
    Query: {
        bands: async () => {
            let bands = null;
            try {
                const answer = JSON.parse(await sendRequest(`${url}?limit=0`));
                const bandsBody = JSON.parse(await sendRequest(`${url}?limit=${answer.total}`));
                bands = bandsBody.items;
            } catch(err) {
                console.log(err);
            }
            for (let band of bands) {
                band.genres = band.genresIds;
                const newGenres = await getObjectForId(process.env.GENRES_URL, band.genres);
                for (let i = 0; i < band.genres.length; ++i) {
                    band.genres[i] = newGenres[i];
                }
            }
            return bands;
        },
        band: async (obj, args) => {
            let band = null;
            try {
                const answer = await sendRequest(`${url}${args.id}`, "GET");
                band = JSON.parse(answer);
            } catch(err) {
                console.log(err);
            }
            band.genres = band.genresIds;
            const newGenres = await getObjectForId(process.env.GENRES_URL, band.genres);
            for (let i = 0; i < band.genres.length; ++i) {
                band.genres[i] = newGenres[i];
            }
            return band;
        },
    },
    Mutation: {
        createBand: async (obj, args) => {
            let answer = null;
            const body = {
                name: args.band.name,
                origin: args.band.origin,
                members: args.band.members,
                website: args.band.website,
                genresIds: args.band.genres
            };
            const headers = {
                "authorization": `${jwt}`,
            };
            if(!(await checkObjectForId(process.env.GENRES_URL, body.genresIds))) {
                throw new UserInputError("Invalid argument value", {
                    argumentsName: "id",
                });
            }
            try {
                console.log(body);
                answer = JSON.parse(await sendRequest(`${url}`, "POST", body, headers));
            } catch(err) {
                console.log(err);
            }
            if(answer.statusCode === 403) {
                throw new ForbiddenError(answer.message);
            }
            return "";
        },
        deleteBand: (obj, args) => {
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
        updateBand: async (obj, args) => {
            let answer = null;
            const body = {
                name: args.band.name,
                origin: args.band.origin,
                members: args.band.members,
                website: args.band.website,
                genresIds: args.band.genres
            };
            const headers = {
                "authorization": `${jwt}`,
            };
            if(!(await checkObjectForId(process.env.GENRES_URL, body.genresIds))) {
                throw new UserInputError("Invalid argument value", {
                    argumentsName: "id",
                });
            }
            try {
                answer = await sendRequest(`${url}${args.id}`, "PUT", body, headers);
            } catch(err) {
                console.log(err);
            }
            if(answer.statusCode === 403) {
                throw new ForbiddenError(answer.message);
            }
            return "";
        },
    },
};