import { _decorator, Component, Node, Vec3, Quat, VERSION} from 'cc';
import { Manager } from './Manager';
import { Vertex } from './Vertex';
const { ccclass, property } = _decorator;

@ccclass('LayoutManager')
export class LayoutManager extends Component {
    private tagsNodeList = [] // restore the empty nodes of tags such like: player, team...

    public centerToTag0Radius = 3; // radius between node and center

    public tagsNodeRadius = 1.5; // radius between nodes of different tags, like tag 0 node and tag 1 nodes...

    private nodesLayerRadiusInterval = 0;

    /**
     * re-classify nodes by tags
     * the vertex with tag will be the child of corresponding tagNode
     */
    public classifyNodeByTag(){
        let count = 0;
        this.tagsNodeList = [];
        
        /**
         * set the tagNodeList(store Node)
         */
        try{
            for(let tag of Manager.Instance().vertexManager.vertexTagSet){
                if(!Manager.Instance().vertexManager.rootNode.getChildByName(tag))
                {
                    let newTagNode = new Node(tag);
                    newTagNode.parent = Manager.Instance().vertexManager.rootNode;
                    newTagNode.name = tag;
                    this.tagsNodeList.push(newTagNode);
                }
            }

          
            while(Manager.Instance().vertexManager.rootNode.children.length > this.tagsNodeList.length){
                let childVertex = Manager.Instance().vertexManager.rootNode.children[0];
                if(childVertex.getComponent(Vertex) != null) {
                    let vertexTag  = childVertex.getComponent(Vertex).tags[0];
                    childVertex.setParent(Manager.Instance().vertexManager.rootNode.getChildByName(vertexTag));
                    count++;
                }
            }
            
        }
        catch(error){
            console.log(error)
        }

        this.nodesLayerRadiusInterval = Math.PI / 2 / this.tagsNodeList.length;


    }

    /**
     * change the orders of tags
     * @param tagsName: string slist if tags
     */
    public adjustOrderOfTags(tagsName:string[]){
        this.tagsNodeList = []; 
        console.log("order by,", tagsName);
        for(let tagName of tagsName){
            this.tagsNodeList.push(Manager.Instance().vertexManager.rootNode.getChildByName(tagName));
        } 
       
    }

    /**
     * one method to re-Layout by tags
     */
    public reLayoutByTags(){

        /**
         * reLayout tag 0 node, with rootNode as center
         */
        let center = Manager.Instance().vertexManager.rootNode.worldPosition;
        let nodes = this.tagsNodeList[0].children; // list of nodes around center
        let angleStep = 2 * Math.PI / nodes.length; // set the step of angle
        for (let i = 0; i < nodes.length; i++) {
            let angle = i * angleStep; // set nodes angles
        
            // calculate the position 
            let x = center.x + this.centerToTag0Radius * Math.cos(angle);
            let y = center.y;
            let z = center.z + this.centerToTag0Radius * Math.sin(angle);
        
            nodes[i].setWorldPosition(x, y, z); // set postion of node
            nodes[i].getComponent(Vertex).isLayouted = true; // if do not have this sentencec, nodes will layout like tree
        }

        /**
         * tag 1--n: rotate with tag 0 align on another plant
         * realign edge as well
         */
    
        for(let tag0Node of nodes){


                this.updateEndVertexAndEdge(tag0Node);

    }

    }

    // private traverseNodeAndUpdate(rootNode:Node){
    //     for(let child of rootNode.children){
    //         this.updateEndVertexAndEdge(child);

    //     }
    // }

    /**
     * update the endvertex and edge of one start vertex
     * @param startVertex: the center of the sub-layer of endvertex and edge
     */
    private updateEndVertexAndEdge(startVertex:Node){

       
       // if(startVertex.getComponent(Vertex).edgesSetOfVertex.length <= 1) return;
        let edgeNum = startVertex.getComponent(Vertex).edgesSetOfVertex.length;
        
        // if(edgeNum < 2) return;

        let areAllEdgesLayouted = true;
        for(let edge of startVertex.getComponent(Vertex).edgesSetOfVertex){
            if(edge.isLayouted == false) areAllEdgesLayouted = false;
            else{
                console.log("unlayouted edge:",edge.edgeID)
            }
        }
        if(areAllEdgesLayouted) return;
        let center = startVertex.worldPosition;
        
        // calcualte the normal vector of plant of tag0, rootNode and up-vector
        let normal = new Vec3();
        Vec3.cross(normal, Vec3.subtract(new Vec3(), center, Vec3.ZERO), Vec3.UP);
        Vec3.normalize(normal, normal);

        /**
         * calculate initial vector of plant of tag0, rootNode and up-vector
         */
        let initialVector = new Vec3();
        Vec3.cross(initialVector, normal, Vec3.subtract(new Vec3(), center, Vec3.ZERO));
        Vec3.normalize(initialVector, initialVector);
        //let selfAngleStep = 2 * Math.PI / edgeNum; // rotate on 2 PI
        let selfAngleStep =  Math.PI / edgeNum;// rotate on PI
        let selfAngle = Math.PI /6 + Math.PI; // initial angle --- PI/6 and it orient outside


       
        for(let i = 0; i < startVertex.getComponent(Vertex).edgesSetOfVertex.length; i++){
            let edge = startVertex.getComponent(Vertex).edgesSetOfVertex[i];
            if(edge.isLayouted) continue;
            let endVertex = edge.endVertex;
            
            /**
             * different tag with different normal and initialVector
             */
            let angleBiasBetweenTags = this.getTagIndex(endVertex.getComponent(Vertex).tags[0]) * this.nodesLayerRadiusInterval; // set the bias of each tag, ranked by first index
            let quat = new Quat();
            let tmp_normal = new Vec3();
            let tmp_initialVector = new Vec3();
            Quat.fromAxisAngle(quat, normal, angleBiasBetweenTags);
            // trans normal
            Vec3.transformQuat(tmp_initialVector, initialVector, quat);
            Quat.fromAxisAngle(quat, initialVector, angleBiasBetweenTags);
            // trans normal
            Vec3.transformQuat(tmp_normal, normal, quat);

            if(edge.startVertex.vid != startVertex.getComponent(Vertex).vid){
                endVertex = edge.startVertex;
            }
            if(!endVertex.isLayouted){

                let position = new Vec3();
                let vectorWithRadius = new Vec3();
                Vec3.multiplyScalar(vectorWithRadius,tmp_initialVector.clone(), this.tagsNodeRadius);
                let quaternion = new Quat();
                Quat.fromAxisAngle(quaternion, tmp_normal,selfAngle);
                Vec3.transformQuat(vectorWithRadius, vectorWithRadius, quaternion);
            
                Vec3.add(position, center.clone(), vectorWithRadius);
                endVertex.node.setWorldPosition(position);
                
                endVertex.isLayouted = true;
                
            }
            /** 
             * reLayout the edge
             */
            edge.resetPosition(startVertex, endVertex.node);
            edge.isLayouted = true;
            
            selfAngle += selfAngleStep; // update angle
            
            this.updateEndVertexAndEdge(endVertex.node);
        }

       
        //console.log("edge after:",Manager.Instance().edgeManager.node.children.length)
            
    }

    /**
     * each child of one tag with same material
     */
    public materialReallocated(){
        let tagIndex = 2;

        for(let tagNode of this.tagsNodeList){
            for(let childVertex of tagNode.children){
                childVertex.getComponent(Vertex).setMaterialCode(tagIndex);//change the material code
                childVertex.getComponent(Vertex).changeMaterial(tagIndex);
            }
            tagIndex++;
        }
    }

    /**
     * getTagIndex
     */
    private getTagIndex(tag:string) {
        for(let index = 0; index < this.tagsNodeList.length; index++){
            if(this.tagsNodeList[index] == tag) return index;
        }
        return -1;
    }

    public getTags():string[]{
        let tagList = [];
        for(let tagNode of this.tagsNodeList){
            tagList.push(tagNode.name);
        }
        return tagList; 
    }
}

