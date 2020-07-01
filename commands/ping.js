const Discord = require('discord.js')
module.exports = {
	name: 'ping',
	description: 'Displays the information about the bot\'s latency.',
	arguments: [],
    guildOnly: false,
    userPermissions: [
        'MANAGE_GUILD'
    ],
    clientPermissions: [
        'SEND_MESSAGES'
    ],
    cooldown: 5,
	run: async (bot, message, args) => {
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        let Loading = new Discord.MessageEmbed()
            .setColor(Number(process.env.BOT_EMBEDCOLOR))
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Ping Information**')
            .addField('Status', ':hourglass_flowing_sand: **Processing...**', true)
            .setThumbnail(guild.iconURL())
        let currently = new Date(Date.now())
		let m = await message.channel.send(Loading)
        let ThisEmbed = new Discord.MessageEmbed()
            .setColor(Number(process.env.BOT_EMBEDCOLOR))
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Ping Information**')
            .addField('Status', ':white_check_mark: **Fetched!**', true)
            .addField('Response Latency (ms)', m.createdTimestamp - message.createdTimestamp, true)
            .setThumbnail(guild.iconURL())
        await m.edit(ThisEmbed)
	}
};