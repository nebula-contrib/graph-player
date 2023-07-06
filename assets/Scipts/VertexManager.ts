import { _decorator, Component, Prefab, instantiate, Node, Vec3,Quat, MeshRenderer } from 'cc';
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

    @property(Node)
    private tmpCentralNode:Node;

    @property(Node)
    chosenVertex:Node = null;


    @property({ type: Prefab })
    public vertexPrefab: Prefab = null;

    @property
    public vertexRadius;


    public vertexIdDic : {[key:string]:any[]} = {}

    private vertexMaterialCount = 5;

    protected onLoad(): void {
        this.centralNode =  this.node.getChildByName("CentralVertexOfCamera");
    }

    protected start(): void {
        this.vertexRadius = 15;
    }

    /**
     * create one child node around parent node
     * @param node the parent node
     * @returns 
     */
    public createVertexAround(node: Node ) {
        const vertex = instantiate(this.vertexPrefab); // initial the prefab

        vertex.getComponent(Vertex).setVertexId();
        this.vertexIdDic[vertex.getComponent(Vertex).getVertexID+""] = []; // set id

        let initialMaterialCode =  Math.floor(Math.random() * (this.vertexMaterialCount)) + 2; // get the random material code
        
        vertex.getComponent(Vertex).setInitialMaterialCode(initialMaterialCode);
        let tmpMaterial = vertex.getComponent(Vertex).getComponent(MeshRenderer).getMaterial(initialMaterialCode);
        vertex.getComponent(Vertex).getComponent(MeshRenderer).setMaterial(tmpMaterial, 0); // set the random material

        // const randomDirection = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        // const randomOffset = randomDirection.clone().multiplyScalar(this.vertexRadius);
        const randomDirection = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const randomOffset = randomDirection.clone().multiplyScalar(this.vertexRadius);
        
        // 
        const position = randomOffset.add(node.worldPosition);
        vertex.worldPosition = position;
        vertex.setParent(node);
        
        // vertex.getComponent(Vertex).setVertexId();
        // vertex.setParent(this.node);
        return vertex;
    }

    /**
     * click one vertex and choose this vertex as potential focus
     * call it when click it once
     * @param chosenNode 
     */
    public chooseOneNormalVertexToFocus(chosenNode:Node){
        this.chosenVertex = chosenNode;
        let focusMaterial = this.chosenVertex.getComponent(Vertex).getComponent(MeshRenderer).getMaterial(1);
        this.chosenVertex.getComponent(Vertex).getComponent(MeshRenderer).setMaterial(focusMaterial, 0);
    }

    public returnFocusToNormalVertex(){
        console.log("chosenVertex:", this.chosenVertex);
        if(!this.chosenVertex) return;
        this.chosenVertex.getComponent(Vertex).returnToInitialMaterial();
        this.chosenVertex = null;
        

    }

    /**
     * delete all the children of veretxManager
     */
    public destroyAllChildren(){
        this.centralNode.children.forEach((child) => {
            child.destroy();
        });
        this.centralNode.removeAllChildren();
        // this.node.children.forEach((child) => {
        //     child.destroy();
        // });
        // this.node.removeAllChildren();
        Manager.Instance().relationManager.resetVertexAndEdgeBox();
    }

    /**
     * do the initiation
     */
    public initiateOriginalVertex(){
        const vertex = instantiate(this.vertexPrefab);

        this.centralNode.position = new Vec3(0, 0, 0);
        this.centralNode.rotation =  Quat.identity(new Quat());
        vertex.getComponent(Vertex).setVertexId();
        vertex.worldPosition = new Vec3(0,0,0);
        vertex.setParent(this.centralNode);
        // this.node.position = new Vec3(0, 0, 0);
        // this.node.rotation =  Quat.identity(new Quat());
        // vertex.getComponent(Vertex).setVertexId();
        // vertex.worldPosition = new Vec3(0,0,0);
        // vertex.setParent(this.node);
        // this.centralNode = vertex;
    }



}