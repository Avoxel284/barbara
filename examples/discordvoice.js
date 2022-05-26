// const Barbara = require("barbara-music");
const Barbara = require("../dist");
const Discord = require("discord.js");
const DiscordVoice = require("@discordjs/voice");
require("dotenv").config({ path: `${__dirname}/.env` });

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
	],
	partials: ["CHANNEL"],
});

client.on("messageCreate", async (msg) => {
	if (msg.content.toLowerCase().startsWith("!play")) {
		if (!msg.member.voice?.channel) return msg.reply("Connect to a VC first!");

		// Create a new voice connection from the bot to the users VC
		const connection = DiscordVoice.joinVoiceChannel({
			channelId: msg.member.voice.channel.id,
			guildId: msg.guild.id,
			adapterCreator: msg.guild.voiceAdapterCreator,
		});

		// Get the search parameters from the message
		const params = msg.content.split("!play ")[1];

		// Search for the track on YouTube
		const search = await Barbara.search(params, {
			service: "soundcloud",
			limit: 1,
			type: "tracks",
		});

		console.log(params);
		console.log(search);
		// If no results were found, return
		if (search.length == 0) return msg.reply("No results were found");

		// Get the first track from the search results
		const track = search[0];

		// Create a new audio resource from the track
		const resource = DiscordVoice.createAudioResource(track.sing());

		// Create a new audio player
		const player = DiscordVoice.createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});

		// Play the audio resource
		player.play(resource);

		// Subscribe the player to the voice connection
		connection.subscribe(player);
	}
});

client.login(process.env.DISCORD_TOKEN);
