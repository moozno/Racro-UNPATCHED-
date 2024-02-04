const readline = require('readline');
const mineflayer = require('mineflayer');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
var figlet = require("figlet");
const {once} = require("events")
const gradient = require('gradient-string');
require('dotenv').config();
const { pathfinder, Movements, goals: { GoalFollow } } = require('mineflayer-pathfinder');
const { CategoryChannel } = require('discord.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function fetchUsernameFromMinecraftWebsite(ssid) {
  return axios
    .get('https://api.minecraftservices.com/minecraft/profile', {
      headers: {
        Authorization: 'Bearer ' + ssid,
      },
    })
    .then((response) => response.data)
    .catch(() => {
      throw new Error(chalk.red('Invalid SSID.'));
    });
}

async function main() {

    console.clear();

    console.log(gradient.vice.multiline`
███▄ ▄███▓▓██   ██▓ ██▀███   ▄▄▄     ▄▄▄█████▓    ██▀███   ▄▄▄       ▄████▄   ██▀███   ▒█████   
▓██▒▀█▀ ██▒ ▒██  ██▒▓██ ▒ ██▒▒████▄   ▓  ██▒ ▓▒   ▓██ ▒ ██▒▒████▄    ▒██▀ ▀█  ▓██ ▒ ██▒▒██▒  ██▒
▓██    ▓██░  ▒██ ██░▓██ ░▄█ ▒▒██  ▀█▄ ▒ ▓██░ ▒░   ▓██ ░▄█ ▒▒██  ▀█▄  ▒▓█    ▄ ▓██ ░▄█ ▒▒██░  ██▒ 
▒██    ▒██   ░ ▐██▓░▒██▀▀█▄  ░██▄▄▄▄██░ ▓██▓ ░    ▒██▀▀█▄  ░██▄▄▄▄██ ▒▓▓▄ ▄██▒▒██▀▀█▄  ▒██   ██░  
▒██▒   ░██▒  ░ ██▒▓░░██▓ ▒██▒ ▓█   ▓██▒ ▒██▒ ░    ░██▓ ▒██▒ ▓█   ▓██▒▒ ▓███▀ ░░██▓ ▒██▒░ ████▓▒░    
░ ▒░   ░  ░   ██▒▒▒ ░ ▒▓ ░▒▓░ ▒▒   ▓▒█░ ▒ ░░      ░ ▒▓ ░▒▓░ ▒▒   ▓▒█░░ ░▒ ▒  ░░ ▒▓ ░▒▓░░ ▒░▒░▒░    
░  ░      ░ ▓██ ░▒░   ░▒ ░ ▒░  ▒   ▒▒ ░   ░         ░▒ ░ ▒░  ▒   ▒▒ ░  ░  ▒     ░▒ ░ ▒░  ░ ▒ ▒░    
░      ░    ▒ ▒ ░░    ░░   ░   ░   ▒    ░           ░░   ░   ░   ▒   ░          ░░   ░ ░ ░ ░ ▒       
       ░    ░ ░        ░           ░  ░              ░           ░  ░░ ░         ░         ░ ░      `);

console.log(gradient.vice.multiline('                                         Welcome to Racro V2 AOTV'));
const ssid = process.env.SSID;

    try {
      const { name, id } = await fetchUsernameFromMinecraftWebsite(ssid);
      console.log(chalk.green(`Minecraft username: ${name}`));
      console.log(chalk.green(`Client Token: ${id}`));

      const bot = mineflayer.createBot({
        host: 'hypixel.net',
        port: 25565,
        version: '1.8.9',
        username: name,
        session: {
          accessToken: ssid,
          clientToken: id,
          selectedProfile: {
            id: id,
            name: name,
          },
        },
        auth: 'mojang',
        skipValidation: true,
      });

      bot.loadPlugin(pathfinder);
      const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))
 
      bot.on('messagestr', (message) => {
        const messageString = message.toString();
      
        // Exclude messages containing mana, defense, and health
        if (
          !messageString.includes('✎') &&
          !messageString.includes('❈') &&
          !messageString.includes('❤') &&
          !messageString.includes('+400 Bits from Cookie Buff!')
        ) {
          console.log(gradient.fruit.multiline(`${message.toString()}`));
        }
      });

      bot.once('login', async () => {
        console.log(chalk.yellow(`Logged in to Hypixel as ${bot.username}`));

        // Perform actions after logging in
        await sleep(2000); // Initial cooldown

        // Send chat commands once
        bot.chat('/language english');
        await sleep(3000);
        bot.chat('/play skyblock');
        await sleep(3000);
        bot.chat('/p leave');
        await sleep(2000);
        bot.chat('/warp dungeon_hub');
        await sleep(3000);
      
      bot.loadPlugin(pathfinder)

      async function logToWebhook(embed) {
        const webhookUrl = process.env.WEBHOOK_URL;
      
        try {
          const response = await axios.post(webhookUrl, { embeds: [embed] });
          console.log('Log successfully sent to webhook.');
          console.log('Response:', response.data);
        } catch (error) {
          console.error('Error sending log to webhook:', error);
        }
      }

      bot.on('messagestr', async (message) => {
        const messageString = message.toString();
        if (messageString.includes('Party Finder > Your group has been removed from the party finder!')) {
          bot.chat('/is');
          await sleep(2000); // Wait for 2 seconds
          bot.chat('/warp dungeon_hub');
          await sleep(3000); // Wait for 2 seconds
          sneakEquipAndHitMort();
        }
      });
      
      bot.on('messagestr', async (message) => {
        const messageString = message.toString();
        if (messageString.includes('Your active Potion Effects have been paused and stored. They will be restored when you leave Dungeons! You are not allowed to use existing Potion Effects while in Dungeons.')) {
          bot.chat('/hub');
          console.log("Going to Hub.");
          await sleep(2000); // Wait for 2 seconds
          bot.chat('/warp dungeon_hub');
          console.log("Warping to Dungeon Hub.");
          await sleep(2000); // Wait for 2 seconds
          bot.chat('/p leave');
          console.log("Leaving Party.");
          await sleep(3000); // Wait for 2 seconds
          sneakEquipAndHitMort();
        }

      });

          bot.on('messagestr', async (message) => {
            const messageString = message.toString();
            if (messageString.includes('joined the dungeon group!')) {
              // Execute the actions hat commands
              bot.chat('/is');
              await sleep(2000); // Wait for 2 seconds
              bot.chat('/p warp');
              await sleep(2000); // Wait for 2 seconds
              bot.chat('/warp dungeon_hub');
              await sleep(2000); // Wait for 2 seconds
              const embed = new EmbedBuilder()
              .setTitle('Racro V2')
              .setDescription('Someone has joined the Dungeon Queue.')
              .setFooter({ text: 'Powered by MyRAT', iconURL: 'https://i.postimg.cc/2SrnZ4L9/my-Rat-Logo.png' });
            // Send the embed to the webhook
              await logToWebhook(embed);
              await sleep(2000);
              sneakEquipAndHitMort();
            }
          });

          bot.on("kicked", async function(permissions, canCreateDiscussions) {
            var p = JSON.parse(permissions);
            var size = p.extra[0].text;
            if (url) {
              const embed = new EmbedBuilder()
                .setTitle('Racro V2')
                .setDescription('Bot has been kicked from the server.')
                .addField('Reason', size)
                .setFooter({ text: 'Powered by MyRAT', iconURL: 'https://i.postimg.cc/2SrnZ4L9/my-Rat-Logo.png' });
          
              // Send the embed to the webhook
              try {
                await axios.post(url, {
                  embeds: [embed]
                });
              } catch (error) {
                console.log("Invalid WEBHOOK.");
              }
            }
            console.log("Bot has been kicked: " + permissions);
            process.exit();
          });

          bot.on('messagestr', async (message) => {
            const messageString = message.toString();
            if (messageString.includes('You were kicked while joining that server!')) {
              await sleep(2000);
              bot.chat('/lobby');
              await sleep(2000); // Wait for 2 seconds
              bot.chat('/play skyblock');
              await sleep(2000);
              bot.chat('/warp dungeon_hub');
              await sleep(3000);
            }
          });

          async function sneakEquipAndHitMort() {
            bot.setControlState('sneak', true);
            await sleep(1000)
            bot.setQuickBarSlot(0);
            bot.activateItem(false);
            bot.setControlState('sneak', false);
            await sleep(1000)
              bot.attack(bot.nearestEntity());
              await sleep(500)
              console.log(chalk.green("[MyRAT RacroV2] Clicked on Mort."));
              await sleep(50)
        }
        
          async function StartQueue() {
            let clickOrder = [11, 14, 45, 32];
            let index = 0;
          
            bot.on('windowOpen', async (window) => {
              try {
                const slot = clickOrder[index];
                await sleep(500);
                window.requiresConfirmation = false; 
                await bot.clickWindow(slot, 0, 0);
                console.log(chalk.greenBright(`[MyRAT RacroV2] Clicked on Slot ${slot}`));
                index++;
                if (index >= clickOrder.length) {
                  index = 0;
                }
              } catch (error) {
                console.error('An error occurred:', error);
                index++;
                if (index >= clickOrder.length) {
                  index = 0;
                }
              }
            });
          }
            StartQueue();
        sneakEquipAndHitMort();
    });

      rl.close();
    } catch (error) {
      console.error(chalk.red(error));
      rl.close();
    }
  };


main();