FROM node:18-alpine

WORKDIR /app

# Копирование package.json и установка зависимостей
COPY package.json ./
RUN npm install

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Установка serve для раздачи статики
RUN npm install -g serve

EXPOSE 3000

# Запуск приложения
CMD ["serve", "-s", "dist", "-l", "3000"]