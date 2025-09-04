

// --- 定時器封裝 ---
export class AutoUpdaterTimer {
    constructor(interval, callback) {
        this.interval = interval;
        this.callback = callback;
        this.timerId = null;//計時器標記，用來控制計時器啟動或結束
    }

    /* 設定定時器 */
    start() {
        this.stop(); // 確保不會重複
        this.callback(); // 開頭先立即跑一次呼叫函數
        this.timerId = setInterval(this.callback, this.interval);
        // setInterval(函數, 間隔毫秒) → 每隔一段時間執行 callback
    }

    /* 設定停止定時器 */
    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }
}



// --- 監聽器管理 --- 資料更新監聽器
export class AutoElementUpdateListenerManager {
    constructor() {
        this.listeners = [];
        // 存放需要掛上監聽器的函數
    }

    addListener(fn) {
        if (typeof fn === "function") {
            this.listeners.push(fn);
        }
    }

    removeListener(fn) {
        this.listeners = this.listeners.filter(listener => listener !== fn);
    }

    notify(obj) {
        this.listeners.forEach(fn => fn(obj));
        // 遍歷函數，傳入物件 → 概念等於把物件傳入函數，讓函數使用這個物件
    }
}




// --- 自動更新整合 --- 組合 定時器 和 監聽器
export class AutoUpdater {
    // 設定間隔時間,設定間隔執行的函式
    constructor(updateInterval, updateFunction, updateTargetObj) {
        this.updateFunction = updateFunction;
        this.updateTargetObj = updateTargetObj; // 傳給 listener
        this.listeners = new AutoElementUpdateListenerManager();
        this.timer = new AutoUpdaterTimer(updateInterval, () => this.doUpdate());
        this.timer.start();
    }

    async doUpdate() {
        try {
            // 呼叫 fetchWeatherData 並等待完成，忽略回傳值
            await this.updateFunction();
            // 通知 listener，傳入更新過的 GetWeather 實例
            this.listeners.notify(this.updateTargetObj);
        }
        catch (err) {
            console.error("更新失敗:", err);
        }
    }

    addListener(fn) {
        this.listeners.addListener(fn);
    }

    removeListener(fn) {
        this.listeners.removeListener(fn);
    }

    stop() {
        this.timer.stop();
    }
}

