const Discord = require('discord.js')
module.exports = {
	name: 'help',
	description: 'Displays all the bot\'s commands and information.',
	arguments: [],
    guildOnly: false,
    userPermissions: [],
    clientPermissions: [
        'SEND_MESSAGES'
    ],
    cooldown: 5,
	run: async (bot, message, args) => {
        let ThisEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Help Information**')
            .addField('Description', 'This bot is used to deliver products to users who buy them. It is also used for account linking and to get user information.')
            .addField('Commands', bot.commands.array().map(command => `**${process.env.BOT_PREFIX+command.name}**${command.arguments.map(a => ` \`${a.label}\``)} | *${command.description}*`).join('\n'))
            .setThumbnail(message.guild.iconURL())
        await message.channel.send(ThisEmbed)
	}
};