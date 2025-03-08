# Гайд по запуску приложения локально

Данный гайд поможет вам запустить приложение на локальном компьютере двумя способами:

1. **Через Docker (рекомендуемый вариант)**
2. **Локально (нерекомендуемый вариант)**

---

## 🚀 Вариант 1 (Рекомендуется) — Использование Docker контейнера

### 🔹 Установка Docker Desktop

Перед началом работы необходимо установить **Docker Desktop**.  
Скачать последнюю версию можно с официального сайта:  
🔗 [https://www.docker.com/](https://www.docker.com/)

После установки проверьте, что Docker работает корректно, выполнив команду:

```bash
docker --version
```
---

### 🔹 Запуск контейнера через docker-compose

1. В любой папке создайте файл `docker-compose.yml`.
    
2. Вставьте в него следующий код:
``` yaml
services:
  movie-quiz-database-dev:
    image: updf/movie-quiz-database:v1.0
    restart: always
    shm_size: 128mb
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: mqpassword
      POSTGRES_DB: movie-quiz-db
    ports:
      - '5432:5432'
    volumes:
      - db_data:/var/lib/postgresql/data

  movie-quiz-backend-dev:
    image: updf/movie-quiz-backend-app:v7.2
    restart: always
    environment:
      NODE_ENV: development
      DATABASE_URL: 'postgresql://admin:mqpassword@movie-quiz-database-dev:5432/movie-quiz-db?schema=public'
      JWT_SECRET: secret
      ALLOWED_ORIGIN: http://localhost:3000
    ports:
      - '4000:4000'
    depends_on:
      - movie-quiz-database-dev

volumes:
  db_data:

```    
  
    
    
4. В терминале перейдите в папку с файлом `docker-compose.yml` и выполните команду:
    
```bash
docker-compose up -d
```
    
5. После успешного выполнения команды проверьте наличие запущенного контейнера в **Docker Desktop**.
---

### 🔹 Открытие сайта в браузере

После запуска контейнера приложение будет доступно по адресу:  
🔗 [http://localhost:3000](http://localhost:4000)

---

## ✅ Вариант 2 (Нерекомендуемый) — Локальный запуск

Этот способ позволяет запустить проект локально без использования Docker.

**📖 Официальная документация:**  
🔗 [Nuxt Docs](https://nuxt.com/docs/getting-started/introduction)

---

### 🔹 Установка Node.js

Перед началом работы установите **Node.js**.  
Скачать последнюю версию можно с официального сайта:  
🔗 [https://nodejs.org/](https://nodejs.org/)

> **Важно:** Рекомендуется устанавливать **LTS-версию**, так как она более стабильная.

После установки проверьте корректность установки **Node.js** и **npm** с помощью команд:

```bash
node -v   # Проверка версии Node.js 
npm -v    # Проверка версии npm
```
---

### 🔹 Клонирование проекта

Скачайте ZIP-архив или клонируйте репозиторий, чтобы получить код на своем компьютере:


```bash
git clone https://github.com/Up-11/movie-quiz-frontend.git
```

Затем перейдите в папку проекта

---

### 🔹 Установка Nestjs Cli

Установите пакет который необходимен для запуска контейнера, выполнив:

```
$ npm i -g @nestjs/cli
```

### 🔹 Установка Docker - Следуйте предыдущему гайду

### 🔹 Разворачивание локальный базы данных 
В терминале в папке с проектом выполните команду:
    
```bash
docker-compose up -d
```


### 🔹 Установка зависимостей проекта

Установите все необходимые зависимости, выполнив:


```bash
npm install
```

---

### 🔹 Запуск локального сервера

Чтобы запустить сервер разработки, выполните одну из команд:

```bash
 npm run start:dev 
```

---

### 🔹 Открытие сайта в браузере

После успешного запуска приложение будет доступно по адресу:  
🔗 [http://localhost:3000](http://localhost:3000)

---
