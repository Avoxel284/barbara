/**
 * Avoxel284 2022
 * Barbara Music Module / YouTube
 */

import { MusicPlaylist, MusicTrack, Service } from "../../lib";
import { debugLog, getSecondsFromTime, getTimeFromSeconds } from "../../lib/util";
import { Audio } from "../../lib";

/**
 * Parse a MusicTrack from YouTube video page data.
 * Some code was ripped from play-dl
 */
export function MusicTrackFromYouTube(data: any) {
	return new MusicTrack({
		url: `https://www.youtube.com/watch?v=${data.videoId}`,
		id: data.videoId,
		name: data.title,
		// description: videoData.shortDescription,
		duration: Number(data.lengthSeconds),
		thumbnail: data.videoThumbnails[0].url,
		author: {
			name: data.author,
			id: data.authorId,
			url: `https://www.youtube.com/${data.authorUrl}`,
			avatar: data.authorThumbnails
				? data.authorThumbnails[data?.authorThumbnails?.length - 1]
				: "",
		},
		audio: data.adaptiveFormats
			? data.adaptiveFormats
					.filter((f: any) => f.audioQuality != null)
					.map((f: any) => {
						return {
							url: f.url,
							quality: f.audioQuality,
							mimeType: f.type.split(";")[0],
							bitrate: f.bitrate,
						};
					})
			: null,
		live: data.liveNow,
		service: Service.youtube,
		originalData: data,
	});
}

/**
 * Parse a MusicPlaylist from YouTube playlist page.
 */
export function MusicPlaylistFromYouTube(data: any) {
	// return new MusicPlaylist({
	// 	url: "",
	// 	service: Service.youtube,
	// });
}
