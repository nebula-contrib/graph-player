import { _decorator, Component, Node,EventHandler,Button, RichText, Layout, EventMouse,input, Input, Collider, Collider2D, Prefab, instantiate, Label, UITransform, EditBox } from 'cc';
const { ccclass, property } = _decorator;
import { Manager } from './Manager';

@ccclass('UIManager')
export class UIManager extends Component {

    clickEventHandler = new EventHandler();

    @property(Button)
    private refreshBtn:Button;

    @property(Button)
    private createCanvasFromJSONButton:Button;

    
    @property(EditBox)
    public createCanvasFromJSONEditBox:EditBox

    @property(Node)
    public nodeInfoBar:Node;

    @property(RichText)
    private nodeInfoText:RichText;

    @property(Button)
    private createVertexBtn:Button;
    
    @property(Button)
    private createEdgeBtn:Button;

    @property(Button)
    private deleteVertexBtn:Button;

    @property(Button)
    private layoutBtn:Button;

    @property(Layout)
    public dropDownBarLayout:Layout;

    @property(Layout)
    private tagOrderChoiceBar:Layout;

    @property(Prefab)
    private tagOrderChoiceBtnPrefab:Prefab 

    @property({type: [Node]})
    public tagOrderChoiceBtnList:Array<Node>;



    /**
     * attributes of tag Order bar and its choices buttons
     */
    private BtnWidth = 30;
    private BtnLength = 170;
    private timer = 0;
    private isEnteredTagOrderChoiceBar = false;
    
    /**
     * attributes of rich info about vertices and edges
     */
    public isNodeInfoEnable = false;
    private nodeInfoPrefix = "<color=#ffffff>";
    private nodeInfoSuffix = "\n</f>";


    public RefreshCanvas(event:Event){
        
        Manager.Instance().canvasManager.resetCanvas();
        //Manager.Instance().JSONReader.putJSONtoModel("");


        
    }

    public createCanvasFromJSONFile(event:Event){
        Manager.Instance().canvasManager.cleanCanvas();
        let jsonFilename = this.createCanvasFromJSONEditBox.string;
        Manager.Instance().JSONReader.putJSONtoModel(jsonFilename);
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

    public changeLayout(event:Event, finalTagOrder: string[]){

        this.tagOrderChoiceBar.node.active = false;
        this.dropDownBarLayout.node.active = false;
       console.log("in change layout")
        Manager.Instance().vertexManager.removeLayoutFlags();
        console.log("1")
        Manager.Instance().edgeManager.removeLayoutFlags();
        console.log("2")
        Manager.Instance().layoutManager.classifyNodeByTag();
        Manager.Instance().layoutManager.adjustOrderOfTags(finalTagOrder);
        // Manager.Instance().layoutManager.adjustOrderOfTags(["team","player"]);
        Manager.Instance().layoutManager.materialReallocated();
        Manager.Instance().layoutManager.reLayoutByTags();
    }


    protected onLoad(): void {
            // initiate infomation bar
            this.nodeInfoBar = this.node.getChildByName('InfoBar');
            this.nodeInfoText = this.nodeInfoBar.getChildByName('NodeInfoText').getComponent(RichText);
            // input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this); // set the progation prevented
            // input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
            // this.tagOrderChoiceBtnList = new Array<Node>();
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
        this.createCanvasFromJSONEditBox = this.createCanvasFromJSONButton.node.getChildByName("EditBox").getComponent(EditBox);
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
        // this.layoutBtn = this.dropDownBarLayout.node.getChildByName("LayoutBtn").getComponent(Button);
        this.layoutBtn = this.node.getChildByName("LayoutGreyBtn").getComponent(Button);
        // layoutEventHandler.target = this.node;
        // layoutEventHandler.component = "UIManager";
        // layoutEventHandler.handler = "changeLayout";
        //this.layoutBtn.clickEvents.push(layoutEventHandler);
        console.log("layout btn",this.layoutBtn)
        this.tagOrderChoiceBar = this.layoutBtn.node.getChildByName("TagOrderChoiceBar").getComponent(Layout);
        console.log("tag order:",this.tagOrderChoiceBar)
        this.tagOrderChoiceBar.node.active = false;
        /**
         * listen on layout btn
         */
        this.tagOrderChoiceBar.node.on(Node.EventType.MOUSE_MOVE, this.onMouseEnterTagOrderChoiceBar, this); // listen on mouse enter in tagOrderChoiceBar 
        this.tagOrderChoiceBar.node.on(Node.EventType.MOUSE_LEAVE,(event:EventMouse) => {
            this.isEnteredTagOrderChoiceBar = false;
        }, this);


        this.layoutBtn.node.on(Node.EventType.MOUSE_ENTER, this.onLayoutBtnMouseEnter.bind(this, layoutEventHandler),this);
        
        this.layoutBtn.node.on(Node.EventType.MOUSE_LEAVE, this.onLayoutBtnMouseLeave,this);

  


        /**
         * initial layout choice bar
         */

        

        // initial createVertexBtn 
        const createVertexEventHandler = new EventHandler();
        this.createVertexBtn = this.dropDownBarLayout.node.getChildByName("CreateVertexBtn").getComponent(Button);
        createVertexEventHandler.target = this.node;
        createVertexEventHandler.component = "UIManager";
        createVertexEventHandler.handler = "createVertex";
        this.createVertexBtn.clickEvents.push(createVertexEventHandler);

        // initial deleteVeretxBtn
        const deleteVertexEventHandler = new EventHandler();
        this.deleteVertexBtn = this.dropDownBarLayout.node.getChildByName("DeleteVertexBtn").getComponent(Button);
        deleteVertexEventHandler.target = this.node;
        deleteVertexEventHandler.component = "UIManager";
        deleteVertexEventHandler.handler = "createVertex";
       

        this.deleteVertexBtn.clickEvents.push(createVertexEventHandler);

    }


    private onMouseEnterTagOrderChoiceBar(event: EventMouse){
        this.isEnteredTagOrderChoiceBar = true;
    }

    /**
     * set the info
     * @param info: info of vertex and edge
     */
    public setRichInfo(info:string){
        this.nodeInfoBar.active = true;
        if(!this.isNodeInfoEnable) {
            this.isNodeInfoEnable = true;
            this.nodeInfoBar.active = true;
        }

        this.nodeInfoText.string = this.nodeInfoPrefix+info+this.nodeInfoSuffix;
    }

    /**
     * add info
     * @param info 
     */
    public addRichInfo(info:string){

        this.nodeInfoText.string += this.nodeInfoPrefix+info+this.nodeInfoSuffix;
    }

    /**
     * clean info in block
     */
    public cleanRichInfo(){
        this.nodeInfoText.string = "";
        
    }

    public cleanAndDisableInfoBar(){
        this.nodeInfoText.string = "";
        this.nodeInfoBar.active = false;
    }

    /**
     * show the order of tags
     */
    private onLayoutBtnMouseEnter(){
        
        
        this.cleanTagOrderChoices();
        
        /** 
         * read the possible layout order 
         */
        let tagList = Array.from(Manager.Instance().vertexManager.vertexTagSet);
        if(tagList.length == 0) return;
        let tagOrderList = [];
        this.generatePermutations(tagList,[],tagOrderList);
        let tagOrderNum = tagOrderList.length;
        // let this.tagOrderChoiceBtnList = []
        this.tagOrderChoiceBar.getComponent(UITransform).setContentSize(this.BtnLength, (tagOrderNum) * this.BtnWidth);
        this.tagOrderChoiceBtnList = new Array<Node>(tagOrderNum);
        
        
        /**
         * show the layout order choices 
        */
       try{
            for(let i = 0; i < tagOrderList.length; i++){
                const tagOrderBtn = instantiate(this.tagOrderChoiceBtnPrefab);

                tagOrderBtn.setParent(this.tagOrderChoiceBar.node);
                tagOrderBtn.setPosition(0, i * this.BtnWidth, 0);
                tagOrderBtn.getChildByName('Label').getComponent(Label).string = tagOrderList[i]; // set the string of tag order button
                console.log("tag node list i:",tagOrderList[i]);
                const tagOrderChoiceHandler = new EventHandler();
                tagOrderChoiceHandler.target = this.node;
                tagOrderChoiceHandler.component = "UIManager";
                tagOrderChoiceHandler.handler = "changeLayout";
                tagOrderChoiceHandler.customEventData = tagOrderList[i];
                // this.tagOrderChoiceBtnList.push(tagOrderBtn);

                tagOrderBtn.getComponent(Button).clickEvents.push(tagOrderChoiceHandler);

                
            }

       }
       catch(error){
        console.log(error);
       }
        this.tagOrderChoiceBar.node.active = true;

    }


    /**
     * get the permutation of tags
     * @param input 
     * @param current 
     * @param result 
     * @returns 
     */
    private generatePermutations(input, current, result) {
        
        if (current.length === input.length) {
            result.push(current.slice()); 
            return;
        }
        for (let i = 0; i < input.length; ++i) {

            if (!current.includes(input[i])) {
                current.push(input[i]);
                this.generatePermutations(input, current, result);
                current.pop();
            }
        }
    }

    /**
     * check the mouse leave on btn
     */
    private onLayoutBtnMouseLeave(event:EventMouse){
        let mouseIn = false;
        
        if (this.timer) {
            clearTimeout(this.timer);
        }
        

        // set new timer to check if mouse enter tagOrderChoiceBar blockB
        this.timer = setTimeout(() => {
            if (!this.isEnteredTagOrderChoiceBar && !mouseIn) {
                console.log("start leave")
                this.tagOrderChoiceBar.node.active = false;
            }
        }, 0.3);
        mouseIn = false;
    }

    // private onTagOrderChoiceBtnClick(tagOrderString: string){
        
    //     //this.finalTagOrder = tagOrderString.split(",");
    //     this.tagOrderChoiceBar.node.active = false;
    //     this.dropDownBarLayout.node.active = false;
        
    // }

    private cleanTagOrderChoices(){
        if(this.tagOrderChoiceBar.node.children == null) return;
        for(let child of this.tagOrderChoiceBar.node.children){
            this.tagOrderChoiceBtnList = new Array<Node>();
            child.destroy();
        }
    }
    
    
}

