const Discord = require('discord.js');
const editJsonFile = require('edit-json-file');
const fs = require('fs');
module.exports = {
	name: 'restart',
	description: 'Restarts the bot, updating all the code with it.',
	arguments: [],
    guildOnly: true,
    userPermissions: [
        'MANAGE_SERVER'
    ],
    clientPermissions: [],
    cooldown: 30,
	run: async (bot, message, args) => {
        let Loading = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('**Restart Information**')
            .addField('Restart Status', ':hourglass_flowing_sand: **Processing...**')
            .setThumbnail(message.guild.iconURL())
        let m = await message.channel.send(Loading)
        fs.open(`restart.json`,'r',function(err, fd){
            if (err) {
                fs.writeFile(`restart.json`, '', function(err) {
                    if(err) {
                        console.log(err);
                    }
                    var restartData = editJsonFile(`restart.json`, {
                        autosave: true
                    });
                    restartData.set('initialized', Date.now())
                    restartData.set('message', m.id)
                    restartData.set('messageChannel', m.channel.id)
                    restartData.set('author', {
                        displayAvatarURL: message.author.displayAvatarURL(),
                        username: message.author.username,
                        guildIcon: message.guild.iconURL()
                    })
                    bot.user.setPresence({
                        status: 'invisible'
                    });
                    bot.destroy();
                    console.log('PROCESS | Restarting...')
                    process.exit(2)
                });
            } else {
                var restartData = editJsonFile(`restart.json`, {
                    autosave: true
                });
                restartData.set('initialized', Date.now())
                restartData.set('message', m.id)
                restartData.set('messageChannel', m.channel.id)
                restartData.set('author', {
                    displayAvatarURL: message.author.displayAvatarURL,
                    username: message.author.username,
                    guildIcon: message.guild.iconURL()
                })
                bot.user.setPresence({
                    status: 'invisible'
                });
                bot.destroy();
                console.log('PROCESS | Restarting...')
                process.exit(2)
            }
        });
	}
};