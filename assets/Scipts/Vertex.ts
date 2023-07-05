import { _decorator, Component, Node } from 'cc';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;

@ccclass('Vertex')
export class Vertex extends Component {

    @property(Number)
    public vertexId: number = -1;

    @property({type:[Number]})
    public edgesSetOfVertex:[number]

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

    onLoad() {
        // this.setVertexId();
    }

    update(deltaTime: number) {
        
    }
}

