import { _decorator, Component, Node,EventHandler,Button, RichText, Layout, EventMouse,input, Input } from 'cc';
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

    @property(Button)
    public createVertexBtn:Button;
    
    @property(Button)
    public createEdgeBtn:Button;

    @property(Button)
    public deleteVertexBtn:Button;

    @property(Button)
    public layoutBtn:Button;

    @property(Layout)
    public dropDownBarLayout:Layout;

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

    public createVertex(event:Event){
        // if the node is vertex
       
        
        if(Manager.Instance().vertexManager.chosenVertex != null && Manager.Instance().edgeManager.chosenEdgeNode == null){
            console.log("operate on vertex!");
            let childVertex = Manager.Instance().vertexManager.createNodeAround(Manager.Instance().vertexManager.chosenVertex);
            Manager.Instance().edgeManager.createEdgeWithStartAndEnd(Manager.Instance().vertexManager.chosenVertex, childVertex);
        }
        else if(Manager.Instance().vertexManager.chosenVertex == null && Manager.Instance().edgeManager.chosenEdgeNode != null){
            console.log("operate on edge!");
            /**
             * To-do create on edge
             */

        }
        this.dropDownBarLayout.node.active = false;
    }

    public changeLayout(){
        this.dropDownBarLayout.node.active = false;
        Manager.Instance().vertexManager.removeLayoutFlags();
        Manager.Instance().layoutManager.classifyNodeByTag();
        Manager.Instance().layoutManager.adjustOrderOfTags(["team","player"]);
        Manager.Instance().layoutManager.materialReallocated();
        Manager.Instance().layoutManager.reLayoutByTags();
    }


    protected onLoad(): void {
            // initiate infomation bar
            this.nodeInfoBar = this.node.getChildByName('InfoBar');
            this.nodeInfoText = this.nodeInfoBar.getChildByName('NodeInfoText').getComponent(RichText);
            // input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this); // set the progation prevented
            // input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    start () {
        
       
        // initiate refresh button
        const refreshClickEventHandler = new EventHandler();
        this.refreshBtn = this.node.getChildByName('RefreshBtn').getComponent(Button);
        refreshClickEventHandler.target = this.node; // node name
        refreshClickEventHandler.component = 'UIManager';// script name
        refreshClickEventHandler.handler = 'RefreshCanvas'; // method name
        // const button = this.node.getComponent(Button);
        this.refreshBtn.clickEvents.push(refreshClickEventHandler);

        // initiate the JSON button
        const createCanvasFromJSONFileEventHandler =  new EventHandler();
        this.createCanvasFromJSONButton = this.node.getChildByName('CreateByJSONBtn').getComponent(Button);
        createCanvasFromJSONFileEventHandler.target = this.node;
        createCanvasFromJSONFileEventHandler.component = 'UIManager';
        createCanvasFromJSONFileEventHandler.handler = 'createCanvasFromJSONFile';



        /**
         * initial the drop-down bar
         */
        this.dropDownBarLayout =  this.node.getChildByName("DropDownBar").getComponent(Layout);
        this.dropDownBarLayout.node.active = false;

        // initial Layout Btn

        const layoutEventHandler = new EventHandler();
        this.layoutBtn = this.dropDownBarLayout.node.getChildByName("LayoutBtn").getComponent(Button);
        layoutEventHandler.target = this.node;
        layoutEventHandler.component = "UIManager";
        layoutEventHandler.handler = "changeLayout";
        this.layoutBtn.clickEvents.push(layoutEventHandler);

        // initial createVertexBtn
        const createVertexEventHandler = new EventHandler();
        this.createVertexBtn = this.dropDownBarLayout.node.getChildByName("CreateVertexBtn").getComponent(Button);
        createVertexEventHandler.target = this.node;
        createVertexEventHandler.component = "UIManager";
        createVertexEventHandler.handler = "createVertex";
        this.createVertexBtn.clickEvents.push(createVertexEventHandler);

        // initial deleteVeretxBtn

        



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

