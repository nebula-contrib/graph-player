import { _decorator, Component, Node, Vec3,math, HingeConstraint, CCString, CCInteger,MeshRenderer, Collider, PhysicsGroup } from 'cc';
import { Manager } from './Manager';
import { Vertex } from './Vertex';
import { PHY_GROUP } from './Constant';


const { ccclass, property } = _decorator;

@ccclass('Edge')
export class Edge extends Component {

    @property(Vertex)
    public startVertex:Vertex;
    @property(Vertex)
    public endVertex:Vertex;

    @property(CCString)
    public edgeName:string = "";
    @property(CCString)
    public edgeID:string = "";
    @property(CCString)
    public srcID:string = "";
    @property(CCString)
    public dstID:string = "";
    @property(Object)
    public properties: Object = new Object();
    @property(CCInteger)
    public rank: number = 0;
    @property(CCString)
    public type: String = "edge";
    @property(Boolean)
    public isLayouted:boolean = false;

    // @property(HingeConstraint)
    // public startJoint = new HingeConstraint();
    // @property(HingeConstraint)
    // public endJoint = new HingeConstraint();

    /**
     * create Edge by the start vertex and end vertex
     * @param startNode:Node of start
     * @param endNode :Node of start
     */
    public createEdgeWithStartAndEnd(startNode: Node,endNode: Node){
        this.startVertex = startNode.getComponent(Vertex);
        this.endVertex = endNode.getComponent(Vertex);
        let start = startNode.worldPosition, end = endNode.worldPosition;
        // this.startPosition = start;
        // this.endPosition = end;
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
        this.srcID = this.startVertex.getVertexID();
        this.dstID = this.endVertex.getVertexID();
        //this.edgeID = Manager.Instance().relationManager.setedgeID();

                
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
     * change position with startNode and endNode
     * @param startNode 
     * @param endNode 
     */
    public resetPosition(startNode: Node,endNode: Node){
        let start = startNode.worldPosition, end = endNode.worldPosition;
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
    }

    /**
     * In Edge class
     * add edge info in individual vertex, veretex manager and edge manager
     * must call after the edge basic info and vertex basic info be given 
     * better called after setAttribute()
     */
    public addAllThisVertexEdgeInfoOnEdge(){
        if(Manager.Instance().vertexManager.vertexEdgeDic[this.srcID] == null) 
        {
            Manager.Instance().vertexManager.vertexEdgeDic[this.srcID] = [];
        }
        if(Manager.Instance().vertexManager.vertexEdgeDic[this.dstID] == null) 
        {
            Manager.Instance().vertexManager.vertexEdgeDic[this.dstID] = [];
        }
        //Manager.Instance().vertexManager.vertexEdgeDic[this.srcID].push(this.edgeID);
        this.startVertex.addEdgeInfoOnVertex(this);
        this.endVertex.addEdgeInfoOnVertex(this);

        Manager.Instance().edgeManager.edgeVertexDic[this.edgeID] = [this.srcID, this.dstID];
    }

    /**
     * get the edge ID
     * @returns:String 
     */
    public getEdgeID(){
        return this.edgeID;
    }

    /**
     * change the material of edge node
     * material[1] is yellow --  the focused material
     * material[2] is white -- the original material
     * @param edgeNode 
     */
    public changeEdgeMaterialToFocused(){

        let focusMaterial = this.getComponent(MeshRenderer).getSharedMaterial(1);
        this.node.getComponent(MeshRenderer).setMaterial(focusMaterial,0);
    }

    /**
     * return this edge node to original white material -- material[2]
     */
    public returnToInitialMaterial(){
        let initialMaterial = this.getComponent(MeshRenderer).getSharedMaterial(2);
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
        this.edgeID = this.srcID +" "+this.edgeName+" "+this.dstID;
        //console.log("Edge ID:"+this.edgeID)
        Manager.Instance().relationManager.setEdgeID(this.edgeID);
    }

        /**
     * present the details of edge
     */
    public showEdgeDetails(){
        // console.log("Edge name:"+this.edgeID);
        
        // console.log("src vectex ID:"+this.srcID);
        
       
        
        Manager.Instance().UIManager.setRichInfo("Edge name:"+this.edgeName);
        Manager.Instance().UIManager.setRichInfo("Edge ID:"+this.edgeID);
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
