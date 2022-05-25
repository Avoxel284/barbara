import { getClientId } from "./services/SoundCloud";

export async function getKey(service: "soundcloudClientId") {
	if (service == "soundcloudClientId") return await getClientId();
}
