import logging

import telegram
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler


TOKEN = "6457589571:AAFjAPcwUrrySkEVzaWsbszMn3zdjSqI-IY"


logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    button = telegram.MenuButtonWebApp(
        text="Open Events Miniapp",
        web_app=telegram.WebAppInfo(url="https://events-miniapp.com")
    )
    await context.bot.set_chat_menu_button(chat_id=update.effective_chat.id, menu_button=button)


async def logout(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.log_out()


if __name__ == '__main__':
    builder = ApplicationBuilder().token(TOKEN)
    application = builder.build()

    start_handler = CommandHandler('start', start)

    application.add_handler(start_handler)

    application.run_polling()

