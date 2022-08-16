"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = exports.MusicPlaylist = exports.MusicTrack = exports.Service = void 0;
const util_1 = require("./util");
const prism_media_1 = __importDefault(require("prism-media"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const YouTube_1 = require("../services/YouTube");
const genius_1 = require("./genius");
var Service;
(function (Service) {
    Service["spotify"] = "spotify";
    Service["youtube"] = "youtube";
    Service["soundcloud"] = "soundcloud";
    Service["audiofile"] = "audiofile";
})(Service = exports.Service || (exports.Service = {}));
class MusicTrack {
    constructor(data) {
        this.name = data.name || "Unnamed MusicTrack";
        this.url = data.url;
        this.thumbnail = data.thumbnail;
        this.duration = data.duration || 0;
        this.durationTimestamp = (0, util_1.getTimeFromSeconds)(data.duration || 0);
        this.live = data.live || false;
        this.playlisted = data.playlisted || false;
        this.service = data.service;
        this.audio = data.audio || [];
        if (!Array.isArray(data?.author))
            data.author = [data.author];
        this.authors = data.author;
        this.metadata = {
            queuedBy: data.queuedBy || null,
            explicit: data.explicit || false,
            id: data.id,
            resolvedTo: data.resolvedTo || false,
        };
        this.originalData = data.originalData;
    }
    async resource(seek = 0, extraArgs, audio) {
        if (this.duration === 0 && this.live === false)
            throw `Track duration is 0 for track: ${this.name}`;
        if (seek < 0 || seek > this.duration)
            throw `Seek is out of range for track: ${this.name}`;
        const url = audio?.url ||
            (await this.bestAudio()
                .then(({ url }) => url)
                .catch((err) => {
                throw err;
            }));
        if (!url)
            throw `Cannot get streaming URL for ${this.name}`;
        const args = [
            "-ss",
            seek,
            "-i",
            url,
            "-analyzeduration",
            "0",
            "-f",
            "opus",
        ];
        if (extraArgs)
            args.push(...extraArgs);
        (0, util_1.debugLog)(`MusicTrack FFmpeg args:`, args);
        new prism_media_1.default.FFmpeg().on("error", (err) => {
            (0, util_1.debugLog)(`FFmpeg streaming error for ${this.name}: ${err}`);
        });
        new prism_media_1.default.FFmpeg().on("end", () => {
            (0, util_1.debugLog)(`FFmpeg streaming ended for ${this.name}`);
        });
        return new prism_media_1.default.FFmpeg({ args: args });
    }
    async bestAudio() {
        await this.fetchMissingAudio();
        let service = this.metadata.resolvedTo || this.service;
        if (this.audio == undefined || this.audio?.length == 0)
            throw new Error("MusicTrack does not contain any audio streams");
        if (service === Service.spotify) {
            throw "Streaming on Spotify is not supported. Try using resolveUnstreamableTrack() first!";
        }
        if (service === Service.soundcloud) {
            (0, util_1.debugLog)(this.audio);
            let best = this.audio
                .filter((a) => a.url != undefined)
                .filter((a) => a.mimeType.includes("audio/mpeg") || a.mimeType.includes("audio/ogg"))
                .filter((a) => a.protocol?.includes("progressive"))
                .sort((a, b) => {
                let qualityToInt = (quality) => {
                    if (quality?.includes("sq"))
                        return 3;
                    if (quality?.includes("medium"))
                        return 2;
                    if (quality?.includes("low"))
                        return 1;
                    return 1;
                };
                if (a.quality != undefined && b.quality != undefined)
                    return qualityToInt(b.quality) - qualityToInt(a.quality);
                return 0;
            })?.[0];
            (0, util_1.debugLog)(best);
            let { data } = await axios_1.default.get(best.url).catch((err) => {
                throw err;
            });
            return {
                ...best,
                url: data.url,
            };
        }
        if (service === Service.youtube) {
            await this.fetchMissingAudio();
            let best = this.audio
                .filter((a) => a.url != undefined)
                .filter((a) => a.mimeType.includes("audio/mp3") ||
                a.mimeType.includes("audio/mpeg") ||
                a.mimeType.includes("audio/mp4"))
                .sort((a, b) => {
                if (a.bitrate && b.bitrate)
                    return b.bitrate - a.bitrate;
                return 0;
            })
                .sort((a, b) => {
                let qualityToInt = (quality) => {
                    if (quality?.includes("HIGH"))
                        return 3;
                    if (quality?.includes("MEDIUM"))
                        return 2;
                    if (quality?.includes("LOW"))
                        return 1;
                    return 1;
                };
                if (a.quality != undefined && b.quality != undefined)
                    return qualityToInt(b.quality) - qualityToInt(a.quality);
                return 0;
            });
            (0, util_1.debugLog)(`Ranking YouTube best audio:`, best);
            return best?.[0];
        }
        if (service === Service.audiofile) {
            return this.audio[0];
        }
        throw new Error("An error occurred when attempting to find best audio");
    }
    async fetchMissingAudio() {
        if (this.audio && this.audio.length > 0)
            return;
        if (this.service === Service.youtube) {
            let { data } = await axios_1.default.get(`${(0, config_1.getKey)("YOUTUBE_INVIDIOUSSITE")}/api/v1/videos/${this.metadata.id || this.originalData.videoId}?fields=adaptiveFormats`);
            if (!data)
                return;
            (0, util_1.debugLog)(`FetchMissingAudio data:`, data);
            this.audio = data.adaptiveFormats
                .filter((f) => f.audioQuality != null)
                .map((f) => {
                return {
                    url: f.url,
                    quality: f.audioQuality,
                    mimeType: f.type,
                    bitrate: f.bitrate,
                };
            });
        }
        return;
    }
    async resolveUnstreamableTrack() {
        if (this.service === Service.spotify) {
            let query = `${this.name} ${this.authors.map((v) => v.name).join(" ")}`;
            let yt = (await (0, YouTube_1.YouTube_Search)(query, 10, "video"))?.[0];
            if (!yt)
                return;
            if (!(yt instanceof MusicTrack))
                return;
            await yt.fetchMissingAudio();
            this.metadata.resolvedTo = Service.youtube;
            this.audio = yt.audio;
            return {
                query: query,
                result: yt,
            };
        }
        return;
    }
    async getGeniusSong() {
        let title = this.name.toLowerCase().replace(/(\(|)lyrics(\)|)/g, "");
        let song = (await (0, genius_1.searchGeniusSong)(`${title} ${this.authors[0].name}`)) ||
            (await (0, genius_1.searchGeniusSong)(`${title}`));
        if (!song)
            return null;
        song.lyrics = ["Lyrics not implemented atm"] || [];
        return song;
    }
    setQueuedBy(queuedBy) {
        this.metadata.queuedBy = queuedBy;
        return this;
    }
}
exports.MusicTrack = MusicTrack;
class MusicPlaylist {
    constructor(data) {
        this.url = data.url;
        this.name = data.name;
        this.duration = data.duration;
        this.durationTimestamp = (0, util_1.getTimeFromSeconds)(data.duration);
        this.isAlbum = data.isAlbum || false;
        this.tracks = data.tracks || [];
        this.service = data.service;
        this.thumbnail = data.thumbnail;
        if (!Array.isArray(data?.authors))
            data.authors = [data.authors];
        this.author = data.authors;
        this.metadata = {
            queuedBy: data.queuedBy,
            collaborative: data.collaborative || false,
            id: data.id,
        };
        this.originalData = data.originalData;
    }
    setQueuedBy(queuedBy) {
        this.metadata.queuedBy = queuedBy;
        this.tracks.forEach((t) => {
            t.setQueuedBy(queuedBy);
        });
        return this;
    }
}
exports.MusicPlaylist = MusicPlaylist;
class Queue {
    constructor(data = {}) { }
}
exports.Queue = Queue;
//# sourceMappingURL=index.js.map