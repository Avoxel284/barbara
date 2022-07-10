"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeKeys = exports.setKeyFile = exports.setKey = exports.getKey = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const keys = {
    SOUNDCLOUD: {
        CLIENTID: "",
    },
    SPOTIFY: {
        APIKEY: "",
        CLIENTID: "",
        CLIENTSECRET: "",
        AUTHORIZATIONCODE: "",
        ACCESSTOKEN: "",
        REFRESHTOKEN: "",
        TOKENTYPE: "",
        EXPIRY: "",
        MARKETCODE: "",
    },
    YOUTUBE: {
        COOKIE: "",
    },
    CONFIG: {
        DEBUG: false,
        FILE: "",
    },
};
function getKey(key) {
    const k = key.split("_");
    if (keys?.[k[0]]?.[k[1]] == null)
        throw new Error("Cannot find key to get: " + key);
    return keys[k[0]][k[1]];
}
exports.getKey = getKey;
function setKey(key, value) {
    const k = key.split("_");
    if (keys?.[k[0]]?.[k[1]] == null)
        throw new Error("Cannot find key to set: " + key);
    keys[k[0]][k[1]] = value;
}
exports.setKey = setKey;
function setKeyFile(path, overwrite = true) {
    if (!path || !path.match(/^(.+)\/([^\/]+)$/))
        throw "Given Barbara key configuration file path is invalid!";
    try {
        let fileContents = fs_1.default.readFileSync(path, { encoding: "utf-8" });
        if (!fileContents)
            throw "Specified configuration file is empty!";
        fileContents = JSON.parse(fileContents);
        for (let [a, b] of Object.entries(fileContents)) {
            a = a.toUpperCase();
            if (keys[a] === undefined)
                continue;
            for (let [c, v] of Object.entries(b)) {
                c = c.toUpperCase();
                if (keys[a][c] === undefined)
                    continue;
                if (keys[a][c] && overwrite == false)
                    continue;
                keys[a][c] = v;
            }
        }
    }
    catch (err) {
        console.error(`An error occurred when attempting to read config file:`, err);
    }
    keys["CONFIG"]["FILE"] = path;
}
exports.setKeyFile = setKeyFile;
async function freeKeys(key) {
    const k = key.split("_");
    if (keys?.[k[0]]?.[k[1]] == null)
        throw new Error("Cannot find key: " + key);
    if (k[0] === "SOUNDCLOUD") {
        if (k[1] === "CLIENTID") {
            const { data } = await axios_1.default.get("https://soundcloud.com/").catch((err) => {
                console.error("soundcloud free key fail");
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
    throw new Error("No free authentication key can be found");
}
exports.freeKeys = freeKeys;
//# sourceMappingURL=config.js.map