# Open Source Whitelist Bot
This whitelisting bot is made for ROBLOX Tech Groups to use in their Discord Servers. It will help deliver products through web requests and store data of users.

## Installation
To install this Discord Bot, you will need:

1. A VPS, or a computer to host this locally. (Please note that Heroku will not work, as we are writing files that should be persistant, and Heroku rebuilds around every 24 hours.)
2. [Node.js](https://nodejs.org/en/)

Then clone the repository and create a file names `.env`. This is where we will store crucial information. Paste the following into your `.env` file:
```
# BOT CONFIGURATION
BOT_TOKEN=
BOT_PREFIX=!
BOT_PRIMARYGUILD=

# WEB CONFIGURATION
HUB_ACCESSPORT=3500

# KEYS
```

## Running the Bot
To initialize the bot, run the following commands in the cloned directory to set up the bot:
- `npm update`
- `npm install`

To start the bot, run the following command:
- `node server.js`

The bot will never need to come offline, as the `!restart` command restarts the whole process and updates the bot's code on it's own.

## Connecting to your Hub
There are many ways to trigger functions in the Discord Bot from HTTP requests, but the most important thing to do is grab the IP and write down the Port that you put in the `.env` file. This information will be referenced multiple times from your ROBLOX Product Hub.