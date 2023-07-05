import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { Edge } from './Edge';
import { Dictionary } from './data/Dictionary';
import { Vertex } from './Vertex';
import { Manager } from './Manager';


const { ccclass, property } = _decorator;

@ccclass('EdgeManager')
export class EdgeManager extends Component {

    @property({ type: Prefab })
    public edgePrefab: Prefab = null;

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
    createOneEdge(startNode: Node, endNode: Node) {
        const edgeNode = instantiate(this.edgePrefab);
        edgeNode.parent = startNode;
        let edge = edgeNode.getComponent(Edge);

        edge.createEdge(startNode,endNode);
        if(!Manager.Instance().vertexManager.vertexIdDic[startNode.getComponent(Vertex).vertexId+""]) Manager.Instance().vertexManager.vertexIdDic[startNode.getComponent(Vertex).vertexId+""] = [];
        Manager.Instance().vertexManager.vertexIdDic[startNode.getComponent(Vertex).vertexId+""].push(edge.getEdgeId());
        this.edgeIdDic[edge.getEdgeId()+''] = [edge.startVertexID, edge.endVertexID];
        console.log("vertex dic:", Manager.Instance().vertexManager.vertexIdDic);
       
        
    }


}
