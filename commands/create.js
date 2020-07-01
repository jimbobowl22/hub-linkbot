const Discord = require('discord.js')
module.exports = {
	name: 'create',
	description: 'Creates a product.',
	arguments: [
        {
            label: "Product ID"
        },
        {
            label: "Product Name"
        },
        { 
            label: "Product File"
        }
    ],
    guildOnly: true,
    userPermissions: [
        'MANAGE_ROLES'
    ],
    clientPermissions: [
        'SEND_MESSAGES',
        'ATTACH_FILES'
    ],
    cooldown: 5,
	run: async (bot, message, args) => {
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        let Loading = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Create Information**')
            .addField('Status', ':hourglass_flowing_sand: **Processing...**', true)
            .setThumbnail(guild.iconURL())
        let currently = new Date(Date.now())
		let m = await message.channel.send(Loading)
        let ThisEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Create Information**')
            .addField('Status', ':white_check_mark: **Fetched!**', true)
            .addField('Response Latency (ms)', m.createdTimestamp - message.createdTimestamp, true)
            .setThumbnail(guild.iconURL())
        await m.edit(ThisEmbed)
	}
};