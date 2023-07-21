import { _decorator, Component, error, JsonAsset, Node,resources} from 'cc';
const { ccclass, property } = _decorator;
import { TableData } from './TableData';
import { Manager } from './Manager';
import { Vertex } from './Vertex';
import { Edge } from './Edge';
import { EDITOR } from 'cc/env';

@ccclass('JSONReader')
export class JSONReader extends Component {

    @property({type: [TableData]})
    public tableDataArray:Array<TableData>;



    public putJSONtoModel(path: any){

      // resources.load('Response/nba', (err: any, res: JsonAsset) => {
      //   if (err) {
      //       error(err.message || err);
      //       return;
      //   }
      //   // get data of JSON
      //   let jsonData = res.json;

 
      //   // let tables = jsonData.data[0].data.tables.map((tableData: any) => new TableData(tableData));
      //   let tables = jsonData.data[0].data.tables;
       
      //   this.transTabletoVertexAndEdge(tables);
      //   // console.log("vertex id DIC: ", Manager.Instance().vertexManager.vertexEdgeDic);
      //   // console.log("edge id dic: ",Manager.Instance().edgeManager.edgeVertexDic);
      //   // console.log("set this.vertexIDBox args:",Manager.Instance().relationManager.edgeNameBox," edge:",Manager.Instance().relationManager.edgeNameBox);
      //   //console.log("tags Set:",Manager.Instance().vertexManager.vertexTagSet);

      //   });
        this.loadJson((tables) => {
          this.transTabletoVertexAndEdge(tables);
          
          // console.log("set this.vertexIDBox args:",Manager.Instance().relationManager.vertexIDBox);
        });
    }


    private loadJson(callback){
      resources.load('Response/nba', (err: any, res: JsonAsset) => {
        if (err) {
            error(err.message || err);
            return;
        }
        // get data of JSON
        let jsonData = res.json;
        let tables = jsonData.data[0].data.tables;
        callback(tables);
        


        });
    }

    public transTabletoVertexAndEdge(tables:any){
      for(let i = 0; i < tables.length; i++) {
        let edges = tables[i]._edgesParsedList;
        let vertices = tables[i]._verticesParsedList;
        
    
        /**
         * only for table has 1 edge with 2 vertices
         */
        let edge = edges[0], startVertex = vertices[0],endVertex = vertices[1];
        let startNode = null, endNode = null, edgeNode= null;

        let isStartVertexExists = Manager.Instance().relationManager.existVertex(startVertex.vid);
        let isEndVertexExits = Manager.Instance().relationManager.existVertex(endVertex.vid);
        let isEdgeExits = Manager.Instance().relationManager.existEdge(edge.edgeName);
        // when edge doesn't exist
        if(!isEdgeExits){
          // create vertices ofstart, end and edge
          if(!isStartVertexExists && !isEndVertexExits){

              startNode = Manager.Instance().vertexManager.createStartNode();
              startNode.getComponent(Vertex).setAttribute(startVertex);
              endNode = Manager.Instance().vertexManager.createNodeAround(startNode);
              endNode.getComponent(Vertex).setAttribute(endVertex);
              edgeNode = Manager.Instance().edgeManager.createEdgeWithStartAndEnd(startNode, endNode);
              edgeNode.getComponent(Edge).setAttribute(edge);
              edgeNode.getComponent(Edge).addAllThisVertexEdgeInfoOnEdge();
          }

          // start vertex exsited, create end vertex and edge
          else if(isStartVertexExists && !isEndVertexExits){
              
              startNode = Manager.Instance().vertexManager.getVertexNodeByVID(startVertex.vid);
              endNode = Manager.Instance().vertexManager.createNodeAround(startNode);
              endNode.getComponent(Vertex).setAttribute(endVertex);
              edgeNode = Manager.Instance().edgeManager.createEdgeWithStartAndEnd(startNode, endNode);
              edgeNode.getComponent(Edge).setAttribute(edge);
              edgeNode.getComponent(Edge).addAllThisVertexEdgeInfoOnEdge();

          }
          // end vertex exsited, create start vertex and edge
          else if(!isStartVertexExists && isEndVertexExits){
            
            endNode = Manager.Instance().vertexManager.getVertexNodeByVID(endVertex.vid);
            startNode = Manager.Instance().vertexManager.createNodeAround(endNode);
            startNode.getComponent(Vertex).setAttribute(startVertex);
            edgeNode = Manager.Instance().edgeManager.createEdgeWithStartAndEnd(startNode, endNode);
            edgeNode.getComponent(Edge).setAttribute(edge);
            edgeNode.getComponent(Edge).addAllThisVertexEdgeInfoOnEdge();

          }
          // both start and end vertex exsited, only create edge
          else if(isStartVertexExists && isEdgeExits){
            
            startNode = Manager.Instance().vertexManager.getVertexNodeByVID(startVertex.vid);
            endNode = Manager.Instance().vertexManager.getVertexNodeByVID(endVertex.vid);
            edgeNode = Manager.Instance().edgeManager.createEdgeWithStartAndEnd(startNode, endNode);
            edgeNode.getComponent(Edge).setAttribute(edge);
            edgeNode.getComponent(Edge).addAllThisVertexEdgeInfoOnEdge();

          }
          
        }
        /*
        for(let j = 0; j < edges.length; j++) {
            let edge = edges[j];
            console.log("Edge: "+ i +" Edge SrcID: " + edge.srcID +"Edge DstID: " + edge.dstID);
            
        }        
        for(let j = 0; j < vertices.length; j++) {
            let vertex = vertices[j];
            console.log("Vertex ID: " + vertex.vid);
            
        }
        */
    }
    //console.log("relation vertex:",Manager.Instance().relationManager.vertexIDBox);
}
}

