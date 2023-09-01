import { _decorator, Component, Node } from 'cc';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;


@ccclass('Graphplayer')
export class Graphplayer extends Component {
    protected start(): void {
        
        // (window as any).globalReceiveJSONByURL = this.buildByURL.bind(this);
        this.buildByURL("http://127.0.0.1:8000/table-details")
        // this.startWithTableDetails("http://127.0.0.1:8000");
    }

    /**
     * receive JSON response
     * @param url: get json response
     */
    public buildByURL(url:string){
        Manager.Instance().canvasManager.cleanCanvas();
        Manager.Instance().JSONReader.createByURL(url);
    }

    public buildByJSONString(jsonString:string){
        Manager.Instance().JSONReader.createdByJSON(jsonString);
    }
}

