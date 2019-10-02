const package = require('./package.json');
const config = require('./config.json');

const Discord = require('discord.js');
const nHentaiApi = require('nhentai-api-js');
let api = new nHentaiApi();
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`nHentai Number Genie started under user ${client.user.tag}!`);
  client.user.setPresence({ game: { name: 'n! <NUMBER>' }, status: 'online'});
});

client.on('message', msg => {
  if (msg.content.startsWith('!n')) {
    if(msg.channel.nsfw !== true) {
        msg.reply("Sorry, you can only use NumberGenie in a NSFW channel.");
    } else {
        let number = msg.content.replace("!n ", "");

        if(isNaN(number)) {
            msg.reply("Usage: !n <NUMBER> where <NUMBER> is the nHentai.net ID");
        } else {
            api.g(number).then(searchResult => {
                let hTitle = searchResult.title.english;
                let hNumber = searchResult.id;
                let hDate = new Date(searchResult.upload_date * 1000);
                let hCover = searchResult.getCover();
                
                let hTags = [];
                searchResult.tags.forEach(function (tag) {
                    hTags.push(tag.name);
                });

                const hEmbed = new Discord.RichEmbed()
                    .setColor("#fb8c00")
                    .setURL('https://nHentai.net/g/' + hNumber)
                    .setTitle(hTitle)
                    .addField("Uploaded Date", hDate.getDate() + "/" + (hDate.getMonth()+1) + "/" + hDate.getFullYear())
                    .addField("Tags", hTags.join(", "))
                    .setThumbnail(hCover)
                    .setFooter('nHentai NumberGenie v' + package.version, 'https://i.imgur.com/A5w5u7q.jpg');

                msg.channel.send(hEmbed);
            }).catch(function(error) {
                msg.reply("Couldn't find this Doujin. Maybe it doesn't exist, maybe nHentai just couldn't find it.");
            });
        }
    }
  }
});

client.login(config.login_token);