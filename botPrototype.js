var Discord = require("discord.js");
var bot = new Discord.Client();
var fs = require('fs');
var readline = require('readline');


let targetedGuild = "252525368865456130";
let targetGuild = "254746488993742850";
let targetChannel = "274085775178596352";


var botEnable = true;

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on('error', e => {
  if (e);
  console.error(e);
});

bot.on("message", msg => {
  if (msg.guild.id == targetedGuild){
    if (msg.content.toLowerCase().includes("mega") || msg.content.toLowerCase().includes("mewthree") || msg.content.toLowerCase().includes("nebby") || msg.content.toLowerCase().includes("nobby") || msg.content.toLowerCase().includes("azure") || msg.content.toLowerCase().includes("poosi") || msg.content.toLowerCase().includes("trapomine") || msg.content.toLowerCase().includes("mew") || msg.content.toLowerCase().includes("nebula")){
      bot.guilds.get(targetGuild).channels.get(targetChannel).sendMessage("[" + msg.channel.name + "]: " + msg.author.username + ": " + msg.content);
      bot.users.get("197592250354499584").sendMessage("[" + msg.channel.name + "]: " + msg.author.username + ": " + msg.content);
    }
  }
  if (botEnable == true){
    if (msg.guild.id == targetedGuild){
      bot.guilds.get(targetGuild).channels.get(targetChannel).sendMessage("[" + msg.channel.name + "]: " + msg.author.username + ": " + msg.content);
      if (msg.attachments.first()){
        bot.guilds.get(targetGuild).channels.get(targetChannel).sendMessage("[" + msg.channel.name + "]: " + msg.author.username + ": " + msg.attachments.first().url);
      }
    }
  }
  if((msg.author.id != bot.user.id) && (msg.author.id != "197592250354499584")) return;
  let prefix = "-";
  let command =  ((msg.content.split(" "))[0]).replace(prefix, '');
  let args = msg.content.split(" ").slice(1);
  if(!msg.content.startsWith(prefix)) return;
  if (command == "botenable"){
    botEnable = true;
    msg.channel.sendMessage("Bot enabled!");
  }
  if (botEnable == true){

  if (command == "botdisable"){
    botEnable = false;
    msg.channel.sendMessage("Bot disabled!");
  }
}
});

bot.login("MjcwMDU5NDkyNDUwNzYyNzUy.C1yg0g.45lkBqDe7hJ6JNvyvagE42UDC-A");
