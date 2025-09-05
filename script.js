// import { getAPIResponse } from './api.js';
import { AutoUpdater } from './updateData.js';
import { GetWeather } from './WeatherData.js';
import { UpdateCurrentDOM } from './CurrentWeather.js';
import { UpdateForecastDOM } from './ForecastCard.js';
import { FormInfo } from './SearchLocForm.js';
import { Geolocation } from './GeoLocation.js';


class WeatherApp {
    constructor() {
        this.CurrentWeatherDOM = new UpdateCurrentDOM();
        this.ForecastWeatherDOM = new UpdateForecastDOM();
        this.updater = null;
        this.userGeo = "未取得";
        this.UserGeolocation = null;
    }



    updateWeather(latLon, updateInterval = 1 * 60 * 1000) {

        // 如果還沒有建立過天氣資料
        if (!this.weather) {

            // 建立天氣資料
            this.weather = new GetWeather(latLon);
        }

        // 如果已經建立了
        else {
            // 更新地點
            this.weather.inputLocation = latLon;
        }

        // 如果還沒有建立過自動更新器
        if (!this.updater) {

            // 建立自動更新器
            this.updater = new AutoUpdater(
                updateInterval,
                () => this.weather.fetchWeatherData(),
                this.weather
            );

            // 訂閱自動更新器
            this.updater.addListener(weatherObj => {
                this.CurrentWeatherDOM.updateDOMContent(weatherObj);
                this.ForecastWeatherDOM.updateDOMContent(8, weatherObj);
            });
        }

        else {

            this.updater.doUpdate();
        }

        // 馬上抓一次資料
        // this.weather.fetchWeatherData(); // 馬上抓一次


        // 先非同步抓一次 GPS，不用 await，不影響同步
        this.fetchUserGeo();
    }


    // 單獨的非同步方法
    async fetchUserGeo() {
        if (!this.UserGeolocation) {
            // 創建 GPS 的 API 物件
            this.UserGeolocation = new Geolocation();
        }
        try {
            // 嘗試取得 API 回傳經緯度
            const coords = await this.UserGeolocation.getGeolocation();

            // 組合經緯度字串
            this.userGeo = `${coords.latitude},${coords.longitude}`;

        } catch (err) {
            console.error(err.message);
        }
    }
}


// 建立 App 實例
const Ku_WeatherApp = new WeatherApp();
// 第一次地點抓使用者 GPS ，呼叫 fetchUserGeo()，等 GPS 回傳資料更新
Ku_WeatherApp.fetchUserGeo().then(() => {
    Ku_WeatherApp.updateWeather(Ku_WeatherApp.userGeo);
});

// 建立搜尋表單監聽器
const formInfo = new FormInfo();

// 傳入 表單送出時，要執行更新的函數，用bind 避免丟失 WeatherApp 內的參數
formInfo.sendFormLocation(Ku_WeatherApp.updateWeather.bind(Ku_WeatherApp));


