export class UpdateForecastDOM {


    constructor() {
        this.CardContainer = document.getElementById('forecast-card-container');
        this.CardTemplate = document.getElementById('forecast-card-template');
    }

    makePrefab(oClock, weatherObj) {
        // ---- 以模板的取得預製件(新物件)
        const Prefab_card = this.CardTemplate.content.cloneNode(true);


        const time = Prefab_card.querySelector('[data-forecast-info="time"]');
        const icon = Prefab_card.querySelector('[data-forecast-info="icon"]>span');
        const weather = Prefab_card.querySelector('[data-forecast-info="weather"]');
        const temperature = Prefab_card.querySelector('[data-forecast-info="temperature"]');
        const precipprob = Prefab_card.querySelector('[data-forecast-info="precipprob"]');



        weatherObj.setForecastTime = oClock;

        time.textContent = weatherObj.forecast_datatime;
        icon.textContent = weatherObj.forecast_icon;
        weather.textContent = weatherObj.forecast_conditions;
        temperature.textContent = weatherObj.forecast_temperature;
        precipprob.textContent = weatherObj.forecast_precipprob;


        return Prefab_card;
    }


    updateDOMContent(hours = 24, weatherObj) {


        // 如果地點輸入錯誤 API 傳出錯誤資訊
        if (weatherObj.errorMsg) {

            // 清空預測天氣資料卡
            this.CardContainer.replaceChildren();
            return;
        }

        // ---- 建立一個暫存容器 DocumentFragment，用於暫時存放所有多個預製件
        const fragment = document.createDocumentFragment();

        for (let i = 1; i <= hours; i++) {

            let Prefab = this.makePrefab(i, weatherObj)


            // ---- 將新的卡片添加到暫存容器
            fragment.appendChild(Prefab);
        }

        // ---- 暫存容器加到父元素容器裡
        this.CardContainer.replaceChildren(fragment);
    }

}