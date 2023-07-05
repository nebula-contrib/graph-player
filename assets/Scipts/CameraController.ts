import { _decorator, Camera, Component, find, input, Node, Vec3, tween, Scheduler,Input,EventMouse, math} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
    @property(Node)
    centralNode:Node;
    @property(Camera)
    mainCamera:Camera;
    @property(Vec3)
    offset:Vec3 = new Vec3(0,0,2);
    @property(Camera)
    public camera: Camera = find("Main Camera").getComponent(Camera);

    private _zoomSpeed: number = 0.1; // zooming speeding of camera
    // private focusDis: Vec3 = new Vec3(-5, 5, 5);

    private scheduler: Scheduler = new Scheduler();

    onLoad() {
        // this.mainCamera = find("Main Camera").getComponent<Camera>;
        //this.camera = find("Main Camera").getComponent(Camera);
        //this.mainCamera.node.position = (this.centralNode.position.add(this.offset));

    }


    focusOn(node: Node) {
        console.log("before: node pos:", node.getWorldPosition(), " camera pos:", this.camera.node.getWorldPosition());
        const targetPosition = node.getWorldPosition();
        this.camera.node.position = (targetPosition.clone().add(this.offset));
        this.camera.node.lookAt(targetPosition);
        console.log("after: node pos:", node.getWorldPosition(), " camera pos:", this.camera.node.getWorldPosition());

    }



}
