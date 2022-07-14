/**
 * Avoxel284 2022
 * Barbara Music Module / Spotify
 */

import { MusicPlaylist, MusicTrack, Service } from "../../lib";
import { getKey } from "../../lib/config";

export function MusicTrackFromSpotify(data: any) {
	return new MusicTrack({
		name: data.name,
		url: data.external_urls.spotify,
		id: data.id,
		duration: Number(data.duration_ms) / 1000,
		author: data.artists.map((artist: any) => {
			return {
				url: artist.external_urls.spotify,
				name: artist.name,
				id: artist.id,
			};
		}),
		thumbnail: data?.album?.images?.[0],
		service: Service.spotify,
		explicit: data.explicit,
		originalData: data,
	});
}

export function MusicPlaylistFromSpotify(data: any, isAlbum: boolean = false) {
	return new MusicPlaylist({
		name: data.name,
		url: data.external_urls.spotify,
		id: data.id,
		duration: Number(data.duration_ms) / 1000,
		authors: {
			url: data.owner.external_urls.spotify,
			name: data.owner.display_name,
			id: data.owner.id,
		},
		thumbnail: data?.images?.[0],
		service: Service.spotify,
		isAlbum: isAlbum,
		// TODO: possibly convert to map?
		// TODO: tracks in playlist- check api
		tracks: data?.tracks.map((d: any) => {
			MusicTrackFromSpotify(d);
		}),
		originalData: data,
	});
}
