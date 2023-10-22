import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { Edge } from './Edge';
import { Vertex } from './Vertex';
import { Manager } from './Manager';


const { ccclass, property } = _decorator;
/**
 * Manager of Edges
 */
@ccclass('EdgeManager')
export class EdgeManager extends Component {

    @property({ type: Prefab })
    public edgePrefab: Prefab = null;

    @property(Node)
    public chosenEdgeNode:Node;

    /**
     * like{'0':[0,2]}
     * means 0 is the id of one edge, and 0 is its startVertex id, 2 is its endVeretex id
     */
    public edgeVertexDic: { [key: string]: any } = {};

    /**
     *  create Edge
     * @param startNode 
     * @param endNode 
     */
    createEdgeWithStartAndEnd(startNode: Node, endNode: Node):Node {
        const edgeNode = instantiate(this.edgePrefab);
        //edgeNode.parent = startNode;
        edgeNode.setParent(Manager.Instance().edgeManager.node);
        let edge = edgeNode.getComponent(Edge);

        edge.createEdgeWithStartAndEnd(startNode,endNode);


        // console.log("vertex dic:", Manager.Instance().vertexManager.vertexEdgeDic);
        return edgeNode;
       
        
    }


    chooseNormalEdge(edgeNode:Node){
        edgeNode.getComponent(Edge).changeEdgeMaterialToFocused();
    }

    public returnFocusToNormalEdge(){
        
        if(!this.chosenEdgeNode) return;
        this.chosenEdgeNode.getComponent(Edge).returnToInitialMaterial();
        this.chosenEdgeNode = null;
        Manager.Instance().UIManager.cleanAndDisableInfoBar();
        

    }

    public removeLayoutFlags(){
        
        for(let child of this.node.children){
            //console.log("node name:",child.name);
            child.getComponent(Edge).isLayouted = false;

        }
    }

    /**
     * destroy all edge by remove the etities and node in list
     */
    destroyAllEdges() {
        if(this.node.children == null) return;
        this.node.destroyAllChildren();
        this.node.removeAllChildren();
        
    }


}
