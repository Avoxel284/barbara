/**
 * Avoxel284 2022
 * Barbara Music Module / Spotify
 */

import axios from "axios";
import { MusicPlaylist, MusicTrack, Service } from "../../lib";
import { getKey } from "../../lib/config";
import { debugLog } from "../../lib/util";

export function MusicTrackFromSpotify(data: any) {
	return new MusicTrack({
		name: data.name,
		url: data.external_urls?.spotify,
		id: data.id,
		duration: Number(data.duration_ms) / 1000,
		author: data.artists.map((artist: any) => {
			return {
				url: artist.external_urls?.spotify,
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
	debugLog(`Creating new Spotify playlist :: isAlbum = ${isAlbum}`, data);
	const tracks: MusicTrack[] = [];
	async function fetchTracks(nextPageUrl?: string) {
		if (nextPageUrl) {
			let { data } = await axios.get(nextPageUrl, {
				headers: {
					Authorization: `${getKey("SPOTIFY_TOKENTYPE")} ${getKey("SPOTIFY_ACCESSTOKEN")}`,
				},
			});
			if (data.offset >= 500) return;
			if (data.tracks?.next) fetchTracks(data.tracks.next);
			tracks.push(...data?.items?.map((d: any) => MusicTrackFromSpotify(d.track)));
		} else {
			if (typeof data.tracks?.next == "string") await fetchTracks(data.tracks.next);
			tracks.push(...data?.tracks?.items?.map((d: any) => MusicTrackFromSpotify(d.track)));
		}
	}

	await fetchTracks();

	return new MusicPlaylist({
		name: data.name,
		url: data.external_urls?.spotify,
		id: data.id,
		duration: Number(data.duration_ms) / 1000,
		authors: {
			url: data.owner.external_urls?.spotify,
			name: data.owner.display_name,
			id: data.owner.id,
		},
		thumbnail: data?.images?.[0]?.url,
		service: Service.spotify,
		isAlbum: isAlbum,
		tracks: tracks,
		originalData: data,
	});
}
