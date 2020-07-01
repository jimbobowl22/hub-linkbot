const Discord = require('discord.js')
const editJsonFile = require('edit-json-file');
const request = require('request');
const fs = require('fs');
module.exports = {
	name: 'createproduct',
	description: 'Creates a product.',
	arguments: [
        {
            label: "Product ID"
        },
        {
            label: "Product Name"
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
        var database = editJsonFile('database.json', {autosave: true})
        let guild = bot.guilds.cache.get(process.env.BOT_PRIMARYGUILD)
        if (!(args.length >= 2)) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Create Information**')
                .addField('Status', ':x: **Cancelled!**', true)
                .addField('Error', 'Incorrect arguments.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        if (database.get('products.'+args[0])) {
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Create Information**')
                .addField('Status', ':x: **Cancelled!**', true)
                .addField('Error', 'Product ID taken.', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
            return
        }
        if (!message.attachments.first()) {
            let Loading = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Create Information**')
                .addField('Status', ':hourglass_flowing_sand: **Waiting for File...**', true)
                .addField('Task', 'Please Attatch the file you would like to use.', true)
                .setThumbnail(guild.iconURL())
            let m = await message.channel.send(Loading)
            var ret = false
            let fileMessage = (await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 300000, error: ['time'] }).catch( err => { ret = true })).first()
            if (!fileMessage || ret == true) {
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Create Information**')
                    .addField('Status', ':x: **Cancelled!**', true)
                    .addField('Error', 'No response.', true)
                    .setThumbnail(guild.iconURL())
                await m.edit(ThisEmbed)
                return
            }
            if (!fileMessage.attachments.first()) {
                let ThisEmbed = new Discord.MessageEmbed()
                    .setColor(Number(process.env.BOT_EMBEDCOLOR))
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setTitle('**Create Information**')
                    .addField('Status', ':x: **Cancelled!**', true)
                    .addField('Error', 'No file found.', true)
                    .setThumbnail(guild.iconURL())
                await m.edit(ThisEmbed)
                return
            }
            let index = args.shift()
            let name = args.join(' ')
            let ext = fileMessage.attachments.first().url.split('.')
            request.get(fileMessage.attachments.first().url)
                .on('error', console.error)
                .pipe(fs.createWriteStream('product-files/'+index+'.'+ext[ext.length - 1]));
            database.set('products.'+index, { name: name, path: 'product-files/'+index+'.'+ext[ext.length - 1] })
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Create Information**')
                .addField('Status', ':white_check_mark: **Complete!**', true)
                .addField('Product Information', 'ID: \`'+index+'\`\nName: \`'+name+'\`\nFile: \`'+index+'.'+ext[ext.length - 1]+'\`', true)
                .setThumbnail(guild.iconURL())
            await m.edit(ThisEmbed)
        } else {
            let index = args.shift()
            let name = args.join(' ')
            let ext = message.attachments.first().url.split('.')
            request.get(message.attachments.first().url)
                .on('error', console.error)
                .pipe(fs.createWriteStream('product-files/'+index+'.'+ext[ext.length - 1]));
            database.set('products.'+index, { name: name, path: 'product-files/'+index+'.'+ext[ext.length - 1] })
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle('**Create Information**')
                .addField('Status', ':white_check_mark: **Complete!**', true)
                .addField('Product Information', 'ID: \`'+index+'\`\nName: \`'+name+'\`\nFile: \`'+index+'.'+ext[ext.length - 1]+'\`', true)
                .setThumbnail(guild.iconURL())
            await message.channel.send(ThisEmbed)
        }
	}
};