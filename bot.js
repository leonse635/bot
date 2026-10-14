const mineflayer = require('mineflayer');

// Настройки подключения
const botOptions = {
  host: 'orca.aternos.host',
  port: 30546,
  username: 'Mrbeast222',   // Ник бота
  version: '1.20.1',         // ВАЖНО: Укажите точную версию вашего сервера, если она отличается!
};

let bot;
let hasRegistered = false;

function createMinecraftBot() {
  bot = mineflayer.createBot(botOptions);

  // Когда бот успешно зашел в мир
  bot.on('spawn', () => {
    console.log(`[Успешно] Бот ${bot.username} заспавнился на сервере.`);

    // Автоматическая регистрация при первом входе
    if (!hasRegistered) {
      setTimeout(() => {
        bot.chat('/login 123qwe');
        console.log('[Авторизация] Отправлена команда регистрации в чат.');
        hasRegistered = true;
      }, 3000); // Задержка 3 секунды для прогрузки мира
    }
    
    // Защита от кика за АФК (прыжок каждые 20 секунд)
    setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }
    }, 20000);
  });

  // Вывод сообщений из чата в консоль Render
  bot.on('message', (jsonMsg) => {
    console.log(`[Чат сервера] ${jsonMsg.toString()}`);
  });

  // Логирование ошибок
  bot.on('error', (err) => {
    console.log('[Ошибка бот]:', err);
  });

  // Автоматическое переподключение при вылете
  bot.on('end', () => {
    console.log('[Отключение] Бот отключился от сервера. Переподключение через 10 секунд...');
    setTimeout(() => {
      createMinecraftBot();
    }, 10000);
  });
}

// Запуск процесса
createMinecraftBot();
