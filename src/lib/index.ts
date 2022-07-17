/**
 * Avoxel284 2022
 * Barbara Music Module
 */

import { Readable } from "stream";
import { debugLog, getTimeFromSeconds } from "./util";
import prism from "prism-media";
import axios from "axios";
import { getKey } from "./config";
import { YouTube_Search } from "../services/YouTube";
import { SoundCloud_Search } from "../services/SoundCloud";
import { fetchGeniusSongLyrics, searchGeniusSong } from "./genius";

export interface SearchOptions {
	/** Service to search track on */
	service?: Service;
	/** Maximum results to return */
	limit?: number;
	/**
	 * Type of results to return
	 * In the case of YouTube, videos and tracks are the same thing.
	 */
	type?: "tracks" | "videos" | "playlists" | "albums";
}

/** Type of media - Is it a MusicTrack or MusicPlaylist? */
export type BarbaraType = MusicTrack | MusicPlaylist;

/**
 * A service represents the platform that is providing the media (e.g. SoundCloud).
 */
export enum Service {
	/** Spotify */
	spotify = "spotify",
	/** YouTube */
	youtube = "youtube",
	/** SoundCloud */
	soundcloud = "soundcloud",
	/** Audio File */
	audiofile = "audiofile",
}

/**
 * An audio format used for streaming.
 * Contains data such as the streaming URL, mime type and quality.
 */
export interface Audio {
	/** Audio URL */
	url: string;
	/** Audio quality */
	quality?: string;
	/** Audio duration **in seconds** */
	duration?: number;
	/** Audio protocol */
	protocol?: string;
	/** Audio mime type */
	mimeType: string;
	/** Audio bitrate */
	bitrate?: number;
	/** Audio codec */
	codec?: string;
}

/**
 * An author that represents an online user that created media/content.
 * Contains data such as friendly URL, avatar URL and name.
 */
export interface Author {
	/** Public page URL */
	url?: string;
	/** Avatar/Profile picture/Channel icon URL */
	avatar?: string;
	/** Name of author */
	name?: string;
	/** ID of author */
	id?: string;
	/** Is the author verified? */
	verified?: boolean;
}

/**
 * Represents a song on Genius.
 * Contains data such as lyrics and title.
 */
export interface GeniusSong {
	/** Array containing lyrics */
	lyrics?: string[];
	/** Friendly URL of song on Genius */
	url: string;
	/** Genius Pyongs count */
	pyongs?: number;
	/** Full title of song on Genius (name and artist concatenated by "by") */
	title: string;
	/** Name of song on Genius */
	name: string;
	/** Primary artist of song on Genius */
	artist: Author;
	/** URL of song art thumbnail */
	thumbnail: string;
	/** ID of song on Genius */
	id: number;
	/** State of the lyrics of the song on Genius ("complete" if the lyrics are all there) */
	lyricsState: string;
}

/**
 * MusicTrack Data Constructor
 *
 * Interface for `data` parameter used when creating a new {@link MusicTrack}
 */
export interface MusicTrackConstructor {
	/** Name of track */
	name: string;
	/** Friendly URL of track */
	url: string;
	/** Service's ID of track */
	id?: string;
	/** URL of thumbnail */
	thumbnail: string;
	/** Author/artist of track */
	author: Author[] | Author;
	/** Reference of who queued the track */
	queuedBy?: any;
	/** Duration of the track in seconds */
	duration: number;
	/** Is the track live? */
	live?: boolean;
	/** Is the track explicit? */
	explicit?: any;
	/** Is the track in a playlist? Set true wehn adding to `MusicPlaylist.tracks` */
	playlisted?: boolean;
	/** Is the track unstreamable (e.g. a Spotify track) and was the audio replaced by an alternative source's audio? */
	resolvedTo?: Service;
	/** Service which is hosting the track */
	service: Service;
	/** Audio data */
	audio?: Audio[];
	/** The original/raw data recieved when making the request */
	originalData: any;
}

export class MusicTrack {
	/** Friendly URL of the track (e.g. https://youtube.com/watch?v=videoid) */
	url: string;
	/** Name of the track */
	name: string;
	/** An object containing additional metadata that may not always be included; e.g. the user that queued the track */
	metadata: {
		/** A reference to the user that queued the track - Can be set via {@link MusicTrack.setQueuedBy} or modified manually */
		queuedBy?: any;
		/** Is the track deemed as explicit? */
		explicit?: boolean;
		/** ID of the track on the platform (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ --> `dQw4w9WgXcQ`) */
		id?: string;
		/** If the track wasn't streamable (e.g. Spotify), was the tracks audio replaced by an alternative source's track, and which service. */
		resolvedTo: Service | false;
	};
	/** Duration of the track **in seconds** */
	duration: number;
	/** Duration of the track **in timestamp** (e.g. `12:34`) */
	durationTimestamp: string;
	/** Is the track live-streaming? (e.g. a YouTube livestream) */
	live: boolean;
	/** Has the track been playlisted? */
	playlisted: boolean;
	/** The service providing track (e.g. YouTube) */
	service: Service;
	/** Thumbnail URL of the track */
	thumbnail: string;
	/** Array of media urls. May be empty in the case that the service does not provide streaming. */
	audio: Audio[];
	/** An array of the authors of the music track. For example, a YouTube channel or SoundCloud user profile */
	authors: Author[];
	/**
	 * Original data retreieved from request to service's API.
	 * For debug and if theres any data not included in MusicTrack itself thats needed.
	 */
	originalData?: any;

	/**
	 * An object that represents a music track.
	 *
	 * @example
	 * ```
	 * let Track = new MusicTrack();
	 * console.log(Track.url);
	 * console.log(Track.name);
	 * console.log(Track.duration);
	 * ```
	 */
	constructor(data: MusicTrackConstructor) {
		this.name = data.name || "Unnamed MusicTrack";
		this.url = data.url;
		this.thumbnail = data.thumbnail;
		this.duration = data.duration || 0;
		this.durationTimestamp = getTimeFromSeconds(data.duration || 0);
		this.live = data.live || false;
		this.playlisted = data.playlisted || false;
		this.service = data.service;
		this.audio = data.audio || [];
		if (!Array.isArray(data?.author)) data.author = [data.author];
		this.authors = data.author;
		this.metadata = {
			queuedBy: data.queuedBy || null,
			explicit: data.explicit || false,
			id: data.id,
			resolvedTo: data.resolvedTo || false,
		};
		this.originalData = data.originalData;
	}

	/**
	 * Returns a **Prism Media FFmpeg** object.
	 *
	 * @example
	 * ```
	 * const resource = await discordVoice.createAudioResource(Track.resource());
	 *
	 * ```
	 *
	 * @param seek Number of seconds to seek in the track. Obviously defaults to 0
	 * @param extraArgs An array of extra arguments to pass to Prism when creating the FFmpeg object.
	 * Basically just your standard FFmpeg arguments but in array form. For example:
	 * ```
	 * "-ar",
	 * "48000",
	 * "-ac",
	 * "2"
	 * ```
	 * @param audio Custom audio object to use instead of relying on {@link MusicTrack.bestAudio()}
	 */
	async resource(seek: number = 0, extraArgs?: any[], audio?: Audio) {
		if (this.duration === 0) throw `Track duration is 0 for track: ${this.name}`;
		if (seek < 0 || seek > this.duration) throw `Seek is out of range for track: ${this.name}`;
		const url =
			audio?.url ||
			(await this.bestAudio()
				.then(({ url }) => url)
				.catch((err) => {
					throw err;
				}));
		if (!url) throw `Cannot get streaming URL for ${this.name}`;
		// TODO: possibly make a way better args system
		const args: any[] = [
			"-ss",
			seek,
			"-i",
			url,
			// "-analyzeduration",
			// "0",
			// "-loglevel",
			// "48",
			"-f",
			"opus",
			// Audio rate/resolution
			// "-ar",
			// "64000",
			// Audio channels
			"-ac",
			"2",
		];
		if (audio?.bitrate) args.push("-b:a", audio.bitrate);
		if (extraArgs) args.push(...extraArgs);
		if (!extraArgs?.includes("-ar")) args.push("-ar", "48000");
		debugLog(`MusicTrack FFmpeg args:`, args);

		new prism.FFmpeg().on("error", (err) => {
			debugLog(`FFmpeg streaming error for ${this.name}: ${err}`);
		});

		new prism.FFmpeg().on("end", () => {
			debugLog(`FFmpeg streaming ended for ${this.name}`);
		});

		return new prism.FFmpeg({ args: args });
	}

	/**
	 * Returns the best audio format.
	 * **Note:** if SoundCloud is the service, `Audio.url` is changed to a time sensitive URL due to SoundCloud APIs.
	 */
	async bestAudio(): Promise<Audio> {
		await this.fetchMissingAudio();
		if (this.audio == undefined || this.audio?.length == 0)
			throw new Error("MusicTrack does not contain any audio streams");

		if (this.service === Service.spotify) {
			debugLog(`Searching for Spotify track on alternative sources`);
			this.audio = [];

			let resolvedTrack = await this.resolveUnstreamableTrack();
			if (!resolvedTrack) throw "Could not find Spotify track on alternative sources";

			this.audio = resolvedTrack.audio;
			this.metadata.resolvedTo = resolvedTrack.service;
			let best = this.audio
				.filter((a: Audio) => a.url != undefined)
				.filter(
					(a: Audio) =>
						a.mimeType.includes("audio/mp3") ||
						a.mimeType.includes("audio/mpeg") ||
						a.mimeType.includes("audio/mp4")
				)
				.sort((a: Audio, b: Audio) => {
					if (a.bitrate && b.bitrate) return b.bitrate - a.bitrate;
					return 0;
				})
				.sort((a: Audio, b: Audio) => {
					let qualityToInt = (quality: string) => {
						if (quality?.includes("HIGH")) return 3;
						if (quality?.includes("MEDIUM")) return 2;
						if (quality?.includes("LOW")) return 1;
						return 1;
					};

					if (a.quality != undefined && b.quality != undefined)
						return qualityToInt(b.quality) - qualityToInt(a.quality);
					return 0;
				});

			return best?.[0];
		}

		if (this.service === Service.soundcloud) {
			// debugLog(this.audio);
			debugLog(this.audio);
			let best = this.audio
				.filter((a: Audio) => a.url != undefined)
				.filter((a: Audio) => a.mimeType.includes("audio/mpeg") || a.mimeType.includes("audio/ogg"))
				.filter((a: Audio) => a.protocol?.includes("progressive"))
				.sort((a: Audio, b: Audio) => {
					let qualityToInt = (quality: string) => {
						if (quality?.includes("sq")) return 3;
						if (quality?.includes("medium")) return 2;
						if (quality?.includes("low")) return 1;
						return 1;
					};

					if (a.quality != undefined && b.quality != undefined)
						return qualityToInt(b.quality) - qualityToInt(a.quality);
					return 0;
				})?.[0];
			debugLog(best);

			let { data } = await axios.get(`${best.url}`).catch((err: Error) => {
				throw err;
			});
			best.url = data.url;
			return best;
		}

		if (this.service === Service.youtube) {
			await this.fetchMissingAudio();
			let best = this.audio
				.filter((a: Audio) => a.url != undefined)
				.filter(
					(a: Audio) =>
						a.mimeType.includes("audio/mp3") ||
						a.mimeType.includes("audio/mpeg") ||
						a.mimeType.includes("audio/mp4")
				)
				.sort((a: Audio, b: Audio) => {
					if (a.bitrate && b.bitrate) return b.bitrate - a.bitrate;
					return 0;
				})
				.sort((a: Audio, b: Audio) => {
					let qualityToInt = (quality: string) => {
						if (quality?.includes("HIGH")) return 3;
						if (quality?.includes("MEDIUM")) return 2;
						if (quality?.includes("LOW")) return 1;
						return 1;
					};

					if (a.quality != undefined && b.quality != undefined)
						return qualityToInt(b.quality) - qualityToInt(a.quality);
					return 0;
				});
			debugLog(`Ranking YouTube best audio:`, best);

			return best?.[0];
		}

		if (this.service === Service.audiofile) {
			return this.audio[0];
		}

		throw new Error("An error occurred when attempting to find best audio");
	}

	/**
	 * Adds neccessary audio data to MusicTrack in the case it was not added.
	 */
	async fetchMissingAudio() {
		if (this.audio && this.audio.length > 0) return;

		if (this.service === Service.youtube) {
			let { data } = await axios.get(
				`${getKey("YOUTUBE_INVIDIOUSSITE")}/api/v1/videos/${
					this.metadata.id || this.originalData.videoId
				}?fields=adaptiveFormats`
			);
			if (!data) return;
			debugLog(`FetchMissingAudio data:`, data);

			this.audio = data.adaptiveFormats
				.filter((f: any) => f.audioQuality != null)
				.map((f: any) => {
					return {
						url: f.url,
						quality: f.audioQuality,
						mimeType: f.type,
						bitrate: f.bitrate,
					};
				});
		}

		return;
	}

	/**
	 * If the track is not streamable (e.g. Spotify), attempt to find a track on an alternative source and use the audio from there
	 */
	async resolveUnstreamableTrack() {
		if (this.service === Service.spotify) {
			// TODO: maybe use fuse.js to get a more accurate search
			let yt = (
				await YouTube_Search(
					`${this.name} ${this.authors.map((v) => v.name).join(" ")}`,
					1,
					"video"
				)
			)?.[0];
			if (yt instanceof MusicTrack) return yt;
		}

		return null;
	}

	/**
	 * Searches for the track on Genius and returns a {@link GeniusSong}. Contains data including lyrics.
	 */
	async getGeniusSong(): Promise<GeniusSong | null> {
		let title = this.name.toLowerCase().replace(/(\(|)lyrics(\)|)/g, "");
		let song =
			(await searchGeniusSong(`${title} ${this.authors[0].name}`)) ||
			(await searchGeniusSong(`${title}`));
		if (!song) return null;
		// let lyrics = await fetchGeniusSongLyrics(song.url).catch((err) => {
		// 	throw err;
		// });
		song.lyrics = ["Lyrics not implemented atm"] || [];

		return song;
	}

	/**
	 * Set who queued the track, for example the user's Discord ID
	 */
	setQueuedBy(queuedBy: any) {
		this.metadata.queuedBy = queuedBy;
		return this;
	}
}

/**
 * MusicPlaylist Data Constructor
 *
 * Interface for `data` parameter used when creating a new {@link MusicPlaylist}
 */
export interface MusicPlaylistConstructor {
	/** Name of playlist */
	name: string;
	/** Friendly URL of playlist */
	url: string;
	/** Service's ID of playlist */
	id?: string;
	/** URL of thumbnail */
	thumbnail: string;
	/** User(s) that created this playlist */
	authors: Author[] | Author;
	/** Duration of the track in seconds */
	duration: number;
	/** Reference of who queued the playlist */
	queuedBy?: any;
	/** Is the playlist an album? */
	isAlbum?: boolean;
	/** Array of tracks in playlist */
	tracks: MusicTrack[];
	/** Is the playlist collaborative/editable by other users on the platform? */
	collaborative?: boolean;
	/** Service which is hosting the playlist */
	service: Service;
	/** The original/raw data recieved when making the request */
	originalData: any;
}

export class MusicPlaylist {
	/** Friendly URL of the playlist */
	url: string;
	/** Name of the playlist */
	name: string;
	metadata: {
		/** A reference to the user that queued the playlist - Can be set via {@link MusicPlaylist.setQueuedBy} or modified manually */
		queuedBy?: any;
		/** Is the playlist collaborative/editable by other users on the platform?  */
		collaborative?: boolean;
		/** ID of the playlist on the platform */
		id?: string;
	};
	/** Duration of all the tracks **in seconds** */
	duration: number;
	/** Duration of all the tracks **in timestamp** (e.g. `12:34`) */
	durationTimestamp: string;
	/** Is the playlist an album? */
	isAlbum: boolean;
	/** Array of MusicTracks in playlist */
	tracks: MusicTrack[];
	/** Array of authors of the playlist. For example, a YouTube channel or SoundCloud user profile */
	author: Author[];
	/** The service providing the playlist */
	service: Service;
	/** Thumbnail of the playlist */
	thumbnail?: string;
	/**
	 * Original data retreieved from request to service's API.
	 * There for debug and if theres any metadata not included in MusicTrack itself.
	 */
	originalData?: any;

	/**
	 * An object that represents a music playlist. Refer to cheatsheet for data object parameters.
	 */
	constructor(data: MusicPlaylistConstructor) {
		this.url = data.url;
		this.name = data.name;
		this.duration = data.duration;
		this.durationTimestamp = getTimeFromSeconds(data.duration);
		this.isAlbum = data.isAlbum || false;
		this.tracks = data.tracks || [];
		this.service = data.service;
		this.thumbnail = data.thumbnail;
		if (!Array.isArray(data?.authors)) data.authors = [data.authors];
		this.author = data.authors;
		this.metadata = {
			queuedBy: data.queuedBy,
			collaborative: data.collaborative || false,
			id: data.id,
		};
		this.originalData = data.originalData;
	}

	/**
	 * Set who queued the playlist, for example the user's Discord ID
	 */
	setQueuedBy(queuedBy: any) {
		this.metadata.queuedBy = queuedBy;
		return this;
	}
}

export interface QueueConstructor {
	/** Identifier for the queue */
	id: string;
}

// TODO: queues
export class Queue {
	/**
	 * Represents a queue
	 * @param data
	 */
	constructor(data: any = {}) {}
}
