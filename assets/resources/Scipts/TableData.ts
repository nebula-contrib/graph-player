import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { Edge } from './Edge';
import { Vertex } from './Vertex';

@ccclass('TableData')
export class TableData extends Component {
    edges: Array<Edge>;
    vertices: Array<Vertex>;

    constructor(data: any) {
        super();
        this.edges = data._edgesParsedList.map((edgeData: any) => new Edge(edgeData));
        this.vertices = data._verticesParsedList.map((vertexData: any) => new Vertex(vertexData));
    }
}

