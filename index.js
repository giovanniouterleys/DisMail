'use strict'
require('dotenv').config();
// node_modules initialization
const fs = require('fs');
const axios = require('axios'); 
var nodemailer = require('nodemailer');

const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

// bot connection
bot.login(TOKEN);


bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}`);
  });


// set your service, user & pass
var mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  }
});

// specify here how users should use the bot, e.g. 'send infos' to send a message to the computer science teacher
const errorMessage = new Discord.RichEmbed()
	.setColor('')
	.setTitle("")
	.setDescription("")
	.setTimestamp()
  .setFooter("");
  
 
bot.on('message', msg => {
  if(!(msg.channel.name=='mail')){ // we check if the channel is named: mail
    return;
  }
  if(!msg.content.startsWith('send')){ // send is the command for use the bot
    return;
  }
  var msgSplitted = msg.content.split(' '); 
  var msgLength = msgSplitted.length;
  var prof = msgSplitted[1];
  var mail_prof = "";
  var matiere = "";

  if(msgLength<2){
    msg.channel.send(errorMessage);
    return;//error message
  }

  switch(prof){
    case 'infos':
        mail_prof = 'example@example.fr';
        matiere = 'infos';
        break;      
    case 'physique':
      mail_prof = 'example@example.fr';
      matiere = 'physiqueapplique';
      break;
    case 'maths':
        mail_prof = 'example@example.fr';
        matiere = 'maths';
        break; 
    case 'cultureg':
        mail_prof = 'example@example.fr';
        matiere = 'cultureg';
        break;       
  }
  

  var nickname = msg.member['nickname'];
  msg.attachments.forEach(attachment => {
    const url = attachment.url;
    const extension = url.split('.');
    var lastItem = extension.pop();
    console.log(url);
    msg.delete();
    axios.get(url, {responseType: "stream"} )  
    .then(response => {  
        var dateObj = new Date();
        var month = ('0' + dateObj.getUTCMonth()+1).slice(-2);
        var day = ('0' + dateObj.getUTCDate()).slice(-2);
        var hour = ('0' + dateObj.getUTCHours()+2).slice(-2);
        var minute = ('0' + dateObj.getUTCMinutes()).slice(-2);
        var seconde = ('0' + dateObj.getUTCSeconds()).slice(-2);
        var milliseconde = dateObj.getUTCMilliseconds();
        var newdate = "_"+day +"-"+month+"-"+hour+"-"+minute+"-"+seconde+"-"+milliseconde+"_";
        var mailDate = day+"/"+month+" à "+hour+"h "+minute+"min "+seconde+" secondes";
        response.data.pipe(fs.createWriteStream(nickname+newdate+"_"+matiere+"."+lastItem));  

        var mailOptions = {
          from: 'example@example.fr', // your mail
          to: mail_prof, 
          subject: 'Exercices de '+nickname,
          text: "Bonjour, \n\n Ci-joint le travail de "+nickname + ".\n\nBonne journée. \n\n\nDate de l'envoi: "+mailDate+"\n\nCe message est envoyé depuis la boîte mail de la classe.\n Ce mail à pour but d'envoyer des mails depuis discord à nos professeurs en automatissant l'envoi.",
          attachments: [
                {   
                    filename: nickname+newdate+"_"+matiere+"."+lastItem,
                    path: nickname+newdate+"_"+matiere+"."+lastItem
                }
            ]
        }
        // call send mail
        mail.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            msg.reply(' le mail est bien envoyé!'); // reply confirmation email sent to the user
          }
    });
    })  
        .catch(error => {  
        console.log(error);
    }); 
  });
});


