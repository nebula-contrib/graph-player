import { _decorator, CCBoolean, CCInteger, CCString, Color, Component, input, Input, Label, MeshRenderer, Node, Vec4 } from 'cc';
import { Manager } from './Manager';
import { Edge } from './Edge';
const { ccclass, property } = _decorator;

@ccclass('Vertex')
export class Vertex extends Component {

    @property(CCString)
    public vid: string = "";
    @property([CCString])
    public tags: [string];
    @property(Object)
    public properties: Object =  new Object;
    @property(CCString)
    public type:string = "vertex";

    @property(Number)
    public degree:number = 0;

    @property(Boolean)
    public isLayouted = false;

    @property({type:[Edge]})
    public edgesSetOfVertex:Edge[] = [];

    @property(Label)
    public idLabel = null;

    @property(CCBoolean)
    public isClicked:false; // if the vertex is clicked once

    
    protected onLoad(): void {
        this.idLabel = this.node.getChildByName("ID").getComponent(Label);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        // console.log("id node:",this.idLabel)
    }
    /**
     * 0 -- current material
     * 1 -- focus material
     * 2~ --  random initial material
     */
    @property(CCInteger)
    public materialCode = 2; //

    // @property(Boolean)
    // public isFocus:false;

    /**
     * move mouse and keep the label on the same direction with camera
     * This results in a slight stutter each time the rotation occurs.
     */
    private onMouseMove(){

        if(Manager.Instance().canvasManager.cameraRotateAroundVertex&&Manager.Instance().graphPlayer.isVertexIDFollowCamera){
            try{
                let positionA = this.idLabel.node.getWorldPosition();
                // console.log("move on vertex id:",positionA);
                let positionB =Manager.Instance().cameraController.camera.node.worldPosition;
                let vectorAB = positionB.clone().subtract(positionA);
                let oppositeVector = positionA.clone().subtract(vectorAB);
                this.idLabel.node.lookAt(oppositeVector);

            }
            catch(error){
                console.log(error);
            }
           
        }


    

    }
    /**
     * set the attribute of vertex by JSON Object
     * @param attribute 
     */
    public setAttribute(attribute: any) {
        //Manager.Instance().relationManager.popLastVertex();
        if(this.vid != ""){
            Manager.Instance().relationManager.removeVertex(this.vid);
            
        }
         //Manager.Instance().relationManager.popLastVertex();

        for (let key in attribute) {
            if (this.hasOwnProperty(key)) {
                this[key] = attribute[key];
            }
        }
        Manager.Instance().relationManager.setVertexID(this.vid);
        for(let tag of this.tags){
            Manager.Instance().vertexManager.addTag(tag);
        }
        //console.log("vid:",this.vid)
        //console.log("idlabel:",this.idLabel)
        this.idLabel.string = this.vid;


       
    }

    /**
     * set the worldposition of entry
     * @param entry 
     */
    public setWorldPosition(entry: Node){
        this.node.setWorldPosition(entry.worldPosition);
    }


    /**
     * for those create vertex without certain vid
     * then set vid by random 
     */
    public setVertexId(){
        // console.log("Manager.Instance().relationManager:",Manager.Instance().relationManager);
        this.vid = Manager.Instance().relationManager.setVertexID();
        //this.idLabel.string = this.vid;
        //console.log("set vertex id:", this.vertexId);
    }


    /**
     * get vertex id
     * @returns: string
     */
    public getVertexID(){
        //console.log("vertex id:",this.vertexId);
        return this.vid;
    }

    /**
     * return chosen vertex to original material
     */
    public returnToInitialMaterial(){
        let initialMaterial = this.getComponent(MeshRenderer).getSharedMaterial(this.materialCode);
        this.getComponent(MeshRenderer).setMaterial(initialMaterial, 0);
    }

    /**
     * set the material code
     * @param code: number
     */
    public setMaterialCode(code:number){
        this.materialCode = code;
    }

    /**
     * get the material coed
     * @returns: number 
     */
    public getMaterialCode(){
        return this.materialCode;
    }


    /**
     * change material 
     * @param materialIndex: the code of changed material 
     */
    public changeMaterial(materialIndex:number){
        // console.log("idlabel:",this.idLabel);
        let tmpMaterial = this.getComponent(MeshRenderer).getSharedMaterial(materialIndex);
        this.getComponent(MeshRenderer).setMaterial(tmpMaterial, 0);

        // set color of idlabel
        const passes = this.getComponent(MeshRenderer).getSharedMaterial(0).passes[0];
        const colorUniform = passes.getUniform(passes.getHandle('albedo'),new Vec4(1, 1,0,0));
       
        const color = new Color(colorUniform.x * 255, colorUniform.y* 255, colorUniform.z* 255, colorUniform.w * 255);
        this.idLabel.color = color; 
        
    }

    /**
     * present the details of vertex
     */
    public showVertexDetails(){
        //console.log("show detail Vertex ID:"+this.vid);
        
        //console.log("tag:",this.tags);
        Manager.Instance().UIManager.nodeInfoBar.active = true;
        Manager.Instance().UIManager.setRichInfo("Vertex vid:"+this.vid);
        Manager.Instance().UIManager.addRichInfo("tag:"+this.tags);
        
        this.printNestedJSON(this.properties,"properties");
        
    }

    /**
     * push edge into edgeSet
     * @param edge 
     */
    public addEdgeInfoOnVertex(edge:Edge){
        
        this.edgesSetOfVertex.push(edge);
        Manager.Instance().vertexManager.vertexEdgeDic[this.vid].push(edge.getEdgeID());
    }
    
    /**
     * print json of infomation
     * @param obj 
     * @param parentKey 
     */
    private printNestedJSON(obj, parentKey = '') {
        for (let key in obj) {
          let newKey = parentKey ? `${parentKey}.${key}` : key;
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            this.printNestedJSON(obj[key], newKey);
          } else {
                Manager.Instance().UIManager.addRichInfo(key+": "+obj[key]);
          }
        }
   }

   /**
    * increase vertex degree
    */
   public increaseVertexDegree(){
    this.degree++;
    //console.log("vertex:",vid," number:",this.vertexDegreeDic[vid])
}

}

