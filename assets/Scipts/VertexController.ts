import { _decorator, Component, Node,input, Input,EventMouse,Vec3, find, Camera, log } from 'cc';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;

@ccclass('VertexManager')
export class VertexManager extends Component {

    node: Node;
    @property(Vec3)
    offset:Vec3 = new Vec3(-5,5,5);

    isTransformView:boolean = false;


    
    public resetVertex(points: Node[]){
        if(points.length <= 0){
            console.log("There are no vertex");
            return;
        }

        this._createCentralVertex(points[0]);
    }

    private _createCentralVertex(point: Node){
        
    }
    update(deltaTime: number) {
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    private onMouseDown(e:EventMouse){
        if(e.getButton() === 0){
            console.log(Manager.Instance().cameraController);
            if(this.isTransformView)
                {
                    
                    Manager.Instance().cameraController.position = this.node.position.add(this.offset);
                    this.isTransformView = false;
                    console.log("transform");
                }
            else
                this.isTransformView = true;
    }
}

}