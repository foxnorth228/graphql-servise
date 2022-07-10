import "dotenv/config";
import { sendRequest } from "../../../sendRequest.js";
import { UserInputError, ForbiddenError } from "apollo-server";
import { checkObjectForId, getObjectForId } from "../../../checkObjectExisting.js";
import { jwt } from "../../users/resolvers/resolver.js"
const url = process.env.ALBUMS_URL;
export const resolver = {
    Query: {
        albums: async () => {
            let albums = null;
            try {
                const answer = JSON.parse(await sendRequest(`${url}?limit=0`));
                const albumsBody = JSON.parse(await sendRequest(`${url}?limit=${answer.total}`));
                albums = albumsBody.items;
            } catch(err) {
                console.log(err);
            }
            for (let album of albums) {
                album.tracks = album.trackIds;
                const newTracks = await getObjectForId(process.env.TRACKS_URL, 
                    album.tracks, [[process.env.ARTISTS_URL, "artists"], [process.env.BANDS_URL, "bands"],
                    [process.env.GENRES_URL, "genres"]]);
                for (let i = 0; i < album.tracks.length; ++i) {
                    album.tracks[i] = newTracks[i];
                }
            }
            for (let album of albums) {
                album.artists = album.artistsIds;
                const newArtists = await getObjectForId(process.env.ARTISTS_URL, 
                    album.artists, [[process.env.BANDS_URL, "bands"], [process.env.GENRES_URL, "genres"]]);
                for (let i = 0; i < album.artists.length; ++i) {
                    album.artists[i] = newArtists[i];
                }
            }
            for (let album of albums) {
                album.bands = album.bandsIds;
                const newBands = await getObjectForId(process.env.BANDS_URL, 
                    album.bands, [[process.env.GENRES_URL, "genres"]]);
                for (let i = 0; i < album.bands.length; ++i) {
                    album.bands[i] = newBands[i];
                }
            }
            for (let album of albums) {
                album.genres = album.genresIds;
                const newGenres = await getObjectForId(process.env.GENRES_URL, album.genres);
                for (let i = 0; i < album.genres.length; ++i) {
                    album.genres[i] = newGenres[i];
                }
            }
            return albums;
        },
        album: async (obj, args) => {
            let album = null;
            try {
                const answer = await sendRequest(`${url}${args.id}`, "GET");
                album = JSON.parse(answer);
            } catch(err) {
                console.log(err);
            }
            album.tracks = album.trackIds;
            const newTracks = await getObjectForId(process.env.TRACKS_URL, 
                album.tracks, [[process.env.ARTISTS_URL, "artists"], [process.env.BANDS_URL, "bands"],
                [process.env.GENRES_URL, "genres"]]);
            for (let i = 0; i < album.tracks.length; ++i) {
                album.tracks[i] = newTracks[i];
            }
            album.artists = album.artistsIds;
            const newArtists = await getObjectForId(process.env.ARTISTS_URL, 
                album.artists, [[process.env.BANDS_URL, "bands"], [process.env.GENRES_URL, "genres"]]);
            for (let i = 0; i < album.artists.length; ++i) {
                album.artists[i] = newArtists[i];
            }
            album.bands = album.bandsIds;
            const newBands = await getObjectForId(process.env.BANDS_URL, 
                album.bands, [[process.env.GENRES_URL, "genres"]]);
            for (let i = 0; i < album.bands.length; ++i) {
                album.bands[i] = newBands[i];
            }
            album.genres = album.genresIds;
            const newGenres = await getObjectForId(process.env.GENRES_URL, album.genres);
            for (let i = 0; i < album.genres.length; ++i) {
                album.genres[i] = newGenres[i];
            }
            return album;
        },
    },
    Mutation: {
        createAlbum: async (obj, args) => {
            let answer = null;
            const body = {
                name: args.album.name,
                released: args.album.released,
                artistsIds: args.album.artists,
                bandsIds: args.album.bands,
                trackIds: args.album.tracks,
                genresIds: args.album.genres,
                image: args.album.image,
            };
            const headers = {
                "authorization": `${jwt}`,
            };
            if(!(await checkObjectForId(process.env.TRACKS_URL, body.trackIds))) {
                throw new UserInputError("Invalid argument value", {
                    argumentsName: "id",
                });
            }
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
        deleteAlbum: (obj, args) => {
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
        updateAlbum: async (obj, args) => {
            let answer = null;
            const body = {
                name: args.album.name,
                released: args.album.released,
                artistsIds: args.album.artists,
                bandsIds: args.album.bands,
                trackIds: args.album.tracks,
                genresIds: args.album.genres,
                image: args.album.image,
            };
            const headers = {
                "authorization": `${jwt}`,
            };
            if(!(await checkObjectForId(process.env.TRACKS_URL, body.trackIds))) {
                throw new UserInputError("Invalid argument value", {
                    argumentsName: "id",
                });
            }
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