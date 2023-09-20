import { _decorator, Component, Prefab, instantiate, Node, Vec3,Quat, MeshRenderer } from 'cc';
import { Manager } from './Manager';
import { Vertex } from './Vertex';
import { Edge } from './Edge';
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

    /**
     * store the {vertex1:[edge1,edge2], vertex2:[edge3,edge4]}
     */
    public vertexEdgeDic : {[key:string]:any[]} = {}

    private vertexMaterialCount = 5;

    /**
     * Container of vertex's tags
     */
    public vertexTagSet: Set<string> = new Set<string>();




    protected onLoad(): void {
        this.rootNode =  this.node.getChildByName("CentralVertexOfCamera");
        this.vertexRadius = 30;
        this.vertexTagSet = new Set<string>();
        
    }


    /**
     * 
     * @returns Node, the vertex is vertex.getCompoent(Vertex)
     */
    public createStartNode():Node{
        const vertex = instantiate(this.vertexPrefab); // initial the prefab
        vertex.setParent(Manager.Instance().vertexManager.rootNode);
        vertex.getComponent(Vertex).setVertexId(); //set id
        let initialMaterialCode =  Math.floor(Math.random() * (this.vertexMaterialCount)) + 2; // get the random material code

        // let tmpMaterial = vertex.getComponent(Vertex).getComponent(MeshRenderer).getMaterial(initialMaterialCode);
        // vertex.getComponent(Vertex).getComponent(MeshRenderer).setMaterial(tmpMaterial, 0); // set the random material

        const randomDirection = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const randomOffset = randomDirection.clone().multiplyScalar(this.vertexRadius); // set the random position of node
        
        // 
        const position = randomOffset.add(Manager.Instance().vertexManager.currentCentralNode.worldPosition); // set the currentCentralNode as center
        vertex.worldPosition = position;
        // vertex.setParent(node);
        
        this.vertexEdgeDic[vertex.getComponent(Vertex).getVertexID()] = []; // set id
        vertex.getComponent(Vertex).setMaterialCode(initialMaterialCode);
        vertex.getComponent(Vertex).changeMaterial(initialMaterialCode);
        //console.log("create vertexEdgeDic of:",vertex.getComponent(Vertex).getVertexID()+"dic:",this.vertexEdgeDic);

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
        
        let initialMaterialCode =  Math.floor(Math.random() * (this.vertexMaterialCount)) + 2; // get the random material code
        

        // let tmpMaterial = vertex.getComponent(Vertex).getComponent(MeshRenderer).getMaterial(initialMaterialCode);
        // vertex.getComponent(Vertex).getComponent(MeshRenderer).setMaterial(tmpMaterial, 0); // set the random material

        // const randomDirection = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        // const randomOffset = randomDirection.clone().multiplyScalar(this.vertexRadius);
        const randomDirection = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const randomOffset = randomDirection.clone().multiplyScalar(this.vertexRadius);
        
        // 
        const position = randomOffset.add(node.worldPosition);
        vertex.worldPosition = position;
        // vertex.setParent(node);
        vertex.setParent(Manager.Instance().vertexManager.rootNode);
        this.vertexEdgeDic[vertex.getComponent(Vertex).getVertexID()] = []; // set id
        
        vertex.getComponent(Vertex).setMaterialCode(initialMaterialCode);
        vertex.getComponent(Vertex).changeMaterial(initialMaterialCode);

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

    /**
     * restore the matereial of focus vertex to it's original material
     * @returns 
     */
    public returnFocusToNormalVertex(){
        
        if(!this.chosenVertex) return;
        this.chosenVertex.getComponent(Vertex).returnToInitialMaterial();
        this.chosenVertex = null;
        Manager.Instance().UIManager.cleanAndDisableInfoBar();

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
     * add type to Set
     * @param type 
     */
    public addTag(type:string){
        // vertexTypeSet doesn't have this type
        if(!this.vertexTagSet.has(type)){
            this.vertexTagSet.add(type); // add this type
        }
    }

    /**
     * remove layouted flag
     */
    public removeLayoutFlags(){
        
        this.traverseNodesChildren(this.rootNode)
        //let parents = this.rootNode;
        // for(let child of parents.children){
        //     if(child.children != null){
        //         console.log("parent:",parents," child:",child);
        //         parents = child;

        //     }
        //     else{
        //         console.log("node name:",child.name);
        //         child.getComponent(Vertex).isLayouted = false;
                
        //     }
        // }
    }

    private traverseNodesChildren(node: Node){
        
        if(node.getComponent(Vertex) != null){
            node.getComponent(Vertex).isLayouted = false;
        }
        if(node.children == null) return;
        for(let child of node.children){
            this.traverseNodesChildren(child);
        }


    }

    /**
     * delete all the children of veretxManager
     */
    public destroyAllChildren(){
        //console.log("root node:",this.rootNode);
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
    
    }




}