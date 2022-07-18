/**
 * Avoxel284 2022
 * Barbara Music Module / Spotify
 */

import axios from "axios";
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
		thumbnail: data?.album?.images?.[0]?.url,
		service: Service.spotify,
		explicit: data.explicit,
		originalData: data,
	});
}

export async function MusicPlaylistFromSpotify(data: any, isAlbum: boolean = false) {
	const fetchTracks = async (nextPageUrl?: string) => {
		if (nextPageUrl) {
			let { data } = await axios.get(nextPageUrl, {
				headers: {
					Authorization: `${getKey("SPOTIFY_TOKENTYPE")} ${getKey("SPOTIFY_ACCESSTOKEN")}`,
				},
			});
			if (data.tracks?.next) fetchTracks(data.tracks.next);

			return data?.tracks.items.map((d: any) => {
				MusicTrackFromSpotify(d);
			});
		} else {
			if (data.tracks?.next) await fetchTracks(data.tracks.next);

			return data?.tracks.items.map((d: any) => {
				MusicTrackFromSpotify(d);
			});
		}
	};

	console.log(await fetchTracks())

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
		thumbnail: data?.images?.[0]?.url,
		service: Service.spotify,
		isAlbum: isAlbum,
		// TODO: possibly convert to map?
		// TODO: tracks in playlist- check api
		// tracks: await fetchTracks(),
		tracks: [],
		originalData: data,
	});
}
