/*
    HUB-LINKBOT (jdwoj5)
    Please view the README before getting started. (Please run node server.js when starting up the bot, not node handler.js.)
*/
const { spawn } = require('child_process');
const Discord = require('discord.js')
const fs = require('fs')

const bot = new Discord.Client({
    presence: {
        status: 'dnd',
        activity: {
            name: 'with ERR Handling.',
            type: 'PLAYING'
        }
    }
})
bot.on('ready', async () => {
    fs.readFile('restart.json', 'utf8', async function (err, data) {
        if (err) {
            bot.destroy()
            process.exit()
        } else {
            let information = JSON.parse(data);
            let channel = await bot.channels.fetch(information.messageChannel)
            let msg = await channel.messages.fetch(information.message)
            let ThisEmbed = new Discord.MessageEmbed()
                .setAuthor(information.author.username, information.author.displayAvatarURL)
                .setTitle('**Restart Information**')
                .addField('Restart Status', ':x: **Error found! Manual Restart required.**')
                .addField('Error Catch Time', (Date.now() - information.initialized) / 1000 + ' seconds')
                .setThumbnail(information.author.guildIcon)
            await msg.edit(ThisEmbed)
            console.log('PROCESS | Updated Restart Information!')
            bot.destroy()
            process.exit()
        } 
    });
})

let full;
function StartBot(arg) {
    if (!arg) full = spawn('node', ['handler.js']);
    else full = spawn('node', ['handler.js', arg]);
    full.stdout.on('data', (data) => {
        console.log(String(data).trim());
    });
      
    full.stderr.on('data', (data) => {
        console.error(String(data));
    });
    full.on('close', function (code) {
        if (code == 1) {
            require('dotenv').config();
            bot.login(process.env.BOT_TOKEN)
        }
        if (code == 2) {
            StartBot('--restarted')
        }
    });
}

StartBot()
