async function getAPIResponse(inputCity = "Taiwan Kaohsiung") {


    /* API 請求的固定參數 */
    const params = {
        unitGroup: "metric",
        include: "current,hours",
        key: "ZVQYZ44HL3DSEKFDH9NLDAFQJ",
        contentType: "json",
        useEpochSeconds:true
    };


    try {

        /* 組合 URL */
        const city = encodeURIComponent(inputCity);
        const query = new URLSearchParams(params).toString();/* 自動把物件形式的URL參數轉成正確格式*/
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?${query}`;
        const response = await fetch(url, { mode: 'cors' });// 呼叫 API，得到 promise 型態的 response，用 awiat 拆成 JSON

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const weatherData = await response.json();// 得到 promise 型態的 JS 物件，用 awiat 拆成普通JS物件
        return weatherData;
    }
    catch (error) {
        console.error("API error:", error);
        return { error: true, message: error.message };
    }
}

export { getAPIResponse };