const Discord = require('discord.js')
module.exports = {
	name: 'ping',
	description: 'Displays the information about the bot\'s latency.',
	arguments: [],
    guildOnly: false,
    userPermissions: [],
    clientPermissions: [],
    cooldown: 2,
	run: async (bot, message, args) => {
        let Loading = new Discord.MessageEmbed()
            .setTitle('Getting Client Ping...')
        let currently = new Date(Date.now())
		let m = await message.channel.send(Loading);
        let ThisEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Ping Information**')
            .addField('Reaction Latency (ms)', m.createdTimestamp - message.createdTimestamp)
            .addField('Message Upload Latency (ms)', Date.now() - m.createdTimestamp)
            .setThumbnail(message.guild.iconURL())
        await m.edit(ThisEmbed)
	}
};