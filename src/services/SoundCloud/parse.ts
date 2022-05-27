import { MusicPlaylist, MusicTrack, Service } from "../../classes";
import { getKey } from "../../config";

export function MusicTrackFromSoundCloud(data: any) {
	const clientId = getKey("soundcloudClientId");

	return new MusicTrack({
		name: data.title,
		url: data.url,
		duration: Number(data.duration) / 1000,
		author: {
			url: data?.user?.permalink_url,
			name: data?.user?.username,
			avatar: data?.user?.avatar_url,
			id: data?.user?.id,
			verified: data?.user?.verified,
		},
		thumbnail: data.artwork_url,
		service: Service.soundcloud,
		audio: data.media.transcodings.map((a: any) => {
			return {
				url: a.url + `?client_id=${clientId}`,
				quality: a.quality,
				duration: a.duration,
				protocol: a.format?.protocol,
				mimeType: a.format?.mime_type,
			};
		}),
		originalData: data,
	});
}

export function MusicPlaylistFromSoundCloud(data: any) {
	const clientId = getKey("soundcloudClientId");

	return new MusicPlaylist({
		url: data.permalink_url,
		name: data.title,
		duration: Number(data.duration) / 1000,
		author: {
			url: data?.user?.permalink_url,
			name: data?.user?.username,
			avatar: data?.user?.avatar_url,
			id: data?.user?.id,
		},
		thumbnail: data.artwork_url,
		service: Service.soundcloud,
		isAlbum: data.set_type == "album",
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
