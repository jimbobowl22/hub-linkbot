const Discord = require('discord.js')
module.exports = {
	name: 'ping',
	description: 'Displays the information about the bot\'s latency.',
	arguments: [],
    guildOnly: false,
    userPermissions: [],
    clientPermissions: [
        'SEND_MESSAGES'
    ],
    cooldown: 2,
	run: async (bot, message, args) => {
        let Loading = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Ping Information**')
            .addField('Status', ':hourglass_flowing_sand: **Processing...**', true)
            .setThumbnail(message.guild.iconURL())
        let currently = new Date(Date.now())
		let m = await message.channel.send(Loading);
        let ThisEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Ping Information**')
            .addField('Status', ':white_check_mark: **Fetched!**', true)
            .addField('Latency (ms)', m.createdTimestamp - message.createdTimestamp, true)
            .setThumbnail(message.guild.iconURL())
        await m.edit(ThisEmbed)
	}
};