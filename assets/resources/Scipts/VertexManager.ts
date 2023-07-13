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
    rootNode:Node;

    @property(Node)
    public currentCentralNode:Node;

    @property(Node)
    chosenVertex:Node = null;


    @property({ type: Prefab })
    public vertexPrefab: Prefab = null;

    @property
    public vertexRadius;


    public vertexIdDic : {[key:string]:any[]} = {}

    private vertexMaterialCount = 5;

    protected onLoad(): void {
        this.rootNode =  this.node.getChildByName("CentralVertexOfCamera");
        
    }

    protected start(): void {
        this.vertexRadius = 25;
        
    }

    /**
     * 
     * @returns Node, the vertex is vertex.getCompoent(Vertex)
     */
    public createStartNode():Node{
        const vertex = instantiate(this.vertexPrefab); // initial the prefab

        vertex.getComponent(Vertex).setVertexId();
        this.vertexIdDic[vertex.getComponent(Vertex).getVertexID+""] = []; // set id

        let initialMaterialCode =  Math.floor(Math.random() * (this.vertexMaterialCount)) + 2; // get the random material code
        
        vertex.getComponent(Vertex).setInitialMaterialCode(initialMaterialCode);
        let tmpMaterial = vertex.getComponent(Vertex).getComponent(MeshRenderer).getMaterial(initialMaterialCode);
        vertex.getComponent(Vertex).getComponent(MeshRenderer).setMaterial(tmpMaterial, 0); // set the random material

        const randomDirection = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const randomOffset = randomDirection.clone().multiplyScalar(this.vertexRadius);
        
        // 
        const position = randomOffset.add(Manager.Instance().vertexManager.currentCentralNode.worldPosition); // set the currentCentralNode as center
        vertex.worldPosition = position;
        // vertex.setParent(node);
        vertex.setParent(Manager.Instance().vertexManager.rootNode);

        return vertex;
    }


    /**
     * create end node around parent node when click the start node
     * @param node the parent node
     * @returns 
     */
    public createNodeAround(node: Node) {
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
        // vertex.setParent(node);
        vertex.setParent(Manager.Instance().vertexManager.rootNode);


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
        // this.currentCentralNode = chosenNode;
        let focusMaterial = this.chosenVertex.getComponent(Vertex).getComponent(MeshRenderer).getMaterial(1);
        this.chosenVertex.getComponent(Vertex).getComponent(MeshRenderer).setMaterial(focusMaterial, 0);
    }

    public returnFocusToNormalVertex(){
        
        if(!this.chosenVertex) return;
        this.chosenVertex.getComponent(Vertex).returnToInitialMaterial();
        this.chosenVertex = null;
        

    }

    /**
     * get the Node of vertex by name
     * @param vertexID 
     * @returns Node
     */
    public getVertexNodeByVID(vertexID:String):Node{
        for(let child of this.rootNode.children){
            if(child.getComponent(Vertex).vid == vertexID) return child;
        }
        return null;
    }

    /**
     * delete all the children of veretxManager
     */
    public destroyAllChildren(){
        this.rootNode.children.forEach((child) => {
            child.destroy();
        });
        this.rootNode.removeAllChildren();
        // this.node.children.forEach((child) => {
        //     child.destroy();
        // });
        // this.node.removeAllChildren();
        Manager.Instance().relationManager.resetVertexAndEdgeBox();
        this.rootNode.position = new Vec3(0, 0, 0);
        this.rootNode.rotation =  Quat.identity(new Quat());
        this.currentCentralNode = this.rootNode;
        this.returnFocusToNormalVertex();
    }

    /**
     * do the initiation
     */
    public initiateOriginalVertex(){
        const vertex = instantiate(this.vertexPrefab);

        // this.centralNode.position = new Vec3(0, 0, 0);
        // this.centralNode.rotation =  Quat.identity(new Quat());
        vertex.getComponent(Vertex).setVertexId();
        vertex.worldPosition = new Vec3(0,0,0);
        vertex.setParent(this.rootNode);
        
        this.currentCentralNode =  vertex;
    
        // this.node.position = new Vec3(0, 0, 0);
        // this.node.rotation =  Quat.identity(new Quat());
        // vertex.getComponent(Vertex).setVertexId();
        // vertex.worldPosition = new Vec3(0,0,0);
        // vertex.setParent(this.node);
        // this.centralNode = vertex;
    }




}