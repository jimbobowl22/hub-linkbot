const Discord = require('discord.js')
const editJsonFile = require('edit-json-file');
const fs = require('fs');
module.exports = {
	name: 'delete',
	description: 'Deletes a product with it\s file.',
	arguments: [
        {
            label: "Product ID"
        }
    ],
    guildOnly: true,
    userPermissions: [
        'MANAGE_GUILD'
    ],
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
                .setTitle('**Delete Information**')
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
                .setTitle('**Delete Information**')
                .addField('Status', ':x: **Cancelled!**', true)
                .addField('Error', 'Product ID not found.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        let { path } = database.get('products.'+args[0])
        fs.unlinkSync(path)
        let users = database.get('users')
        if (users) {
            let formatted = Object.entries(users)
            let me = formatted.filter(v => v[1].products.find(r => r == args[0]))
            me.forEach(async (auser) => {
                let index = auser[0]
                let user = auser[1]
                user.products.splice(user.products.indexOf(args[0]), 1)
                database.set('users.'+index, user)
            })
        }
        database.unset('products.'+args[0])
        let ThisEmbed = new Discord.MessageEmbed()
            .setColor(Number(process.env.BOT_EMBEDCOLOR))
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Delete Information**')
            .addField('Status', ':white_check_mark: **Complete!**', true)
            .setThumbnail(guild.iconURL())
        await message.channel.send(ThisEmbed)
	}
};