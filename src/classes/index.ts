import { Readable } from "stream";
import { getTimeFromSeconds } from "../util";

export interface SearchOptions {
	/** Service to search track on */
	service: Service;
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

	/** Duration of the track **in timestamp** */
	durationTimestamp?: string;

	/** Has the track been playlisted? */
	playlisted: boolean;

	/** Service providing track */
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
	 * @param {Object} data Internal data parameter, will come back to this later
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
}

export class MusicPlaylist {
	/** Friendly URL of the playlist */
	url?: string;

	/** Name of the playlist */
	name?: string;

	/** Is the playlist an album? */
	isAlbum?: boolean;

	/** Array of MusicTracks in playlist */
	tracks?: Array<MusicTrack>;

	/** Author of playlist. For example, a YouTube channel or SoundCloud user profile */
	author?: Author;

	constructor(data: any = {}) {
		this.url = data.url;
		this.name = data.name;
		this.isAlbum = data.isAlbum;
		this.tracks = data.tracks;
	}
}

export class BarbaraStream {
	/** Readable stream */
	stream?: Readable;

	constructor(data: any = {}) {

	}
}
