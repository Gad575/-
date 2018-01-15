
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', (message) => {
	if(message.content == config.prefix + 'test') {
		message.reply('TEST');
	}

client.login(process.env.TOKEN);
