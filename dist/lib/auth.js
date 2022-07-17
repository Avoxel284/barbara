"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokens = exports.authenticateKey = void 0;
const axios_1 = __importDefault(require("axios"));
const _1 = require(".");
const config_1 = require("./config");
async function authenticateKey(key0) {
    if (key0 === "SPOTIFY") {
        let accessToken = (0, config_1.getKey)("SPOTIFY_ACCESSTOKEN");
        let clientId = (0, config_1.getKey)("SPOTIFY_CLIENTID");
        let clientSecret = (0, config_1.getKey)("SPOTIFY_CLIENTSECRET");
        if (accessToken)
            return;
        if (!clientId || !clientSecret)
            return;
        let { data } = await axios_1.default
            .post("https://accounts.spotify.com/api/token", {
            grant_type: "client_credentials",
            headers: {
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
            },
        })
            .catch((err) => {
            throw err;
        });
        return {
            SPOTIFY_CLIENTID: "",
            SPOTIFY_ACCESSTOKEN: data.access_token,
            SPOTIFY_TOKENEXPIRY: Date.now() + (data.expires_in - 1) * 1000,
            SPOTIFY_TOKENTYPE: data.token_type,
        };
    }
    return;
}
exports.authenticateKey = authenticateKey;
async function refreshTokens(service) {
    if (service === _1.Service.spotify || !service) {
        authenticateKey("SPOTIFY");
    }
}
exports.refreshTokens = refreshTokens;
(async () => {
    if ((0, config_1.getKey)("CONFIG_AUTOREFRESH")) {
    }
})();
//# sourceMappingURL=auth.js.map