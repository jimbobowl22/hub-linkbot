const Discord = require('discord.js')
const editJsonFile = require('edit-json-file');
const fs = require('fs');
module.exports = {
	name: 'retrieve',
	description: 'Fetches a product file.',
	arguments: [
        {
            label: "Product ID"
        }
    ],
    guildOnly: true,
    userPermissions: [],
    clientPermissions: [
        'SEND_MESSAGES'
    ],
    cooldown: 5,
	run: async (bot, message, args) => {
        var database = editJsonFile('database.json', {autosave: true})
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        if (args.length !== 1) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Retrieve Information**')
                .addField('Status', ':x: **Cancelled!**', true)
                .addField('Error', 'Incorrect arguments.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        if (!database.get('products.'+args[0])) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Retrieve Information**')
                .addField('Status', ':x: **Cancelled!**', true)
                .addField('Error', 'Product ID not found.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        let users = database.get('users')
        if (!users) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Retrieve Information**')
                .addField('Status', ':x: **Cancelled!**', true)
                .addField('Error', 'Does not own product.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        let formatted = Object.values(users)
        let me = formatted.find(v => {if (v.verify.status == "complete") {return v.verify.value == message.author.id} else {return false}})
        if (!me.products.find(p => args[0])) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Retrieve Information**')
                .addField('Status', ':x: **Cancelled!**', true)
                .addField('Error', 'Does not own product.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        let sent = await bot.functions.sendFile(message.member, args[0])
        let ThisEmbed = new Discord.MessageEmbed()
            .setColor(Number(process.env.BOT_EMBEDCOLOR))
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Retrieve Information**')
            .setThumbnail(guild.iconURL())
        if (sent) {
            ThisEmbed.addField('Status', ':white_check_mark: **Complete!**', true)
            ThisEmbed.addField('Task', 'Please check your DMs.', true)
        } else {
            ThisEmbed.addField('Status', ':x: **Incomplete!**', true)
            ThisEmbed.addField('Task', 'Please open your Direct Messages and try again.', true)
        }
        await message.channel.send(ThisEmbed)
	}
};