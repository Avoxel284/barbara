import { getClientId } from "./services/SoundCloud";

const keys = {
	soundcloudClientId: "",
};

export async function getKey(key: "soundcloudClientId") {
	if (key == "soundcloudClientId") return await getClientId();
	return "";
}

export function isDebug() {
	return true;
}

(async () => {
	if (!keys.soundcloudClientId) {
		keys.soundcloudClientId = await getClientId();
	}
})();
