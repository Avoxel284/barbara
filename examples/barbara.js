const barbara = require("../dist");

// console.log(barbara.search("hi", { service: barbara.Service.spotify }));

barbara.setKey("CONFIG_DEBUG", true);

(async () => {
	// barbara.setKey("SOUNDCLOUD_CLIENTID", await barbara.freeKeys("SOUNDCLOUD_CLIENTID"));

	// let mt = await barbara.info("https://soundcloud.com/onumi/baddest");
	// console.log(mt);

	// barbara.search("auughhhh", { type: "videos", service: barbara.Service.youtube });
	let info = await barbara.info("https://www.youtube.com/watch?v=qdoKxRaZcwM");
	console.log(info.bestAudio());
})();
