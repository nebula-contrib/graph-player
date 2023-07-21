import { _decorator, CCInteger, CCString, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RelationManager')
export class RelationManager extends Component {

    @property({ type:Set })
    vertexIDBox:Set<string> = new Set<string>();

    @property({ type:Set})
    edgeNameBox:Set<string> = new Set<string>();

    @property(CCInteger)
    vertexCount:number = 0;

    @property(CCInteger)
    edgeCount:number = 0;

    protected onLoad(): void {
        this.vertexIDBox = new Set<string>();
        this.edgeNameBox = new Set<string>();

    }
    /**
     * set the vertexID self-defined
     * @param s 
     */
    public setVertexID(...args: string[]){ 
        
        if(args.length == 1){
            let [s] = args;
            this.vertexIDBox.add(s);
            this.vertexCount++;
            return s;
        }
        else{
            this.vertexCount++;
            this.vertexIDBox.add( "" + this.vertexCount);
            return "" + this.vertexCount;
        }
        
        
        // return this.vertexIDBox;
        
    }

    /**
     * pop the last element from Box
     */
    public removeVertex(vid: string){

        if(this.vertexIDBox.has(vid)){
            this.vertexIDBox.delete(vid);
            this.vertexCount--;
        }

    }

    public removeEdge(edgeName){
        if(this.edgeNameBox.has(edgeName)){
            this.edgeNameBox.delete(edgeName);
            this.edgeCount--;
        }

    }


    public setEdgeName(...args:string[]){
        if(args.length == 1){
            let [s] = args;
            this.edgeNameBox.add(s);
            this.edgeCount++;
            return s;
        }
        else{
            return "" + this.edgeCount;
        }
    }

    public resetVertexAndEdgeBox(){
        // console.log(this.vertexIDBox)
        this.vertexIDBox.clear();
        // this.vertexIDBox = new Set<string>();
        this.edgeNameBox.clear();
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

