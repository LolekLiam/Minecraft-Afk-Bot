const mc = require('mineflayer');
const mcView = require('prismarine-viewer').mineflayer
const config = require('./config.json');
const { yellow, green, red } = require('colorette');

// Connect to the server
function createBot() {
  const bot = mc.createBot({
    host: config.server.ip,
    port: config.server.port, // Replace with the server port
    username: config['bot-account']['username'],
    auth: config['bot-account']['type'],
    version: config.server.version,
  });
  
  // Check for deaths and errors
  bot.on('death', () => console.log(red(`${config['bot-account']['username']} has died and was respawned`)));
  bot.on('error', (err) => console.log(red(err)))
  
  // Listen for the "login" event
  bot.once('spawn', () => {
    console.log(yellow(`${config['bot-account']['username']} joined to ${config.server.ip}`));
    mcView(bot, { port: 6969, firstPerson: false })

    setInterval(() => {
       bot.look(bot.entity.yaw + 1, bot.entity.pitch, true);
    }, 100);
  });

  // Listen for all chat messages from the server
  bot.on('chat', (username, message) => {
    console.log(green(`CHAT: <${username}> ${message}`));
  });

  // Check for kicks and closing the viewer while reconnecting in 10 secs
  bot.on('kicked', (reason) => {
    if (bot.viewer) {
        bot.viewer.close();
    }
    const kickReasonObj = JSON.parse(reason);
    const actualKickReason = kickReasonObj.translate;
    console.log(red(`${config['bot-account']['username']} has been kicked from ${config.server.ip}, Reason: ${actualKickReason}`));
    console.log(red('Reconnecting in 10 seconds...'));
    setTimeout(createBot, 10000);
  });
}

createBot();