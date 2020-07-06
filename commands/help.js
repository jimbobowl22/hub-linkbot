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
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        let ThisEmbed = new Discord.MessageEmbed()
            .setColor(Number(process.env.BOT_EMBEDCOLOR))
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Help Information**')
            .setFooter('This bot has been written by jdwoj5butbetter#1132.')
            .setThumbnail(guild.iconURL())
            // .addField('Description', 'This bot is used to deliver products to users who buy them. It is also used for account linking and to get user information.', true)
        bot.commands.array().map(command => {
            if (message.guild) {
                let upermission = message.member.permissionsIn(message.channel)
                var matching = []
                for (permission of command.userPermissions) {
                    if (!upermission.has(permission, true)) matching.push('`'+permission+'`')
                }
                if (matching.length > 0) {
                    return
                }
                let mepermission = message.guild.me.permissionsIn(message.channel)
                var matching = []
                for (permission of command.clientPermissions) {
                    if (!mepermission.has(permission, true)) matching.push('`'+permission+'`')
                }
                if (matching.length > 0) {
                    return
                }
            }
            ThisEmbed.addField(process.env.BOT_PREFIX+command.name+command.arguments.map(a => ` \`${a.label}\``), `*${command.description}*`, true)
        })
        await message.channel.send(ThisEmbed)
	}
};