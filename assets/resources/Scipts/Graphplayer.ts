import { _decorator, Component, Node } from 'cc';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;


@ccclass('Graphplayer')
export class Graphplayer extends Component {

    private serverAddress:string = "http://127.0.0.1:8080";
    protected start(): void {
        
        // (window as any).globalReceiveJSONByURL = this.buildByURL.bind(this);
        // this.buildByURL("http://127.0.0.1:8000/table-details")

    }

    public changeServerAddress(address:string):string{
        this.serverAddress = address;
        return address;
    }

    public getServerAddress():string{
        return this.serverAddress;
    }

    
}

