import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RelationManager')
export class RelationManager extends Component {

    @property(Number)
    vertexIDBox:number = 0;

    @property(Number)
    edgeIDBox:number = 0;

    protected onLoad(): void {
        console.log("relationMAnager is prepared")
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    public setVertexID(){
        this.vertexIDBox++;
        return this.vertexIDBox;
    }

    public setEdgeID(){
        this.edgeIDBox++;
        return this.edgeIDBox;
    }

    public resetVertexAndEdgeBox(){
        this.vertexIDBox = 0;
        this.edgeIDBox = 0;
    }
}

