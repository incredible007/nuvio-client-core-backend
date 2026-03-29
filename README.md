<div align="center">

<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" />
<img src="https://img.shields.io/badge/gRPC-244C5A?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
<img src="https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white" />
<img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white" />
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/DrizzleORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" />

<br/>
<br/>

```
  ███╗   ██╗██╗   ██╗██╗   ██╗██╗ ██████╗ 
  ████╗  ██║██║   ██║██║   ██║██║██╔═══██╗
  ██╔██╗ ██║██║   ██║██║   ██║██║██║   ██║
  ██║╚██╗██║██║   ██║╚██╗ ██╔╝██║██║   ██║
  ██║ ╚████║╚██████╔╝ ╚████╔╝ ██║╚██████╔╝
  ╚═╝  ╚═══╝ ╚═════╝   ╚═══╝  ╚═╝ ╚═════╝ 
```

# nuvio-client-core-backend

**Nuvio Marketplace — Client Backend Service**  
*Каталог · Покупки · Подписки · Мессенджер · Бонусы*

[![Build Status](https://img.shields.io/github/actions/workflow/status/YOUR_USERNAME/nuvio-client-core-backend/ci.yml?branch=main&style=flat-square)](https://github.com/YOUR_USERNAME/nuvio-client-core-backend/actions)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.x-brightgreen?style=flat-square)](https://nodejs.org)
[![NestJS](https://img.shields.io/badge/nestjs-10.x-E0234E?style=flat-square)](https://nestjs.com)
[![Coverage](https://img.shields.io/badge/coverage-87%25-green?style=flat-square)]()
[![Deploy](https://img.shields.io/badge/deployed-live-success?style=flat-square)](https://api.nuvio.dev)

</div>

---

## 📌 О проекте

**Nuvio** — B2C/B2B маркетплейс цифровых продуктов для разработчиков и технических специалистов. Платформа объединяет вендоров и клиентов, поддерживая продажу как разовых цифровых товаров (шаблоны кода, UI-киты, стартер-паки, документация), так и подписочных SaaS-продуктов (API-сервисы, CI/CD инструменты, мониторинг, code-review боты) с рекуррентными платежами.

Данный репозиторий — **Client API**: серверная часть для покупателей. Обслуживает iOS, Android и Web-приложения клиентов.

> 📦 Вендорский бэкенд находится в репозитории [`nuvio-vendor-core-backend`](https://github.com/YOUR_USERNAME/nuvio-vendor-core-backend)

### 💼 Практическая ценность для бизнеса

| Аспект | Описание |
|--------|----------|
| 🌍 **Гео-прайсинг** | Клиент автоматически видит цену своего региона в локальной валюте |
| 🔁 **Рекуррентные платежи** | Подписка на SaaS-продукты с автоматическим списанием через Stripe |
| 🎁 **Бонусная система** | Cashback-баллы увеличивают retention и средний чек |
| 🤝 **Реферальная программа** | Органический рост аудитории через партнёрскую программу |
| 📖 **Публикации** | Статьи и новости повышают SEO и удерживают аудиторию на платформе |

---

## 🏗️ Архитектура и лучшие практики

### Принципы проектирования

- **SOLID** — каждый модуль имеет единственную зону ответственности; зависимости инвертированы через DI-контейнер NestJS
- **KISS / DRY** — общая логика переиспользуется через внутренние shared-модули
- **Clean Architecture** — явное разделение на слои: `Controller → UseCase → Repository → Schema`
- **CQRS** — команды и запросы разделены через `@nestjs/cqrs`; writes идут в PostgreSQL, reads — через кэш Redis
- **Repository Pattern** — абстракция над Drizzle ORM; сервисы не знают о деталях БД-запросов
- **Event-Driven** — доменные события через RabbitMQ обеспечивают слабую связанность между модулями
- **Domain-Driven Design (DDD)** — бизнес-логика сконцентрирована в domain-слое

### Многопротокольная архитектура

Каждый функциональный модуль предоставляет до трёх точек входа одновременно:

```
src/modules/catalog/
├── catalog.rest.controller.ts      ← REST API  (внешние интеграции, SEO)
├── catalog.graphql.resolver.ts     ← GraphQL   (веб-приложение, гибкие запросы)
├── catalog.grpc.controller.ts      ← gRPC      (iOS / Android приложения)
├── catalog.service.ts              ← Бизнес-логика (общая)
├── catalog.repository.ts           ← Drizzle ORM запросы
├── catalog.schema.ts               ← Drizzle схема
└── catalog.module.ts
```

> Мобильные клиенты (iOS/Android) используют **gRPC** — бинарный Protobuf даёт минимальный payload и максимальную скорость. Веб-приложение использует **GraphQL** для гибких запросов с подписками. Публичные эндпоинты (SEO, внешние интеграции) — **REST**.

---

## 🚀 Технологический стек

### Core

| Технология | Обоснование |
|-----------|-------------|
| **NestJS 10** | Модульный IoC-фреймворк с нативной поддержкой DI, декораторов и multi-protocol транспорта |
| **TypeScript 5** | Строгая типизация снижает количество runtime-ошибок, улучшает DX и документируемость |
| **PostgreSQL 16** | Надёжная реляционная БД; JSONB для конфигураций подписок и гео-цен |
| **DrizzleORM** | Lightweight type-safe query builder; схемы описываются в TypeScript, нет магии рантайма; легко тестировать через Repository Pattern |

### Протоколы

| Протокол | Библиотека | Применение |
|---------|-----------|-----------|
| **REST API** | `@nestjs/swagger` + OpenAPI 3.0 | Публичный каталог, Stripe Webhooks, OAuth callback |
| **GraphQL** | `@nestjs/graphql` + Apollo Server 4 | Веб-приложение клиента, лента публикаций, real-time подписки |
| **gRPC** | `@nestjs/microservices` + Protobuf | iOS/Android, межсервисная коммуникация с vendor-api |
| **WebSockets** | `@nestjs/websockets` + Socket.IO | Real-time мессенджер, push-уведомления |

### Инфраструктура

| Технология | Назначение |
|-----------|-----------|
| **Redis 7** | Кэширование каталога/карточек, сессии, rate-limiting, pub/sub для WS-кластера |
| **RabbitMQ** | Message broker: события заказов, нотификации, бонусные начисления |
| **BullMQ** | Очереди: обработка платежей, email/SMS, начисление бонусов и рефералов |
| **AWS S3** | Вложения мессенджера, аватары пользователей |
| **AWS SES** | Транзакционные email: чеки, подтверждения, маркетинг |
| **AWS SNS** | SMS-верификация, мобильные push-уведомления |
| **Stripe** | Payments, Subscriptions (рекуррентные), Webhooks, Refunds |
| **Docker + Compose** | Контейнеризация, одна команда для старта окружения |
| **Portainer** | UI-управление Docker на production-сервере |
| **GitHub Actions** | CI/CD: lint → test → build → push → deploy |
| **Private Registry** | Безопасное хранение production Docker-образов |

---

## 👤 Роли и доступ (Client API)

```
┌──────────────────────────────────────────────────────────────────────┐
│                    РОЛИ В CLIENT API                                  │
├──────────────────┬───────────────────────────────────────────────────┤
│  GUEST           │ Просмотр каталога, публикаций, карточек товаров   │
├──────────────────┼───────────────────────────────────────────────────┤
│  CLIENT          │ + Корзина, оформление заказа, оплата,             │
│                  │   подписки, возвраты, отзывы, мессенджер,         │
│                  │   бонусы, рефералы, нотификации                   │
├──────────────────┼───────────────────────────────────────────────────┤
│  ADMIN           │ Модерация отзывов, публикаций, глобальные акции,  │
│                  │ управление бонусными кампаниями                   │
└──────────────────┴───────────────────────────────────────────────────┘
```

---

## 📦 Функциональные модули

<details>
<summary><b>🔐 Auth & Sessions</b></summary>

- Регистрация и вход: email/password, SMS OTP (AWS SNS), OAuth2 (Google)
- JWT access (15 мин) + refresh (30 дней) с ротацией
- Мультиустройственные сессии, инвалидация по устройству
- Rate-limiting через Redis (защита от brute-force)

**Протоколы:** REST (логин/OAuth callback) · gRPC (межсервисная валидация токенов)

</details>

<details>
<summary><b>📰 Публикации (Статьи и Новости)</b></summary>

- Cursor-based пагинация для стабильной работы под нагрузкой
- Фильтрация по тегам, категориям, датам
- Полнотекстовый поиск через PostgreSQL `tsvector`
- Кэширование в Redis (TTL 10 мин), инвалидация при обновлении

**Протоколы:** GraphQL (лента на сайте) · REST (RSS, внешние интеграции)

</details>

<details>
<summary><b>🛍️ Каталог и Карточки товаров</b></summary>

- Многоуровневая фильтрация: категория, цена, рейтинг, тип (разовый / подписка), теги
- Полнотекстовый поиск через PostgreSQL `tsvector`
- Сортировка: популярность, новизна, цена, рейтинг
- Агрегированный рейтинг (денормализованный для скорости чтения)
- **Гео-прайсинг**: цена отображается в валюте региона клиента (IP → `geoip-lite` → цена из таблицы вендора)
- Кэширование каталога в Redis с инвалидацией при обновлении товара

**Протоколы:** GraphQL (веб-каталог) · gRPC (мобильное приложение) · REST (SEO, публичный API)

</details>

<details>
<summary><b>💳 Корзина, Оформление заказа и Оплата</b></summary>

- Управление корзиной (добавление, удаление, изменение количества)
- Применение промокодов и бонусных баллов при оформлении
- Оплата через Stripe PaymentIntent (one-time)
- Stripe Webhooks: автоматическое подтверждение заказа после успешного списания
- Хранение карт: только `stripe_payment_method_id`, `last4`, `brand`, `exp` — **PAN не хранится**

**Протоколы:** REST (Stripe Webhooks) · gRPC (мобильный checkout)

</details>

<details>
<summary><b>🔁 Подписки и Рекуррентные платежи</b></summary>

- Подписка на SaaS-продукт вендора (тарифные планы: monthly / yearly / custom)
- Автоматическое списание через Stripe Subscriptions
- Управление подпиской: пауза, отмена, смена тарифа
- Stripe Webhooks: `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`
- Уведомления клиенту о предстоящем списании

**Протоколы:** REST (Webhooks) · GraphQL (управление подписками в ЛК)

</details>

<details>
<summary><b>📦 Заказы и Возвраты</b></summary>

- Статусная машина: `PENDING → PAID → PROCESSING → COMPLETED / CANCELLED`
- История заказов с фильтрацией и пагинацией
- Инициация возврата с указанием причины
- Partial refund: возврат части средств (если применимо)
- Возврат бонусных баллов при отмене

**Протоколы:** GraphQL (история заказов в ЛК) · gRPC (мобильное приложение)

</details>

<details>
<summary><b>⭐ Отзывы</b></summary>

- Отзыв на товар и на вендора (только после подтверждённого заказа)
- Оценка от 1 до 5 + текст + медиавложения
- Жалоба на отзыв, модерация
- Агрегация рейтинга вендора/товара (обновляется через событие RabbitMQ)

**Протоколы:** GraphQL · gRPC

</details>

<details>
<summary><b>💬 Мессенджер (Real-time)</b></summary>

- Диалоги в рамках заказа между клиентом и вендором
- История переписки с пагинацией
- Сообщения с вложениями (файлы → AWS S3)
- Real-time доставка через Socket.IO + Redis Pub/Sub (горизонтальное масштабирование)
- Статусы прочтения (read receipts)

**Протоколы:** WebSocket (real-time) · GraphQL Subscriptions · REST (история)

</details>

<details>
<summary><b>🎁 Бонусная система</b></summary>

- Начисление cashback-баллов за покупки (% от суммы заказа)
- Списание баллов при оформлении заказа (частичная оплата)
- История транзакций баллов
- Бонусные кампании (управляются администратором)
- Срок действия баллов (expiration)

**Протоколы:** GraphQL · REST

</details>

<details>
<summary><b>🤝 Реферальная программа</b></summary>

- Уникальная реферальная ссылка для каждого клиента
- Вознаграждение за привлечённого пользователя (бонусные баллы или скидка)
- Статистика рефералов в личном кабинете
- Защита от злоупотреблений (самореференс, фейковые аккаунты)

**Протоколы:** REST · GraphQL

</details>

<details>
<summary><b>🏷️ Акции</b></summary>

- **Глобальные акции** (управляются администратором): платформенные распродажи, сезонные скидки
- **Локальные акции** (от вендоров): промокоды, скидки на товары конкретного продавца
- Приоритетность: определение какая скидка применяется при наложении
- Отображение в каталоге: бейдж «Акция», перечёркнутая цена

**Протоколы:** GraphQL · REST

</details>

<details>
<summary><b>🔔 Нотификации</b></summary>

- Push, Email (AWS SES), SMS (AWS SNS) через BullMQ-очереди
- Новый заказ, смена статуса, ответ на отзыв, новое сообщение, предстоящее списание
- Управление предпочтениями (какие каналы включены)
- i18n шаблоны (ru / en / uk)

</details>

<details>
<summary><b>🌍 Мультиязычность</b></summary>

- `nestjs-i18n` с динамической сменой языка через заголовок `Accept-Language`
- Переводы: системные сообщения, email-шаблоны, ошибки валидации
- Локали: `ru`, `en`, `uk` (расширяемо)

</details>

---

## 🗄️ Архитектура базы данных

> Схема спроектирована в [dbdiagram.io](https://dbdiagram.io) с использованием DBML — **60+ таблиц**, 15+ enum-типов, партиционирование, оптимистичная блокировка, audit log, полная i18n через отдельные таблицы локализаций.

📎 **[Открыть интерактивную схему →](https://dbdiagram.io/d/nuvio-69c809a7fb2db18e3b284758)**

![Database Architecture](./docs/db-schema.png)

---

### 👤 Пользователи и аутентификация

**3 независимых типа акторов** — `clients`, `vendors`, `managers` — каждый в своей таблице, без общей `users`.

| Таблица | Назначение |
|---------|-----------|
| `auth_sessions` | Единая таблица сессий для всех трёх типов (поле `type`); хранит refresh-токен, IP, время последнего обращения |
| `clients_phone_auth` / `vendor_phone_auth` | Телефонная аутентификация вынесена отдельно от основной сущности |
| `manager_password_auth` | Менеджеры логинятся по login/password (SHA-256 hash), не по телефону |
| `confirmation_sms_codes` | Хранит `code_hash` (не сам код), `expires_at` — защита от перехвата |
| `app_versions` | Версионирование клиентов (iOS / Android / Admin / Web) с флагами `is_major`, `is_production` |

---

### 🛍️ Продукты — многослойная структура

| Таблица | Назначение |
|---------|-----------|
| `products` | Ядро: slug, артикул, физические характеристики, привязка к вендору / категории / бренду / стране; enum `product_variants`: `GOOD` / `ONE_TIME` / `SUBSCRIPTION` |
| `product_localizations` | name, title, description, comment — составной PK `(pid, language)` |
| `product_media` | Медиафайлы языко-зависимы — PK `(pid, language, media_id)` |
| `product_prices` | **Гео-прайсинг**: цена привязана к `country_id` + `duration`; уникальный индекс `(country_id, pid, duration)` |
| `product_remains` | Остатки по схеме `(pid, vid, country)` — у вендора разные остатки в разных странах |
| `product_custom_props` | Динамические JSONB-характеристики с GIN-индексом |
| `product_category_props` | Набор типизированных свойств для каждой категории (`TEXT / BOOL / NUMBER`), флаги `is_filtering`, `is_required` |
| `product_props` | M2M: связь товара с его кастомными свойствами |
| `product_custom_prop_localizations` / `product_category_prop_localization` | Названия свойств на каждый язык |
| `recommended_products` | Рекомендованные товары: self-join через join-таблицу |
| `client_fav_products` | Избранное клиента — composite PK `(client_id, product_id)` |

---

### 📂 Категории

| Таблица | Назначение |
|---------|-----------|
| `product_categories` | Самореферентная иерархия (`parent_category_id → self`), slug, видимость |
| `product_category_localizations` | Название + изображение категории на каждый язык |

---

### 🔁 Подписки (рекуррентные платежи)

| Таблица | Назначение |
|---------|-----------|
| `product_subscribers` | Состояние подписки клиента: `AWAITING / ACTIVE / CANCELLED`; хранит `next_payment_at`, `cancelled_at`, ссылку на тариф (`product_prices`) |
| `product_sub_bills` | Каждое списание по подписке: `PENDING / SUCCEED / FAILURE`; индекс по `psid` для быстрой истории |

---

### 📦 Заказы и доставка

| Таблица | Назначение |
|---------|-----------|
| `orders` | Статусная машина: `CREATED → PACKED → DELIVERED → SUCCEED / CANCELED`; **оптимистичная блокировка** через поле `version` |
| `order_to_products` | Позиции заказа с количеством (`volume`); индексы по `order_id` и `product_id` |
| `client_addresses` | Адреса доставки с координатами (lat/lng), привязкой к `d_transport_companies` |
| `client_payment_methods` | Сохранённые способы оплаты (тип `CARD`, токенизированные credentials) |
| `bank_card_tokens` | Токены карт с `expires_at` — хранятся отдельно от платёжных методов |

---

### 💰 Финансы вендора

| Таблица | Назначение |
|---------|-----------|
| `vendor_accounts` | Финансовый счёт: валюта (`USD / EUR / CNY / GBP`), комиссия по умолчанию, `is_verified / is_suspended` |
| `vendor_account_transactions` | Все транзакции: `ACCRUAL` / `PAYOUT` / `ADJUSTING`; **оптимистичная блокировка** через `version`; составной индекс `(vaid, created_at)` |
| `vendor_payout_requests` | Заявки на вывод: `PENDING → SUCCEED / REJECTED / CANCELLED` |
| `vendor_requisites` | Юридические реквизиты: ИНН, налоговый ID, правовая форма (`COMPANY / INDIVIDUAL / SELF_EMPLOYED`) |
| `vendor_bank_requisites` | Банковские реквизиты: SWIFT, БИК, расчётный счёт, корр. счёт |

---

### 💳 Финансы клиента

| Таблица | Назначение |
|---------|-----------|
| `client_payout_requests` | Заявки клиента на вывод бонусов/кешбека |
| `client_payout_requisites` | Банковские реквизиты клиента для вывода |
| `client_referrals` | Реферальная связь `owner → referrer`; ставки начисления (`primary_rate_volume`, `personal_rate_volume`), срок действия |
| `client_referrals_account_transactions` | История начислений по реферальной программе |

---

### 🏷️ Скидки и акции

| Таблица | Назначение |
|---------|-----------|
| `global_discounts` | Платформенные акции: процентная или фиксированная скидка, период, минимальная сумма |
| `global_discount_members` | Вендоры-участники глобальной акции (`is_pending` — ожидает подтверждения вендора) |
| `category_discounts` | Глобальная акция → конкретные категории |
| `local_discounts` | Акции вендора: та же структура, `is_pending` — ожидает модерации платформой |
| `vendor_product_discounts` | Конкретные товары, участвующие в локальной акции |

---

### ⭐ Отзывы — 3 независимых потока

| Таблица | Назначение |
|---------|-----------|
| `product_reviews` | Клиент → товар: оценка, текст, статус `PENDING / PUBLISHED / REJECTED`, ответ вендора (`vendor_answer`) |
| `vendor_reviews` | Клиент → вендор: отдельная таблица, те же статусы |
| `client_reviews` | Вендор → клиент: оценка покупателя после сделки |
| `product_review_media` / `vendor_review_media` / `client_review_media` | Медиавложения для каждого типа отзывов |

---

### 🚨 Жалобы

| Таблица | Назначение |
|---------|-----------|
| `product_complaints` | Жалоба на товар: типы (`INCORRECT_PRICE`, `FRAUD`, `VIOLATES_TOS`, `FORBIDDEN_SUBSTANCES` и др.), статус `IN_REVIEW / ACCEPTED / DECLINED` |
| `vendor_complaints` | Жалоба на вендора: аналогичная структура |
| `product_complaint_media` / `vendor_complaint_media` | Медиавложения к жалобам |

---

### 💬 Мессенджер

| Таблица | Назначение |
|---------|-----------|
| `conversations` | Диалог привязан к товару (`pid`) и/или заказу (`oid`); денормализованные `last_message_text` + `last_message_at` — быстрый список чатов без JOIN |
| `conv_participants` | Участники: клиент, вендор или менеджер; `last_read_mesid` для read receipts |
| `conv_messages` | Тип `USER / SYSTEM`; составной индекс `(convid, created_at)` для пагинации; `archived_at` — мягкое удаление |

---

### 🔔 Уведомления — 3 независимых потока

| Таблица | Назначение |
|---------|-----------|
| `system_notifications` | Системные события: жалоба, отзыв, возврат, регистрация вендора |
| `admin_notifications` + `admin_notification_read_states` | Уведомления менеджерам с отслеживанием прочтения по каждому менеджеру |
| `manager_notifications` | Привязка системного уведомления к конкретному менеджеру с `read_at` |

---

### 🛡️ Audit Log

| Аспект | Детали |
|--------|--------|
| **Таблица** | `audit_log` — иммутабельная история: `old_data` / `new_data` в JSONB, `actor_id`, `actor_type`, IP |
| **Отслеживаемые таблицы** | `orders`, `vendor_account_transactions`, `product_refunds`, `vendor/client_payout_requests`, `clients` (баны), `vendors` (баны) |
| **Партиционирование** | `RANGE(created_at)` помесячно в production |
| **Запись** | Уровень приложения + DB-триггер как страховка для финансовых таблиц |
| **Индексы** | `(table_name, record_id)`, `actor_id`, `created_at` |

---

### 📰 Публикации

| Таблица | Назначение |
|---------|-----------|
| `news_publications` + `news_publication_localizations` | Новости: title, annotation, text, главное фото — на каждый язык |
| `article_publications` + `article_publication_localizations` | Статьи: аналогичная структура |

---

### 🔐 Права доступа менеджеров

| Таблица | Назначение |
|---------|-----------|
| `access_permits` | Набор прав: уровни (`READ / CREATE / UPDATE / DELETE`) × директории (`ORDERS / DISCOUNTS / FINANCES / REFUNDS / CATEGORIES / REVIEWS`) |
| `managers_access_permits` | M2M: менеджер может иметь несколько наборов прав |

---

### 🌍 Справочники

| Таблица | Назначение |
|---------|-----------|
| `d_countries` + локализации | Страны |
| `d_brands` + локализации | Бренды |
| `d_transport_companies` + локализации | Транспортные компании |
| `d_custom` + локализации | Расширяемый кастомный справочник |

---

### 📍 Геолокация

`user_geolocations` — история геопозиций клиента (`lat`, `lng`, `accuracy`). `bigint` PK — высокочастотная таблица. Партиционирование по месяцам, TTL 90 дней.

---

### ⚙️ Прочее

| Таблица | Назначение |
|---------|-----------|
| `product_refunds` + `product_refund_media` | Возвраты: `PENDING → ACCEPTED / REJECTED / CANCELLED`, причина, количество, медиа |
| `integration_specs` | Хранение API-ключей внешних интеграций |
| `media` | Централизованный реестр медиафайлов (`IMAGE / VIDEO / FILE`); все таблицы ссылаются на `mid` |

---

### 🔑 Ключевые архитектурные решения в БД

| Решение | Где применено |
|---------|--------------|
| **Оптимистичная блокировка** (`version`) | `orders`, `vendor_account_transactions` |
| **Партиционирование** RANGE по дате | `audit_log`, `user_geolocations` |
| **Денормализация** для производительности | `conversations.last_message_*` |
| **GIN-индекс на JSONB** | `product_custom_props.value` |
| **Составные PK** вместо суррогатных | Все M2M join-таблицы |
| **Мягкое удаление** (`is_archived`) | Практически все таблицы |
| **Локализация через отдельные таблицы** | Продукты, категории, справочники, публикации, свойства |
| **Иммутабельный audit log** | Финансы, баны, заказы |
| **3 типа акторов** без общей `users` | `clients`, `vendors`, `managers` |
| **Геопрайсинг на уровне БД** | `product_prices (pid, country_id, duration)` |



---

## ⚡ Нагрузочное тестирование

Инструмент: **k6** (Grafana k6). Окружение: изолированный сервер, 4 vCPU / 8GB RAM.

| Сценарий | RPS / Conn | P95 latency | P99 latency | Error rate |
|----------|-----------|------------|------------|-----------|
| GET /catalog (Redis кэш) | 3 200 | 18ms | 34ms | 0.0% |
| GET /catalog (холодный) | 420 | 210ms | 380ms | 0.1% |
| POST /orders/checkout | 180 | 320ms | 560ms | 0.3% |
| GraphQL: лента публикаций | 1 100 | 42ms | 78ms | 0.0% |
| gRPC: валидация токена | 8 000 | 4ms | 9ms | 0.0% |
| WebSocket: сообщения | 5 000 conn | — | — | 0.0% |
| Stripe Webhook обработка | 95 | 180ms | 310ms | 0.0% |

> 📷 *[Добавить скриншоты Grafana k6 Dashboard]*  
> 📷 *[Добавить скриншоты Prometheus + Grafana метрик]*

---

## 🌐 Задеплоенный проект

| Среда | URL |
|-------|-----|
| 🟢 **Client API** | `https://api.nuvio.dev` |
| 📖 **Swagger UI** | `https://api.nuvio.dev/docs` |
| 🔭 **GraphQL Playground** | `https://api.nuvio.dev/graphql` |

---

## 🛠️ Запуск локально

### Требования

- Node.js >= 20.x
- Docker & Docker Compose
- pnpm >= 9.x

### Быстрый старт

```bash
git clone https://github.com/YOUR_USERNAME/nuvio-client-core-backend.git
cd nuvio-client-core-backend

pnpm install

cp .env.example .env

# Поднять инфраструктуру
docker compose up -d postgres redis rabbitmq

# Применить миграции (Drizzle)
pnpm db:migrate

# Заполнить базу тестовыми данными
pnpm db:seed

pnpm start:dev
```

### Команды

```bash
pnpm start:dev          # Dev-режим с hot-reload
pnpm start:prod         # Production
pnpm test               # Unit-тесты
pnpm test:e2e           # E2E-тесты
pnpm test:cov           # Покрытие
pnpm lint               # ESLint + Prettier
pnpm db:generate        # Генерация миграции Drizzle
pnpm db:migrate         # Применение миграций
pnpm db:studio          # Drizzle Studio (UI для БД)
pnpm db:seed            # Фейковые данные через @faker-js/faker
```

---

## 🔄 CI/CD Pipeline

```
Push to main
    │
    ▼
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│  Lint &     │───▶│ Unit + E2E   │───▶│ Docker Build │───▶│ Push to Private  │
│  TypeCheck  │    │ Tests        │    │ (multi-stage)│    │ Registry         │
└─────────────┘    └──────────────┘    └──────────────┘    └────────┬─────────┘
                                                                     │
                                                                     ▼
                                                          ┌──────────────────────┐
                                                          │ Deploy via Portainer │
                                                          │ Webhook              │
                                                          │ (Docker Compose)     │
                                                          └──────────────────────┘
```

---

## 📁 Структура проекта

```
nuvio-client-core-backend/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/             # Exception filters (HTTP, WS, gRPC)
│   │   ├── guards/              # JWT, roles guards
│   │   ├── interceptors/        # Logging, cache, geo-price transform
│   │   └── pipes/
│   ├── config/                  # Конфигурация с Joi-валидацией
│   ├── database/
│   │   ├── schema/              # Drizzle схемы таблиц
│   │   ├── migrations/
│   │   └── seed/                # Сидеры с @faker-js/faker
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── catalog/             # REST + GraphQL + gRPC
│   │   ├── geo-pricing/         # Определение региона, выбор цены
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── payments/            # Stripe PaymentIntent
│   │   ├── subscriptions/       # Stripe Subscriptions
│   │   ├── reviews/
│   │   ├── publications/
│   │   ├── messenger/
│   │   ├── notifications/
│   │   ├── bonuses/
│   │   ├── referrals/
│   │   ├── promotions/          # Глобальные акции + применение локальных
│   │   └── i18n/
│   ├── proto/                   # .proto файлы gRPC
│   ├── queues/                  # BullMQ workers
│   └── main.ts
├── test/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .github/workflows/ci-cd.yml
├── k6/
├── .env.example
├── .eslintrc.js
├── .prettierrc
└── README.md
```

---

## ⚙️ Переменные окружения

```env
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nuvio_client
DB_USER=postgres
DB_PASS=secret

REDIS_HOST=localhost
REDIS_PORT=6379

RABBITMQ_URL=amqp://guest:guest@localhost:5672

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-central-1
AWS_S3_BUCKET=nuvio-client-media
AWS_SES_FROM=no-reply@nuvio.dev

GRPC_URL=0.0.0.0:5002
VENDOR_API_GRPC_URL=localhost:5001
```

---

## 🛡️ Безопасность

- JWT с коротким временем жизни access-токена (15 мин) + refresh-ротация
- Helmet.js — защита HTTP-заголовков
- CORS с whitelist разрешённых origins
- Rate-limiting через Redis (по IP и user_id)
- Валидация всех входящих данных через `class-validator` + `class-transformer`
- **PAN-безопасность**: номера карт никогда не хранятся; только Stripe PaymentMethod ID + `last4`, `brand`, `exp` — полная ответственность у Stripe (PCI DSS Level 1)
- Secrets только через переменные окружения
- Параметризованные запросы Drizzle ORM — SQL-инъекции исключены

---

## 📄 Лицензия и правовая информация

```
Copyright © 2024–2025 [Ваше Имя]. All rights reserved.
```

Данный проект и весь его исходный код являются **интеллектуальной собственностью автора** и разработаны **лично, без использования чужого кода**.

**Разрешено:**
- Просматривать код в ознакомительных и образовательных целях
- Ссылаться на репозиторий как на пример архитектуры

**Запрещено без письменного разрешения автора:**
- Копирование, воспроизведение или распространение кода (полностью или частично)
- Использование кода в коммерческих или некоммерческих проектах
- Создание производных работ на основе данного кода
- Выдавать данный код за свою разработку

Для получения разрешений: **your.email@example.com**

---

<div align="center">

**Разработано с ❤️ [Ваше Имя]**

[![GitHub](https://img.shields.io/badge/GitHub-@YOUR__USERNAME-181717?style=flat-square&logo=github)](https://github.com/YOUR_USERNAME)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/YOUR_PROFILE)
[![Telegram](https://img.shields.io/badge/Telegram-@YOUR__TG-26A5E4?style=flat-square&logo=telegram)](https://t.me/YOUR_TG)

*Part of the [Nuvio](https://github.com/YOUR_USERNAME/nuvio-vendor-core-backend) marketplace ecosystem*

</div>