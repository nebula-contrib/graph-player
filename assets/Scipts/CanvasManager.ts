import {  _decorator, Component, input,Input,EventMouse,  geometry, Node, director, tween, PhysicsSystem, Vec3,Vec2, Camera,math, find, Quat } from 'cc';
import { Vertex } from './Vertex';
import { VertexManager } from './VertexManager';
import { CameraController } from './CameraController';
import { Manager } from './Manager';
import { EdgeManager } from './EdgeManager';

const { ccclass, property } = _decorator;

@ccclass('CanvasManager')
export class CanvasManager extends Component {
    @property({ type: VertexManager })
    public vertexManager: VertexManager;

    @property({ type: CameraController })
    public cameraController: CameraController;

    @property({ type: EdgeManager })
    public edgeManager: EdgeManager;

    @property({ type:Node})
    public centralVertex:Node = null;
    
    // mouse-left parameter

    private leftClickCount: number = 0; 
    private lastClickTime: number = 0;
    private doubleClickDelay: number = 0.3; // double-click intervals of mouse-left


    // mouse wheel parameter
    private _zoomSpeed: number = 0.0005; // zoom speed of mouse wheel

    // mouse movement

    private isMouseDragging = false;
    private previousMousePosition: Vec2 = null;
    private dragRotationSpeed = 0.05;
    private dragRotationQuat: Quat = new Quat();

    onLoad() {
        
        //this.cameraController = Manager.Instance().cameraController.getComponent(CameraController);
        //this.vertexManager = this.vertexManager.getComponent(VertexManager);
        //this.vertexManager.createVertexAround(this.node); 

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }

    onMouseMove(event:EventMouse){
        if(this.isMouseDragging){
            
            const currentPosition = event.getLocation();
            const dx = event.getDeltaX();
            const dy = event.getDeltaY();
            let quat = this.cameraController.camera.node.rotation.clone();

            // 创建垂直旋转（x轴）和水平旋转（y轴）的四元数
            let quatX = Quat.fromEuler(new Quat(), dy * this.dragRotationSpeed, 0, 0);
            let quatY = Quat.fromEuler(new Quat(), 0, dx * this.dragRotationSpeed, 0);
            
            // 组合两个旋转
            Quat.multiply(quat, quat, quatX);
            Quat.multiply(quat, quat, quatY);
            
            // 设置摄像机节点的旋转
            this.cameraController.camera.node.rotation = quat;
            // this.cameraController.camera. = this.dragRotationQuat;
            

            
        }
    }
    
    onMouseDown(event: EventMouse){
        if(event.getButton() === EventMouse.BUTTON_LEFT){
            this.isMouseDragging = true;
            this.previousMousePosition = event.getLocation();
            
            
        }
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === EventMouse.BUTTON_RIGHT) {
            
            this.createVertexAtMouse(event);
        } else if (event.getButton() === EventMouse.BUTTON_LEFT) {
            this.isMouseDragging = false;
            this.chooseVertexAtMouse(event)
;            // const now = performance.now();
            // if (now - this.lastClickTime < this.doubleClickDelay * 1000) {
            //     this.leftClickCount++;
            //     console.log("left click times add");
            // } else {
            //     console.log("left click one time");
            //     this.leftClickCount = 1;
            // }
            // this.lastClickTime = now;
            // if (this.leftClickCount === 2) {
            //     console.log("left click two times");
            //     this.focusCameraAtMouse(event);
            //}
            
        }
    }

    
    onMouseWheel(event: EventMouse) {
        // get the y value of wheel 
        let scrollY = event.getScrollY();

        // calculate and update new position of camera
        let newCameraPos = new Vec3();
        
        math.Vec3.scaleAndAdd(newCameraPos, this.cameraController.camera.node.position, this.cameraController.camera.node.forward, this._zoomSpeed * scrollY);
        this.cameraController.camera.node.position = newCameraPos;
    }



    
    onDestroy() {
        input.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    /**
     * do the collision detection by ray
     * @param event 
     */
    createVertexAtMouse(event: EventMouse) {
        const ray = this.cameraController.camera.screenPointToRay(event.getUILocation().x, event.getUILocation().y);
       
        const r = new geometry.Ray();
        Vec3.copy(r.o, ray.o);
        Vec3.copy(r.d, ray.d);
        if (PhysicsSystem.instance.raycastClosest(r)) {
            
            const result = PhysicsSystem.instance.raycastClosestResult;
           
            if (result.collider.node.getComponent(Vertex)) {
                
                let childVertex = this.vertexManager.createVertexAround(result.collider.node);
                this.edgeManager.createOneEdge(result.collider.node, childVertex);
                
            }
        }
    }

    chooseVertexAtMouse(event:EventMouse){
        const ray = this.cameraController.camera.screenPointToRay(event.getUILocation().x, event.getUILocation().y);
        const r = new geometry.Ray();
        Vec3.copy(r.o, ray.o);
        Vec3.copy(r.d, ray.d);
        if (PhysicsSystem.instance.raycastClosest(r)) {
            
            const result = PhysicsSystem.instance.raycastClosestResult;
            
            if (result.collider.node.getComponent(Vertex)) {
                
                this.centralVertex = result.collider.node;
                this.cameraController.focusOn(result.collider.node);
                
                
            }
        }
    }

    focusCameraAtMouse(event: EventMouse) {
        console.log("start focus on new node!");
        const ray = this.cameraController.camera.screenPointToRay(event.getUILocation().x, event.getUILocation().y);
        const r = new geometry.Ray();
        Vec3.copy(r.o, ray.o);
        Vec3.copy(r.d, ray.d);
        if (PhysicsSystem.instance.raycastClosest(r)) {
            const result = PhysicsSystem.instance.raycastClosestResult;
            if (result.collider.node.getComponent(Vertex)) {
                this.cameraController.focusOn(result.collider.node);
            }
        }
    }
}
