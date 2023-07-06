import { _decorator, Component,physics } from 'cc';
import { CameraController } from './CameraController';
import { VertexManager } from './VertexManager';
import { CanvasManager } from './CanvasManager';
import { EdgeManager } from './EdgeManager';
import { RelationManager } from './RelationManager';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('Manager')
export class Manager extends Component {
 
    
    @property(CameraController)
    public cameraController: CameraController;

    @property(VertexManager)
    public vertexManager: VertexManager;

    @property(CanvasManager)
    public canvasManager: CanvasManager;

    @property(EdgeManager)
    public edgeManager: EdgeManager;

    @property(RelationManager)
    public relationManager: RelationManager;

    @property(UIManager)
    public UIManager: UIManager;

    static instance:Manager = new Manager();

    protected onLoad(): void {
        physics.PhysicsSystem.instance.enable = true;
        Manager.instance.cameraController = this.node.getChildByName('CameraController').getComponent(CameraController);
        Manager.instance.vertexManager = this.node.getChildByName('VertexManager').getComponent(VertexManager);
        Manager.instance.canvasManager = this.node.getChildByName('CanvasManager').getComponent(CanvasManager);
        Manager.instance.edgeManager = this.node.getChildByName('EdgeManager').getComponent(EdgeManager);
        Manager.instance.relationManager = this.node.getChildByName('RelationManager').getComponent(RelationManager);
        Manager.instance.UIManager = this.node.getChildByName('Canvas').getChildByName('UIManager').getComponent(UIManager);
        Manager.Instance();

        console.log("find: ", Manager.Instance().UIManager)
    }
    
    

    
    static Instance(){
        if(!Manager.instance){
            Manager.instance = new Manager();

        }
        return Manager.instance;
    }

}

