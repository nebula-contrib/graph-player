import { _decorator, Component, Node,EventHandler,Button } from 'cc';
const { ccclass, property } = _decorator;
import { Manager } from './Manager';

@ccclass('UIManager')
export class UIManager extends Component {

    clickEventHandler = new EventHandler();

    @property(Button)
    public refreshBtn:Button;

    public RefreshCanvas(event:Event){
        console.log("refresh!",this.refreshBtn);
        Manager.Instance().canvasManager.resetCanvas();

        
    }

    start () {
        const refreshClickEventHandler = new EventHandler();
        this.refreshBtn = this.node.getChildByName('RefreshBtn').getComponent(Button);
        console.log("refreshBtn:",this.refreshBtn);
        
        refreshClickEventHandler.target = this.node.getChildByName('RefreshBtn'); // 这个 node 节点是你的事件处理代码组件所属的节点
        refreshClickEventHandler.component = 'UIManager';// 这个是脚本类名
        refreshClickEventHandler.handler = 'RefreshCanvas';
        

        // const button = this.node.getComponent(Button);
        this.refreshBtn.clickEvents.push(refreshClickEventHandler);
    }


    update(deltaTime: number) {
        
    }
}

