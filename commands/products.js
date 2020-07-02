const Discord = require('discord.js')
const editJsonFile = require('edit-json-file');
const fs = require('fs');
module.exports = {
	name: 'products',
    description: 'Displays all products.',
    arguments: [],
    guildOnly: false,
    userPermissions: [],
    clientPermissions: [],
    cooldown: 5,
	run: async (bot, message, args) => {
        var database = editJsonFile('database.json', {autosave: true})
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        if (!database.get('products')) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Products Information**')
                .addField('Status', ':x: **Cancelled!**', true)
                .addField('Error', 'No products found.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        let products = database.get('products')
        let entries = Object.entries(products)
        if (entries.length == 0) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Products Information**')
                .addField('Status', ':x: **Cancelled!**', true)
                .addField('Error', 'No products found.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        let ThisEmbed = new Discord.MessageEmbed()
            .setColor(Number(process.env.BOT_EMBEDCOLOR))
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Products Information**')
            .addField('Status', ':white_check_mark: **Complete!**', true)
            .addField('Products', entries.map(v => `**${v[1].name}** \`${v[0]}\``), true)
            .setThumbnail(guild.iconURL())
        await message.channel.send(ThisEmbed)
	}
};