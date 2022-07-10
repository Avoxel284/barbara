const barbara = require("../dist");

// console.log(barbara.search("hi", { service: barbara.Service.spotify }));

barbara.setKey("CONFIG_DEBUG", false);

(async () => {
	barbara.setKey("SOUNDCLOUD_CLIENTID", await barbara.freeKeys("SOUNDCLOUD_CLIENTID"));

	let mt = await barbara.info("https://soundcloud.com/onumi/baddest");
	console.log(mt);
})();
