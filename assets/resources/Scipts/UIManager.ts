import { _decorator, Component, Node,EventHandler,Button, RichText, Layout, EventMouse,resources, Prefab, instantiate, Label, UITransform, EditBox } from 'cc';
const { ccclass, property } = _decorator;
import { Manager } from './Manager';
import { Vertex } from './Vertex';
import { HttpRequest } from './HttpRequest';
import { Graphplayer } from './Graphplayer';

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


    /** record the list of tags */
    @property(Layout)
    public tagOrderChoiceBar:Layout;
    @property({type: [Node]})
    public tagOrderChoiceBtnList:Array<Node>;
    @property(Prefab)
    private tagOrderChoiceBtnPrefab:Prefab 

    /**for user to input instruction */
    @property(EditBox)
    public userInputBar:EditBox;

    @property(Button)
    public submitInputButton:Button;

    /** hide UI */
    @property(Button)
    public hideUIColumnBtn:Button;
    /** show the hiden UI */
    @property(Button)
    public showUIColumnBtn:Button;

    /**  root node of hide column*/
    @property(Node)
    public hideColumnNode:Node;

    // public jsonResponseUrl = "http://127.0.0.1:8050"; // get the table-details 

    private vertexIDLabelManager: Node;

    private vertexIDLabelPrefab: Prefab;




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



    protected onLoad(): void {
            // initiate infomation bar
            this.nodeInfoBar = this.node.getChildByName('InfoBar');
            this.nodeInfoText = this.nodeInfoBar.getChildByName('NodeInfoText').getComponent(RichText);
            // input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this); // set the progation prevented
            // input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
            // this.tagOrderChoiceBtnList = new Array<Node>();
                    // 使用cc.resources.load来加载预制体
        resources.load("Prefab/VertexIDLabel" , Prefab, (err, prefab) => {
            if (err) {
                console.error("Failed to load prefab:", err);
                return;
            }
            else{
                this.vertexIDLabelPrefab = prefab;
            }
        });

        // this.jsonResponseUrl = Manager.Instance().graphPlayer.getServerAddress();
        // console.log("address:", Manager.Instance().graphPlayer.getServerAddress())
    }

    start () {


        // initiate hide column button
        this.hideUIColumnBtn = this.node.getChildByName("HideUIColumnBtn").getComponent(Button);
        const hideUIColumnClickEventHandler = new EventHandler();
        hideUIColumnClickEventHandler.target = this.node;
        hideUIColumnClickEventHandler.component = 'UIManager';
        hideUIColumnClickEventHandler.handler = 'hideUIColumn';
        this.hideUIColumnBtn.clickEvents.push(hideUIColumnClickEventHandler);

        // initiate show column button

        this.showUIColumnBtn = this.node.getChildByName("ShowUIColumnBtn").getComponent(Button);
        const showUIColumnClickEventHandler = new EventHandler();
        showUIColumnClickEventHandler.target = this.node;
        showUIColumnClickEventHandler.component = 'UIManager';
        showUIColumnClickEventHandler.handler = 'showUIColumn';
        this.showUIColumnBtn.clickEvents.push(showUIColumnClickEventHandler);
        /**
        * hide cloumn
        */

         this.hideColumnNode =  this.node.getChildByName('HideColumn');
        
        // initiate user input bar
        this.userInputBar = this.hideColumnNode.getChildByName("UserInputBar").getComponent(EditBox);
        this.submitInputButton = this.hideColumnNode.getChildByName('SubmitInputBtn').getComponent(Button);
        const submitInputClickEventHandler = new EventHandler();
        submitInputClickEventHandler.target = this.node;
        submitInputClickEventHandler.component = 'UIManager';
        submitInputClickEventHandler.handler = 'submitUserInput';
        this.submitInputButton.clickEvents.push(submitInputClickEventHandler);
  
       
        // initiate refresh button
        const refreshClickEventHandler = new EventHandler();
        // this.refreshBtn = this.node.getChildByName('RefreshBtn').getComponent(Button);
        this.refreshBtn = this.hideColumnNode.getChildByName('RefreshBtn').getComponent(Button);
        refreshClickEventHandler.target = this.node; // node name
        refreshClickEventHandler.component = 'UIManager';// script name
        refreshClickEventHandler.handler = 'RefreshCanvas'; // method name
        // const button = this.node.getComponent(Button);
        this.refreshBtn.clickEvents.push(refreshClickEventHandler);

        // initiate the JSON button
        // const createCanvasFromJSONFileEventHandler =  new EventHandler();
        // this.createCanvasFromJSONButton = this.node.getChildByName('CreateByJSONBtn').getComponent(Button);
        // this.createCanvasFromJSONEditBox = this.createCanvasFromJSONButton.node.getChildByName("EditBox").getComponent(EditBox);
        // createCanvasFromJSONFileEventHandler.target = this.node;
        // createCanvasFromJSONFileEventHandler.component = 'UIManager';
        // createCanvasFromJSONFileEventHandler.customEventData = 'web';
        // createCanvasFromJSONFileEventHandler.handler = 'createCanvasFromJSONFile';
        // this.createCanvasFromJSONButton.clickEvents.push(createCanvasFromJSONFileEventHandler);

        /**
         * initial the drop-down bar
         */
        this.dropDownBarLayout =  this.node.getChildByName("DropDownBar").getComponent(Layout);
        this.dropDownBarLayout.node.active = false;
        
        // initial Layout Btn

        const layoutEventHandler = new EventHandler();

        // this.layoutBtn = this.node.getChildByName("LayoutGreyBtn").getComponent(Button);
        this.layoutBtn = this.hideColumnNode.getChildByName("LayoutGreyBtn").getComponent(Button);
        this.tagOrderChoiceBar = this.layoutBtn.node.getChildByName("TagOrderChoiceBar").getComponent(Layout); 
        this.tagOrderChoiceBar.node.active = false;
        /**
         * listen on layout btn
         */


        this.layoutBtn.node.on(Node.EventType.MOUSE_ENTER, this.chooseLayoutBtn.bind(this, layoutEventHandler),this);
        
        this.layoutBtn.node.on(Node.EventType.MOUSE_LEAVE, this.onLayoutBtnMouseLeave,this);
  
        //this.tagOrderChoiceBar.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnterTagOrderChoiceBar, this);
        this.tagOrderChoiceBar.node.on(Node.EventType.MOUSE_MOVE, this.onMouseEnterTagOrderChoiceBar, this); // listen on mouse enter in tagOrderChoiceBar 
        // this.tagOrderChoiceBar.node.on(Node.EventType.MOUSE_LEAVE,(event:EventMouse) => {
        //     this.isEnteredTagOrderChoiceBar = false;
        // }, this);

        /** close by click mouse on CanvasMAnager.onMouseUp() */
        this.tagOrderChoiceBar.node.on(Node.EventType.MOUSE_LEAVE,this.onMouseLeaveTagOrderChoiceBar, this);
        // // initial createVertexBtn 
        // const createVertexEventHandler = new EventHandler();
        // this.createVertexBtn = this.dropDownBarLayout.node.getChildByName("CreateVertexBtn").getComponent(Button);
        // createVertexEventHandler.target = this.node;
        // createVertexEventHandler.component = "UIManager";
        // createVertexEventHandler.handler = "createVertex";
        // this.createVertexBtn.clickEvents.push(createVertexEventHandler);

        // // initial deleteVeretxBtn
        // const deleteVertexEventHandler = new EventHandler();
        // this.deleteVertexBtn = this.dropDownBarLayout.node.getChildByName("DeleteVertexBtn").getComponent(Button);
        // deleteVertexEventHandler.target = this.node;
        // deleteVertexEventHandler.component = "UIManager";
        // deleteVertexEventHandler.handler = "createVertex";
       

        // this.deleteVertexBtn.clickEvents.push(createVertexEventHandler);



    }

    /**
     * hide UI column
     * @param event 
     */
    private hideUIColumn(event:Event){
        this.hideColumnNode.active = false;
        this.showUIColumnBtn.node.active = true;
        this.hideUIColumnBtn.node.active = false;

    }
    
    /**
     * show UI column 
     * @param event 
     */
    private showUIColumn(event:Event){
        this.hideColumnNode.active = true;
        this.hideUIColumnBtn.node.active = true;
        this.showUIColumnBtn.node.active = false;

    }
    
    /**
     * submit input in userInputBar to server
     * @param event 
     */
    public submitUserInput(event:Event){

        let content = this.userInputBar.string;
        try{
            HttpRequest.send(Manager.Instance().graphPlayer.getServerAddress(), { nGQL: content }).then((response) => {
                Manager.Instance().canvasManager.cleanCanvas();
                Manager.Instance().JSONReader.createdByJSON(response);
            
            }).catch((error) => {

                console.error(error);
            });
            this.userInputBar.string = "";
        }
        catch(error){
            console.log(error)
        }
    }

    public RefreshCanvas(event:Event){
        
        Manager.Instance().canvasManager.resetCanvas();
        //Manager.Instance().JSONReader.putJSONtoModel("");


        
    }


    /**
     * 
     * @param event 
     * @param method:"local" or "web" 
     */
    // public createCanvasFromJSONFile(event:Event, method: string){
    //     Manager.Instance().canvasManager.cleanCanvas();
        
    //     if(method == "local"){
    //         const jsonFilename = this.createCanvasFromJSONEditBox.string;
    //         Manager.Instance().JSONReader.putJSONtoModel(jsonFilename);
    //     }
    //     else if(method == "web"){
        
    //         Manager.Instance().JSONReader.createByURL(this.jsonResponseUrl);
    //    }
    // }

    

    public createVertex(event:Event){
        // if the node is vertex
       
        
        if(Manager.Instance().vertexManager.chosenVertex != null && Manager.Instance().edgeManager.chosenEdgeNode == null){
            
            let childVertex = Manager.Instance().vertexManager.createNodeAround(Manager.Instance().vertexManager.chosenVertex);
            Manager.Instance().edgeManager.createEdgeWithStartAndEnd(Manager.Instance().vertexManager.chosenVertex, childVertex);
        }
        else if(Manager.Instance().vertexManager.chosenVertex == null && Manager.Instance().edgeManager.chosenEdgeNode != null){
            
            /**
             * To-do create on edge
             */

        }
        this.dropDownBarLayout.node.active = false;
    }

    /**
     * when press layout btn
     * @param event 
     * @param finalTagOrder 
     */
    public changeLayout(event:Event, finalTagOrder: string){
        let finalTagOrderList = finalTagOrder.split(",");
        //console.log("finalTagOrder:",finalTagOrder+"finalTagOrderList:",finalTagOrderList)
        this.tagOrderChoiceBar.node.active = false;
        this.dropDownBarLayout.node.active = false;
        
        Manager.Instance().vertexManager.removeLayoutFlags();
        
        Manager.Instance().edgeManager.removeLayoutFlags();
        
        Manager.Instance().layoutManager.classifyNodeByTag();
        Manager.Instance().layoutManager.adjustOrderOfTags(finalTagOrderList);
        // Manager.Instance().layoutManager.adjustOrderOfTags(["team","player"]);
        Manager.Instance().layoutManager.materialReallocated();
        Manager.Instance().layoutManager.reLayoutByTags();
    }


    /**
     * when mouse enter drop down bar of tag of layout 
     * @param event 
     */
    private onMouseEnterTagOrderChoiceBar(event: EventMouse){
        
        this.isEnteredTagOrderChoiceBar = true;
       
    }

    /**
     * when mouse leave drop down bar of tag of layout 
     * @param event 
     */
    private onMouseLeaveTagOrderChoiceBar(event:EventMouse){
       
        this.isEnteredTagOrderChoiceBar = false;
        
        this.tagOrderChoiceBar.node.active = false;
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

    /**
     * clean info of info bar
     */
    public cleanAndDisableInfoBar(){
        this.nodeInfoText.string = "";
        this.nodeInfoBar.active = false;
    }

    /**
     * show the order of tags
     */
    private chooseLayoutBtn(){
        
        try{
            this.cleanTagOrderChoices();
            
            /** 
             * read the possible layout order 
             */
            let tagList = Array.from(Manager.Instance().vertexManager.vertexTagSet);
            if(tagList.length == 0) return;
            /**
             * order of
             */
            // let tagOrderList = [];
            // this.generatePermutations(tagList,[],tagOrderList);
            let tagOrderList = Object.keys(Manager.Instance().relationManager.tagDegreeDic);
            let tagOrderNum = tagOrderList.length;
            // let this.tagOrderChoiceBtnList = []
            this.tagOrderChoiceBar.getComponent(UITransform).setContentSize(this.BtnLength, (tagOrderNum) * this.BtnWidth);
            this.tagOrderChoiceBtnList = new Array<Node>(tagOrderNum);
            
            
            /**
             * show the layout order choices 
            */
            
                for(let i = 0; i < tagOrderList.length; i++){
                    const tagOrderBtn = instantiate(this.tagOrderChoiceBtnPrefab);
                
                    tagOrderBtn.setParent(this.tagOrderChoiceBar.node);
                    tagOrderBtn.setPosition(0, i * this.BtnWidth, 0);
                    tagOrderBtn.getChildByName('Label').getComponent(Label).string = tagOrderList[i]; // set the string of tag order button
                    
                    const tagOrderChoiceHandler = new EventHandler();
                    tagOrderChoiceHandler.target = this.node;
                    tagOrderChoiceHandler.component = "UIManager";
                    tagOrderChoiceHandler.handler = "changeLayout";
                   
                    tagOrderChoiceHandler.customEventData = this.getPermutationByTagDegree(tagOrderList[i]).join(",");
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
     * get the permutation of tags by their degree
     * @param firstElement 
     * @returns 
     */
    private getPermutationByTagDegree(firstElement: string){
        let tagOrderList = new Array<string>();
        let dic = Manager.Instance().relationManager.tagDegreeDic;
        let arr = Object.keys(Manager.Instance().relationManager.tagDegreeDic);
        
        tagOrderList.push(firstElement);
        for(let i = 0; i < arr.length; i++){
            if(arr[i] == firstElement) continue;
             for(let j = 0; j < arr.length - 1; j++)
             {
                const key1 = arr[i];
                const key2 = arr[j];
                if(dic[key1] > dic[key2]){
                    [arr[i], arr[j]] = [arr[j],arr[i]];
                }
             }
        }
        
        
        for(let tag of arr){
            if(tag != firstElement)
                tagOrderList.push(tag);
            
        }
        //console.log("tagOrderList:",tagOrderList)
        return tagOrderList;
    }


    /**
     * get the all the permutation of tags
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
            if (!this.isEnteredTagOrderChoiceBar) {
                
                this.tagOrderChoiceBar.node.active = false;
            }
        }, 0.3);
        
    }

    // private onTagOrderChoiceBtnClick(tagOrderString: string){
        
    //     //this.finalTagOrder = tagOrderString.split(",");
    //     this.tagOrderChoiceBar.node.active = false;
    //     this.dropDownBarLayout.node.active = false;
        
    // }

    private cleanTagOrderChoices(){
        this.isEnteredTagOrderChoiceBar = false;
        if(this.tagOrderChoiceBar.node.children == null) return;
        for(let child of this.tagOrderChoiceBar.node.children){
            this.tagOrderChoiceBtnList = new Array<Node>();
            child.destroy();
        }
    }
    

    /**
     * set vertex ID Label for each vertex
     * @param vertex: Vertex
     */
    public setVeretxIDLabel(vertex: Vertex){
        // const vertexIDLabel = instantiate(this.vertexIDLabelPrefab);
        // vertexIDLabel.setWorldPosition(vertex.node.worldPosition.x + 0.5, vertex.node.worldPosition.y + 1.5, 0);
        // vertexIDLabel.getComponent(Label).string = vertex.vid;
    }
    
}

