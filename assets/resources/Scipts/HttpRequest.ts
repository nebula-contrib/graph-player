import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HttpRequest')
export class HttpRequest {
    static send(url: string, data: object): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error(xhr.statusText));
                    }
                }
            };
            xhr.send(JSON.stringify(data));
        });
    }
}
