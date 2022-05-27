import { MusicPlaylist, MusicTrack, Service } from "../../classes";
import { getSecondsFromTime, getTimeFromSeconds } from "../../util";
import { Audio } from "../../classes";

/**
 * Parse a MusicTrack from YouTube video page data.
 * Some code was ripped from play-dl
 */
export function MusicTrackFromYouTube(data: any) {
	let playerData = data
		.split("var ytInitialPlayerResponse = ")?.[1]
		?.split(";</script>")[0]
		.split(/;\s*(var|const|let)\s/)[0];
	if (!playerData) throw new Error("Failed to extract player data from YouTube video HTML");

	let initialData = data
		.split("var ytInitialData = ")?.[1]
		?.split(";</script>")[0]
		.split(/;\s*(var|const|let)\s/)[0];
	if (!initialData) throw new Error("Failed to extract initial data from YouTube video HTML");

	playerData = JSON.parse(playerData);
	initialData = JSON.parse(initialData);

	if (playerData.playabilityStatus.status !== "OK") {
		if (playerData.playabilityStatus.status === "CONTENT_CHECK_REQUIRED") {
			// const cookies =
			// 	initialData.topbar.desktopTopbarRenderer.interstitial?.consentBumpV2Renderer.agreeButton
			// 		.buttonRenderer.command.saveConsentAction;
			// if (cookies) {
			// 	Object.assign(cookieJar, {
			// 		VISITOR_INFO1_LIVE: cookies.visitorCookie,
			// 		CONSENT: cookies.consentCookie,
			// 	});
			// }
			// const updatedValues = await acceptViewerDiscretion(vid.videoId, cookieJar, body, true);
			// playerData.streamingData = updatedValues.streamingData;
			// initialData.contents.twoColumnWatchNextResults.secondaryResults = updatedValues.relatedVideos;
		} else if (playerData.playabilityStatus.status === "LIVE_STREAM_OFFLINE") {
			throw new Error("Livestream has not begun yet");
			// upcoming = true;
			// upcoming live stream
		} else
			throw new Error(
				`Error occurred when scraping data from YouTube video: \n${
					playerData.playabilityStatus.errorScreen.playerErrorMessageRenderer?.reason.simpleText ??
					playerData.playabilityStatus.errorScreen.playerKavRenderer?.reason.simpleText ??
					playerData.playabilityStatus.reason
				}`
			);
	}

	const videoData = playerData.videoDetails;
	console.log("video data", videoData);
	const musicData =
		initialData.contents.twoColumnWatchNextResults.results.results.contents?.[1]
			?.videoSecondaryInfoRenderer?.metadataRowContainer?.metadataRowContainerRenderer?.rows;

	// TODO: Music metadata
	if (musicData)
		musicData.forEach((m: any) => {
			// console.log(m);
			// if (!m.metadataRowRenderer) return;
			// const row = m.metadataRowRenderer;
			// const title = row.title.simpleText ?? row.title.runs[0].text;
			// const contents = row.contents[0].simpleText ?? row.contents[0]?.runs?.[0]?.text;
			// const url =
			// 	row.contents[0]?.runs?.[0]?.navigationEndpoint?.commandMetadata?.webCommandMetadata.url;
			// if (music.length === 0) music.push({});
			// music[music.length - 1][title.toLowerCase()] = url
			// 	? { text: contents, url: `https://www.youtube.com${url}` }
			// 	: contents;
			// if (row.hasDividerLine) music.push({});
		});

	let audios: Audio[] = [];
	if (playerData.streamingData.formats)
		playerData.streamingData.formats.forEach((m: any) => {
			return audios.push();
		});
	// let audios =
	console.log(playerData.streamingData.formats);
	console.log(playerData.streamingData.adaptiveFormats);

	return new MusicTrack({
		url: `https://www.youtube.com/watch?v=${videoData.videoId}`,
		id: videoData.videoId,
		name: videoData.title,
		// description: videoData.shortDescription,
		duration: Number(videoData.lengthSeconds),
		durationTime: getTimeFromSeconds(videoData.lengthSeconds),
		thumbnail: videoData.thumbnail.thumbnails[0].url,
		author: {
			name: videoData.author,
			id: videoData.channelId,
			url: `https://www.youtube.com/channel/${videoData.channelId}`,
			avatar:
				initialData.contents.twoColumnWatchNextResults.results?.results?.contents[1]
					?.videoSecondaryInfoRenderer?.owner?.videoOwnerRenderer?.thumbnail?.thumbnails?.[0],
		},
		audio: audios,
		live: videoData.isLiveContent,
		service: Service.youtube,
		originalData: videoData,
	});
}

/**
 * Parse a MusicTrack from YouTube search page data.
 * Some code was ripped from play-dl
 */
export function MusicTrackFromYouTubeSearch(data: any) {
	if (!data || !data.videoRenderer) throw new Error("No data given");

	const channel = data.videoRenderer.ownerText.runs[0];
	const duration = data.videoRenderer.lengthText;
	const thumbnail =
		data.videoRenderer.thumbnail.thumbnails[data.videoRenderer.thumbnail.thumbnails.length - 1];
	const avatar =
		data.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail
			.thumbnails[0];

	return new MusicTrack({
		url: `https://www.youtube.com/watch?v=${data.videoRenderer.videoId}`,
		name: data.videoRenderer.title.runs[0].text,
		id: data.videoRenderer.videoId,
		// description: data.videoRenderer.detailedMetadataSnippets?.[0].snippetText.runs.length
		// 	? data.videoRenderer.detailedMetadataSnippets[0].snippetText.runs
		// 			.map((run: any) => run.text)
		// 			.join("")
		// 	: "",
		duration: duration ? getSecondsFromTime(duration.simpleText) : 0,
		durationTimestamp: duration ? duration.simpleText : null,
		thumbnail: thumbnail?.url,
		author: {
			id: channel.navigationEndpoint.browseEndpoint.browseId || null,
			name: channel.text || null,
			url: `https://www.youtube.com${
				channel.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
				channel.navigationEndpoint.commandMetadata.webCommandMetadata.url
			}`,
			avatar: avatar,
		},
		live: duration ? false : true,
		service: Service.youtube,
		originalData: data.videoRenderer,
	});
}

/**
 * Parse a MusicPlaylist from YouTube playlist page.
 * Some code was ripped from play-dl
 */
export function MusicPlaylistFromYouTube(data: any) {
	return new MusicPlaylist({
		url: "",

		service: Service.youtube,
	});
}
