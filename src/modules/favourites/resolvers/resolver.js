import "dotenv/config";
import { sendRequest } from "../../../sendRequest.js";
import { checkAuth } from "../../../checkAuthorization.js";
import { UserInputError, ForbiddenError } from "apollo-server";
import { checkObjectForId, getObjectForId } from "../../../checkObjectExisting.js";
import { jwt } from "../../users/resolvers/resolver.js"
const url = process.env.FAVOURITES_URL;
export const resolver = {
    Query: {
        favourites: async (obj, args, context) => {
            await checkAuth(context.token);
            let answer = null;
            const headers = {
                "authorization": context.token,
            };
            try {
                answer = await sendRequest(`${url}`, "GET", {}, headers);
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
        addTrackToFavourites: async (obj, args, context) => {
            await checkAuth(context.token);
            const body = {
                type: "tracks",
                id: args.id
            }
            const headers = {
                "authorization": context.token,
            };
            try {
                const answer = JSON.parse(await sendRequest(`${url}add`, "PUT", body, headers));
            } catch(err) {
                console.log(err);
            }
            return "";
        },
        addBandToFavourites: async (obj, args, context) => {
            await checkAuth(context.token);
            const body = {
                type: "bands",
                id: args.id
            }
            const headers = {
                "authorization": context.token,
            };
            try {
                const answer = JSON.parse(await sendRequest(`${url}add`, "PUT", body, headers));
            } catch(err) {
                console.log(err);
            }
            return "";
        },
        addArtistToFavourites: async (obj, args, context) => {
            await checkAuth(context.token);
            const body = {
                type: "artists",
                id: args.id
            }
            const headers = {
                "authorization": context.token,
            };
            try {
                const answer = JSON.parse(await sendRequest(`${url}add`, "PUT", body, headers));
            } catch(err) {
                console.log(err);
            }
            return "";
        },
        addGenreToFavourites: async (obj, args, context) => {
            await checkAuth(context.token);
            const body = {
                type: "genres",
                id: args.id
            }
            const headers = {
                "authorization": context.token,
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