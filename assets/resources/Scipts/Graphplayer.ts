import { _decorator, Component, Node } from 'cc';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;

@ccclass('Graphplayer')
export class Graphplayer extends Component {
    protected start(): void {
        
        Manager.Instance().canvasManager.cleanCanvas();
        Manager.Instance().JSONReader.getJSONResponse("http://127.0.0.1:8000/table-details");
        // this.startWithTableDetails("http://127.0.0.1:8000");
    }
    /**
     * change the url to get json 
     * @param url : like "http://127.0.0.1:8080"
     */
    public changeJSONResponseUrl(url:string){
        Manager.Instance().UIManager.jsonResponseUrl = url;
    }
    
    public startWithTableDetails(url:string){
    //     const jsonString = localStorage.getItem('table-details');
        //const jsonString = Manager.Instance().JSONReader.getCookie('table-details');
        // const jsonString = sessionStorage.getItem('table-details');
        const xhr = new XMLHttpRequest();
        console.log("sucess on cocos!")
        xhr.onreadystatechange = function () {
            console.log("xhr.readyState: ",xhr.readyState ,"xhr.status:",xhr.status)
          if (xhr.readyState === 4 && xhr.status === 200) {
            const jsonString = JSON.parse(xhr.responseText);
            console.log("jsonString :",jsonString )
            Manager.Instance().JSONReader.transTabletoVertexAndEdge(jsonString);
          }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();


    }
}

