"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicPlaylistFromYouTube = exports.MusicTrackFromYouTubeSearch = exports.MusicTrackFromYouTube = void 0;
const lib_1 = require("../../lib");
const util_1 = require("../../lib/util");
function MusicTrackFromYouTube(data) {
    let playerData = data
        .split("var ytInitialPlayerResponse = ")?.[1]
        ?.split(";</script>")[0]
        .split(/;\s*(var|const|let)\s/)[0];
    if (!playerData)
        throw new Error("Failed to extract player data from YouTube video HTML");
    let initialData = data
        .split("var ytInitialData = ")?.[1]
        ?.split(";</script>")[0]
        .split(/;\s*(var|const|let)\s/)[0];
    if (!initialData)
        throw new Error("Failed to extract initial data from YouTube video HTML");
    playerData = JSON.parse(playerData);
    initialData = JSON.parse(initialData);
    if (playerData.playabilityStatus.status !== "OK") {
        if (playerData.playabilityStatus.status === "CONTENT_CHECK_REQUIRED") {
        }
        else if (playerData.playabilityStatus.status === "LIVE_STREAM_OFFLINE") {
            throw new Error("Livestream has not begun yet");
        }
        else
            throw new Error(`Error occurred when scraping data from YouTube video: \n${playerData.playabilityStatus.errorScreen.playerErrorMessageRenderer?.reason.simpleText ??
                playerData.playabilityStatus.errorScreen.playerKavRenderer?.reason.simpleText ??
                playerData.playabilityStatus.reason}`);
    }
    const videoData = playerData.videoDetails;
    console.log("video data", videoData);
    const musicData = initialData.contents.twoColumnWatchNextResults.results.results.contents?.[1]
        ?.videoSecondaryInfoRenderer?.metadataRowContainer?.metadataRowContainerRenderer?.rows;
    if (musicData)
        musicData.forEach((m) => {
        });
    let audios = [];
    if (playerData.streamingData.formats)
        playerData.streamingData.formats.forEach((m) => {
            return audios.push();
        });
    console.log(playerData.streamingData.formats);
    console.log(playerData.streamingData.adaptiveFormats);
    return new lib_1.MusicTrack({
        url: `https://www.youtube.com/watch?v=${videoData.videoId}`,
        id: videoData.videoId,
        name: videoData.title,
        duration: Number(videoData.lengthSeconds),
        thumbnail: videoData.thumbnail.thumbnails[0].url,
        author: {
            name: videoData.author,
            id: videoData.channelId,
            url: `https://www.youtube.com/channel/${videoData.channelId}`,
            avatar: initialData.contents.twoColumnWatchNextResults.results?.results?.contents[1]
                ?.videoSecondaryInfoRenderer?.owner?.videoOwnerRenderer?.thumbnail?.thumbnails?.[0],
        },
        audio: audios,
        live: videoData.isLiveContent,
        service: lib_1.Service.youtube,
        originalData: videoData,
    });
}
exports.MusicTrackFromYouTube = MusicTrackFromYouTube;
function MusicTrackFromYouTubeSearch(data) {
    if (!data || !data.videoRenderer)
        throw new Error("No data given");
    const channel = data.videoRenderer.ownerText.runs[0];
    const duration = data.videoRenderer.lengthText;
    const thumbnail = data.videoRenderer.thumbnail.thumbnails[data.videoRenderer.thumbnail.thumbnails.length - 1];
    const avatar = data.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail
        .thumbnails[0];
    return new lib_1.MusicTrack({
        url: `https://www.youtube.com/watch?v=${data.videoRenderer.videoId}`,
        name: data.videoRenderer.title.runs[0].text,
        id: data.videoRenderer.videoId,
        duration: duration ? (0, util_1.getSecondsFromTime)(duration.simpleText) : 0,
        thumbnail: thumbnail?.url,
        author: {
            id: channel.navigationEndpoint.browseEndpoint.browseId || null,
            name: channel.text || null,
            url: `https://www.youtube.com${channel.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
                channel.navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
            avatar: avatar,
        },
        live: duration ? false : true,
        service: lib_1.Service.youtube,
        originalData: data.videoRenderer,
    });
}
exports.MusicTrackFromYouTubeSearch = MusicTrackFromYouTubeSearch;
function MusicPlaylistFromYouTube(data) {
}
exports.MusicPlaylistFromYouTube = MusicPlaylistFromYouTube;
//# sourceMappingURL=parse.js.map