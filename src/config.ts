import { getClientId } from "./services/SoundCloud";

export async function getKey(key: "soundcloudClientId") {
	if (key == "soundcloudClientId") return await getClientId();
}

export function isDebug() {
	return true;
}
