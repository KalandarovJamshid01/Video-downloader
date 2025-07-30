import logging
import os
from aiogram import Bot, Dispatcher, types
from aiogram.types import Message
from aiogram.utils import executor
from config import BOT_TOKEN
from downloader import download_video

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)

@dp.message_handler(commands=['start'])
async def start_handler(message: Message):
    await message.reply(
        "👋 Salom! Men YouTube, TikTok va Instagram videolarini yuklab bera olaman.\n\n"
        "📝 Faqat video linkni yuboring."
    )

@dp.message_handler()
async def video_handler(message: Message):
    url = message.text.strip()
    await message.reply("⏳ Yuklab olinmoqda...")

    try:
        filepath = download_video(url)
        filesize = os.path.getsize(filepath)

        if filesize > 49 * 1024 * 1024:
            await message.reply("❌ Video hajmi 50MB dan katta, Telegram orqali jo‘natib bo‘lmaydi.")
        else:
            with open(filepath, "rb") as video:
                await message.reply_video(video)
    except Exception as e:
        await message.reply(f"❌ Yuklab olishda xatolik yuz berdi:\n{str(e)}")
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
