import { _decorator, Component, Node, Vec3, Quat, VERSION} from 'cc';
import { Manager } from './Manager';
import { Vertex } from './Vertex';
const { ccclass, property } = _decorator;

@ccclass('LayoutManager')
export class LayoutManager extends Component {
    private tagsNodeList = []

    public centerToTag0Radius = 3;

    public tagsNodeRadius = 2; // radius between nodes of different tags, like tag 0 node and tag 1 nodes...

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

    /**
     * 
     * @param tagsName change the orders of tags
     */
    public adjustOrderOfTags(tagsName:string[]){
        this.tagsNodeList = []; 
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
        }

        /**
         * tag 1--n: rotate with tag 0 align on another plant
         * realign edge as well
         */
    
        for(let tag0Node of nodes){
            let center = tag0Node.worldPosition;
            let edgeNum = tag0Node.getComponent(Vertex).edgesSetOfVertex.length;
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
            let selfAngleStep = Math.PI / edgeNum;// rotate on PI
            let selfAngle = Math.PI /6 + Math.PI; // initial angle --- PI/6 and it orient outside

           
            for(let edge of tag0Node.getComponent(Vertex).edgesSetOfVertex){
                let endVertex = edge.endVertex;
                if(edge.startVertex.vid != tag0Node.getComponent(Vertex).vid){
                    endVertex = edge.startVertex;
                }
                if(!endVertex.isLayouted){
                    
                    // let x = center.x ;
                    // let y = center.y + this.tagsNodeRadius * Math.cos(selfAngle);
                    // let z = center.z + this.tagsNodeRadius * Math.sin(selfAngle) ;
                    // let position = new Vec3(x, y, z).add(normal);
                    let position = new Vec3();
                    //Vec3.scaleAndAdd(position, center, initialVector, this.tagsNodeRadius); 
                    let vectorWithRadius = new Vec3();
                    Vec3.multiplyScalar(vectorWithRadius,initialVector.clone(), this.tagsNodeRadius);
                    //Vec3.add(position, center.clone(), vector);
                    let quaternion = new Quat();
                    Quat.fromAxisAngle(quaternion, normal,selfAngle);
                    Vec3.transformQuat(vectorWithRadius, vectorWithRadius, quaternion);
                
                    Vec3.add(position, center.clone(), vectorWithRadius);
                    endVertex.node.setWorldPosition(position);
                    
                    endVertex.isLayouted = true;
                    
                }
                /**
                 * reLayout the edge
                 */
                edge.resetPosition(tag0Node, endVertex.node);
                selfAngle += selfAngleStep; // update angle
                
            }
        }

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
}

