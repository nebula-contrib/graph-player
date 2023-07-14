import { _decorator, Component, Node,EventHandler,Button, RichText } from 'cc';
const { ccclass, property } = _decorator;
import { Manager } from './Manager';

@ccclass('UIManager')
export class UIManager extends Component {

    clickEventHandler = new EventHandler();

    @property(Button)
    public refreshBtn:Button;

    @property(Button)
    public createCanvasFromJSONButton:Button;

    @property(Node)
    public nodeInfoBar:Node;

    @property(RichText)
    public nodeInfoText:RichText;


    public isNodeInfoEnable = false;
    private nodeInfoPrefix = "<color=#ffffff>";
    private nodeInfoSuffix = "\n</f>";

    public RefreshCanvas(event:Event){
        
        Manager.Instance().canvasManager.resetCanvas();
        //Manager.Instance().JSONReader.putJSONtoModel("");


        
    }

    public createCanvasFromJSONFile(event:Event){
        Manager.Instance().canvasManager.cleanCanvas();
        Manager.Instance().JSONReader.putJSONtoModel("");
    }

    protected onLoad(): void {
            // initiate infomation bar
            this.nodeInfoBar = this.node.getChildByName('InfoBar');
            this.nodeInfoText = this.nodeInfoBar.getChildByName('NodeInfoText').getComponent(RichText);
    }

    start () {
        // initiate refresh button
        const refreshClickEventHandler = new EventHandler();
        this.refreshBtn = this.node.getChildByName('RefreshBtn').getComponent(Button);
        refreshClickEventHandler.target = this.node.getChildByName('RefreshBtn'); // node name
        refreshClickEventHandler.component = 'UIManager';// script name
        refreshClickEventHandler.handler = 'RefreshCanvas'; // method name
        // const button = this.node.getComponent(Button);
        this.refreshBtn.clickEvents.push(refreshClickEventHandler);

        // initiate the JSON button
        const createCanvasFromJSONFileEventHandler =  new EventHandler();
        this.createCanvasFromJSONButton = this.node.getChildByName('createByJSONBtn').getComponent(Button);
        createCanvasFromJSONFileEventHandler.target = this.node.getChildByName('createByJSONBtn');
        createCanvasFromJSONFileEventHandler.component = 'UIManager';
        createCanvasFromJSONFileEventHandler.handler = 'createCanvasFromJSONFile';



    }


    public setRichInfo(info:string){
        this.nodeInfoBar.active = true;
        if(!this.isNodeInfoEnable) {
            this.isNodeInfoEnable = true;
            this.nodeInfoBar.active = true;
        }

        this.nodeInfoText.string = this.nodeInfoPrefix+info+this.nodeInfoSuffix;
    }

    public addRichInfo(info:string){

        this.nodeInfoText.string += this.nodeInfoPrefix+info+this.nodeInfoSuffix;
    }

    public cleanRichInfo(){
        this.nodeInfoText.string = "";
        
    }

    public cleanAndDisableInfoBar(){
        this.nodeInfoText.string = "";
        this.nodeInfoBar.active = false;
    }

}

