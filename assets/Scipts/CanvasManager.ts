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

    // private isMouseDragging = false;
    private cameraMove = false;
    private cameraRorateAroundVertex = false;
    private previousMousePosition: Vec2 = null;
    private dragMoveSpeed = 0.05;
    private dragRotateSpeed = 0.05;
    private dragRotationQuat: Quat = new Quat();

    onLoad() {
        
        //Manager.Instance().cameraController = Manager.Instance().cameraController.getComponent(CameraController);
        //this.vertexManager = this.vertexManager.getComponent(VertexManager);
        //this.vertexManager.createVertexAround(this.node); 
        this.cameraController = Manager.Instance().cameraController;
        


        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }

    protected start(): void {
                // reset the canvas
        this.resetCanvas();
    }

    onMouseMove(event:EventMouse){
        if(this.cameraMove){
            
            const currentPosition = event.getLocation();
            const dx = event.getDeltaX();
            const dy = event.getDeltaY();
            let quat = Manager.Instance().cameraController.camera.node.rotation.clone();

            
            let quatX = Quat.fromEuler(new Quat(), dy * this.dragMoveSpeed, 0, 0);
            let quatY = Quat.fromEuler(new Quat(), 0, dx * this.dragMoveSpeed, 0);
            
          
            Quat.multiply(quat, quat, quatX);
            Quat.multiply(quat, quat, quatY);
            
            
            Manager.Instance().cameraController.camera.node.rotation = quat;
            // Manager.Instance().cameraController.camera. = this.dragRotationQuat;
            

            
        }

        else if(this.cameraRorateAroundVertex){

            console.log("try to rotate around")
            let currentMousePosition = event.getLocation();
            let dx = (currentMousePosition.x - this.previousMousePosition.x) * this.dragRotateSpeed;
            let dy = (currentMousePosition.y - this.previousMousePosition.y) * this.dragRotateSpeed;
            
            console.log("central node:",Manager.Instance().vertexManager)
            let cameraQuaternion =  Manager.Instance().vertexManager.node.rotation.clone();
            let rotateQuat = new Quat();
            Quat.fromEuler(rotateQuat, dy, dx, 0);
            Quat.multiply(rotateQuat, cameraQuaternion, rotateQuat);

            Manager.Instance().vertexManager.node.setRotation(rotateQuat);
            //console.log("rotation focus node:", this.centralVertex.getComponent(Vertex).getVertexID()," position:",this.centralVertex.position)
            console.log(" rorate around:",Manager.Instance().vertexManager.node.position)
            
            this.previousMousePosition = currentMousePosition;
        }
    }
    
    onMouseDown(event: EventMouse){
        if(event.getButton() === EventMouse.BUTTON_MIDDLE){
            
            this.cameraMove = true;
            this.previousMousePosition = event.getLocation();
            
            
            
        }

        else if(event.getButton() === EventMouse.BUTTON_LEFT){
            this.cameraRorateAroundVertex = true;
            this.previousMousePosition = event.getLocation();
            
            
        }
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === EventMouse.BUTTON_RIGHT) {
            
            this.createVertexAtMouse(event);
        } 
        else if (event.getButton() === EventMouse.BUTTON_MIDDLE) {
           
            this.cameraMove = false;
            
        }
        else if(event.getButton() === EventMouse.BUTTON_LEFT){
            this.cameraRorateAroundVertex = false;
            this.chooseVertexAtMouse(event);
        }
    }

    
    onMouseWheel(event: EventMouse) {
        // get the y value of wheel 
        let scrollY = event.getScrollY();

        // calculate and update new position of camera
        let newCameraPos = new Vec3();
        
        math.Vec3.scaleAndAdd(newCameraPos, Manager.Instance().cameraController.camera.node.position, Manager.Instance().cameraController.camera.node.forward, this._zoomSpeed * scrollY);
        Manager.Instance().cameraController.camera.node.position = newCameraPos;
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
        const ray = Manager.Instance().cameraController.camera.screenPointToRay(event.getUILocation().x, event.getUILocation().y);
       
        const r = new geometry.Ray();
        Vec3.copy(r.o, ray.o);
        Vec3.copy(r.d, ray.d);
        if (PhysicsSystem.instance.raycastClosest(r)) {
            
            const result = PhysicsSystem.instance.raycastClosestResult;
           
            if (result.collider.node.getComponent(Vertex)) {
                
                let childVertex = Manager.Instance().vertexManager.createVertexAround(result.collider.node);
                Manager.Instance().edgeManager.createOneEdge(result.collider.node, childVertex);
                
            }
        }
    }

    chooseVertexAtMouse(event:EventMouse){
        const ray = Manager.Instance().cameraController.camera.screenPointToRay(event.getUILocation().x, event.getUILocation().y);
        const r = new geometry.Ray();
        Vec3.copy(r.o, ray.o);
        Vec3.copy(r.d, ray.d);
        if (PhysicsSystem.instance.raycastClosest(r)) {
            
            const result = PhysicsSystem.instance.raycastClosestResult;
            
            if (result.collider.node.getComponent(Vertex)) {
                
                this.centralVertex = result.collider.node;

                // transfer the vertexManager position same as the centralVertex, in order to rotate on the centralVertex
                
                // Manager.Instance().vertexManager.node.position = this.centralVertex.position;
                Manager.Instance().cameraController.focusOn(result.collider.node);
                
                
            }
        }
    }

    focusCameraAtMouse(event: EventMouse) {
        console.log("start focus on new node!");
        const ray = Manager.Instance().cameraController.camera.screenPointToRay(event.getUILocation().x, event.getUILocation().y);
        const r = new geometry.Ray();
        Vec3.copy(r.o, ray.o);
        Vec3.copy(r.d, ray.d);
        if (PhysicsSystem.instance.raycastClosest(r)) {
            const result = PhysicsSystem.instance.raycastClosestResult;
            if (result.collider.node.getComponent(Vertex)) {
                Manager.Instance().cameraController.focusOn(result.collider.node);
            }
        }
    }


    resetCanvas(){
        Manager.Instance().vertexManager.destroyAllChildren();
        Manager.Instance().vertexManager.initiateOriginalVertex();
        Manager.Instance().cameraController.resetPosition();
        
    }
}
