

export class FormInfo {
    constructor() {

        // 取得表單元素
        this.form = document.getElementById('search_bar');
        this.submittedLocation = "";
    }



    // 監聽表單的送出事件
    sendFormLocation(callbackFn) {

        this.form.addEventListener('submit', (event) => {


            // 阻止表單的預設送出行為
            event.preventDefault();

            //送出表單時，進行所有輸入項的驗證
            // const passValidity = submitValidity();
            const passValidity = true;

            // 如果通過驗證
            if (passValidity) {

                // 創建一個 FormData 物件，傳入表單元素
                const formData = new FormData(this.form);
                // 將 FormData 轉成純JS物件
                const formDataObject = Object.fromEntries(formData.entries());

                this.submittedLocation = formDataObject.location;


                // 呼叫外部函數，並把 submittedLocation 當作參數傳入
                this.updateLoction(callbackFn, this.submittedLocation);

                this.form.reset();
            }
        });
    }


    updateLoction(fn, ...args) {
        if (typeof fn === 'function') {
            return fn(...args);
        }
    }
}
