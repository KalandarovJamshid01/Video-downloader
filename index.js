const { Telegraf } = require('telegraf');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const bot = new Telegraf(process.env.BOT_TOKEN);
const limitPerUser = 5;
const userLimits = {};

bot.start((ctx) => {
  ctx.reply(
    `👋 Salom, ${ctx.from.first_name}!

` +
    'Men YouTube, TikTok va Instagram videolarini yuklab bera olaman.

' +
    '📌 Link yuboring — men sizga videoni qaytaraman.
' +
    '📥 Kunlik limit: 5 ta video.'
  );
});

bot.on('text', async (ctx) => {
  const url = ctx.message.text;

  if (!url.startsWith('http')) {
    return ctx.reply('❌ Iltimos, to‘g‘ri video havolasini yuboring.');
  }

  const userId = ctx.from.id;
  if (!userLimits[userId]) userLimits[userId] = 0;

  if (userLimits[userId] >= limitPerUser) {
    return ctx.reply('🚫 Siz bugun 5 ta video yuklab oldingiz. Ertaga qayta urinib ko‘ring.');
  }

  const filename = `video_${Date.now()}.mp4`;
  const filePath = path.join(__dirname, filename);

  ctx.reply('⏬ Yuklab olinmoqda, iltimos kuting...');

  exec(`yt-dlp -o "${filePath}" -f "mp4" "${url}"`, async (error, stdout, stderr) => {
    if (error) {
      console.error(error.message);
      return ctx.reply('❌ Video yuklab bo‘lmadi. Iltimos, boshqa link sinab ko‘ring.');
    }

    try {
      await ctx.replyWithVideo({ source: fs.createReadStream(filePath) });
      userLimits[userId]++;
    } catch (e) {
      console.error(e);
      ctx.reply('❌ Video yuborishda xatolik yuz berdi.');
    } finally {
      fs.unlinkSync(filePath); // clean up
    }
  });
});

bot.launch();
