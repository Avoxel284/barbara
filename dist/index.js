"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setKeyFile = exports.getKey = exports.freeKey = exports.setKey = exports.Service = exports.MusicPlaylist = exports.MusicTrack = exports.info = exports.serviceFromURL = exports.search = void 0;
const lib_1 = require("./lib");
Object.defineProperty(exports, "MusicTrack", { enumerable: true, get: function () { return lib_1.MusicTrack; } });
Object.defineProperty(exports, "MusicPlaylist", { enumerable: true, get: function () { return lib_1.MusicPlaylist; } });
Object.defineProperty(exports, "Service", { enumerable: true, get: function () { return lib_1.Service; } });
const SoundCloud_1 = require("./services/SoundCloud");
const YouTube_1 = require("./services/YouTube");
const Spotify_1 = require("./services/Spotify");
const config_1 = require("./lib/config");
Object.defineProperty(exports, "setKey", { enumerable: true, get: function () { return config_1.setKey; } });
Object.defineProperty(exports, "freeKey", { enumerable: true, get: function () { return config_1.freeKey; } });
Object.defineProperty(exports, "getKey", { enumerable: true, get: function () { return config_1.getKey; } });
Object.defineProperty(exports, "setKeyFile", { enumerable: true, get: function () { return config_1.setKeyFile; } });
const Arbitrary_1 = require("./services/Arbitrary");
const util_1 = require("./lib/util");
async function search(query, options = {}) {
    let type;
    options.limit ??= 1;
    options.service ??= lib_1.Service.youtube;
    options.type ??= "tracks";
    switch (options.service) {
        case lib_1.Service.soundcloud:
            if (options.type == "videos")
                throw new Error("Videos do not exist on SoundCloud");
            return await (0, SoundCloud_1.SoundCloud_Search)(query, options.limit, options.type);
            break;
        case lib_1.Service.spotify:
            if (options.type == "videos")
                throw new Error("Videos do not exist on Spotify");
            if (options.type == "albums")
                type = "album";
            if (options.type == "playlists")
                type = "playlist";
            if (options.type == "tracks")
                type = "track";
            return await (0, Spotify_1.Spotify_Search)(query, options.limit, type);
            break;
        case lib_1.Service.youtube:
            if (options.type == "albums")
                throw new Error("Albums do not exist on YouTube");
            if (options.type == "playlists")
                type = "playlist";
            if (options.type == "tracks" || options.type == "videos")
                type = "video";
            return await (0, YouTube_1.YouTube_Search)(query, options.limit, type);
            break;
        case lib_1.Service.audiofile:
            throw "Bro really thought they could search for audio files";
            break;
    }
    throw new Error("Interesting how its impossible for this error to ever occur");
}
exports.search = search;
async function serviceFromURL(url) {
    url = url.trim();
    if (url.length === 0)
        return;
    if ((0, YouTube_1.YouTube_Validate)(url))
        return lib_1.Service.youtube;
    if ((0, SoundCloud_1.SoundCloud_Validate)(url))
        return lib_1.Service.soundcloud;
    if ((0, Spotify_1.Spotify_Validate)(url))
        return lib_1.Service.spotify;
    if ((0, Arbitrary_1.AudioFile_Validate)(url))
        return lib_1.Service.audiofile;
}
exports.serviceFromURL = serviceFromURL;
async function info(url) {
    url = url.trim();
    let service = await serviceFromURL(url);
    if (!url)
        throw "URL empty";
    (0, util_1.debugLog)(`Getting info from ${url} :: Detected service: ${service}`);
    switch (service) {
        case lib_1.Service.soundcloud:
            return (0, SoundCloud_1.SoundCloud_Info)(url).catch((err) => {
                throw err;
            });
        case lib_1.Service.spotify:
            return (0, Spotify_1.Spotify_Info)(url);
            break;
        case lib_1.Service.youtube:
            return (0, YouTube_1.YouTube_Info)(url);
            break;
        case lib_1.Service.audiofile:
            return (0, Arbitrary_1.AudioFile_Info)(url, {});
            break;
    }
    throw new Error("Invalid service");
}
exports.info = info;
//# sourceMappingURL=index.js.map