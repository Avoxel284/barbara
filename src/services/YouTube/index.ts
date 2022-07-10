/**
 * Avoxel284 2022
 * Barbara Music Module / YouTube
 */

import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../lib";
import axios from "axios";
import {
	MusicPlaylistFromYouTube,
	MusicTrackFromYouTube,
	MusicTrackFromYouTubeSearch,
} from "./parse";
import { debugLog } from "../../lib/util";

/**
 * Returns {@link MusicTrack} or {@link MusicPlaylist} from a given YouTube URL
 * Some code was ripped from play-dl
 */
export async function YouTube(url: string): Promise<MusicTrack | MusicPlaylist> {
	url = url.trim();
	// if (!url.match(YOUTUBE_URL_PATTERN)) throw new Error(`Given URL is not a valid YouTube URL`);

	let videoId;
	if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split(/(\?|\/|&)/)[0];
	else if (url.includes("youtube.com/embed/"))
		videoId = url.split("youtube.com/embed/")[1].split(/(\?|\/|&)/)[0];
	else if (url.includes("youtube.com/shorts/"))
		videoId = url.split("youtube.com/shorts/")[1].split(/(\?|\/|&)/)[0];
	else videoId = (url.split("watch?v=")[1] ?? url.split("&v=")[1]).split(/(\?|\/|&)/)[0];

	if (!videoId) throw new Error("Given URL is not a valid YouTube URL");

	const { data: html } = await axios
		.get(`https://www.youtube.com/watch?v=${videoId}&has_verified=1`, {
			headers: {
				"accept-language": "en-US;q=0.9",
				Cookie: "",
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36",
			},
		})
		.catch((err: Error) => {
			throw err;
		});

	if (html.includes("Our systems have detected unusual traffic from your computer network."))
		throw new Error("YouTube detected we're a bot.. thanks youtube.");

	return MusicTrackFromYouTube(html);
}

/**
 * Searches for a YouTube video or playlist and returns an array of {@link MusicTrack} or {@link MusicPlaylist}
 * Some code was ripped from play-dl
 */
export async function YouTubeSearch(
	query: string,
	limit: number = 10,
	type: "video" | "playlist" = "video"
): Promise<MusicTrack[] | MusicPlaylist[]> {
	let results: any = [];
	let url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

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

	debugLog(url);

	const { data: html } = await axios
		.get(url, {
			headers: { "accept-language": "en-US;q=0.9" },
		})
		.catch((err: Error) => {
			throw err;
		});

	if (html.includes("Our systems have detected unusual traffic from your computer network"))
		throw new Error("YouTube detected we're a bot");

	const data = JSON.parse(
		html
			.split("var ytInitialData = ")?.[1]
			?.split(";</script>")[0]
			.split(/;\s*(var|const|let)\s/)[0]
	);
	const items =
		data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents.flatMap(
			(s: any) => s.itemSectionRenderer?.contents
		);
	for (const item of items) {
		if (limit && results.length >= limit) break;
		if (!item || (!item.videoRenderer && !item.channelRenderer && !item.playlistRenderer)) continue;

		debugLog(type);
		switch (type) {
			case "video": {
				const result = MusicTrackFromYouTubeSearch(item);
				if (result) results.push(result);
				break;
			}
			case "playlist": {
				const result = MusicPlaylistFromYouTube(item);
				// if (result) results.push(result);
				break;
			}
			default:
				throw new Error("Unknown type");
				break;
		}
	}

	debugLog(results);
	return results;
}
