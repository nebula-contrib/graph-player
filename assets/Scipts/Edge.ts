import { _decorator, Component, Node, Vec3,math } from 'cc';
import { Manager } from './Manager';
import { Vertex } from './Vertex';
const { ccclass, property } = _decorator;

@ccclass('Edge')
export class Edge extends Component {

    @property(Vec3)
    public startPosition:Vec3;

    @property(Number)
    public edgeId:number = -1;

    @property(Vec3)
    public endPosition:Vec3;
    
    @property(Number)
    public startVertexID:number = 0;

    @property(Number)
    public endVertexID:number = 0;

    /**
     * create Edge by the start vertex and end vertex
     * @param startVertex :Node of start
     * @param endVertex :Node of start
     */

    public createEdge(startVertex: Node,endVertex: Node){
        let start = startVertex.position, end = endVertex.position;
        this.startPosition = start;
        start = new Vec3(0,0,0);
        this.endPosition = end;
        const center = (start.clone()).add(end).multiplyScalar(0.5);
        this.node.setPosition(center);
        

        // set distance
        const length = Vec3.distance(start,end);
        this.node.setScale(0.01, 0.01, length); 

        const dir = Vec3.subtract(new Vec3(), end, start).normalize();
        const up = new Vec3(0, 0, 1);
        const quat = new math.Quat();
        math.Quat.rotationTo(quat, up, dir);
        this.node.setRotation(quat);
        
        // set ID
        this.startVertexID = startVertex.getComponent(Vertex).getVertexID();
        this.endVertexID = endVertex.getComponent(Vertex).getVertexID();
        this.edgeId = Manager.Instance().relationManager.setEdgeID();
    }

    

    /**
     * get the edge ID
     * @returns 
     */
    public getEdgeId(){
        return this.edgeId;
    }

}
