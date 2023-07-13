import { _decorator, CCBoolean, CCInteger, CCString, Component, FixedJoint2D, MeshRenderer, Node } from 'cc';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;

@ccclass('Vertex')
export class Vertex extends Component {

    @property(CCString)
    public vid: String = "";
    @property([CCString])
    public tags: [String];
    @property(Object)
    public properties: Object =  new Object;
    @property(CCString)
    public type:String = "vertex";


    @property({type:[CCInteger]})
    public edgesSetOfVertex:[number]

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

    public setAttribute(attribute: any) {
        for (let key in attribute) {
            if (this.hasOwnProperty(key)) {
                this[key] = attribute[key];
            }
        }
        Manager.Instance().relationManager.setVertexID(this.vid);
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

    public setInitialMaterialCode(code:number){
        this.materialCode = code;
    }

    public getInitialMaterialCode(){
        return this.materialCode;
    }

    public showVertexDetails(){
        console.log("show detail Vertex ID:"+this.vid);
        
        console.log("tag:",this.tags);
        Manager.Instance().UIManager.setRichInfo("Vertex vid:"+this.vid);
        Manager.Instance().UIManager.addRichInfo("tag:"+this.tags);
        for(let key in this.tags){
            console.log(key+": "+this.tags[key]);
            Manager.Instance().UIManager.addRichInfo(key+": "+this.tags[key]);
        }

        for(let key in this.properties){
            if (this.properties.hasOwnProperty(key)) {  
                for(let obj in this.properties[key]){
                    console.log(obj + ": "+(this.properties[key])[obj]);
                    Manager.Instance().UIManager.addRichInfo(obj + ": "+(this.properties[key])[obj]);
                }
                

            }
                
        }
    }

}

