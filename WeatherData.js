import { getAPIResponse } from './api.js';


export class GetWeather {

    constructor(inputLocation = "Taiwan Taipei") {
        this.inputLocation = inputLocation;
        this.weatherData = null;

        this.errorMsg = false;

    }

    async fetchWeatherData() {
        this.weatherData = await getAPIResponse(this.inputLocation);
        // console.log(this.weatherData)

        if ('error' in this.weatherData) {
            this.errorMsg = this.weatherData.error;
        }
        else {
            this.errorMsg = false;
        }
    }

    // 各種資料的 getter

    get current_icon() {
        const result = this.weatherData?.currentConditions?.icon ?? null;

        switch (result) {
            case "snow": return "weather_snowy";
            case "rain": return "rainy";
            case "fog": return "foggy";
            case "wind": return "air";
            case "cloudy": return "cloud";
            case "partly-cloudy-day": return "partly_cloudy_day";
            case "partly-cloudy-night": return "partly_cloudy_night";
            case "clear-day": return "sunny";
            case "clear-night": return "bedtime";
            default: return "downloading";
        }
    }

    get current_datetime() {
        let dateStr = this.weatherData?.days?.[0]?.datetime ?? null;

        let date = new Date(dateStr);

        let formatted = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            weekday: "short",
        }).format(date);

        return formatted;
    }

    get current_time() {
        // const timestamp = Date.now();
        // const dateObj = new Date(timestamp);
        // const time = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

        this.timeZone = this.weatherData?.timezone ?? null;
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: this.timeZone,
            // year: "numeric",
            // month: "2-digit",
            // day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            // second: "2-digit",
        }).format(now);

        return formatter
    }

    get current_location() {

        let location_result = this.weatherData?.resolvedAddress ?? null;

        const regex_Locte = /[a-zA-Z\u4e00-\u9fa5]/;
        // 檢查是否包含英文字母

        const regex_LonLat = /^\s*([+-]?\d{1,2}(?:\.\d+)?)\s*,\s*([+-]?\d{1,3}(?:\.\d+)?)\s*$/;
        // 檢查是否為經緯度

        if (regex_Locte.test(location_result)) {
            // 有文字的地址 → 刪掉所有數字
            return `${location_result.replace(/\d+/g, "")}`;
        }

        else if (regex_LonLat.test(location_result)) {
            // 經緯度 → 變更格式
            const parts = location_result.split(",");
            const lat = Number(parseFloat(parts[0]).toFixed(2));
            const lon = Number(parseFloat(parts[1]).toFixed(2));
            return `緯度：${lat}\n經度：${lon}`
        }
    }

    get current_temperature() {
        let temperature_result = this.weatherData?.currentConditions?.temp ?? null;
        return `${temperature_result} °C`
    }

    get current_conditions() {
        let conditions_result = this.weatherData?.currentConditions?.conditions ?? null;
        return `${conditions_result}`;
    }

    get current_precipprob() {
        let precipprob_result = this.weatherData?.currentConditions?.precipprob ?? null;
        return `${precipprob_result} %`;
    }

    get current_precip() {
        let precip_result = this.weatherData?.currentConditions?.precip ?? 0;
        return `${precip_result} mm`;
    }

    get current_winddir() {
        let winddir_result = this.weatherData?.currentConditions?.winddir ?? null;

        if (winddir_result > 337.5 || winddir_result < 22.5) {
            return ["北風", "south"];

        }
        else if (22.5 < winddir_result && winddir_result < 67.5) {
            return ["東北風", "south_west"];

        }
        else if (67.5 < winddir_result && winddir_result < 112.5) {
            return ["東風", "west"];

        }
        else if (112.5 < winddir_result && winddir_result < 157.5) {
            return ["東南風", "north_west"];

        }
        else if (157.5 < winddir_result && winddir_result < 202.5) {
            return ["南風", "north"];

        }
        else if (202.5 < winddir_result && winddir_result < 247.5) {
            return ["西南風", "north_east"];

        }
        else if (247.5 < winddir_result && winddir_result < 292.5) {
            return ["西風", "east"];

        }
        else if (292.5 < winddir_result && winddir_result < 337.5) {
            return ["西北風", "south_east"];

        }
        else {
            return ["", "air"];
        }

    }

    get current_sunrise() {
        let sunrise_result = this.weatherData?.currentConditions?.sunrise ?? null;
        return `${sunrise_result}`;
    }

    get current_sunset() {
        let sunset_result = this.weatherData?.currentConditions?.sunset ?? null;
        return `${sunset_result}`;
    }

    get current_uvindex() {
        let uvindex_result = this.weatherData?.currentConditions?.uvindex ?? null;

        if (0 <= uvindex_result && uvindex_result <= 2) {
            return `${uvindex_result} / 低量級`;
        }
        else if (3 <= uvindex_result && uvindex_result <= 5) {
            return `${uvindex_result} / 中量級`;
        }
        else if (6 <= uvindex_result && uvindex_result <= 7) {
            return `${uvindex_result} / 高量級`;
        }
        else if (8 <= uvindex_result && uvindex_result <= 10) {
            return `${uvindex_result} / 過量級`;
        }
        else if (11 <= uvindex_result) {
            return `${uvindex_result} / 危險級`;
        }
        else {
            return ``;
        }
    }



    set setForecastTime(oClock) {

        let timeZoneOffset_result = this.weatherData?.tzoffset ?? null;
        const nowUTC = Date.now();// UTC+0 的絕對毫秒數
        const nowTime = new Date(nowUTC + timeZoneOffset_result * 60 * 60 * 1000);// 把 UTC+0 修正成當地時區

        const targetTime = new Date(nowTime.getTime() + oClock * 60 * 60 * 1000)// 目標時間：現在當地時間的 N 個小時後

        const oneDay = 24 * 60 * 60 * 1000;// 一個全天的毫秒數
        const nowTime_AbsoluteDays = Math.floor(nowTime.getTime() / oneDay); //Math.floor -> 向下取整
        const targetTime_AbsoluteDays = Math.floor(targetTime.getTime() / oneDay);

        // 計算前後時間的天數差
        this.getForecastDayIndex = Math.abs(targetTime_AbsoluteDays - nowTime_AbsoluteDays);
        // 目標時間的小時數
        this.getForecastHoursIndex = targetTime.getUTCHours();

        // console.log(` -------- timeZoneOffset_result --------${timeZoneOffset_result}`)
        // console.log(` -------- nowUTC --------${new Date(nowUTC).toISOString()}`)
        // console.log(` -------- nowTime --------${nowTime.toISOString()}`)
        // console.log(` -------- targetTime --------${targetTime.toISOString()}`)
        // console.log(` -------- nowTime_AbsoluteDays --------${nowTime_AbsoluteDays}`)
        // console.log(` -------- targetTime_AbsoluteDays --------${targetTime_AbsoluteDays}`)
        // console.log(` --------     this.getForecastDayIndex --------${this.getForecastDayIndex}`)
        // console.log(` --------    this.getForecastHoursIndex --------${this.getForecastHoursIndex}`)
    }
    get forecast_datatime() {
        let datatime_result = this.weatherData?.days[this.getForecastDayIndex]?.hours[this.getForecastHoursIndex]?.datetime ?? null;
        return `${datatime_result.split(":").slice(0, 2).join(":")}`;
    }
    get forecast_icon() {
        let icon_result = this.weatherData?.days[this.getForecastDayIndex]?.hours[this.getForecastHoursIndex]?.icon ?? null;
        if (icon_result === "snow") {
            return "weather_snowy";
        }
        else if (icon_result === "rain") {
            return "rainy";
        }
        else if (icon_result === "fog") {
            return "foggy";
        }
        else if (icon_result === "wind") {
            return "air";
        }
        else if (icon_result === "cloudy") {
            return "cloud";
        }
        else if (icon_result === "partly-cloudy-day") {
            return "partly_cloudy_day";
        }
        else if (icon_result === "partly-cloudy-night") {
            return "partly_cloudy_night";
        }
        else if (icon_result === "clear-day") {
            return "sunny";
        }
        else if (icon_result === "clear-night") {
            return "bedtime";
        }
        else {
            return "downloading";
        }
    }
    get forecast_conditions() {
        let conditions_result = this.weatherData?.days[this.getForecastDayIndex]?.hours[this.getForecastHoursIndex]?.conditions ?? null;

        return `${conditions_result}`;
    }
    get forecast_temperature() {
        let temperature_result = this.weatherData?.days[this.getForecastDayIndex]?.hours[this.getForecastHoursIndex]?.temp ?? null;

        return `${temperature_result} °C`;
    }
    get forecast_precipprob() {
        let precipprob_result = this.weatherData?.days[this.getForecastDayIndex]?.hours[this.getForecastHoursIndex]?.precipprob ?? null;

        return `降雨機率 ${precipprob_result} %`;
    }
}
