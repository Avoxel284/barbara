import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../classes";
import axios from "axios";
import { MusicTrackFromSoundCloud, MusicPlaylistFromSoundCloud } from "./parse";

let clientId = "";

/** URL pattern for SoundCloud - ripped from play-dl */
const SOUNDCLOUD_URL_PATTERN =
	/^(?:(https?):\/\/)?(?:(?:www|m)\.)?(api\.soundcloud\.com|soundcloud\.com|snd\.sc)\/(.*)$/;

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

// export async function SoundCloudStream(mt: MusicTrack) {
// 	if (mt.service !== Service.soundcloud)
// 		throw Error("MusicTrack service is not SoundCloud, thus cannot be streamed");

// 	const HLSformats = parseHlsFormats(data.formats);
// 	if (typeof quality !== "number") quality = HLSformats.length - 1;
// 	else if (quality <= 0) quality = 0;
// 	else if (quality >= HLSformats.length) quality = HLSformats.length - 1;
// 	const req_url = HLSformats[quality].url + "?client_id=" + soundData.client_id;
// 	console.log(req_url);
// 	const s_data = JSON.parse(await request(req_url));
// 	const type = HLSformats[quality].format.mime_type.startsWith("audio/ogg")
// 		? StreamType.OggOpus
// 		: StreamType.Arbitrary;
// 	return new SoundCloudStream(s_data.url, type);
// }
