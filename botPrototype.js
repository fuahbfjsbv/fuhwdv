/*****
PUT YOUR TOKEN HERE!!!
*****/
var Discord = require("discord.js");
var bot = new Discord.Client();
var fs = require('fs');
var readline = require('readline');
const ImagesClient = require('google-images');

let mentionResponses = {};
let reactions = {};

let mentionCooldown = 15000;
let mentionCooling = false;

const shortcuts = new Map([
  ["lenny", "( ͡° ͜ʖ ͡°)"],
  ["shrug", "¯\\_(ツ)_/¯"],
  ["tableflip", "(╯°□°）╯︵ ┻━┻"],
  ["unflip", "┬──┬﻿ ノ( ゜-゜ノ)"],
  ["nebula", "\u200b\:milky_way:"],
  ["complaint", "Please send all complaints to `/dev/null`!"],
  ["null", "\u200b"],
  ["lugiaprophecy", "**Disturb not the harmony of fire, ice or lightning,\nlest these titans wreak destruction upon the world in which they clash.\nThough the water's great guardian shall arise to quell the fighting,\nalone its song will fail, and thus the earth shall turn to ash.\nO Chosen One, into thine hands bring together all three.\nTheir treasures combined tame the Beast of the Sea.\n\n            --Shamouti Prophecy**"]
]);

const textReplace = new Map([
  ["~lenny~", "( ͡° ͜ʖ ͡°)"],
  ["~shrug~", "¯\\_(ツ)_/¯"],
  ["~tableflip~", "(╯°□°）╯︵ ┻━┻"],
  ["~unflip~", "┬──┬﻿ ノ( ゜-゜ノ)"],
  ["~nebula~", "\u200b\:milky_way:"],
  ["~complaint~", "Please send all complaints to `/dev/null`!"],
  ["~null~", "\u200b"]
]);

const colors = new Map([
  ["red", [255, 0, 0]],
  ["green", [0, 255, 0]],
  ["blue", [0, 0, 255]],
  ["orange", [255, 144, 70]],
  ["yellow", [255, 255, 0]],
  ["cyan", [0, 255, 255]],
  ["magenta", [255, 0, 255]],
  ["white", [255, 255, 255]],
  ["black", [1, 1, 1]],
  ["gray", [128, 128, 128]],
  ["pink", [255, 128, 255]],
  ["purple", [120, 60, 220]]
]);

const textToEmoji = new Map([
  ["a", ":regional_indicator_a:"],
  ["b", ":regional_indicator_b:"],
  ["c", ":regional_indicator_c:"],
  ["d", ":regional_indicator_d:"],
  ["e", ":regional_indicator_e:"],
  ["f", ":regional_indicator_f:"],
  ["g", ":regional_indicator_g:"],
  ["h", ":regional_indicator_h:"],
  ["i", ":regional_indicator_i:"],
  ["j", ":regional_indicator_j:"],
  ["k", ":regional_indicator_k:"],
  ["l", ":regional_indicator_l:"],
  ["m", ":regional_indicator_m:"],
  ["n", ":regional_indicator_n:"],
  ["o", ":regional_indicator_o:"],
  ["p", ":regional_indicator_p:"],
  ["q", ":regional_indicator_q:"],
  ["r", ":regional_indicator_r:"],
  ["s", ":regional_indicator_s:"],
  ["t", ":regional_indicator_t:"],
  ["u", ":regional_indicator_u:"],
  ["v", ":regional_indicator_v:"],
  ["w", ":regional_indicator_w:"],
  ["x", ":regional_indicator_x:"],
  ["y", ":regional_indicator_y:"],
  ["z", ":regional_indicator_z:"],
  ["!", ":grey_exclamation:"],
  ["?", ":grey_question:"],
  ["0", ":zero:"],
  ["1", ":one:"],
  ["2", ":two:"],
  ["3", ":three:"],
  ["4", ":four:"],
  ["5", ":five:"],
  ["6", ":six:"],
  ["7", ":seven:"],
  ["8", ":eight:"],
  ["9", ":nine:"]
]);

let client = new ImagesClient('004497848346027955910:bvtye9dcwfc', 'AIzaSyApx3SNxIM9N1rALRy6CcbWVLZtzalFW1I');

var botEnable = true;

bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on('error', e => {
  if (e);
  console.error(e);
});

bot.on("guildCreate", guild => {

});

bot.on("guildMemberAdd", (member) => {

});

bot.on("message", msg => {
  if (msg.author != bot.user){
    if (mentionCooling){
      return;
    }
    if (msg.mentions.users.first()){
      if (mentionResponses[msg.channel.id]){
        if (msg.mentions.users.first().id == bot.user.id){
          if (mentionResponses[msg.channel.id].dm == true){
            msg.author.sendMessage(mentionResponses[msg.channel.id].response).catch((err)=>{console.log(err);});
          }else{
            msg.reply(mentionResponses[msg.channel.id].response).catch((err)=>{console.log(err);});
          }
          setTimeout(function(){mentionCooling = false;}, mentionCooldown);
          mentionCooling = true;
        }
      }
    }
  }
  
  if (reactions[msg.channel.id]){
    if (reactions[msg.channel.id].reactions.length > 0){
      reactions[msg.channel.id].forEach((reaction) => {
        msg.react(reaction);
      });
    }
  }
  
  if(msg.author !== bot.user) return;

  const msgContent = msg.content;
  const newMsg = msgContent.split(" ").map(p=> textReplace.has(p) ? textReplace.get(p) : p).join(" ");
  if(msg.content !== newMsg) {
    msg.edit(newMsg);
  }

  let prefix = "~";
  let command =  ((msg.content.split(" "))[0]).replace(prefix, '');
  let args = msg.content.split(" ").slice(1);
  if(!msg.content.startsWith(prefix)) return;
  if(!msg.author.id == "197592250354499584") return;
  if (command == "botenable"){
    botEnable = true;
    msg.channel.sendMessage("Bot enabled!");
  }
  if (botEnable == true){

  if (command == "ping") {
    msg.channel.sendMessage("Pong!").then((sent) => {
      let t = sent.createdTimestamp - msg.createdTimestamp;
      sent.edit("Pong! " + t + "ms");
    });
  }
    
  if (command == "mentionresponseadd" || command == "mra") {
    let all = false;
    let dm = false;
    if (args[0] == "-a"){
      all = true;
      args = args.slice(1);
    }
    if (args[0] == "-dm"){
      dm = true;
      args = args.slice(1);
    }
    if (all){
      let array = [];
      msg.guild.channels.forEach((channel) => {array.push(channel.id);});
      if (!mentionResponses[msg.channel.id]){
        for (let i = 0; i < array.length; i++){
          mentionResponses[array[i.toString()]] = {response: args.join(" "), dm: dm};
        }
        msg.channel.sendMessage("Added `" + args.join(" ") + "` as the response! (All channels in this server) DM set to " + dm + "!");
      }else{
        for (let i = 0; i < array.length; i++){
          mentionResponses[array[i.toString()]].response = args.join(" ");
          mentionResponses[msg.channel.id].dm = dm;
        }
        msg.channel.sendMessage("Updated `" + args.join(" ")+ "` as the response! (All channels in this server) DM set to " + dm + "!");
      }
      return;
    }
    if (!mentionResponses[msg.channel.id]){
      mentionResponses[msg.channel.id] = {response: args.join(" "), dm: dm};
      msg.channel.sendMessage("Added `" + args.join(" ") + "` as the response! DM set to " + dm + "!");
    }else{
      mentionResponses[msg.channel.id].response = args.join(" ");
      mentionResponses[msg.channel.id].dm = dm;
      msg.channel.sendMessage("Updated `" + args.join(" ")+ "` as the response!");
    }
  }
    
  if (command == "mentionresponsedelete" || command == "mrd") {
    if (args[0] == "-g"){
      mentionResponses = {};
      msg.channel.sendMessage("Deleted all mention responses!");
      return;
    }
    if (!mentionResponses[msg.channel.id]){
      msg.channel.sendMessage("There is no response in this channel!");
    }else{
      delete mentionResponses[msg.channel.id];
      msg.channel.sendMessage("Deleted mention response for this channel!");
    }
  }
    
  if (command == "autoreactadd" || command == "ara") {
    let all = false;
    if (args[0] == "-a"){
      all = true;
      args = args.slice(1);
    }
    let reactionArray;
    args.forEach((arg) => {if (arg.startsWith(":") && arg.endsWith(":")){reactionArray.push(arg);}});
    if (all){
      let array = [];
      msg.guild.channels.forEach((channel) => {array.push(channel.id);});
      if (!reactions[msg.channel.id]){
        for (let i = 0; i < array.length; i++){
          reactions[array[i.toString()]] = {reactions: reactionArray};
        }
        msg.channel.sendMessage("Auto-react enabled! (for all channels in this server)");
      }else{
        for (let i = 0; i < array.length; i++){
          reactions[array[i.toString()]].reactions = reactionArray;
        }
        msg.channel.sendMessage("Auto-react updated! (for all channels in this server)");
      }
      return;
    }
    if (!reactions[msg.channel.id]){
      reactions[msg.channel.id] = {reactions: reactionArray};
      msg.channel.sendMessage("Auto-react enabled!");
    }else{
      mentionResponses[msg.channel.id].reactions = reactionArray;
      msg.channel.sendMessage("Auto-react updated!");
    }
  }
    
  if (command == "autoreactdelete" || command == "ard") {
    if (args[0] == "-g"){
      reactions = {};
      msg.channel.sendMessage("Deleted all auto-reactions!");
      return;
    }
    if (!reactions[msg.channel.id]){
      msg.channel.sendMessage("There are no auto-reactions in this channel!");
    }else{
      delete reactions[msg.channel.id];
      msg.channel.sendMessage("Deleted auto-reactions for this channel!");
    }
  }
    
  if (command == "lillie") {
    /*bot.channels.get("259062910435852299").sendMessage(args.join(" ")).then(()=>{
      msg.channel.awaitMessages(response => response.length > 0, {
        max: 3,
        time: 5000,
        errors: ['time'],
      }).then((collected)=>{
        msg.channel.sendMessage(collected.first().content);
        let array = collected.array();
        if (array[1]){
          msg.channel.sendMessage(array[1].content);
        }
        if (array[2]){
          msg.channel.sendMessage(array[2].content);
        }
      }).catch(() => {
        msg.channel.sendMessage("Lillie returned nothing!");
      });
    });*/
    bot.channels.get("284526377263300609").sendMessage(args.join(" "))
      .then(() => {
        bot.channels.get("284526377263300609").awaitMessages(response => response.author.id == "258834974386421761", {
          maxMatches: 1,
          time: 5000,
          errors: ['time'],
        })
        .then((collected) => {
          msg.channel.sendMessage(collected.first().content);
          if (collected.array()[1]){
            msg.channel.sendMessage(collected.array()[1].content);
          }
          if (collected.array()[2]){
            msg.channel.sendMessage(collected.array()[2].content);
          }
        })
        .catch(() => {
          msg.channel.sendMessage("Lillie returned nothing!");
        });
});
    return;
  }

  else if (command == "imagesearch"){
    client.search(args.join(" "))
      .then(function (images) {
         let array = images.slice(0,9);
         if (!array[0]){
           msg.channel.sendMessage("Error!");
           return;
         }
         msg.channel.sendMessage(array[0].url);
    });
    commandUsed = true;
  }

  else if (command == "embed"){
    /*const embed = new Discord.RichEmbed()
      .setTitle('Very Nice Title')
      .setAuthor('Author Name', 'https://goo.gl/rHndF5')
    Alternatively, use '#00AE86', [0, 174, 134] or an integer number.
      .setColor(0x00AE86)
      .setDescription('The text of the body, essentially')
      .setFooter('Nice text at the bottom', 'https://goo.gl/hkFYh0')
      .setImage('https://goo.gl/D3uKk2')
      .setThumbnail('https://goo.gl/lhc6ke')
    Takes a Date object, defaults to current date.
      .setTimestamp()
      .setURL('https://discord.js.org/#/docs/main/indev/class/RichEmbed')
      .addField('Field Title', 'Field Value')
    Inline fields may not display as inline if the thumbnail and/or image is too big.
      .addField('Inline Field', 'Hmm 🤔', true)
    Blank field, useful to create some space.
      .addField('\u200b', '\u200b', true);*/

    let embed = new Discord.RichEmbed();
    let argLength = args.length;
    let flagUsed = false;
    let title;
    let r = 0;
    let g = 0;
    let b = 0;
    let text;
    for (let i = 0; i < argLength; i++){
      if (args[i] == "-text"){
        let nextFlagExists = 0;
        for (let j = i; j < argLength; j++){
          if ((args[j] == "-r" || args[j] == "-g" || args[j] == "-b" || args[j] == "-title" || args[j] == "-color") && nextFlagExists == 0){
            nextFlagExists = j;
          }
        }
        if (nextFlagExists == 0){
          text = args.slice(i + 1).join(" ");
        }else{
          text = args.slice(i + 1, nextFlagExists).join(" ");
        }
      }
      if (args[i] == "-title"){
        let nextFlagExists = 0;
        for (let j = i; j < argLength; j++){
          if ((args[j] == "-r" || args[j] == "-g" || args[j] == "-b" || args[j] == "-text" || args[j] == "-color") && nextFlagExists == 0){
            nextFlagExists = j;
          }
        }
        if (nextFlagExists == 0){
          title = args.slice(i + 1).join(" ");
        }else{
          title = args.slice(i + 1, nextFlagExists).join(" ");
        }
      }
      if (args[i] == "-color"){
        let nextFlagExists = 0;
        for (let j = i; j < argLength; j++){
          if ((args[j] == "-r" || args[j] == "-g" || args[j] == "-b" || args[j] == "-text" || args[j] == "-title") && nextFlagExists == 0){
            nextFlagExists = j;
          }
        }
        if (i < argLength){
            if (colors.has(args[i + 1])){
              r = colors.get(args[i + 1])[0];
              g = colors.get(args[i + 1])[1];
              b = colors.get(args[i + 1])[2];
            }
        }else{

        }
      }
      if (args[i] == "-r"){
        let nextFlagExists = 0;
        if (i < argLength){
          if (!isNaN(args[i + 1])){
            r = parseInt(args[i + 1]);
          }
        }else{

        }
      }
    if (args[i] == "-g"){
      let nextFlagExists = 0;
      if (i < argLength){
        if (!isNaN(args[i + 1])){
          g = parseInt(args[i + 1]);
        }
      }else{

      }
    }
    if (args[i] == "-b"){
      let nextFlagExists = 0;
      if (i < argLength){
        if (!isNaN(args[i + 1])){
          b = parseInt(args[i + 1]);
        }
      }else{

      }
    }
  }
    if (text){
      embed.setDescription(text);
    }
    embed.setColor([r, g, b]);
    if (title){
      embed.setTitle(title);
    }
    msg.channel.sendEmbed(embed);
    msg.delete();
  }

  else if(command == "eval") {
    try {
      var code = args.join(" ");
      var evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      msg.channel.sendCode("xl", evaled);
    } catch(err) {
      msg.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
  }

  else if (command == "prune"){
    if (isNaN(args[0])){
      msg.channel.sendMessage("Usage: `[p]clearreactions [-a] [number]`");
    }
    let messagecount = parseInt(args[0]);
    msg.channel.fetchMessages({limit: 100})
    .then(messages => {
      let msg_array = messages.array();
      msg_array = msg_array.filter(m => m.author.id === bot.user.id);
      msg_array.length = messagecount + 1;
      msg_array.map(m => m.delete().catch(console.error));
   });
  }
    
  else if (command == "clearreactions"){
    if (!msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){
      msg.channel.sendMessage("Error! Missing permission `MANAGE_MESSAGES`!");
      return;
    }
    if (args[0]){
      if (args[0] == "-a"){
        if (isNaN(args[1])){
          msg.channel.sendMessage("Usage: `[p]clearreactions [-a] [number]`");
        }
        let messagecount = parseInt(args[1]);
        msg.channel.fetchMessages({limit: 100})
        .then(messages => {
          let msg_array = messages.array();
          msg_array.length = messagecount + 1;
          msg_array.map(m => m.clearReactions().catch(console.error));
        });
        return;
      }
    }
    if (isNaN(args[0])){
      msg.channel.sendMessage("Usage: `[p]clearreactions [-a] [number]`");
    }
    let messagecount = parseInt(args[0]);
    msg.channel.fetchMessages({limit: 100})
    .then(messages => {
      let msg_array = messages.array();
      msg_array = msg_array.filter(m => m.author.id === bot.user.id);
      msg_array.length = messagecount + 1;
      msg_array.map(m => m.clearReactions().catch(console.error));
    });
  }
    
  else if (command == "wipe"){
    if (!msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")){
        msg.channel.sendMessage("Error! Missing permission `MANAGE_MESSAGES`!");
        return;
    }
    if (isNaN(args[0])){
      msg.channel.sendMessage("Usage: `[p]clearreactions [-a] [number]`");
    }
    let messagecount = parseInt(args[0]);
    msg.channel.fetchMessages({limit: 100})
    .then(messages => {
      let msg_array = messages.array();
      if (msg.mentions.users.first()){
        msg_array = msg_array.filter(m => m.author.id == msg.mentions.users.first().id);
      }
      msg_array.length = messagecount + 1;
      msg_array.map(m => m.delete().catch(console.error));
   });
  }

  else if (command == "botrestart"){
    msg.channel.sendMessage("Restarting!").then((m) => {
      process.exit("Restarting!");
    });
  }

  else if (command == "toemoji"){
    let charArray = args.join(" ").toLowerCase().split("");
    for (let i = 0; i < charArray.length; i++){
      if (textToEmoji.has(charArray[i])){
        charArray[i] = textToEmoji.get(charArray[i]);
      }
    }
    //setTimeout( () => { msg.edit(charArray.join("")) }, 50);
    msg.channel.sendMessage(charArray.join(""));
    msg.delete();
  }

  else if (command == "userid"){
  if (!msg.mentions.users.first()){
    msg.channel.sendMessage("`Usage: [p]userid @mention`");
    return;
  }
  let targetUser = msg.mentions.users.first().id;
  msg.channel.sendMessage("User ID of " + msg.mentions.users.first() + ": "+ targetUser);
  commandUsed = true;
  }

  else if (command == "setgame"){
    bot.user.setGame(args.join(" "));
    msg.channel.sendMessage("Game set to: " + args.join(" "));
  }

  if (command == "botdisable"){
    botEnable = false;
    msg.channel.sendMessage("Bot disabled!");
  }

  else if (shortcuts.has(command)){
    setTimeout( () => { msg.edit(shortcuts.get(command)) }, 50);
    return;
  }
}
});

bot.login(process.env.TOKEN);
