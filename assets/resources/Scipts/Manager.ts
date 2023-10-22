import { _decorator, Component,physics,find } from 'cc';
import { CameraController } from './CameraController';
import { VertexManager } from './VertexManager';
import { CanvasManager } from './CanvasManager';
import { EdgeManager } from './EdgeManager';
import { RelationManager } from './RelationManager';
import { UIManager } from './UIManager';
import { JSONReader } from './JSONReader';
import { LayoutManager } from './LayoutManager';
import { Graphplayer } from './Graphplayer';
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

    @property(JSONReader)
    public JSONReader:JSONReader;

    @property(LayoutManager)
    public layoutManager:LayoutManager;

    @property(Graphplayer)
    public graphPlayer: Graphplayer;

    static instance:Manager = new Manager();

    protected onLoad(): void {
        console.log("Manager!")
        physics.PhysicsSystem.instance.enable = true;
        Manager.instance.cameraController = this.node.getChildByName('CameraController').getComponent(CameraController);
        Manager.instance.vertexManager = this.node.getChildByName('Canvas').getChildByName('VertexManager').getComponent(VertexManager);
        Manager.instance.canvasManager = this.node.getChildByName('CanvasManager').getComponent(CanvasManager);
        Manager.instance.edgeManager = this.node.getChildByName('EdgeManager').getComponent(EdgeManager);
        Manager.instance.relationManager = this.node.getChildByName('RelationManager').getComponent(RelationManager);
        Manager.instance.UIManager = this.node.getChildByName('Canvas').getChildByName('UIManager').getComponent(UIManager);
        Manager.instance.JSONReader = this.node.getChildByName('JSONReader').getComponent(JSONReader);
        Manager.instance.layoutManager = this.node.getChildByName('LayoutManager').getComponent(LayoutManager);
        Manager.instance.graphPlayer = find("GraphPlayer").getComponent(Graphplayer);

        console.log("find: ", Manager.instance.edgeManager);
    }
    
    

    
    static Instance(){
        if(!Manager.instance){
            Manager.instance = new Manager();

        }
        return Manager.instance;
    }

}

