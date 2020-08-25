<p align="center">
    <img src="/assets/title.png" alt="Title Image" /></a>
</p>

# Hub Whitelist Bot (jdwoj5)
This whitelisting bot is made for ROBLOX Tech Groups to use in their Discord Servers. It will help deliver products through web requests and store data of users. Please note that while this works, it may not be so appealing to the eye as the Zing Tech one is, but it works nevertheless and has more features.

## Installation
To install this Discord Bot, you will need to do the following:

1. Obtain a VPS, or a computer to host this locally. (This is probably going to be the most difficult step of the entire installation process.)
    - Please note that Heroku will not work, as we are writing files that should be persistant, and Heroku rebuilds around every 24 hours. using Heroku would require you to rework the database system entirely to function with Heroku instead of using `.json` files.
    - Glitch will not work unless you boost your project. As pinging services have been banned, uptime of the bot is crucial.
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
	BOT_LOGCHANNELID=

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
        - `BOT_LOGCHANNELID` Set this to the ID of the Channel you would like to log possible leaks to your endpoints and products. (Will output to console if left blank.)
        - `HUB_ACCESSPORT` Set this to a random four digit integer. This will be used later when scripting your Hub to work with this bot. (If you are using a VPS that predefines the `PORT` variable with process.env.PORT, you may leave this blank.)
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
- `!create` Creates a product.
- `!delete` Deletes a product with its file.
- `!forceunlink` Forcefully unlinks a selected Discord Account to your Registered User.
- `!help` Displays all the bot's commands and information.
- `!link` Links your Discord Account to your Registered User with a code generated from the Hub.
- `!ping` Displays the information about the bot's latency.
- `!products` Displays all products.
- `!profile` Displays all information stored about a user.
- `!restart` Restarts the bot, updating all the code with it.
- `!retrieve` Fetches a product file.
- `!revoke` Revokes a user access to a product.
- `!transfer` Transfers product access from one user to another.
- `!updatefile` Updates a product file and sends out a mass DM with the new file.
- `!whitelist` Gives a user access to a product.


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
Written below is a ModuleScript that you may use to make coding your hub easier. Setting it up should be easy, but please ensure that this script is inside ServerScriptService, as it contains confidential information. It is not recommended to edit the script in any other place than the URL variable and the Key variable.

```lua
--[[
	ROBLOX-HubModule
	Please do not edit below! This script should be obfuscated to increase security.
--]]

local URL = ""; -- IP:PORT or Defined URL
local Key = ""; -- API Key defined in your .env file

--[[				// Functions \\
	--------------
	 GetStatus() returns true/false (Is it running?)
	--------------
	 GetUserProducts([User ID]) returns Array[Products]
	--------------
	 GetVerifyStatus([User ID]) returns 'link'/'complete'
	--------------
	 GetLinkCode([User ID]) returns Link Code (Returns false if verified)
	--------------
	 WaitForVerify([User ID]) returns void (Returns when user is verified)
	--------------
	 GetAllProducts([User ID]) returns Array[Products]
	--------------
	 WhitelistUser([Product ID], [User ID]) returns true/false (Did the delivery DM succeed?)
	--------------
	 RevokeUser([Product ID], [User ID]) returns void
	--------------
--]]

local Success,Error = pcall(function()
	if game.Players.LocalPlayer ~= nil then
		game.Players.LocalPlayer:Kick("HUB | You must not have this Module stored locally!");
	end;
end);
if not script:IsDescendantOf(game.ServerScriptService) then
	error("HUB | You must have this Module this in ServerScriptService!");
end;
function GetURL(Endpoint)
	return 'http://'..URL..Endpoint.."?key="..Key;
end;
local HttpService = {
	GetAsync = function(ResURL)
		local Request = game:GetService('HttpService'):RequestAsync({
			Url = ResURL;
			Method = "GET";
		});
		if not Request.Success then
			return nil;
		else
			return Request.StatusCode, game:GetService('HttpService'):JSONDecode(Request.Body);
		end;
	end;
};
local Module = {};
Module.GetStatus = function(ID)
	local Status, Data = HttpService.GetAsync(GetURL('/'));
	if not Data then
		return false;
	end;
	if Data.running == true then
		return true;
	end;
	return false;
end;
Module.GetUserProducts = function(ID)
	local Status, Data = HttpService.GetAsync(GetURL('/user/'..ID));
	return Data.value.products;
end;
Module.GetVerifyStatus = function(ID)
	local Status, Data = HttpService.GetAsync(GetURL('/user/'..ID));
	return Data.value.verify.status;
end;
Module.GetLinkCode = function(ID)
	local Status, Data = HttpService.GetAsync(GetURL('/user/'..ID));
	print(game:GetService('HttpService'):JSONEncode(Data))
	if Data.value.verify.status == 'link' then
		return Data.value.verify.value;
	else
		return false;
	end;
end;
Module.WaitForVerify = function(ID)
	while true do
		local Status, Data = HttpService.GetAsync(GetURL('/user/'..ID));
		if Data.value.verify.status == 'complete' then
			return;
		end;
		wait(2);
	end;
end;
Module.GetAllProducts = function(ID)
	local Status, Data = HttpService.GetAsync(GetURL('/products'));
	return Data.products;
end;
Module.WhitelistUser = function(Product, ID)
	local Status, Data = HttpService.GetAsync(GetURL('/products/give/'..Product..'/'..ID));
	return Data.dm;
end;
Module.RevokeUser = function(Product, ID)
	local Status, Data = HttpService.GetAsync(GetURL('/products/revoke/'..Product..'/'..ID));
end;
return Module;
```

###### Checking the Whitelist
Written below is a Whitelist Checker that you may use to check whitelists. Setting it up should be easy, but please ensure that this script is directly inside the main folder, as it will destroy the parent of the script when loading. It is recommended that all server-side code is stored in this whitelist script and this whitelist script is obfuscated, so that no one can remove this script and have it still run entirely.

```lua
--[[
    ROBLOX-Whitelist
    Please do not edit below! This script should be obfuscated to increase security.
--]]

-- PRODUCT SETUP
local ProductId = ""
local URL = "" -- "IP:Port"

local UnloadProduct = function()
	-- Insert code here to unload the product.
	warn("["..string.upper(ProductId).."] Unloaded!")
end
local LoadProduct = function()
	-- Insert code here to load the product.
	warn("["..string.upper(ProductId).."] Loaded!")
end

-- WHITELIST CHECK
local Http = game:GetService("HttpService")
warn("["..string.upper(ProductId).."] Loading...")
local HTTPInfoEncoded = ""
local HttpEnabled, HttpError = pcall(function()
	HTTPInfoEncoded = Http:GetAsync("http://"..URL.."/game/"..ProductId.."/?job=a"..game.JobId)
end)
if HttpEnabled == false and HttpError == "Http requests are not enabled. Enable via game settings" then
	warn("["..string.upper(ProductId).."] Please enable HTTP Services.")
	spawn(UnloadProduct)
	return
elseif HttpEnabled == false then
	warn("["..string.upper(ProductId).."] There was an issue connecting to the server. ("..HttpError..")")
	spawn(UnloadProduct)
	return
end
local HTTPInfo = Http:JSONDecode(HTTPInfoEncoded)
if HTTPInfo.status == "error" then
	warn("["..string.upper(ProductId).."] "..HTTPInfo.error)
	local s, e = pcall(UnloadProduct)
	if not s then
		warn("["..string.upper(ProductId).."] Error while unloading: "..e)
	end
	script:Destroy()
	return
elseif HTTPInfo.owned == false then
	warn("["..string.upper(ProductId).."] User does not own product.")
	local s, e = pcall(UnloadProduct)
	if not s then
		warn("["..string.upper(ProductId).."] Error while unloading: "..e)
	end
	script:Destroy()
	return
elseif game:GetService('RunService'):IsStudio() then
	warn("["..string.upper(ProductId).."] Products do not work in Studio.")
	local s, e = pcall(UnloadProduct)
	if not s then
		warn("["..string.upper(ProductId).."] Error while unloading: "..e)
	end
	script:Destroy()
	return
end
local s, e = pcall(LoadProduct)
if not s then
	warn("["..string.upper(ProductId).."] Error while loading: "..e)
end
-- For security measures, it is suggested that you add script:Destroy() here.
return
```

## Credits
Here are the Credits to how this was made. If you use this is some way for any reason, I would appreciate credit for this bot, so *please* do not remove the footer in the help command. Also, please do not resell this bot. It took me a while to make, and reselling it is just offensive and wrong.
- [discord.js's Documentation Pages](https://discord.js.org/#/docs/main/stable/general/welcome) | Helped me with how the discord.js module works, and I always use these Documentation pages when writing code.
- [Zing Tech Whitelisting Bot](https://github.com/iPanda969/whitelistbot) | Helped me learn how to use the express module almost entirely, also greatly inspired me to make an open source bot for myself with file management.
- [Pivot Tech's Discord](https://discord.gg/vxFvh3w) | Helped me test this system with a big tech group. (Please go check them out, it is a great example of how this bot can be, and is supposed to be used!)
- [Pivot Tech's Hub](https://www.roblox.com/games/4944337460/Hub) | Helped me test this system on the ROBLOX-Side.

## Examples
Below are a set of Discord Servers that use this bot. You may join then to take a look at how they use it.
- [Pivot Tech](https://discord.gg/vxFvh3w)
- [SKYtech](https://discord.gg/PsE4qwQ)
