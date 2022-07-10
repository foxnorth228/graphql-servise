import "dotenv/config";
import { deepUpdateProperties } from "../../../deepObjectCheckers.js";
import { sendRequest, sendRequestWithParsing } from "../../../sendRequest.js";
import { UserInputError, ForbiddenError } from "apollo-server";
import { checkObjectForId, getObjectForId, testObjectExisting } from "../../../checkObjectExisting.js";
import { jwt } from "../../users/resolvers/resolver.js"
import { checkAuth } from "../../../checkAuthorization.js";
const url = process.env.ALBUMS_URL;
export const resolver = {
    Query: {
        albums: async () => {
            let answer = null;
            try {
                answer = await sendRequestWithParsing(`${url}?limit=0`);
                answer = (await sendRequestWithParsing(`${url}?limit=${answer.total}`)).items;
            } catch(err) {
                console.log(err);
            }
            for (let el of answer) {
                await deepUpdateProperties(el, "track", process.env.TRACKS_URL, [[process.env.ARTISTS_URL, "artists"], [process.env.BANDS_URL, "bands"],
                    [process.env.GENRES_URL, "genres"]]);
            }
            for (let el of answer) {
                await deepUpdateProperties(el, "artists", process.env.ARTISTS_URL, [[process.env.BANDS_URL, "bands"], [process.env.GENRES_URL, "genres"]]);
            }
            for (let el of answer) {
                await deepUpdateProperties(el, "bands", process.env.BANDS_URL, [[process.env.GENRES_URL, "genres"]]);
            }
            for (let el of answer) {
                await deepUpdateProperties(el, "genres", process.env.GENRES_URL);
            }
            return answer;
        },
        album: async (obj, args) => {
            let answer = null;
            try {
                answer = await sendRequestWithParsing(`${url}${args.id}`, "GET");
            } catch(err) {
                console.log(err);
            }
            console.log(answer);
            await deepUpdateProperties(answer, "track", process.env.TRACKS_URL, [[process.env.ARTISTS_URL, "artists"], [process.env.BANDS_URL, "bands"],
                    [process.env.GENRES_URL, "genres"]]);
            await deepUpdateProperties(answer, "artists", process.env.ARTISTS_URL, [[process.env.BANDS_URL, "bands"], [process.env.GENRES_URL, "genres"]]);
            await deepUpdateProperties(answer, "bands", process.env.BANDS_URL, [[process.env.GENRES_URL, "genres"]]);
            await deepUpdateProperties(answer, "genres", process.env.GENRES_URL);
            return answer;
        },
    },
    Mutation: {
        createAlbum: async (obj, args, context) => {
            await checkAuth(context.token);
            let answer = null;
            const body = {
                name: args.album.name,
                released: args.album.released,
                artistsIds: args.album.artists,
                bandsIds: args.album.bands,
                trackIds: args.album.track,
                genresIds: args.album.genres,
                image: args.album.image,
            };
            const headers = {
                "authorization": context.token,
            };
            await testObjectExisting(process.env.TRACKS_URL, body.trackIds);
            await testObjectExisting(process.env.BANDS_URL, body.bandsIds);
            await testObjectExisting(process.env.ARTISTS_URL, body.artistsIds);
            await testObjectExisting(process.env.GENRES_URL, body.genresIds);
            try {
                answer = await sendRequestWithParsing(`${url}`, "POST", body, headers);
                await deepUpdateProperties(answer, "track", process.env.TRACKS_URL, [[process.env.ARTISTS_URL, "artists"], [process.env.BANDS_URL, "bands"],
                    [process.env.GENRES_URL, "genres"]]);
                await deepUpdateProperties(answer, "artists", process.env.ARTISTS_URL, [[process.env.BANDS_URL, "bands"], [process.env.GENRES_URL, "genres"]]);
                await deepUpdateProperties(answer, "bands", process.env.BANDS_URL, [[process.env.GENRES_URL, "genres"]]);
                await deepUpdateProperties(answer, "genres", process.env.GENRES_URL);
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
        deleteAlbum: async (obj, args, context) => {
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
        updateAlbum: async (obj, args) => {
            await checkAuth(context.token);
            let answer = null;
            const body = {
                name: args.album.name,
                released: args.album.released,
                artistsIds: args.album.artists,
                bandsIds: args.album.bands,
                trackIds: args.album.track,
                genresIds: args.album.genres,
                image: args.album.image,
            };
            const headers = {
                "authorization": context.token,
            };
            await testObjectExisting(process.env.TRACKS_URL, body.trackIds);
            await testObjectExisting(process.env.BANDS_URL, body.bandsIds);
            await testObjectExisting(process.env.ARTISTS_URL, body.artistsIds);
            await testObjectExisting(process.env.GENRES_URL, body.genresIds);
            try {
                answer = await sendRequestWithParsing(`${url}${args.id}`, "PUT", body, headers);
                await deepUpdateProperties(answer, "track", process.env.TRACKS_URL, [[process.env.ARTISTS_URL, "artists"], [process.env.BANDS_URL, "bands"],
                    [process.env.GENRES_URL, "genres"]]);
                await deepUpdateProperties(answer, "artists", process.env.ARTISTS_URL, [[process.env.BANDS_URL, "bands"], [process.env.GENRES_URL, "genres"]]);
                await deepUpdateProperties(answer, "bands", process.env.BANDS_URL, [[process.env.GENRES_URL, "genres"]]);
                await deepUpdateProperties(answer, "genres", process.env.GENRES_URL);
            } catch(err) {
                console.log(err);
            }
            return answer;
        },
    },
};