import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../classes";
import axios from "axios";

let clientId = "";

/** URL pattern for YouTube - ripped from play-dl */
const SOUNDCLOUD_URL_PATTERN =
	/^(?:(https?):\/\/)?(?:(?:www|m)\.)?(api\.soundcloud\.com|soundcloud\.com|snd\.sc)\/(.*)$/;

/** Generate MusicTrack from YouTube data */
const MusicTrackFromSoundCloud = (data: any) =>
	new MusicTrack({
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
		thumbnail: { url: data.artwork_url },
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

/** Generate MusicPlaylist from SoundCloud data */
const MusicPlaylistFromSoundCloud = (data: any) =>
	new MusicPlaylist({
		url: data.permalink_url,
		name: data.title,
		duration: Number(data.duration) / 1000,
		author: {
			url: data?.user?.permalink_url,
			name: data?.user?.username,
			avatar: data?.user?.avatar_url,
			id: data?.user?.id,
		},
		thumbnail: { url: data.artwork_url },
		service: Service.soundcloud,
		isAlbum: data.set_type == "album",
		tracks: data.tracks.filter((t: any) => t?.title?.length > 0).map(MusicTrackFromSoundCloud),
		originalData: data,
	});

/**
 * Returns a free client ID - ripped from play-dl
 */
export async function getClientId(): Promise<string> {
	const { data } = await axios.get("https://soundcloud.com/").catch((err: Error) => {
		throw err;
	});
	const urls: string[] = [];
	data.split('<script crossorigin src="').forEach((r: string) => {
		if (r.startsWith("https")) urls.push(r.split('"')[0]);
	});
	const { data: data2 } = await axios.get(urls[urls.length - 1]).catch((err: Error) => {
		throw err;
	});
	return data2.split(',client_id:"')[1].split('"')[0];
}

/**
 * Returns MusicTrack or MusicPlaylist with information from SoundCloud
 */
export async function SoundCloud(url: string): Promise<MusicTrack | MusicPlaylist> {
	clientId = await getClientId();
	console.log(clientId);

	url = url.trim();
	if (!url.match(SOUNDCLOUD_URL_PATTERN))
		throw new Error(`Given URL is not a valid SoundCloud URL`);
	const { data } = await axios
		.get(`https://api-v2.soundcloud.com/resolve?url=${url}&client_id=${clientId}`)
		.catch((err: Error) => {
			throw err;
		});

	if (data.kind === "track") return MusicTrackFromSoundCloud(data);
	else if (data.kind === "playlist") return MusicPlaylistFromSoundCloud(data);
	else throw new Error("SoundCloud returned unknown resource");
}

/**
 * Searches for a SoundCloud track or playlist
 */
export async function SoundCloudSearch(
	query: string,
	limit: number,
	type: "tracks" | "playlists" | "albums" = "tracks"
): Promise<BarbaraType[]> {
	clientId = await getClientId();
	console.log(clientId);

	let results: BarbaraType[] = [];
	const { data } = await axios
		.get(
			`https://api-v2.soundcloud.com/search/${type}?q=${query}&client_id=${clientId}&limit=${limit}`
		)
		.catch((err: Error) => {
			throw err;
		});

	if (type === "tracks")
		data.collection.forEach((d: any) => results.push(MusicTrackFromSoundCloud(d)));
	else if (type === "albums" || type === "playlists")
		data.collection.forEach((d: any) => results.push(MusicPlaylistFromSoundCloud(d)));
	else {
		throw new Error("Unknown SoundCloud resource type");
	}

	return results;
}