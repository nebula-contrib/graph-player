import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { Edge } from './Edge';
import { Vertex } from './Vertex';
import { Manager } from './Manager';


const { ccclass, property } = _decorator;

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
    public edgeIdDic: { [key: string]: any } = {};

    /**
     *  create Edge
     * @param startNode 
     * @param endNode 
     */
    createOneEdge(startNode: Node, endNode: Node):Node {
        const edgeNode = instantiate(this.edgePrefab);
        //edgeNode.parent = startNode;
        edgeNode.setParent(Manager.Instance().edgeManager.node);
        let edge = edgeNode.getComponent(Edge);

        edge.createEdge(startNode,endNode);
        if(!Manager.Instance().vertexManager.vertexIdDic[startNode.getComponent(Vertex).vid+""]) 
        {
            Manager.Instance().vertexManager.vertexIdDic[startNode.getComponent(Vertex).vid+""] = [];
        }
        Manager.Instance().vertexManager.vertexIdDic[startNode.getComponent(Vertex).vid+""].push(edge.getEdgeName());
        this.edgeIdDic[edge.getEdgeName()+''] = [edge.srcID, edge.dstID];
        // console.log("vertex dic:", Manager.Instance().vertexManager.vertexIdDic);
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
    /**
     * destroy all edge by remove the etities and node in list
     */
    destroyAllEdges() {
        this.node.destroyAllChildren();
        this.node.removeAllChildren();
        
    }


}
