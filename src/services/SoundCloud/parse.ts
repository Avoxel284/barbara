/**
 * Avoxel284 2022
 * Barbara Music Module / SoundCloud
 */

import { MusicPlaylist, MusicTrack, Service } from "../../lib";
import { getKey } from "../../lib/config";
import { debugLog } from "../../lib/util";

export function MusicTrackFromSoundCloud(data: any) {
	const clientId = getKey("SOUNDCLOUD_CLIENTID");

	return new MusicTrack({
		name: data.title,
		url: data.url || data.permalink_url,
		id: data.id,
		duration: Number(data.duration) / 1000,
		author: {
			url: data?.user?.permalink_url,
			name: data?.user?.username,
			avatar: data?.user?.avatar_url,
			id: data?.user?.id,
			verified: data?.user?.verified,
		},
		explicit: false,
		queuedBy: null,
		playlisted: false,
		thumbnail: data.artwork_url
			? data.artwork_url?.replace(/-large\.jpg/g, "-t300x300.jpg")
			: undefined,
		service: Service.soundcloud,
		audio: data.media.transcodings.map((a: any) => {
			// debugLog(`Parsing SoundCloud formats:`, a, a.format);
			return {
				url: a.url + `?client_id=${clientId}`,
				quality: a.quality,
				duration: a.duration,
				protocol: a.format?.protocol,
				mimeType: a.format?.mime_type?.split(";")[0],
			};
		}),
		originalData: data,
	});
}

export function MusicPlaylistFromSoundCloud(data: any) {
	const clientId = getKey("SOUNDCLOUD_CLIENTID");

	return new MusicPlaylist({
		name: data.title,
		url: data.url || data.permalink_url,
		id: data.id,
		duration: Number(data.duration) / 1000,
		authors: {
			url: data?.user?.permalink_url,
			name: data?.user?.username,
			avatar: data?.user?.avatar_url,
			id: data?.user?.id,
		},
		thumbnail: data.artwork_url
			? data.artwork_url?.replace(/-large\.jpg/g, "-t300x300.jpg")
			: undefined,
		service: Service.soundcloud,
		isAlbum: data.set_type === "album",
		tracks: data.tracks
			.filter((t: any) => t?.title?.length > 0)
			.map((m: any) => {
				m = MusicTrackFromSoundCloud(m);
				m.playlisted = true;
				return m;
			}),
		originalData: data,
	});
}
