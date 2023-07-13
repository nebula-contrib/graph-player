import { _decorator, CCInteger, CCString, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RelationManager')
export class RelationManager extends Component {

    @property({ type:[CCString] })
    vertexIDBox:[String];

    @property({ type:[CCString]})
    edgeNameBox:[String];

    @property(CCInteger)
    vertexCount:number = 0;

    @property(CCInteger)
    edgeCount:number = 0;

    /**
     * set the vertexID self-defined
     * @param s 
     */
    public setVertexID(...args: String[]){ 
        if(args.length == 1){
            let [s] = args;
            this.vertexIDBox.push(s);
            this.vertexCount++;
            return s;
        }
        else{
            return "" + this.vertexCount;
        }
        // return this.vertexIDBox;
    }



    public setEdgeName(...args:String[]){
        if(args.length == 1){
            let [s] = args;
            this.edgeNameBox.push(s);
            this.edgeCount++;
            return s;
        }
        else{
            return "" + this.edgeCount;
        }
    }

    public resetVertexAndEdgeBox(){
        this.vertexIDBox = [""];
        this.edgeNameBox = [""];
        this.vertexCount = 0;
        this.edgeCount = 0;
    }

    public existVertex(vertexID:String):boolean{
        for(let entry of this.vertexIDBox){
            if(vertexID == entry) return true;
        }
        return false;
    }

    public existEdge(edgeName:String):boolean{
        for(let entry of this.edgeNameBox){
            if(edgeName == entry) return true;
        }
        return false;
    }


}

