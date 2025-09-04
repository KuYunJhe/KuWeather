
export class Geolocation {
    getGeolocation() {

        return new Promise((resolve, reject) => {


            if (!("geolocation" in navigator)) {
                reject(new Error("瀏覽器不支援 Geolocation"));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => resolve(position.coords),  // 成功 → resolve
                (error) => reject(error),               // 失敗 → reject
                { enableHighAccuracy: true, timeout: 5000 }
            );
        });
    }
}