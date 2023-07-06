import { _decorator, Component, FixedJoint2D, MeshRenderer, Node } from 'cc';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;

@ccclass('Vertex')
export class Vertex extends Component {

    @property(Number)
    public vertexId: number = -1;

    @property({type:[Number]})
    public edgesSetOfVertex:[number]

    @property(Boolean)
    public isClicked:false; // if the vertex is clicked once

    

    /**
     * 0 -- current material
     * 1 -- focus material
     * 2~ --  random initial material
     */
    @property(Number)
    public materialCode = 2; //

    // @property(Boolean)
    // public isFocus:false;

    public setEntry(entry: Node){
        this.node.setWorldPosition(entry.worldPosition);
    }


    public setVertexId(){
        // console.log("Manager.Instance().relationManager:",Manager.Instance().relationManager);
        this.vertexId = Manager.Instance().relationManager.setVertexID();
        console.log("set vertex id:", this.vertexId);
    }


    public getVertexID(){
        console.log("vertex id:",this.vertexId);
        return this.vertexId;
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
    onLoad() {
        // this.setVertexId();
    }

    update(deltaTime: number) {
        
    }
}

