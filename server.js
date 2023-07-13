let Ts3;
// =========================
// ======== Imports ========
// =========================

const { TeamSpeak, QueryProtocol } = require('ts3-nodejs-scentral');
const axios = require('axios').default;
const config = require('./config.json');

// =========================
// ======== Variables ======
// =========================
var curraop = "None Set";
var today = new Date();
var time = today.toLocaleString('en-US', { hour12: true, timeZone: config.time_settings.time_zone, hour: "2-digit", minute: "2-digit", });
console.log(time)

// =========================
// ======== Command ========
// =========================

RegisterCommand(config.command_name, async (source, args) => {
    let newaop = args.join(" ");
    let commandRunner = GetPlayerName(source);
    let hasPermission = await CheckPermission(source);
    if (config.permissions.toggle) {
        if (hasPermission && newaop) {
            emitNet("chat:addMessage", -1, { template: `<div style='background-color: rgba(64, 64, 64, 0.8); text-align: center; border-radius: 0.5vh; padding: 0.7vh; font-size: 1.7vh;'><b>The AOP has been changed to ^3${newaop} ^7by ^1${commandRunner}.</b></div>`, });
            curraop = newaop;
            ChangeAOP(newaop, commandRunner);
        } else if (!hasPermission && newaop) {
            emitNet("chatMessage", source, `^3[AOP] ^7You do not have permission to change the AOP!`)
        } else if (!newaop) {
            emitNet("chatMessage", source, `^3[AOP] ^7The current area of patrol is: ^1${curraop}`)
        } 
    } else {
        if (newaop) {
            emitNet("chat:addMessage", -1, { template: `<div style='background-color: rgba(64, 64, 64, 0.8); text-align: center; border-radius: 0.5vh; padding: 0.7vh; font-size: 1.7vh;'><b>The AOP has been changed to ^3${newaop} ^7by ^1${commandRunner}.</b></div>`, });
            curraop = newaop;
            ChangeAOP(newaop, commandRunner);
        } else {
            emitNet("chatMessage", source, `^3[AOP] ^7The current area of patrol is: ^1${curraop}`)
        }
    }
});

// =========================
// ======== Functions ======
// =========================

async function ChangeAOP(aop, player) {
    const channel = await Ts3.getChannelById(config.ts3_settings.channel_id);
    if (config.time_settings.toggle) {
        await channel.edit({ channelDescription: `[center][size=15]AOP: ${aop}[/size][/center]\n[center][size=15]Set By: ${player}[/size][/center]`, channelName: `[cspacer]AOP: ${aop} [${time}]`}).catch((e) => {
            console.log(e);
        })
    } else {
        await channel.edit({ channelDescription: `[center][size=15]AOP: ${aop}[/size][/center]\n[center][size=15]Set By: ${player}[/size][/center]`, channelName: `[cspacer]AOP: ${aop}`}).catch((e) => {
            console.log(e);
        })
    }

    if (config.discord_logs.toggle) {
        let embed = {
            "title": "AOP Changed",
            "description": `The AOP has been changed to **${aop}** by **${player}**.`,
            "color": 16711680,
            "footer": {
                "text": `AOP-Ts3 By scentral`
            }
        }

        await axios({
            method: 'post',
            url: config.discord_logs.webhook,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ embeds: [embed] }),
        }).then((res) => {
            return res;
        }).catch((err) => {
            if (err.response.status === 404) {
                console.log(`^1[AOP-Ts3] ^7The Discord Webhook URL is invalid! Please check your config.json file.^0`);
            } else {
                console.log(err);
            }
        });
    }
}

async function CheckPermission(player) {
    let DiscordID = GetPlayerIdentifier(player, 4);
    DiscordID = DiscordID.replace("discord:", "");
    let hasPermission = false;

    let DiscordBot = await axios({
        method: 'get',
        url: `https://discord.com/api/guilds/${config.permissions.guild_id}/members/${DiscordID}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${config.permissions.token}`,
        },
    }).catch((err) => {
        console.log(err);
    })

    if (DiscordBot.data) {
        let roles = DiscordBot.data.roles;
        roles.forEach((role) => {
            if (config.permissions.roles.includes(role)) {
                hasPermission = true;
            } else {
                hasPermission = false;
            }
        });
    } else {
        hasPermission = false;
    }
    
    return hasPermission;
}

on("onResourceStart", async(resourceName) => {
    if (resourceName === GetCurrentResourceName()) {
        try {
            Ts3 = await TeamSpeak.connect({
                host: config.ts3_settings.host,
                protocol: QueryProtocol.RAW,    
                queryport: config.ts3_settings.queryport,
                serverport: config.ts3_settings.serverport,
                username: config.ts3_settings.username,
                password: config.ts3_settings.password,
                nickname: config.ts3_settings.nickname,
            });
            console.log(`^2[AOP-Ts3] Connected to TS3 server!^0`);
        } catch (err) {
            console.log(`^1[AOP-Ts3] ^7There was an error connecting to the TS3 server! Please check your config.json file.^0`);
            console.log(err);
        }
    }
})

console.log(`^2[AOP-Ts3] ^7AOP-Ts3 has been started!^0`);
console.log(`^2[AOP-Ts3] ^7Made by scentral^0`);