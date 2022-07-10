import "dotenv/config";
import { sendRequest } from "../../../sendRequest.js";
import { UserInputError, ForbiddenError } from "apollo-server";
import { checkObjectForId, getObjectForId } from "../../../checkObjectExisting.js";
import { jwt } from "../../users/resolvers/resolver.js"
const url = process.env.TRACKS_URL;
export const resolver = {
    Query: {
        tracks: async () => {
            let tracks = null;
            try {
                const answer = JSON.parse(await sendRequest(`${url}?limit=0`));
                const tracksBody = JSON.parse(await sendRequest(`${url}?limit=${answer.total}`));
                tracks = tracksBody.items;
            } catch(err) {
                console.log(err);
            }
            for (let track of tracks) {
                track.artists = track.artistsIds;
                const newArtists = await getObjectForId(process.env.ARTISTS_URL, 
                    track.artists, [[process.env.BANDS_URL, "bands"], [process.env.GENRES_URL, "genres"]]);
                for (let i = 0; i < track.artists.length; ++i) {
                    track.artists[i] = newArtists[i];
                }
            }
            for (let track of tracks) {
                track.bands = track.bandsIds;
                const newBands = await getObjectForId(process.env.BANDS_URL, 
                    track.bands, [[process.env.GENRES_URL, "genres"]]);
                for (let i = 0; i < track.bands.length; ++i) {
                    track.bands[i] = newBands[i];
                }
            }
            for (let track of tracks) {
                track.genres = track.genresIds;
                const newGenres = await getObjectForId(process.env.GENRES_URL, track.genres);
                for (let i = 0; i < track.genres.length; ++i) {
                    track.genres[i] = newGenres[i];
                }
            }
            return tracks;
        },
        track: async (obj, args) => {
            let track = null;
            try {
                const answer = await sendRequest(`${url}${args.id}`, "GET");
                track = JSON.parse(answer);
            } catch(err) {
                console.log(err);
            }
            track.artists = track.artistsIds;
            const newArtists = await getObjectForId(process.env.ARTISTS_URL, 
                track.artists, [[process.env.BANDS_URL, "bands"], [process.env.GENRES_URL, "genres"]]);
            for (let i = 0; i < track.artists.length; ++i) {
                track.artists[i] = newArtists[i];
            }
            track.bands = track.bandsIds;
            const newBands = await getObjectForId(process.env.BANDS_URL, 
                track.bands, [[process.env.GENRES_URL, "genres"]]);
            for (let i = 0; i < track.bands.length; ++i) {
                track.bands[i] = newBands[i];
            }
            track.genres = track.genresIds;
            const newGenres = await getObjectForId(process.env.GENRES_URL, track.genres);
            for (let i = 0; i < track.genres.length; ++i) {
                track.genres[i] = newGenres[i];
            }
            return track;
        },
    },
    Mutation: {
        createTrack: async (obj, args) => {
            let answer = null;
            const body = {
                title: args.track.title,
                albumId: args.track.album,
                artistsIds: args.track.artists,
                bandsIds: args.track.bands,
                duration: args.track.duration,
                released: args.track.released,
                genresIds: args.track.genres,
            };
            const headers = {
                "authorization": `${jwt}`,
            };
            if(!(await checkObjectForId(process.env.BANDS_URL, body.bandsIds))) {
                throw new UserInputError("Invalid argument value", {
                    argumentsName: "id",
                });
            }
            if(!(await checkObjectForId(process.env.ARTISTS_URL, body.artistsIds))) {
                throw new UserInputError("Invalid argument value", {
                    argumentsName: "id",
                });
            }
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
        deleteTrack: (obj, args) => {
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
        updateTrack: async (obj, args) => {
            let answer = null;
            const body = {
                title: args.track.title,
                albumId: args.track.album,
                artistsIds: args.track.artists,
                bandsIds: args.track.bands,
                duration: args.track.duration,
                released: args.track.released,
                genresIds: args.track.genres,
            };
            const headers = {
                "authorization": `${jwt}`,
            };
            if(!(await checkObjectForId(process.env.BANDS_URL, body.bandsIds))) {
                throw new UserInputError("Invalid argument value", {
                    argumentsName: "id",
                });
            }
            if(!(await checkObjectForId(process.env.ARTISTS_URL, body.artistsIds))) {
                throw new UserInputError("Invalid argument value", {
                    argumentsName: "id",
                });
            }
            if(!(await checkObjectForId(process.env.GENRES_URL, body.genresIds))) {
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