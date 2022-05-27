"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeSearch =
	exports.YouTube =
	exports.SoundCloudSearch =
	exports.SoundCloud =
	exports.Service =
	exports.MusicTrack =
	exports.info =
	exports.search =
		void 0;
const classes_1 = require("./classes");
Object.defineProperty(exports, "MusicTrack", {
	enumerable: true,
	get: function () {
		return classes_1.MusicTrack;
	},
});
Object.defineProperty(exports, "Service", {
	enumerable: true,
	get: function () {
		return classes_1.Service;
	},
});
const SoundCloud_1 = require("./services/SoundCloud");
Object.defineProperty(exports, "SoundCloud", {
	enumerable: true,
	get: function () {
		return SoundCloud_1.SoundCloud;
	},
});
Object.defineProperty(exports, "SoundCloudSearch", {
	enumerable: true,
	get: function () {
		return SoundCloud_1.SoundCloudSearch;
	},
});
const YouTube_1 = require("./services/YouTube");
Object.defineProperty(exports, "YouTubeSearch", {
	enumerable: true,
	get: function () {
		return YouTube_1.YouTubeSearch;
	},
});
Object.defineProperty(exports, "YouTube", {
	enumerable: true,
	get: function () {
		return YouTube_1.YouTube;
	},
});
async function search(query, options) {
	if (options.service === classes_1.Service.soundcloud) {
		return await (0, SoundCloud_1.SoundCloudSearch)(query, options.limit, options.type);
	}
}
exports.search = search;
async function info(url, options) {}
exports.info = info;
//# sourceMappingURL=index.js.map
