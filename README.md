<p align="center">
    <img src="/assets/title.png" alt="Title Image" height="150" /></a>
</p>

# Hub Whitelist Bot (jdwoj5)
This whitelisting bot is made for ROBLOX Tech Groups to use in their Discord Servers. It will help deliver products through web requests and store data of users. Please note that while this works, it may not be so appealing to the eye as the Zing Tech one is, but it works nevertheless and has more features.

## Installation
To install this Discord Bot, you will need to do the following:

1. Obtain a VPS, or a computer to host this locally. (This is probably going to be the most difficult step of the entire installation process.)
    - Please note that Heroku will not work, as we are writing files that should be persistant, and Heroku rebuilds around every 24 hours. using Heroku would require you to rework the database system entirely to function with Heroku instead of using `.json` files.
    - Glitch also probably will not work, as Glitch requires requests to keep uptime, and this bot should be running almost 24/7. If you can find a way to ping your Glitch URL every 4 minutes, then Glitch should work fine, just be sure to set the PORT in your `.env` to 80.
    - You will need to put the IP of the place you are running the bot in your products and your hub, so we recommend a few ways to secure this information:
        - Use DDoS protection, a VPN, or a proxy of sorts.
        - Host on a VPS to prevent your personal IP from getting leaked.
        - Obfuscate all scripts that contain your IP with Luraph's `LPH_ENCSTR()` system.
        - Use a domain name. (I have no experience with Domains, so do not trust this security precaution or go out of your way to get this.)
    - If you are using your local computer on a home WiFi network, you need to figure out how to Port Forward the port you plan to use for this system.
2. Ensure it has the [Node.js](https://nodejs.org/en/) engine installed.
3. Clone this repository with `git clone https://github.com/jdwoj5/hub-linkbot`
4. Create a [Discord Application](https://discord.com/developers/applications) with a Bot created in the Bot Section.
5. Create a file named `.env` in the main folder/directory to store crucial information. 
    - Paste the following into your `.env` file:
    ```env
    # BOT CONFIGURATION
    BOT_EMBEDCOLOR=
    BOT_TOKEN=
    BOT_PREFIX=
    BOT_PRIMARYGUILD=
    BOT_VERIFIEDROLEID=

    # WEB CONFIGURATION
    HUB_ACCESSPORT=
    HUB_CHANGENICKNAME=

    # KEYS
    HUB_APIKEY=
    UUID_NAMESPACE=
    ```
    - Input your `.env` information as shown below:
        - `BOT_EMBEDCOLOR` Set this to the color [(in decimal value)](https://spycolor.com/) you wish your embeds to have. (Recommended: `2303786`)
        - `BOT_TOKEN` Set this to your bot token as found in the Bot section of your [Discord Application](https://discord.com/developers/applications).
        - `BOT_PREFIX` Set this to your preferred bot prefix. (Recommended: `!`)
        - `BOT_PRIMARYGUILD` Set this to the ID of the Server you would like to use the bot in.
        - `BOT_VERIFIEDROLEID` Set this to the ID of the Role you would like to give users if they are verified.
        - `HUB_ACCESSPORT` Set this to a random four digit integer. This will be used later when scripting your Hub to work with this bot.
        - `HUB_CHANGENICKNAME` Set this to true if you want the bot to change the nickname on account link, and false if you do not.
        - `HUB_APIKEY` Set this to a [random alphanumeric string](https://onlinerandomtools.com/generate-random-string?length=32&count=1&predefined-charset=alphamixnum&custom-charset=). This will be used for system security. Even if your IP and Port are leaked, you need to have this changable API key in order to back you up in order to prevent unfixable security issues.
        - `UUID_NAMESPACE` Set this to the UUID generated [here](https://www.uuidgenerator.net/). This will be used to encrypt your user's database index UUIDs and make them truly randomized.

## Running the Bot
To initialize the bot, run the following commands in the cloned directory to set up the bot:
1. `npm update`
2. `npm install`

To start the bot, run the following command:
- `node server.js`

The bot should never need to come offline, as the `!restart` command restarts the whole process and updates the bot's code on it's own. Most errors will also be caught with this command, prompting you to update the code and restart the bot yourself.
All commands are locked with a **permission-based system**. This means that roles are not used for command permissinons, and commands are given to people with specific discord-type permissions instead. To see the permissions used for each command, go into the command file and view the property `userPermissions: []`, as that is where the permissions are defined. 

## Pre-Installed Commands
Already added are many commands that can be used to manage the whitelist system and product creation. Here is a list of them:
- `!createproduct` Creates a product.
- `!deleteproduct` Deletes a product with its file.
- `!forceunlink` Forcefully unlinks a selected Discord Account to your Registered User.
- `!help` Displays all the bot's commands and information.
- `!link` Links your Discord Account to your Registered User with a code generated from the Hub.
- `!ping` Displays the information about the bot's latency.
- `!products` Displays all products.
- `!profile` Displays all information stored about a user.
- `!restart` Restarts the bot, updating all the code with it.
- `!retrieve` Fetches a product file.

## Connecting to your Hub
There are many ways to trigger functions in the Discord Bot from HTTP requests, but the most important thing to do is to write down the IP at which you are running this Discord Bot and write down the `HUB_ACCESSPORT` that you put in the `.env` file before coding with this hub. This information will be referenced multiple times from the scripts in your ROBLOX Product Hub.

###### Playing with Endpoints (Self-Writing)
This section is not recommended unless you know exactly what you are doing and how to go about doing things. Listed below are the endpoints necessary to use this Bot:
- **GET** `/` This endpoint is used to view the main status of the page. (Template: `{"status":"ok","running":true}`)
- **GET** `/products/` This endpoint is used to view all product information. (Template: `{"status":"ok","products":{"productId1":{"name":"productName","path":"productFilePath"}}}`, this endpoint requires an API key.)
- **GET** `/products/give/[Product ID]/[ROBLOX User ID]/` This endpoint is used to give a user a product. This will not only edit the whitelist, but send them the product file in DMs. (Template: `{"status":"ok","success":true,"dm":true}`, this endpoint requires an API key.)
- **GET** `/products/revoke/[Product ID]/[ROBLOX User ID]/` This endpoint is used to revoke the whitelist of a product for a user. This will not send the user a DM. (Template: `{"status":"ok","success":true}`, this endpoint requires an API key.)
- **GET** `/users/[ROBLOX User ID]/` This endpoint is used to view all information collected about a user. Please note that the field labelled "index" is the user's UUID, which you can search for a profile with if needed in Discord. (Template: `{"status":"ok","index":"userUUID","value":{"robloxId":"userROBLOXID","robloxUsername":"userROBLOXUsername","verify":{"status":"complete/link","value":"discordID/linkcode"},"products":["insert","array","of","product","ids"]}}`, this endpoint requires an API key.)

When encountering errors, the website will return something such as: `{"status":"error", "error":"errorMessage}`
Most of the error messages are `User not found`, `Product not found`, and stuff like that. Feel free to take a look at the handler.js file to take a look at every error if you are looking into handling it through your Hub. (Line: 195)

###### ROBLOX Web API ModuleScript (Pre-Written)
**If you would like to see this section added, please DM me on Discord:** `@jdwoj5butbetter#1132`

###### Checking the Whitelist
Written below is a Whitelist Checker that you may use to check whitelists. Setting it up should be easy, but please ensure that this script is directly inside the main folder, as it will destroy the parent of the script when loading. It is recommended that all server-side code is stored in this whitelist script and this whitelist script is obfuscated, so that no one can remove this script and have it still run entirely.

```lua
--[[
    ROBLOX-Whitelist
    Please do not edit below! This script should be obfuscated to increase security.
--]]

-- PRODUCT SETUP
local ProductId = ""
local IP = ""
local Port = "" -- If 80, leave blank.
local APIKey = ""

-- WHITELIST CHECK
local Http = game:GetService("HttpService")
local URL = IP
if Port ~= "" and Port ~= nil then
    URL = URL..":"..Port
end
function HasProduct(info)
    local Owned = false
    for i=1,#info.value.products in pairs(info.value.products) do
        if info.value.products[i] == ProductId then
            Owned = true
        end
    end
    return Owned
end
warn("["..string.upper(ProductId).."] Loading...")
local GameOwner = nil
if game.CreatorType == Enum.CreatorType.Group then
    GameOwner = game:GetService("GroupService"):GetGroupInfoAsync(game.CreatorId).Owner.Id
else
    GameOwner = game.CreatorId
end
local UserInfoEncoded = ""
local HttpEnabled = pcall(function()
    UserInfoEncoded = Http:GetAsync("http://"..URL.."/user/"..GameOwner.."?key="..APIKey)
end)
if HttpEnabled == false then
	warn("["..string.upper(ProductId).."] An error has occured. (Are HTTP services enabled?)")
    script.Parent:Destroy()
    return
end
local UserInfo = http:JSONDecode(UserInfoEncoded)
if UserInfo.status == "error" or HasProduct(UserInfo) == false then
	warn("["..string.upper(ProductId).."] An error has occured. (Does the Owner own the product?)")
	script.Parent:Destroy()
    return
end
warn("["..string.upper(ProductId).."] Loaded!")
```

## Credits
Here are the Credits to how this was made. If you use this is some way for any reason, I would appreciate credit for this bot, so *please* do not remove the footer in the help command. Also, please do not resell this bot. It took me a while to make, and reselling it is just offensive and wrong.
- [discord.js's Documentation Pages](https://discord.js.org/#/docs/main/stable/general/welcome) | Helped me with how the discord.js module works, and I always use these Documentation pages when writing code.
- [Zing Tech Whitelisting Bot](https://github.com/iPanda969/whitelistbot) | Helped me learn how to use the express module almost entirely, also greatly inspired me to make an open source bot for myself with file management.
- [Pivot Tech's Discord](https://discord.gg/vxFvh3w) | Helped me test this system with a big tech group. (Please go check them out, it is a great example of how this bot can be, and is supposed to be used!)
- [Pivot Tech's Hub](https://www.roblox.com/games/4944337460/Hub) | Helped me test this system on the ROBLOX-Side.
