"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setKeyFile = exports.getKey = exports.freeKeys = exports.setKey = exports.Service = exports.MusicPlaylist = exports.MusicTrack = exports.info = exports.serviceFromURL = exports.search = void 0;
const lib_1 = require("./lib");
Object.defineProperty(exports, "MusicTrack", { enumerable: true, get: function () { return lib_1.MusicTrack; } });
Object.defineProperty(exports, "MusicPlaylist", { enumerable: true, get: function () { return lib_1.MusicPlaylist; } });
Object.defineProperty(exports, "Service", { enumerable: true, get: function () { return lib_1.Service; } });
const SoundCloud_1 = require("./services/SoundCloud");
const YouTube_1 = require("./services/YouTube");
const Spotify_1 = require("./services/Spotify");
const config_1 = require("./lib/config");
Object.defineProperty(exports, "setKey", { enumerable: true, get: function () { return config_1.setKey; } });
Object.defineProperty(exports, "freeKeys", { enumerable: true, get: function () { return config_1.freeKeys; } });
Object.defineProperty(exports, "getKey", { enumerable: true, get: function () { return config_1.getKey; } });
Object.defineProperty(exports, "setKeyFile", { enumerable: true, get: function () { return config_1.setKeyFile; } });
const Arbitrary_1 = require("./services/Arbitrary");
const util_1 = require("./lib/util");
async function search(query, options) {
    let type;
    options ??= {
        service: lib_1.Service.soundcloud,
        type: "tracks",
    };
    switch (options.service) {
        case lib_1.Service.soundcloud:
            return await (0, SoundCloud_1.SoundCloudSearch)(query, options.limit, options.type);
            break;
        case lib_1.Service.spotify:
            if (options.type == "albums")
                type = "album";
            if (options.type == "playlists")
                type = "playlist";
            if (options.type == "tracks")
                type = "track";
            return await (0, Spotify_1.SpotifySearch)(query, options.limit, type);
            break;
        case lib_1.Service.youtube:
            if (options.type == "albums")
                throw new Error("Albums do not exist on YouTube");
            if (options.type == "playlists")
                type = "playlist";
            if (options.type == "tracks")
                type = "video";
            return await (0, YouTube_1.YouTubeSearch)(query, options.limit, type);
            break;
    }
}
exports.search = search;
async function serviceFromURL(url) {
    url = url.trim();
    if (url.length === 0)
        return;
    if (url.match(SoundCloud_1.SOUNDCLOUD_URL_PATTERN))
        return lib_1.Service.soundcloud;
    if (url.match(Spotify_1.SPOTIFY_URL_PATTERN))
        return lib_1.Service.spotify;
    if (url.match(Arbitrary_1.AUDIOFILE_URL_PATTERN))
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
            return (0, SoundCloud_1.SoundCloud)(url).catch((err) => {
                throw err;
            });
        case lib_1.Service.spotify:
            return (0, Spotify_1.Spotify)(url);
            break;
        case lib_1.Service.youtube:
            return (0, YouTube_1.YouTube)(url);
            break;
        case lib_1.Service.audiofile:
            return (0, Arbitrary_1.AudioFile)(url, {});
            break;
    }
    throw new Error("Invalid service");
}
exports.info = info;
//# sourceMappingURL=index.js.map