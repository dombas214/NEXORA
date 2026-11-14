# NEXORA — версия для Cloudflare Pages + Telegram

В этой версии не нужен отдельный проект Cloudflare Workers и не нужен URL `workers.dev`.
Форма отправляет заявку на относительный адрес `/api/submit`, который обслуживает Cloudflare Pages Function.

## Что находится в архиве
- `index.html`, `styles.css`, `script.js` — сайт.
- `_worker.js` — Cloudflare Pages Advanced Mode: принимает заявки на `/api/submit`, отправляет их в Telegram и отдаёт остальные файлы сайта через Pages Assets.

## Настройка Cloudflare Pages
1. Открой проект `nexora` в Cloudflare Dashboard.
2. Перейди в **Settings → Variables and Secrets**.
3. Добавь переменные для Production:
   - `TELEGRAM_BOT_TOKEN` — тип **Secret**, значение токена от BotFather.
   - `TELEGRAM_CHAT_ID` — значение ID чата, куда бот должен присылать заявки (можно Secret или обычной переменной).
4. Сохрани изменения.
5. Опубликуй содержимое архива в существующий Pages-проект. В этом архиве используется `_worker.js` (Advanced Mode), который поддерживается при Direct Upload/drag-and-drop. Файл `_worker.js` должен лежать в корне рядом с `index.html`.

## Важно про способ публикации
Обычная папка `functions` не компилируется при загрузке через dashboard drag-and-drop. Поэтому здесь используется Advanced Mode `_worker.js`, который Cloudflare Pages поддерживает при прямой загрузке. Не удаляй `_worker.js` и загружай файлы из корня архива, а не саму вложенную папку.

## Проверка
После публикации открой `https://ТВОЙ-ДОМЕН/api/submit`. Должен появиться JSON с `"ok":true` и `"service":"NEXORA Telegram notifier"`.
Затем отправь тестовую заявку с сайта. В Telegram должно прийти сообщение с именем, контактом, выбранной услугой, комментарием и временем.

Бот должен быть запущен пользователем через `/start` в личном чате. Не вставляй токен в HTML или `script.js` — он должен храниться только в Pages Secrets.
