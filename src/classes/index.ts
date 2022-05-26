import { Readable } from "stream";
import { getTimeFromSeconds } from "../util";
import prism from "prism-media";
import axios from "axios";
import { getKey } from "../auth";

let clientId = getKey("soundcloudClientId");

export interface SearchOptions {
	/** Service to search track on */
	service: Service;
	/** Maximum results to return */
	limit: number;
	/**
	 * Type of results to return
	 * In the case of YouTube, `tracks` are videos, `playlists` are playlists and `albums` are.. not a thing
	 */
	type: "tracks" | "playlists" | "albums";
}

export interface InfoOptions {
	/** Amount of results to return */
	length: number;
}

/** Type of media - Is it a MusicTrack or MusicPlaylist? */
export type BarbaraType = MusicTrack | MusicPlaylist;

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

/** An audio format */
interface Audio {
	/** Audio URL */
	url?: string;
	/** Audio quality */
	quality?: string;
	/** Audio duration **in seconds** */
	duration?: number;
	/** Audio protocol */
	protocol?: string;
	/** Audio mime type */
	mimeType?: string;
}

interface Thumbnail {
	/** Thumbnail URL */
	url: string;
}

interface Author {
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

export class MusicTrack {
	/** Friendly URL of the track (e.g. https://youtube.com/watch?v=videoid) */
	url: string;

	/** Name of the track */
	name: string;

	/** ID of user that queued/played the track */
	queuedBy?: string;

	/** Duration of the track **in seconds** */
	duration: number;

	/** Duration of the track **in timestamp** (e.g. `12:34`) */
	durationTimestamp?: string;

	/** Has the track been playlisted? */
	playlisted: boolean;

	/** The service providing track */
	service?: Service;

	/** Thumbnail of the track */
	thumbnail?: Thumbnail;

	/** Array of media urls */
	audio?: Array<Audio>;

	/** Author of music track. For example, a YouTube channel or SoundCloud user profile */
	author?: Author;

	/**
	 * Original data retreieved from request to service's API.
	 * There for debug and if theres any metadata not included in MusicTrack itself.
	 */
	originalData?: any;

	/**
	 * An object that represents a music track
	 *
	 * @param {Object} data An object containing data. Reference below:
	 * ```
	 * url: Public URL
	 * name: Track name
	 * thumbnail: Thumbnail object { url: Thumbnail URL }
	 * queuedBy: Who queued the track
	 * duration
	 * ```
	 * @example
	 * ```
	 * let Track = new MusicTrack();
	 * console.log(Track.url);
	 * console.log(Track.name);
	 * console.log(Tack.duration);
	 * ```
	 */
	constructor(data: any = {}) {
		this.url = data.url || "";
		this.name = data.name || "Unnamed MusicTrack";
		this.thumbnail = data.thumbnail;
		this.queuedBy = data.queuedBy;
		this.duration = data.duration || 0;
		this.durationTimestamp = getTimeFromSeconds(data.duration || 0);
		this.playlisted = data.playlisted || false;
		this.service = data.service;
		this.audio = data.audio;
		this.author = data.author;
		this.originalData = data.originalData;
	}

	/**
	 * Barbara will sing the track for you. Just kidding.
	 * Returns a Prism Media FFmpeg object for use with Discord Voice.
	 *
	 * @example
	 * ```
	 * const resource = await discordVoice.createAudioResource(Track.sing());
	 *
	 * ```
	 *
	 * @param seek Number of seconds to seek in the track. Obviously defaults to 0
	 * @param extraArgs An array of extra arguments to pass to Prism when creating the FFmpeg object.
	 * Basically just your standarad FFmpeg arguments but in array form. For example:
	 * ```
	 * "-f",
	 * "opus",
	 * "-ar",
	 * "48000",
	 * "-ac",
	 * "2"
	 * ```
	 */
	async sing(seek: number = 0, extraArgs?: any[]) {
		if (seek < 0 || seek > this.duration) throw new Error("Seek is out of range of track");
		const args: any[] = [
			"-ss",
			seek,
			"-i",
			(await this.bestAudio()).url,
			// "-analyzeduration",
			// "0",
			// "-loglevel",
			// "48",
			// "-f",
			// "opus",
			// "-ar",
			// "48000",
			"-ac",
			"2",
		];
		if (extraArgs) args.push(...extraArgs);

		return new prism.FFmpeg({ args: args });
	}

	/**
	 * Returns the best audio format.
	 * **Note:** if SoundCloud is the service, `Audio.url` is changed to a time sensitive URL due to SoundCloud APIs.
	 */
	async bestAudio(): Promise<Audio> {
		if (this.audio == undefined || this.audio?.length == 0)
			throw new Error("MusicTrack does not contain any audios");

		if (this.service === Service.spotify) {
			throw new Error("Spotify does not provide streaming, thus cannot return best audio");
		}

		if (this.service === Service.soundcloud) {
			console.log(this.audio);
			let best = this.audio
				.filter((a: Audio) => (a.mimeType ? a.mimeType.includes("audio/mpeg") : false))
				.filter((a: Audio) => a.protocol?.includes("progressive"))
				.filter((a: Audio) =>
					a.quality
						? a.quality.includes("sq") || a.quality.includes("medium") || a.quality.includes("low")
						: false
				)?.[0];
			console.log(best);

			let { data } = await axios.get(`${best.url}`).catch((err: Error) => {
				throw err;
			});
			best.url = data.url;
			return best;
		}

		if (this.service === Service.youtube) {
			return this.audio[0];
		}

		return {};
	}
}

export class MusicPlaylist {
	/** Friendly URL of the playlist */
	url?: string;

	/** Name of the playlist */
	name?: string;

	/** Duration of all the tracks **in seconds** */
	duration?: number;

	/** Duration of all the tracks **in timestamp** (e.g. `12:34`) */
	durationTimestamp?: string;

	/** Is the playlist an album? */
	isAlbum?: boolean;

	/** Array of MusicTracks in playlist */
	tracks?: MusicTrack[];

	/** Author of playlist. For example, a YouTube channel or SoundCloud user profile */
	author?: Author;

	/** The service providing track */
	service?: Service;

	/** Thumbnail of the playlist */
	thumbnail?: Thumbnail;

	/**
	 * Original data retreieved from request to service's API.
	 * There for debug and if theres any metadata not included in MusicTrack itself.
	 */
	originalData?: any;

	constructor(data: any = {}) {
		this.url = data.url;
		this.name = data.name;
		this.duration = data.duration;
		this.durationTimestamp = getTimeFromSeconds(data.duration);
		this.isAlbum = data.isAlbum;
		this.tracks = data.tracks;
		this.service = data.service;
		this.thumbnail = data.thumbnail;
		this.author = data.author;
		this.originalData = data.originalData;
	}
}

export class BarbaraStream {
	/** Readable stream */
	stream?: Readable;

	/** The service providing track */
	service?: Service;

	/** URL that the stream is using */
	url?: string;

	constructor(data: any = {}) {
		this.url = data.url;
		this.stream = data.stream;
		this.service = data.service;
	}
}
