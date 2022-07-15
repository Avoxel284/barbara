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
        };
        this.originalData = data.originalData;
    }
    async resource(seek = 0, extraArgs, audio) {
        if (this.duration === 0)
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
            "-f",
            "opus",
            "-ac",
            "2",
        ];
        if (extraArgs)
            args.push(...extraArgs);
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
        if (this.audio == undefined || this.audio?.length == 0)
            throw new Error("MusicTrack does not contain any audio streams");
        if (this.service === Service.spotify) {
            throw new Error("Spotify does not provide streaming, thus cannot return audio." +
                " Try searching for a similar track on a different service.");
        }
        if (this.service === Service.soundcloud) {
            (0, util_1.debugLog)(this.audio);
            let best = this.audio
                .filter((a) => (a.mimeType ? a.mimeType.includes("audio/mpeg") : false))
                .filter((a) => a.protocol?.includes("progressive"))
                .filter((a) => a.quality
                ? a.quality.includes("sq") || a.quality.includes("medium") || a.quality.includes("low")
                : false)?.[0];
            (0, util_1.debugLog)(best);
            let { data } = await axios_1.default.get(`${best.url}`).catch((err) => {
                throw err;
            });
            best.url = data.url;
            return best;
        }
        if (this.service === Service.youtube) {
            await this.fetchMissingAudio();
            let best = this.audio
                .filter((a) => a.mimeType.includes("audio/mp3") ||
                a.mimeType.includes("audio/mpeg") ||
                a.mimeType.includes("audio/mp4"))
                .sort((a, b) => {
                if (a.bitrate && b.bitrate)
                    return a.bitrate - b?.bitrate;
                return 0;
            })?.[0];
            return best;
        }
        if (this.service === Service.audiofile) {
            return this.audio[0];
        }
        throw new Error("An error occurred when attempting to find best audio");
    }
    async fetchMissingAudio() {
        if (this.service !== Service.youtube)
            return;
        if (this.audio && this.audio.length > 0)
            return;
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
        return this;
    }
}
exports.MusicPlaylist = MusicPlaylist;
class Queue {
    constructor(data = {}) { }
}
exports.Queue = Queue;
//# sourceMappingURL=index.js.map