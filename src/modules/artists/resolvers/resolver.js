import "dotenv/config";
import { sendRequest } from "../../../sendRequest.js";
import { UserInputError, ForbiddenError } from "apollo-server";
import { checkObjectForId, getObjectForId } from "../../../checkObjectExisting.js";
import { jwt } from "../../users/resolvers/resolver.js"
const url = process.env.ARTISTS_URL;
export const resolver = {
    Query: {
        artists: async () => {
            let artists = null;
            try {
                const answer = JSON.parse(await sendRequest(`${url}?limit=0`));
                const artistsBody = JSON.parse(await sendRequest(`${url}?limit=${answer.total}`));
                artists = artistsBody.items;
            } catch(err) {
                console.log(err);
            }
            for (let artist of artists) {
                artist.bands = artist.bandsIds;
                const newBands = await getObjectForId(process.env.BANDS_URL, 
                    artist.bands, [[process.env.GENRES_URL, "genres"]]);
                for (let i = 0; i < artist.bands.length; ++i) {
                    artist.bands[i] = newBands[i];
                }
            }
            return artists;
        },
        artist: async (obj, args) => {
            let artist = null;
            try {
                const answer = await sendRequest(`${url}${args.id}`, "GET");
                artist = JSON.parse(answer);
            } catch(err) {
                console.log(err);
            }
            artist.bands = artist.bandsIds;
            const newBands = await getObjectForId(process.env.BANDS_URL, artist.bands,
                [[process.env.GENRES_URL, "genres"]]);
            for (let i = 0; i < artist.bands.length; ++i) {
                artist.bands[i] = newBands[i];
            }
            return artist;
        },
    },
    Mutation: {
        createArtist: async (obj, args) => {
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
                "authorization": `${jwt}`,
            };
            if(!(await checkObjectForId(process.env.BANDS_URL, body.bandsIds))) {
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
        deleteArtist: (obj, args) => {
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
        updateArtist: async (obj, args) => {
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
                "authorization": `${jwt}`,
            };
            if(!(await checkObjectForId(process.env.BANDS_URL, body.bandsIds))) {
                throw new UserInputError("Invalid argument value", {
                    argumentsName: "id",
                });
            }
            try {
                console.log(body);
                answer = JSON.parse(await sendRequest(`${url}${args.id}`, "PUT", body, headers));
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