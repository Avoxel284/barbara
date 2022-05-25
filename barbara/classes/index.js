"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicPlaylist = exports.MusicTrack = exports.Service = void 0;
const util_1 = require("../util");
var Service;
(function (Service) {
    Service["spotify"] = "spotify";
    Service["youtube"] = "youtube";
    Service["soundcloud"] = "soundcloud";
    Service["audiofile"] = "audiofile";
})(Service = exports.Service || (exports.Service = {}));
class MusicTrack {
    constructor(data = {}) {
        this.url = data.url || "";
        this.name = data.name || "Unnamed MusicTrack";
        this.thumbnail = data.thumbnail;
        this.queuedBy = data.queuedBy;
        this.duration = data.duration || 0;
        this.durationTimestamp = (0, util_1.getTimeFromSeconds)(data.duration || 0);
        this.playlisted = data.playlisted || false;
        this.service = data.service;
        this.audio = data.audio;
        this.author = data.author;
        this.originalData = data.originalData;
    }
}
exports.MusicTrack = MusicTrack;
class MusicPlaylist {
    constructor(data = {}) {
        this.url = data.url;
        this.name = data.name;
        this.isAlbum = data.isAlbum;
        this.tracks = data.tracks;
    }
}
exports.MusicPlaylist = MusicPlaylist;
//# sourceMappingURL=index.js.map