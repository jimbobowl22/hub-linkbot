# Open Source Whitelist Bot
This whitelisting bot is made for ROBLOX Tech Groups to use in their Discord Servers. It will help deliver products through web requests and store data of users.

## Installation
To install this Discord Bot, you will need to do the following:

1. Obtain a VPS, or a computer to host this locally. (Please note that Heroku will not work, as we are writing files that should be persistant, and Heroku rebuilds around every 24 hours.)
2. Ensure it has the [Node.js](https://nodejs.org/en/) engine installed.
3. Clone this repository with `git clone https://github.com/jdwoj5/hub-linkbot`
4. Create a file named `.env`, which is where we will store crucial information. 
    - Paste the following into your `.env` file:
    ```env
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
There are many ways to trigger functions in the Discord Bot from HTTP requests, but the most important thing to do is to write down the IP which you are running this Discord Bot and write down the Port that you put in the `.env` file. This information will be referenced multiple times from the scripts in your ROBLOX Product Hub.