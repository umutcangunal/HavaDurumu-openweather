const url = 'https://api.openweathermap.org/data/2.5/'; // Arama çubuğu için HTML öğesine erişim sağlar
const key = 'fe5255470de87b07100a97bef2e63e40';  // API anahtarı, istekleri kimlik doğrulaması için kullanılır

// Arama çubuğuna girilen şehir adını alır ve Enter tuşuna basıldığında çağrılır
const setQuery = (e) => { // Arama çubuğuna girilen şehir adını alır ve Enter tuşuna basıldığında çalışır
    if (e.keyCode === 13) { // Eğer basılan tuş Enter tuşu ise
        const cityName = searchBar.value;
        getResult(cityName); // Şehir adı ile getResult fonksiyonunu çağırarak hava durumu verilerini alır
        searchBar.value = ''; // Arama çubuğunu temizler
    }
};

// Şehir adı ile hava durumu verilerini API'den alır ve sonuçları gösterir
const getResult = (cityName) => { // Şehir adı ile hava durumu verilerini API'den alır ve sonuçları gösterir
    const query = `${url}weather?q=${cityName}&appid=${key}&units=metric&lang=tr`; // Şehir adı ile hava durumu verilerini API'den alır ve sonuçları gösterir
    fetch(query) // API'ye GET isteği gönderir
        .then(weather => {
            return weather.json(); // API cevabını JSON formatına dönüştürür
        })
        .then(result => {
            displayResult(result); // Hava durumu sonuçlarını ekranda göstermek için displayResult fonksiyonunu çağırır
            getForecast(cityName); // Şehir için hava durumu tahminlerini almak için getForecast fonksiyonunu çağırır
        })
        .catch(error => {
            console.error("Hata oluştu:", error); // Hata durumunda konsola hata mesajını yazdırır
        });
};

// Şehir için hava durumu tahminlerini API'den alır ve sonuçları gösterir
const getForecast = (cityName) => {
    const forecastQuery = `${url}forecast?q=${cityName}&appid=${key}&units=metric&lang=tr`;
    fetch(forecastQuery) // API'ye GET isteği gönderir
        .then(forecast => {
            return forecast.json(); // API cevabını JSON formatına dönüştürür
        })
        .then(displayForecast) // Hava durumu tahminlerini ekranda göstermek için displayForecast fonksiyonunu çağırır
        .catch(error => {
            console.error("Hata oluştu:", error); // Hata durumunda konsola hata mesajını yazdırır
        });
};

// Hava durumu verilerini ekranda gösterir
const displayResult = (result) => {
    const city = document.querySelector('.city');
    const temp = document.querySelector('.temp');
    const desc = document.querySelector('.desc');
    const minmax = document.querySelector('.minmax');

    city.innerText = `${result.name}, ${result.sys.country}`; // Şehir adı ve ülke kodunu ekrana yazar
    const temperature = Math.round(result.main.temp); // Hava sıcaklığını yuvarlayarak alır

    // Hava sıcaklığına göre arka plan rengini ve ikonu ayarlar
    if (temperature < 10) {
        temp.style.color = 'blue';
        temp.innerHTML = `${temperature}°C <span style="font-size: 36px;">❄️</span>`;
        desc.innerHTML = `${result.weather[0].description} <span style="font-size: 24px;">🌬️</span>`;
        document.body.style.backgroundImage = "url('cold.jpg')";
    } else if (temperature > 35) {
        temp.style.color = 'red';
        temp.innerHTML = `${temperature}°C <span style="font-size: 36px;">🔥</span>`;
        desc.innerHTML = `${result.weather[0].description} <span style="font-size: 24px;">☀️</span>`;
        document.body.style.backgroundImage = "url('hot.jpg')";
    } else {
        temp.style.color = 'white';
        temp.innerText = `${temperature}°C`;
        desc.innerHTML = `${result.weather[0].description}`;
        document.body.style.backgroundImage = "url('bulut.jpg')";
    }

    minmax.innerText = `${Math.round(result.main.temp_min)}°C - ${Math.round(result.main.temp_max)}°C`; // Minimum ve maksimum sıcaklıkları ekrana yazar
};

// Hava durumu tahminlerini ekranda gösterir
const displayForecast = (forecast) => {
    const forecastList = forecast.list;
    const forecastContainer = document.querySelector('.forecast-container');

    forecastContainer.innerHTML = ''; // Önceki tahminleri temizler

    let groupedForecasts = {};
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
        const temperature = Math.round(item.main.temp);
        const description = item.weather[0].description;

        if (!groupedForecasts[dayOfWeek]) {
            groupedForecasts[dayOfWeek] = { temperature, description };
        } else {
            if (temperature < groupedForecasts[dayOfWeek].temperature) {
                groupedForecasts[dayOfWeek].temperature = temperature;
            }
            if (!groupedForecasts[dayOfWeek].description.includes(description)) {
                groupedForecasts[dayOfWeek].description += `, ${description}`;
            }
        }
    });

    Object.entries(groupedForecasts).forEach(([day, data]) => {
        const forecastItem = document.createElement("div");
        forecastItem.innerHTML = `<p>${day}, ${data.temperature}°C, ${data.description}</p>`;
        forecastContainer.appendChild(forecastItem);
    });
};

const searchBar = document.getElementById('searchBar'); // Arama çubuğu için HTML öğesine erişim sağlar
searchBar.addEventListener('keypress', setQuery); // Arama çubuğuna klavye olay dinleyici ekler

getResult(""); // Sayfa yüklendiğinde İstanbul'un hava durumu sonuçlarını göstermek için getResult fonksiyonunu çağırır

