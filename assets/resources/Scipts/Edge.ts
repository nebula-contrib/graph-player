import { _decorator, Component, Node, Vec3,math, HingeConstraint, CCString, CCInteger,MeshRenderer } from 'cc';
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

    // @property(HingeConstraint)
    // public startJoint = new HingeConstraint();
    // @property(HingeConstraint)
    // public endJoint = new HingeConstraint();

    /**
     * create Edge by the start vertex and end vertex
     * @param startVertex :Node of start
     * @param endVertex :Node of start
     */

    public createEdge(startVertex: Node,endVertex: Node){
        let start = startVertex.worldPosition, end = endVertex.worldPosition;
        this.startPosition = start;
        this.endPosition = end;
        const center = (start.clone()).add(end).multiplyScalar(0.5);
        this.node.setWorldPosition(center);

        // set distance
        const length = Vec3.distance(start,end)/2;
        this.node.setScale(0.002, length, 0.002 ); 

        const dir = Vec3.subtract(new Vec3(), end, start).normalize();
        const right = new Vec3(0, 1, 0);
        const quat = new math.Quat();
        math.Quat.rotationTo(quat, right, dir);
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

    /**
     * change the material of edge node
     * material[1] is yellow --  the focused material
     * material[2] is white -- the original material
     * @param edgeNode 
     */
    public changeEdgeMaterialToFocused(){
        let focusMaterial = this.getComponent(MeshRenderer).getMaterial(1);
        this.node.getComponent(MeshRenderer).setMaterial(focusMaterial,0);
    }

    /**
     * return this edge node to original white material -- material[2]
     */
    public returnToInitialMaterial(){
        let initialMaterial = this.getComponent(MeshRenderer).getMaterial(2);
        this.getComponent(MeshRenderer).setMaterial(initialMaterial, 0);
    }

    /**
     * set the attribute of Edge by json
     * @param attribute 
     */
    public setAttribute(attribute: any) {
        for (let key in attribute) {
            if (this.hasOwnProperty(key)) {
                this[key] = attribute[key];
            }
        }
        this.edgeName = this.srcID +" "+this.edgeName+" "+this.dstID;
        Manager.Instance().relationManager.setEdgeName(this.edgeName);
    }

        /**
     * present the details of edge
     */
        public showEdgeDetails(){
            // console.log("Edge name:"+this.edgeName);
            
            // console.log("src vectex ID:"+this.srcID);
            Manager.Instance().UIManager.setRichInfo("Edge name:"+this.edgeName);
            Manager.Instance().UIManager.addRichInfo("src vectex ID:"+this.srcID);
            Manager.Instance().UIManager.addRichInfo("dst vectex ID:"+this.dstID);
           
            // for(let key in this.properties){
            //     console.log("key:",key);
            //     console.log(key+": "+this.properties[key]);
            //     Manager.Instance().UIManager.addRichInfo(key+": "+this.properties[key]);
            // }
            this.printNestedJSON(this.properties,"properties");
            Manager.Instance().UIManager.addRichInfo("rank:"+this.rank);
        }

    private printNestedJSON(obj, parentKey = '') {
         for (let key in obj) {
           let newKey = parentKey ? `${parentKey}.${key}` : key;
           if (typeof obj[key] === 'object' && obj[key] !== null) {
             this.printNestedJSON(obj[key], newKey);
           } else {
            Manager.Instance().UIManager.addRichInfo(key+": "+this.properties[key]);
           }
         }
    }

}
