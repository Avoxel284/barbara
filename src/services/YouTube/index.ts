import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../classes";
import axios from "axios";
import { MusicPlaylistFromYouTube, MusicTrackFromYouTube } from "./parse";

/**
 * Returns {@link MusicTrack} or {@link MusicPlaylist} from a given YouTube URL
 */
export async function YouTube(url: string): Promise<MusicTrack | MusicPlaylist> {
	url = url.trim();
	if (!url.match(YOUTUBE_URL_PATTERN)) throw new Error(`Given URL is not a valid SoundCloud URL`);
	const { data } = await axios
		.get(`https://api-v2.soundcloud.com/resolve?url=${url}&client_id=${clientId}`)
		.catch((err: Error) => {
			throw err;
		});

	if (data.kind === "track") return MusicTrackFromYouTube(data);
	else if (data.kind === "playlist") return MusicPlaylistFromYouTube(data);
	else throw new Error("YouTube returned unknown resource or nothing");
}

/**
 * Searches for a YouTube video or playlist and returns an array of {@link MusicTrack} or {@link MusicPlaylist}
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
		throw new Error("YouTube returned unknown resource or nothing");
	}

	return results;
}
