import { _decorator, Component, Prefab, instantiate, Node, Vec3,Quat } from 'cc';
import { Manager } from './Manager';
import { Vertex } from './Vertex';
const { ccclass, property } = _decorator;

@ccclass('VertexManager')
export class VertexManager extends Component {

    node: Node;
    // @property(Vec3)
    // offset:Vec3 = new Vec3(-4,4,4);

    isTransformView:boolean = false;

    @property(Node)
    centralNode:Node;


    @property({ type: Prefab })
    public vertexPrefab: Prefab = null;

    @property
    public vertexRadius;


    public vertexIdDic : {[key:string]:any[]} = {}

    protected onLoad(): void {
        this.centralNode =  this.node.getChildByName("Vertex");
    }

    protected start(): void {
        this.vertexRadius = 5;
    }

    createVertexAround(node: Node ) {
        const vertex = instantiate(this.vertexPrefab);
        vertex.getComponent(Vertex).setVertexId();
        this.vertexIdDic[vertex.getComponent(Vertex).getVertexID+""] = [];
        // const randomDirection = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        // const randomOffset = randomDirection.clone().multiplyScalar(this.vertexRadius);
        const randomDirection = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const randomOffset = randomDirection.clone().multiplyScalar(this.vertexRadius);
        
        console.log("randomDir: ",randomDirection," randomofffset: ",randomOffset," r:", this.vertexRadius)
        const position = randomOffset.add(node.worldPosition);
        vertex.worldPosition = position;
        vertex.setParent(node);
        
        // vertex.getComponent(Vertex).setVertexId();
        // vertex.setParent(this.node);
        return vertex;
    }

    /**
     * delete all the children of veretxManager
     */
    public destroyAllChildren(){
        this.node.children.forEach((child) => {
            child.destroy();
        });

        
        this.node.removeAllChildren();
        Manager.Instance().relationManager.resetVertexAndEdgeBox();
    }

    /**
     * do the initiation
     */
    public initiateOriginalVertex(){
        const vertex = instantiate(this.vertexPrefab);
        this.node.position = new Vec3(0, 0, 0);
        this.node.rotation =  Quat.identity(new Quat());
        vertex.getComponent(Vertex).setVertexId();
        vertex.worldPosition = new Vec3(0,0,0);
        vertex.setParent(this.node);
        this.centralNode = vertex;
    }



}