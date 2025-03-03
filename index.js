const axios = require("axios");
require("dotenv").config();

async function getWeather(city, units = "metric") {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            throw new Error('API-ключ не найден. Укажите его в файле .env');
        }

        const url = new URL("https://api.openweathermap.org/data/2.5/weather");
        url.searchParams.set("q", city);
        url.searchParams.set("appid", apiKey);
        url.searchParams.set("units", units);
        url.searchParams.set("lang", "ru");

        // Выполнение запроса
        const response = await axios.get(url.toString());
        const weatherData = response.data;

        // Извлечение данных
        const temperature = Math.round(weatherData.main.temp);
        const feelsLike = Math.round(weatherData.main.feels_like);
        const description = weatherData.weather[0].description;
        const cityName = weatherData.name;

        // Форматированный вывод
        const weatherMessage = `
            Погода в городе ${cityName}:
            Температура: ${temperature}°C
            Ощущается как: ${feelsLike}°C
            Описание: ${description}
        `.trim();

        console.log(weatherMessage);
        return weatherData;

    } catch (error) {
        if (error.response) {
            console.error(`Ошибка API: ${error.response.data.message}`);
        } else if (error.request) {
            console.error("Ошибка сети: проверьте подключение к интернету");
        } else {
            console.error("Ошибка:", error.message);
        }
        throw error;
    }
}

// Пример использования с обработкой промиса
async function main() {
    try {
        await getWeather("Москва");
    } catch (error) {
        console.error("Ошибка в main:", error.message);
    }
}

main();