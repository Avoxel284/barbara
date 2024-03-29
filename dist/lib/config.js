"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeKey = exports.setKeyFile = exports.setKeys = exports.setKey = exports.getKey = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("./auth");
const util_1 = require("./util");
const keys = {
    SOUNDCLOUD: {
        CLIENTID: "",
    },
    SPOTIFY: {
        CLIENTID: "",
        CLIENTSECRET: "",
        ACCESSTOKEN: "",
        TOKENTYPE: "",
        TOKENEXPIRY: "",
        MARKETCODE: "AU",
    },
    YOUTUBE: {
        COOKIE: "",
        INVIDIOUSSITE: "https://vid.puffyan.us",
    },
    GENIUS: {
        TOKEN: "",
        LYRICSCACHING: true,
    },
    CONFIG: {
        DEBUG: false,
        FILE: "",
        AUTOREFRESH: true,
    },
};
function getKey(key) {
    const k = key.split("_");
    if (keys?.[k[0]]?.[k[1]] === undefined)
        throw new Error("Cannot find key to get: " + key);
    return keys[k[0]][k[1]];
}
exports.getKey = getKey;
function setKey(key, value) {
    const k = key.split("_");
    if (value === undefined)
        (0, util_1.warnLog)(`Value when setting ${k[0]}_${k[1]} is undefined!`);
    if (keys?.[k[0]]?.[k[1]] === undefined)
        throw new Error("Cannot find key to set: " + key);
    keys[k[0]][k[1]] = value;
    (0, auth_1.authenticateKey)(k[0]);
}
exports.setKey = setKey;
function setKeys(ks) {
    for (let [a, b] of Object.entries(ks)) {
        a = a.toUpperCase();
        if (a.includes("_") && typeof b !== "object") {
            let k = a.split("_");
            k[0] = k[0].toUpperCase();
            k[1] = k[1].toUpperCase();
            if (keys[k[0]]?.[k[1]] === undefined)
                continue;
            if (b === undefined)
                (0, util_1.warnLog)(`Value when setting ${k[0]}_${k[1]} is undefined!`);
            keys[k[0]][k[1]] = b;
            (0, auth_1.authenticateKey)(k[0]);
            continue;
        }
        if (keys[a] === undefined)
            continue;
        for (let [c, v] of Object.entries(b)) {
            c = c.toUpperCase();
            if (keys[a]?.[c] === undefined)
                continue;
            if (v === undefined)
                (0, util_1.warnLog)(`Value when setting ${a}_${c} is undefined!`);
            keys[a][c] = v;
            (0, auth_1.authenticateKey)(a);
            continue;
        }
    }
}
exports.setKeys = setKeys;
function setKeyFile(path, overwrite = true) {
    if (!path || !path.match(/^(.+)\/([^\/]+)$/) || !fs_1.default.existsSync(path))
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
                if (keys[a]?.[c] === undefined)
                    continue;
                if (keys[a][c] && overwrite == false)
                    continue;
                keys[a][c] = v;
                (0, auth_1.authenticateKey)(a);
            }
        }
    }
    catch (err) {
        console.error(`An error occurred when attempting to read config file:`, err);
    }
    keys["CONFIG"]["FILE"] = path;
}
exports.setKeyFile = setKeyFile;
async function freeKey(key) {
    const k = key.split("_");
    if (keys?.[k[0]]?.[k[1]] == null)
        throw new Error("Cannot find key: " + key);
    if (k[0] === "SOUNDCLOUD") {
        if (k[1] === "CLIENTID") {
            const { data } = await axios_1.default.get("https://soundcloud.com/").catch((err) => {
                console.error("An error occurred when attempting to fetch SoundCloud free key:");
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
    if (k[0] === "YOUTUBE") {
        if (k[1] === "INVIDIOUSSITE") {
            const { data } = await axios_1.default
                .get(`https://api.invidious.io/instances.json?pretty=0&sort_by=type,users`)
                .catch((err) => {
                console.error("An error occurred when attempting to fetch Invidious api url:");
                throw err;
            });
            if (!data)
                return;
            const urls = [];
            data.forEach((a) => {
                if (a[1].api)
                    urls.push(a[1].uri);
            });
            return urls[0];
        }
    }
    throw new Error("No free authentication key can be found");
}
exports.freeKey = freeKey;
//# sourceMappingURL=config.js.map