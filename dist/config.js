"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeKeys = exports.isDebug = exports.setKeyFile = exports.setKey = exports.getKey = void 0;
const axios_1 = __importDefault(require("axios"));
const keys = {
    soundcloudClientId: "",
    spotifyAPIKey: "",
};
function getKey(key) {
    if (key == "SOUNDCLOUD_CLIENTID")
        return keys["soundcloudClientId"];
    if (key == "SPOTIFY_APIKEY")
        return keys["spotifyAPIKey"];
    return "";
}
exports.getKey = getKey;
function setKey(key, value) {
    if (key == "SOUNDCLOUD_CLIENTID")
        keys["soundcloudClientId"] = value;
    if (key == "SPOTIFY_APIKEY")
        keys["spotifyAPIKey"] = value;
}
exports.setKey = setKey;
function setKeyFile(path) { }
exports.setKeyFile = setKeyFile;
function isDebug() {
    return true;
}
exports.isDebug = isDebug;
async function freeKeys(key) {
    if (key === "SOUNDCLOUD_CLIENTID") {
        const { data } = await axios_1.default.get("https://soundcloud.com/").catch((err) => {
            throw err;
        });
        const urls = [];
        data.split('<script crossorigin src="').forEach((r) => {
            if (r.startsWith("https"))
                urls.push(r.split('"')[0]);
        });
        const { data: data2 } = await axios_1.default.get(urls[urls.length - 1]).catch((err) => {
            throw err;
        });
        return data2.split(',client_id:"')[1].split('"')[0];
    }
}
exports.freeKeys = freeKeys;
//# sourceMappingURL=config.js.map