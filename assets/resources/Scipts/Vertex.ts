import { _decorator, CCBoolean, CCInteger, CCString, Component, FixedJoint2D, MeshRenderer, Node } from 'cc';
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

    @property(Boolean)
    public isLayouted = false;

    @property({type:[Edge]})
    public edgesSetOfVertex:Edge[] = [];

    @property(CCBoolean)
    public isClicked:false; // if the vertex is clicked once

    

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

       
    }

    public setWorldPosition(entry: Node){
        this.node.setWorldPosition(entry.worldPosition);
    }


    public setVertexId(){
        // console.log("Manager.Instance().relationManager:",Manager.Instance().relationManager);
        this.vid = Manager.Instance().relationManager.setVertexID();
        //console.log("set vertex id:", this.vertexId);
    }


    public getVertexID(){
        //console.log("vertex id:",this.vertexId);
        return this.vid;
    }

    public returnToInitialMaterial(){
        let initialMaterial = this.getComponent(MeshRenderer).getMaterial(this.materialCode);
        this.getComponent(MeshRenderer).setMaterial(initialMaterial, 0);
    }

    public setMaterialCode(code:number){
        this.materialCode = code;
    }

    /**
     * change material 
     * @param materialIndex: the code of changed material 
     */
    public changeMaterial(materialIndex:number){
        let tmpMaterial = this.getComponent(MeshRenderer).getMaterial(materialIndex);
        this.getComponent(MeshRenderer).setMaterial(tmpMaterial, 0);
    }

    public getMaterialCode(){
        return this.materialCode;
    }

    /**
     * present the details of vertex
     */
    public showVertexDetails(){
        console.log("show detail Vertex ID:"+this.vid);
        
        console.log("tag:",this.tags);
        Manager.Instance().UIManager.setRichInfo("Vertex vid:"+this.vid);
        Manager.Instance().UIManager.addRichInfo("tag:"+this.tags);
        // for(let key in this.tags){
        //     console.log(key+": "+this.tags[key]);
        //     Manager.Instance().UIManager.addRichInfo(key+": "+this.tags[key]);
        // }

        // for(let key in this.properties){
        //     if (this.properties.hasOwnProperty(key)) {  
        //         for(let obj in this.properties[key]){
        //             console.log(obj + ": "+(this.properties[key])[obj]);
        //             Manager.Instance().UIManager.addRichInfo(obj + ": "+(this.properties[key])[obj]);
        //         }
        //     }
                
        // }
        this.printNestedJSON(this.properties,"properties");
    }

    public addEdgeInfoOnVertex(edge:Edge){
        
        this.edgesSetOfVertex.push(edge);
        Manager.Instance().vertexManager.vertexEdgeDic[this.vid].push(edge.getedgeID());
    }
    
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

}

