/**
 * Avoxel284 2022
 * Barbara Music Module / YouTube
 * 
 * Module to decipher audio formats since YouTube does some wacky ciphering stuff
 * Most of the code was ripped from play-dl
 */

import { URL, URLSearchParams } from "node:url";
// import { request } from "./../../Request";
import axios from "axios";

interface formatOptions {
	url?: string;
	sp?: string;
	signatureCipher?: string;
	cipher?: string;
	s?: string;
}

const VAR_JS_REGEX = "[a-zA-Z_\\$]\\w*";
const SINGLEQUOTE_JS_REGEX = `'[^'\\\\]*(:?\\\\[\\s\\S][^'\\\\]*)*'`;
const DOUBLEQUOTE_JS_REGEX = `"[^"\\\\]*(:?\\\\[\\s\\S][^"\\\\]*)*"`;
const QUOTE_JS_REGEX = `(?:${SINGLEQUOTE_JS_REGEX}|${DOUBLEQUOTE_JS_REGEX})`;
const KEY_JS_REGEX = `(?:${VAR_JS_REGEX}|${QUOTE_JS_REGEX})`;
const PROP_JS_REGEX = `(?:\\.${VAR_JS_REGEX}|\\[${QUOTE_JS_REGEX}\\])`;
const EMPTY_JS_REGEX = `(?:''|"")`;
const REVERSE_FUNCTION_REGEX = ":function\\(a\\)\\{" + "(?:return )?a\\.reverse\\(\\)" + "\\}";
const SLICE_FUNCTION_REGEX = ":function\\(a,b\\)\\{" + "return a\\.slice\\(b\\)" + "\\}";
const SPLICE_FUNCTION_REGEX = ":function\\(a,b\\)\\{" + "a\\.splice\\(0,b\\)" + "\\}";
const SWAP_FUNCTION_REGEX =
	":function\\(a,b\\)\\{" +
	"var c=a\\[0\\];a\\[0\\]=a\\[b(?:%a\\.length)?\\];a\\[b(?:%a\\.length)?\\]=c(?:;return a)?" +
	"\\}";
const OBJ_REGEXP = new RegExp(
	`var (${VAR_JS_REGEX})=\\{((?:(?:${KEY_JS_REGEX}${REVERSE_FUNCTION_REGEX}|${KEY_JS_REGEX}${SLICE_FUNCTION_REGEX}|${KEY_JS_REGEX}${SPLICE_FUNCTION_REGEX}|${KEY_JS_REGEX}${SWAP_FUNCTION_REGEX}),?\\r?\\n?)+)\\};`
);
const FUNCTION_REGEXP = new RegExp(
	`${
		`function(?: ${VAR_JS_REGEX})?\\(a\\)\\{` +
		`a=a\\.split\\(${EMPTY_JS_REGEX}\\);\\s*` +
		`((?:(?:a=)?${VAR_JS_REGEX}`
	}${PROP_JS_REGEX}\\(a,\\d+\\);)+)` +
		`return a\\.join\\(${EMPTY_JS_REGEX}\\)` +
		`\\}`
);
const REVERSE_REGEXP = new RegExp(`(?:^|,)(${KEY_JS_REGEX})${REVERSE_FUNCTION_REGEX}`, "m");
const SLICE_REGEXP = new RegExp(`(?:^|,)(${KEY_JS_REGEX})${SLICE_FUNCTION_REGEX}`, "m");
const SPLICE_REGEXP = new RegExp(`(?:^|,)(${KEY_JS_REGEX})${SPLICE_FUNCTION_REGEX}`, "m");
const SWAP_REGEXP = new RegExp(`(?:^|,)(${KEY_JS_REGEX})${SWAP_FUNCTION_REGEX}`, "m");
/**
 * Function to get tokens from html5player body data.
 * @param body body data of html5player.
 * @returns Array of tokens.
 */
function js_tokens(body: string) {
	const function_action = FUNCTION_REGEXP.exec(body);
	const object_action = OBJ_REGEXP.exec(body);
	if (!function_action || !object_action) return null;

	const object = object_action[1].replace(/\$/g, "\\$");
	const object_body = object_action[2].replace(/\$/g, "\\$");
	const function_body = function_action[1].replace(/\$/g, "\\$");

	let result = REVERSE_REGEXP.exec(object_body);
	const reverseKey = result && result[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, "");

	result = SLICE_REGEXP.exec(object_body);
	const sliceKey = result && result[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, "");

	result = SPLICE_REGEXP.exec(object_body);
	const spliceKey = result && result[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, "");

	result = SWAP_REGEXP.exec(object_body);
	const swapKey = result && result[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, "");

	const keys = `(${[reverseKey, sliceKey, spliceKey, swapKey].join("|")})`;
	const myreg = `(?:a=)?${object}(?:\\.${keys}|\\['${keys}'\\]|\\["${keys}"\\])` + `\\(a,(\\d+)\\)`;
	const tokenizeRegexp = new RegExp(myreg, "g");
	const tokens = [];
	while ((result = tokenizeRegexp.exec(function_body)) !== null) {
		const key = result[1] || result[2] || result[3];
		switch (key) {
			case swapKey:
				tokens.push(`sw${result[4]}`);
				break;
			case reverseKey:
				tokens.push("rv");
				break;
			case sliceKey:
				tokens.push(`sl${result[4]}`);
				break;
			case spliceKey:
				tokens.push(`sp${result[4]}`);
				break;
		}
	}
	return tokens;
}
/**
 * Function to decipher signature
 * @param tokens Tokens from js_tokens function
 * @param signature Signatured format url
 * @returns deciphered signature
 */
function deciper_signature(tokens: string[], signature: string) {
	let sig = signature.split("");
	const len = tokens.length;
	for (let i = 0; i < len; i++) {
		let token = tokens[i],
			pos;
		switch (token.slice(0, 2)) {
			case "sw":
				pos = parseInt(token.slice(2));
				swappositions(sig, pos);
				break;
			case "rv":
				sig.reverse();
				break;
			case "sl":
				pos = parseInt(token.slice(2));
				sig = sig.slice(pos);
				break;
			case "sp":
				pos = parseInt(token.slice(2));
				sig.splice(0, pos);
				break;
		}
	}
	return sig.join("");
}
/**
 * Function to swap positions in a array
 * @param array array
 * @param position position to switch with first element
 */
function swappositions(array: string[], position: number) {
	const first = array[0];
	array[0] = array[position];
	array[position] = first;
}
/**
 * Sets Download url with some extra parameter
 * @param format video fomat
 * @param sig deciphered signature
 * @returns void
 */
function download_url(format: formatOptions, sig: string) {
	if (!format.url) return;

	const decoded_url = decodeURIComponent(format.url);

	const parsed_url = new URL(decoded_url);
	parsed_url.searchParams.set("ratebypass", "yes");

	if (sig) {
		parsed_url.searchParams.set(format.sp || "signature", sig);
	}
	format.url = parsed_url.toString();
}
/**
 * Main function which handles all queries related to video format deciphering
 * @param formats video formats
 * @param html5player url of html5player
 * @returns array of format.
 */
export async function format_decipher(
	formats: formatOptions[],
	html5player: string
): Promise<formatOptions[]> {
	const body = await request(html5player);
	const tokens = js_tokens(body);
	formats.forEach((format) => {
		const cipher = format.signatureCipher || format.cipher;
		if (cipher) {
			const params = Object.fromEntries(new URLSearchParams(cipher));
			Object.assign(format, params);
			delete format.signatureCipher;
			delete format.cipher;
		}
		if (tokens && format.s) {
			const sig = deciper_signature(tokens, format.s);
			download_url(format, sig);
			delete format.s;
			delete format.sp;
		}
	});
	return formats;
}
