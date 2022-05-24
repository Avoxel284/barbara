"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundCloud = exports.getClientId = void 0;
const classes_1 = require("../../classes");
const axios = require("axios").default;
let clientId = "";
const SOUNDCLOUD_URL_PATTERN = /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(api\.soundcloud\.com|soundcloud\.com|snd\.sc)\/(.*)$/;
async function getClientId() {
    const { data } = await axios.get("https://soundcloud.com/").catch((err) => {
        throw err;
    });
    const urls = [];
    data.split('<script crossorigin src="').forEach((r) => {
        if (r.startsWith("https"))
            urls.push(r.split('"')[0]);
    });
    const { data: data2 } = await axios.get(urls[urls.length - 1]).catch((err) => {
        throw err;
    });
    return data2.split(',client_id:"')[1].split('"')[0];
}
exports.getClientId = getClientId;
async function SoundCloud(url) {
    clientId = await getClientId();
    console.log(clientId);
    url = url.trim();
    if (!url.match(SOUNDCLOUD_URL_PATTERN))
        throw new Error(`Given URL is not a valid SoundCloud URL`);
    const { data } = await axios
        .get(`https://api-v2.soundcloud.com/resolve?url=${url}&client_id=${clientId}`)
        .catch((err) => {
        throw err;
    });
    if (data.kind == "track") {
        return new classes_1.MusicTrack({
            name: data.title,
            url: data.permalink_url,
            duration: Number(data.duration) / 1000,
            author: {
                url: data.user.permalink_url,
                name: data.user.username,
                avatar: data.user.avatar_url,
                id: data.user.id,
            },
            thumbnail: { url: data.artwork_url },
            service: classes_1.Service.soundcloud,
        });
    }
    else if (data.kind == "playlist") {
        return new classes_1.MusicPlaylist({
            name: data.title,
            url: data.permalink_url,
            duration: Number(data.duration) / 1000,
            author: {
                url: data.user.permalink_url,
                name: data.user.username,
                avatar: data.user.avatar_url,
                id: data.user.id,
            },
            thumbnail: { url: data.artwork_url },
            service: classes_1.Service.soundcloud,
        });
    }
    else {
        throw new Error("SoundCloud returned unknown resource");
    }
}
exports.SoundCloud = SoundCloud;
//# sourceMappingURL=index.js.map