import { _decorator, Component, Node, Vec3,math, HingeConstraint, CCString, CCInteger } from 'cc';
import { Manager } from './Manager';
import { Vertex } from './Vertex';


const { ccclass, property } = _decorator;

@ccclass('Edge')
export class Edge extends Component {

    @property(Vec3)
    public startPosition:Vec3;
    @property(Vec3)
    public endPosition:Vec3;

    @property(CCString)
    public edgeName:String = "";
    @property(CCString)
    public srcID:String = "";
    @property(CCString)
    public dstID:String = "";
    @property(Object)
    public properties: Object = new Object();
    @property(CCInteger)
    public rank: number = 0;
    @property(CCString)
    public type: String = "edge";

    @property(HingeConstraint)
    public startJoint = new HingeConstraint();
    @property(HingeConstraint)
    public endJoint = new HingeConstraint();

    /**
     * create Edge by the start vertex and end vertex
     * @param startVertex :Node of start
     * @param endVertex :Node of start
     */

    public createEdge(startVertex: Node,endVertex: Node){
        let start = startVertex.worldPosition, end = endVertex.worldPosition;
        this.startPosition = start;
        //start = new Vec3(0,0,0);
        this.endPosition = end;
        const center = (start.clone()).add(end).multiplyScalar(0.5);
        this.node.setWorldPosition(center);


        // set distance
        const length = Vec3.distance(start,end);
        this.node.setScale(0.002, 0.002, length); 

        const dir = Vec3.subtract(new Vec3(), end, start).normalize();
        const up = new Vec3(0, 0, 1);
        const quat = new math.Quat();
        math.Quat.rotationTo(quat, up, dir);
        this.node.setRotation(quat);
        
        // set ID
        this.srcID = startVertex.getComponent(Vertex).getVertexID();
        this.dstID = endVertex.getComponent(Vertex).getVertexID();
        //this.edgeName = Manager.Instance().relationManager.setEdgeName();

                
        //set joint

        // this.startJoint = new HingeConstraint();
        // this.startJoint.connectedBody = startVertex.getComponent(RigidBody);

        // console.log("try to joint start!", this.startJoint.connectedBody);
        // this.startJoint.pivotA = start.clone().subtract(center);
        // this.startJoint.axis = new Vec3(0, 1, 0);
        // this.startJoint.pivotB = new Vec3(0, 0, 0);
        // console.log("joint start!");
        // this.endJoint = new HingeConstraint()
        // this.endJoint.connectedBody = endVertex.getComponent(RigidBody);
        // // this.endJoint.pivotA = end.clone().subtract(center);
        // // this.endJoint.pivotB = new Vec3(0, 0, 0);
        // console.log("joint end!")
    }



    /**
     * get the edge ID
     * @returns:String 
     */
    public getEdgeName(){
        return this.edgeName;
    }

    public setAttribute(attribute: any) {
        for (let key in attribute) {
            if (this.hasOwnProperty(key)) {
                this[key] = attribute[key];
            }
        }
        this.edgeName = this.srcID +" "+this.edgeName+" "+this.dstID;
        Manager.Instance().relationManager.setEdgeName(this.edgeName);
    }

}
