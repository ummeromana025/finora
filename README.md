# Finora: Digital Banking Dashboard
React + TypeScript + Vite + Tailwind v4, Zustand, TanStack Query, React Hook Form + Zod, Recharts.

## Run
npm install && npm run dev

Login with any email + 6+ char password. An email containing "admin" opens the Admin panel.

## Features
Auth + protected/role routes, dashboard charts, transactions table (search, filter, sort, pagination, CSV), multi-step transfer, flip card with freeze, budgets, dark mode, responsive layout.

## Also included
Signup + OTP (demo code 123456), forgot password, Settings (tabs), Modal/Tabs/Toast, Ctrl+K palette, beneficiaries, savings goals, Vitest test (`npm test`), GitHub Actions CI.

## Round 3
Transaction details drawer, category/date filters synced to the URL, notifications dropdown, USD/PKR switcher, idle-session warning, lazy-loaded routes, admin analytics with suspend/activate.

## Round 4 (advanced)
Insights (forecast, anomaly detection, savings rate), recurring payments with due dates, multi-currency accounts with FX fee and validation, optimistic transfer with rollback, error boundary, offline banner, Framer Motion page transitions, unit tests for analytics/FX logic.
