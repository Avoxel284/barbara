import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../classes";
import axios from "axios";
import { MusicPlaylistFromYouTube, MusicTrackFromYouTube } from "./parse";

/**
 * Returns MusicTrack or MusicPlaylist with information from YouTube
 */
export async function YouTube(url: string): Promise<MusicTrack | MusicPlaylist> {
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
 * Searches for a YouTube video or playlist
 */
export async function YouTubeSearch(
	query: string,
	limit: number,
	type: "video" | "playlist" = "video"
): Promise<BarbaraType[]> {
	let results: BarbaraType[] = [];
	let url = `https://www.youtube.com/results?search_query=${query}`;

	if (url.indexOf("&sp=") === -1) {
		url += "&sp=";
		switch (type) {
			case "playlist": {
				url += `EgIQAw%253D%253D`;
			}
			case "video": {
				url += `EgIQAQ%253D%253D`;
			}
		}
	}

	const { data } = await axios
		.get(url, {
			headers: { "accept-language": "en-US;q=0.9" },
		})
		.catch((err: Error) => {
			throw err;
		});

	if (data.contains("Our systems have detected unusual traffic from your computer network"))
		throw new Error("YouTube detected we're a bot");

	if (type === "video") data.collection.forEach((d: any) => results.push(MusicTrackFromYouTube(d)));
	else if (type === "playlist")
		data.collection.forEach((d: any) => results.push(MusicPlaylistFromYouTube(d)));
	else {
		throw new Error("Unknown SoundCloud resource type");
	}

	return results;
}
