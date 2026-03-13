<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d2da2d64-6d14-4eb9-8da0-df8d0da06abe

## Run Locally

**Prerequisites:** Node.js

1. Установи зависимости: `npm install`
2. Скопируй `.env.example` в `.env.local` и заполни переменные (Supabase и при необходимости Gemini).
3. Запуск: `npm run dev`

## Деплой на Vercel

1. Залей проект в GitHub и подключи репозиторий в [Vercel](https://vercel.com).
2. **Root Directory:** укажи папку с этим проектом (если он не в корне репозитория — например `cinemaprivé (1)`).
3. **Environment Variables** в настройках проекта добавь:
   - `VITE_SUPABASE_URL` — URL проекта Supabase
   - `VITE_SUPABASE_ANON_KEY` — anon (public) ключ Supabase
   - `VITE_APP_URL` — итоговый URL сайта (например `https://твой-проект.vercel.app`)
4. Деплой: Vercel сам подхватит Vite, соберёт `npm run build` и раздаст `dist`. Маршруты SPA настроены в `vercel.json`.
