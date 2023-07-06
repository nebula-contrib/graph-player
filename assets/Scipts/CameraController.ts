import { _decorator, Camera, Component, find, input, Node, Vec3, tween, Scheduler,Quat} from 'cc';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    // @property(Node)
    // centralNode:Node = find("Manager/VertexManager/Vertex");
    @property(Camera)
    mainCamera:Camera;
    @property(Vec3)
    offset:Vec3;
    @property(Camera)
    public camera: Camera;

    private zoomSpeed: number = 0.1; // zooming speeding of camera
    private smoothZoomIntervals = 0.3;
    // private focusDis: Vec3 = new Vec3(-5, 5, 5);
    private scheduler: Scheduler = new Scheduler();

    onLoad() {
        // this.mainCamera = find("Main Camera").getComponent<Camera>;
        this.camera = find("Main Camera").getComponent(Camera);
        this.offset = new Vec3(0,0,2);
        // this.camera.near = 1;
        //this.mainCamera.node.position = (this.centralNode.position.add(this.offset));

    }


    focusOn(node: Node) {
        console.log("before: node pos:", node.getWorldPosition(), " camera pos:", this.camera.node.getWorldPosition());

        const targetPosition = node.getWorldPosition();
        //this.camera.node.position = (targetPosition.clone().add(this.offset));
        tween(this.camera.node)
            .to(this.smoothZoomIntervals, { worldPosition: targetPosition.clone().add(this.offset) }, { easing: 'smooth' })
            .start();
        this.camera.node.lookAt(targetPosition);
        this.camera.node.rotation = node.rotation;
        console.log("after: node pos:", node.getWorldPosition(), " camera pos:", this.camera.node.getWorldPosition());

    }

    resetPosition(){
        
        this.camera.node.position = Manager.Instance().vertexManager.centralNode.position.clone().add(this.offset);
        this.camera.node.rotation =  Quat.identity(new Quat());
    }



}
