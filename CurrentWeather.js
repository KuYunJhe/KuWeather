export class UpdateCurrentDOM {

    constructor() {
        this.icon = document.querySelector('[data-current-info="icon"]>span');
        this.datetime = document.querySelector('[data-current-info="datetime"]');
        this.time = document.querySelector('[data-current-info="time"]');
        this.location = document.querySelector('[data-current-info="location"]');
        this.temperature = document.querySelector('[data-current-info="temperature"]');
        this.conditions = document.querySelector('[data-current-info="conditions"]');


        this.precipprob = document.querySelector('[data-current-info="precipprob"]>.minor-info-content');
        this.precip = document.querySelector('[data-current-info="precip"]>.minor-info-content');
        this.winddir = document.querySelector('[data-current-info="winddir"]>.minor-info-content');
        this.winddir_icon = document.querySelector('[data-current-info="winddir-icon"]>span');
        this.sunrise = document.querySelector('[data-current-info="sunrise"]>.minor-info-content');
        this.sunset = document.querySelector('[data-current-info="sunset"]>.minor-info-content');
        this.uvindex = document.querySelector('[data-current-info="uvindex"]>.minor-info-content');
    }



    print() {
        console.log(this.icon.textContent.replaceAll("-", "_"));
        console.log(this.datetime.textContent);
        console.log(this.time.textContent);
        console.log(this.location.textContent);
        console.log(this.temperature.textContent);
        console.log(this.conditions.textContent);

        console.log(this.precipprob.textContent);
        console.log(this.precip.textContent);
        console.log(this.winddir.textContent);
        console.log(this.sunrise.textContent);
        console.log(this.sunset.textContent);
        console.log(this.uvindex.textContent);

    }


    updateDOMContent(weatherObj) {
        if (weatherObj.errorMsg) {
            this.icon.textContent = "wrong_location"; // 或預設 icon
            // this.datetime.textContent = "N/A";
            // this.time.textContent = "N/A";
            this.location.textContent = "請輸入完整地點";
            this.temperature.textContent = "　";
            this.conditions.textContent = "　";

            this.precipprob.textContent = "-";
            this.precip.textContent = "-";
            this.winddir.textContent = "-";
            this.winddir_icon.textContent = "-";
            this.sunrise.textContent = "-";
            this.sunset.textContent = "-";
            this.uvindex.textContent = "-";

            return; // <- 非常重要，避免後面覆蓋
        }
        
        this.icon.textContent = weatherObj.current_icon;
        this.datetime.textContent = weatherObj.current_datetime;
        this.time.textContent = weatherObj.current_time;
        this.location.textContent = weatherObj.current_location;
        this.temperature.textContent = weatherObj.current_temperature;
        this.conditions.textContent = weatherObj.current_conditions;

        this.precipprob.textContent = weatherObj.current_precipprob;
        this.precip.textContent = weatherObj.current_precip;
        this.winddir.textContent = weatherObj.current_winddir[0];
        this.winddir_icon.textContent = weatherObj.current_winddir[1];
        this.sunrise.textContent = weatherObj.current_sunrise;
        this.sunset.textContent = weatherObj.current_sunset;
        this.uvindex.textContent = weatherObj.current_uvindex;
    }
}