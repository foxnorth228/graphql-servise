import "dotenv/config";
import { sendRequest } from "../../../sendRequest.js";
import { UserInputError, ForbiddenError } from "apollo-server";
import { checkObjectForId, getObjectForId } from "../../../checkObjectExisting.js";
import { jwt } from "../../users/resolvers/resolver.js"
const url = process.env.FAVOURITES_URL;
export const resolver = {
    Query: {
        favourites: async (obj, args) => {
            let answer = null;
            const headers = {
                "authorization": `${jwt}`,
            };
            try {
                answer = await sendRequest(`${url}`, "GET", {}, headers);
                console.log(answer);
            } catch(err) {
                console.log(err);
            }
            answer = JSON.parse(answer);
            answer.bands = answer.bandsIds;
            answer.genres = answer.genresIds;
            answer.artists = answer.artistsIds;
            answer.tracks = answer.tracksIds;
            return answer;
        },
    },
    Mutation: {
        addTrackToFavourites: async (obj, args) => {
            const body = {
                type: "tracks",
                id: args.id
            }
            const headers = {
                "authorization": `${jwt}`,
            };
            try {
                const answer = JSON.parse(await sendRequest(`${url}add`, "PUT", body, headers));
            } catch(err) {
                console.log(err);
            }
            return "";
        },
        addBandToFavourites: async (obj, args) => {
            const body = {
                type: "bands",
                id: args.id
            }
            const headers = {
                "authorization": `${jwt}`,
            };
            try {
                const answer = JSON.parse(await sendRequest(`${url}add`, "PUT", body, headers));
            } catch(err) {
                console.log(err);
            }
            return "";
        },
        addArtistToFavourites: async (obj, args) => {
            const body = {
                type: "artists",
                id: args.id
            }
            const headers = {
                "authorization": `${jwt}`,
            };
            try {
                const answer = JSON.parse(await sendRequest(`${url}add`, "PUT", body, headers));
            } catch(err) {
                console.log(err);
            }
            return "";
        },
        addGenreToFavourites: async (obj, args) => {
            const body = {
                type: "genres",
                id: args.id
            }
            const headers = {
                "authorization": `${jwt}`,
            };
            try {
                const answer = JSON.parse(await sendRequest(`${url}add`, "PUT", body, headers));
            } catch(err) {
                console.log(err);
            }
            return "";
        },
    }
}