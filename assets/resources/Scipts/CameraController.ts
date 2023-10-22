import { _decorator, Camera, Component, find, input, Node, Vec3, tween, Scheduler,Quat, misc} from 'cc';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    // @property(Node)
    // centralNode:Node = find("Manager/VertexManager/Vertex");
    @property(Camera)
    mainCamera:Camera;
    @property(Vec3)
    originalOffset:Vec3;
    @property(Vec3)
    currentOffset:Vec3;
    @property(Camera)
    public camera: Camera;

    private smoothZoomIntervals = 0.42;
    private originalOffsetFactor:number = 3;

    onLoad() {
        
        this.camera = find("Main Camera").getComponent(Camera);
        this.originalOffset = new Vec3(0,0,3);
        this.currentOffset = this.originalOffset;
        this.camera.near = 0.01;
        this.originalOffsetFactor = this.originalOffset.length() / this.originalOffset.clone().normalize().length();
        //console.log("camera offset factor:",this.originalOffsetFactor);

    }


    focusOn(node: Node) {
        this.recordCurrentOffset();
        // let orient = node.getWorldPosition().clone().subtract(Manager.Instance().vertexManager.rootNode.getWorldPosition().clone())
        // this.camera.node.lookAt(orient)
        let targetPosition = node.getWorldPosition();
        let tmpZeroQuat = new Quat(Quat.IDENTITY); 
        let targetOffset = this.currentOffset.clone().normalize().multiplyScalar(this.originalOffsetFactor);
    
        tween(this.camera.node)
            .to(this.smoothZoomIntervals, { 
                worldPosition: targetPosition.clone().add(targetOffset),
            }
                , { easing: 'smooth' })
            .start();
        
            // this.camera.node.setRotation(tmpZeroQuat);

        

    }

    /**
     * rotate on central vertes
     * @param target: which one to rotate(here is camera)
     * @param center: the center  
     * @param angle: angle(degree)
     * @param axis: around which axis to rotate
     * @returns 
     */
    rotateOnVertex(target: Vec3, center: Vec3, angle: number, axis: Vec3 = Vec3.UP): Vec3{
        let rotateQuat = new Quat();
        let dir = new Vec3();
        let rotated = new Vec3();
        Vec3.subtract(dir, target, center);
        let rad = misc.degreesToRadians(angle);
        Quat.fromAxisAngle(rotateQuat, axis, rad);
        Vec3.transformQuat(rotated, dir, rotateQuat);
        Vec3.add(rotated, center, rotated);
        return rotated;
    }

    resetPosition(){
        
        this.camera.node.position = Manager.Instance().vertexManager.rootNode.position.clone().add(this.originalOffset);
        Manager.Instance().canvasManager.isFirstChoose = true;
        this.camera.node.rotation =  Quat.identity(new Quat());
    }

    /**
     * record the offset between tmp central node(current central node)
     */
    public recordCurrentOffset(){
        // this.currentOffset = this.camera.node.getWorldPosition().clone().subtract(Manager.Instance().vertexManager.currentCentralNode.getWorldPosition());
        console.log("Manager.Instance().canvasManager.isFirstChoose:",Manager.Instance().canvasManager.isFirstChoose)
        if(!Manager.Instance().canvasManager.isFirstChoose) {

            //this.currentOffset = Manager.Instance().canvasManager.cameraRotateOffset.clone().subtract(Manager.Instance().vertexManager.currentCentralNode.getWorldPosition());
            this.currentOffset = this.camera.node.getWorldPosition().clone().subtract(Manager.Instance().vertexManager.currentCentralNode.getWorldPosition());
            console.log("cur_central:",Manager.Instance().vertexManager.currentCentralNode.getWorldPosition())
        }
        else{

            // this.currentOffset = new Vec3(0,0,2)
            this.currentOffset = this.camera.node.getWorldPosition().clone().subtract(Manager.Instance().vertexManager.rootNode.getWorldPosition());
            Manager.Instance().canvasManager.isFirstChoose = false;
        }
        Manager.Instance().vertexManager.currentCentralNode = Manager.Instance().vertexManager.chosenVertex;
        
    }



}
