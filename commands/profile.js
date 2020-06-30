const Discord = require('discord.js')
module.exports = {
	name: 'profile',
	description: 'Displays all information stored about a user.',
	arguments: [
        {
            label: 'User'
        }
    ],
    guildOnly: false,
    userPermissions: [],
    clientPermissions: [
        'SEND_MESSAGES'
    ],
    cooldown: 2,
	run: async (bot, message, args) => {
        let ThisEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Profile Information**')
            .setThumbnail(message.guild.iconURL())
        await m.edit(ThisEmbed)
	}
};