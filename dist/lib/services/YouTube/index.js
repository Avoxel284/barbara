"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTube_Validate = exports.YouTube_Search = exports.YouTube_Info = void 0;
const axios_1 = __importDefault(require("axios"));
const parse_1 = require("./parse");
const util_1 = require("../../lib/util");
const config_1 = require("../../lib/config");
const PLAYLIST_ID_PATTERN = /^(PL|UU|LL|RD|OL)[a-zA-Z\d_-]{10,}$/;
const PLAYLIST_URL_PATTERN = /^((?:https?:)?\/\/)?(?:(?:www|m|music)\.)?(youtube\.com)\/(?:(playlist|watch))(.*)?((\?|\&)list=)(PL|UU|LL|RD|OL)[a-zA-Z\d_-]{10,}(.*)?$/;
const VIDEO_URL_PATTERN = /^((?:https?:)?\/\/)?(?:(?:www|m|music)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|shorts\/|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
async function YouTube_Info(url) {
    url = url.trim();
    let videoId;
    if (url.includes("youtu.be/"))
        videoId = url.split("youtu.be/")[1].split(/(\?|\/|&)/)[0];
    else if (url.includes("youtube.com/embed/"))
        videoId = url.split("youtube.com/embed/")[1].split(/(\?|\/|&)/)[0];
    else if (url.includes("youtube.com/shorts/"))
        videoId = url.split("youtube.com/shorts/")[1].split(/(\?|\/|&)/)[0];
    else if (url.includes("youtube.com/playlist?list="))
        videoId = url.split("youtube.com/playlist?list=")[1].split(/(\?|\/|&)/)[0];
    else
        videoId = (url.split("watch?v=")[1] ?? url.split("&v=")[1]).split(/(\?|\/|&)/)[0];
    let { data } = await axios_1.default.get(`${(0, config_1.getKey)("YOUTUBE_INVIDIOUSSITE")}/api/v1/videos/${videoId}`);
    return (0, parse_1.MusicTrackFromYouTube)(data);
}
exports.YouTube_Info = YouTube_Info;
async function YouTube_Search(query, limit = 10, type = "video") {
    (0, util_1.debugLog)(`Invidious API URL key: ${(0, config_1.getKey)("YOUTUBE_INVIDIOUSSITE")}`);
    let { data } = await axios_1.default.get(`${(0, config_1.getKey)("YOUTUBE_INVIDIOUSSITE")}/api/v1/search?q=${encodeURIComponent(query)}&type=${type}`);
    return data.map(parse_1.MusicTrackFromYouTube);
}
exports.YouTube_Search = YouTube_Search;
function YouTube_Validate(url) {
    if (url.match(PLAYLIST_URL_PATTERN))
        return true;
    if (url.match(VIDEO_URL_PATTERN))
        return true;
}
exports.YouTube_Validate = YouTube_Validate;
//# sourceMappingURL=index.js.map