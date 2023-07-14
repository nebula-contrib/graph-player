import {  _decorator, Component, input,Input,EventMouse,  geometry, Node, director, tween, PhysicsSystem, Vec3,Vec2, Camera,math, find, Quat } from 'cc';
import { Vertex } from './Vertex';
import { Manager } from './Manager';
import { Edge } from './Edge';


const { ccclass, property } = _decorator;

@ccclass('CanvasManager')
export class CanvasManager extends Component {


    @property({ type:Node})
    public centralVertex:Node = null;
    
    // mouse-left parameter

    public leftClickCount: number = 0; 
    private lastClickTime: number = 0;
    private doubleClickDelay: number = 0.3; // double-click intervals of mouse-left


    // mouse wheel parameter
    private _zoomSpeed: number = 0.00009; // zoom speed of mouse wheel

    // mouse movement

    // private isMouseDragging = false;
    private cameraMove = false;
    private cameraRorateAroundVertex = false;
    private previousMousePosition: Vec2 = null;
    private previousMousePositionVec3: Vec3 = new Vec3();
    private dragMoveSpeed = 0.01;
    private dragRotateSpeed = 0.2;
    private dragRotationQuat: Quat = new Quat();
    private dragRotateEuler: Vec3 = new Vec3(); 

    onLoad() {
        
        //Manager.Instance().cameraController = Manager.Instance().cameraController.getComponent(CameraController);
        //this.vertexManager = this.vertexManager.getComponent(VertexManager);
        //this.vertexManager.createVertexAround(this.node); 
        


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
            /**
             * Method 1. start -- camera rotate by itseif
             */
            

            // const currentPosition = event.getLocation();
            // const dx = event.getDeltaX();
            // const dy = event.getDeltaY();
            // let quat = Manager.Instance().cameraController.camera.node.rotation.clone();
            // let quatX = Quat.fromEuler(new Quat(), dy * this.dragMoveSpeed, 0, 0);
            // let quatY = Quat.fromEuler(new Quat(), 0, dx * this.dragMoveSpeed, 0);
            // Quat.multiply(quat, quat, quatX);
            // Quat.multiply(quat, quat, quatY);
            // Manager.Instance().cameraController.camera.node.rotation = quat;
            /**
             * Method 1. end -- camera rotate by itself
             */

            /**
             * Method 2. start -- camera move directly
             */
            const dx = event.getDeltaX();
            const dy = event.getDeltaY();
            let newPosition = new Vec3(
                Manager.Instance().cameraController.camera.node.position.x - dx * this.dragMoveSpeed,
                Manager.Instance().cameraController.camera.node.position.y - dy * this.dragMoveSpeed,
                Manager.Instance().cameraController.camera.node.position.z
            );

            Manager.Instance().cameraController.camera.node.position = newPosition;



            /**
             * Method 2. end -- camera move directly
             */

            
        }

        else if(this.cameraRorateAroundVertex){
            /**
             * ---- start rorate nodes and its children --------
             */
            // let currentMousePosition = event.getLocation();
            // let dx = (currentMousePosition.x - this.previousMousePosition.x) * this.dragRotateSpeed;
            // let dy = (currentMousePosition.y - this.previousMousePosition.y) * this.dragRotateSpeed;
            
            // console.log("central node:",Manager.Instance().vertexManager)
            // let cameraQuaternion =  Manager.Instance().vertexManager.centralNode.rotation.clone();
            // let rotateQuat = new Quat();
            // Quat.fromEuler(rotateQuat, dy, dx, 0);
            // Quat.multiply(rotateQuat, cameraQuaternion, rotateQuat);

            // Manager.Instance().vertexManager.centralNode.setRotation(rotateQuat);
            // //console.log("rotation focus node:", this.centralVertex.getComponent(Vertex).getVertexID()," position:",this.centralVertex.position)
            
            // this.previousMousePosition = currentMousePosition;
            /**
             * ---- end rorate nodes and its children --------
             */

            /**
             * ---- start rorate camera ------------
             */
            let currentMousePosition = event.getLocation();
            let dx = (currentMousePosition.x - this.previousMousePosition.x) * this.dragRotateSpeed;
            let dy = (currentMousePosition.y - this.previousMousePosition.y) * this.dragRotateSpeed;
            const angleX = (dx / 100) * 80;
            const angleY = (dy / 100) * 80;
            const cameraPos = Manager.Instance().cameraController.camera.node.worldPosition.clone();
            const targetPos = Manager.Instance().vertexManager.currentCentralNode.worldPosition.clone();

            // calculate the position after rotation
            const rotatedPosX = Manager.Instance().cameraController.rotateOnVertex(cameraPos, targetPos, angleX, Vec3.UP);
            const rotatedPosY = Manager.Instance().cameraController.rotateOnVertex(rotatedPosX, targetPos, angleY, Vec3.RIGHT);

            // set the camera
            Manager.Instance().cameraController.camera.node.worldPosition = rotatedPosY;
            Manager.Instance().cameraController.camera.node.lookAt(targetPos);

            // uodate the mouse position
            this.previousMousePosition = currentMousePosition;

            /**
             * ---- end rorate camera ------------
             */
            
           
        }
    }
    
    /**
     * Event of pressing mouse down 
     * @param event 
     */
    onMouseDown(event: EventMouse){
        /**
         * press by middle key
         */
        if(event.getButton() === EventMouse.BUTTON_MIDDLE){
            
            this.cameraMove = true;
            this.previousMousePosition = event.getLocation();

        }

        /**
         * press by left key
         */
        else if(event.getButton() === EventMouse.BUTTON_LEFT){
            this.cameraRorateAroundVertex = true;
            this.previousMousePositionVec3.set(event.getLocationX(), event.getLocationY(), 0);
            
            this.previousMousePosition = event.getLocation();
            
            
        }
    }

    
    /**
     * Event of mouse up
     * @param event 
     */
    onMouseUp(event: EventMouse) {
        /**
         * mouse up by right key
         */
        if (event.getButton() === EventMouse.BUTTON_RIGHT) {
            
            this.createVertexAtMouse(event);
        } 
        /**
         * mouse up by middle key
         */
        else if (event.getButton() === EventMouse.BUTTON_MIDDLE) {
           
            this.cameraMove = false;
            
        }
        /**
         * mouse up by left key
         */
        else if(event.getButton() === EventMouse.BUTTON_LEFT){
            
            this.cameraRorateAroundVertex = false;
            this.chooseVertexOrEdgeAtMouse(event);
            //this.chooseEdgeAtMouse(event);
        }
    }

    /**
     * mouse event of wheel, on camera zooming
     * @param event 
     */
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
        let ray = new geometry.Ray();
        Manager.Instance().cameraController.camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        if (PhysicsSystem.instance.raycastClosest(ray)) {
            
            const result = PhysicsSystem.instance.raycastClosestResult;
           
            if (result.collider.node.getComponent(Vertex)) {
                let childVertex = Manager.Instance().vertexManager.createNodeAround(result.collider.node);
                Manager.Instance().edgeManager.createOneEdge(result.collider.node, childVertex);
                
            }
        }
    }

    /**
     * when click and choose vertex
     * @param event left click(0, 1, 2 times)
     */
    chooseVertexOrEdgeAtMouse(event:EventMouse){
        
        let ray = new geometry.Ray();
        Manager.Instance().cameraController.camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        if (PhysicsSystem.instance.raycastClosest(ray)) {
            
            const result = PhysicsSystem.instance.raycastClosestResult;
            
            if (result.collider.node.getComponent(Vertex)) {
                Manager.Instance().edgeManager.returnFocusToNormalEdge();
                if(this.leftClickCount == 0){
                    this.leftClickCount ++;
                    this.centralVertex = result.collider.node;
                    
                
                    // Manager.Instance().vertexManager.node.position = this.centralVertex.position;
                    Manager.Instance().vertexManager.returnFocusToNormalVertex();
                    Manager.Instance().vertexManager.chosenVertex = result.collider.node;
                    Manager.Instance().vertexManager.chooseOneNormalVertexToFocus(result.collider.node); // change the chosen vertex
                }  
                else if(this.leftClickCount == 1 && Manager.Instance().vertexManager.chosenVertex == result.collider.node) {
                    
                    Manager.Instance().cameraController.focusOn(result.collider.node);

                    Manager.Instance().vertexManager.currentCentralNode.getComponent(Vertex).showVertexDetails();

                    this.leftClickCount = 0;
                }
                else if(this.leftClickCount == 1 && Manager.Instance().vertexManager.chosenVertex != result.collider.node){
                    this.centralVertex = result.collider.node;
                    Manager.Instance().vertexManager.returnFocusToNormalVertex();
                    Manager.Instance().vertexManager.chosenVertex = result.collider.node;
                    Manager.Instance().vertexManager.chooseOneNormalVertexToFocus(result.collider.node);
                }  
                else{
                    this.leftClickCount = 0;
                    Manager.Instance().vertexManager.returnFocusToNormalVertex();
                }
            }
            else if(result.collider.node.getComponent(Edge)){
                Manager.Instance().vertexManager.returnFocusToNormalVertex();
                Manager.Instance().edgeManager.returnFocusToNormalEdge();
                Manager.Instance().edgeManager.chosenEdgeNode = result.collider.node;
                Manager.Instance().edgeManager.chooseNormalEdge(result.collider.node); 
                Manager.Instance().edgeManager.chosenEdgeNode.getComponent(Edge).showEdgeDetails();
            }
        }
        
        else{
            this.leftClickCount = 0;
            Manager.Instance().edgeManager.returnFocusToNormalEdge();
            // Manager.Instance().vertexManager.returnFocusToNormalVertex();
        } 
    }

    /**
     * when click and choose edge
     * @param event 
     */
    chooseEdgeAtMouse(event:EventMouse){
        let ray = new geometry.Ray();
        Manager.Instance().cameraController.camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        if (PhysicsSystem.instance.raycastClosest(ray)) {
            
            const result = PhysicsSystem.instance.raycastClosestResult;
            
            if (result.collider.node.getComponent(Edge)) {
                console.log("choose edge!")
                if(this.leftClickCount == 0){
                    this.leftClickCount ++;
                    Manager.Instance().edgeManager.returnFocusToNormalEdge();
                    Manager.Instance().edgeManager.chosenEdgeNode = result.collider.node;
                    Manager.Instance().edgeManager.chooseNormalEdge(result.collider.node); // change the chosen edge
                    
                    
                }  
                else if(this.leftClickCount == 1 && Manager.Instance().edgeManager.chosenEdgeNode == result.collider.node) {
                    
                    Manager.Instance().edgeManager.chosenEdgeNode.getComponent(Edge).showEdgeDetails();

                    this.leftClickCount = 0;
                }
                else if(this.leftClickCount == 1 && Manager.Instance().edgeManager.chosenEdgeNode != result.collider.node){
                    // Manager.Instance().edgeManager.chosenEdgeNode = result.collider.node;
                    Manager.Instance().edgeManager.returnFocusToNormalEdge();
                    Manager.Instance().edgeManager.chosenEdgeNode = result.collider.node;
                    Manager.Instance().edgeManager.chooseNormalEdge(result.collider.node);
                }  
                else{
                    this.leftClickCount = 0;
                    Manager.Instance().edgeManager.returnFocusToNormalEdge();
                }
            }
        }
        else{
            this.leftClickCount = 0;
            // Manager.Instance().vertexManager.returnFocusToNormalVertex();
        } 
    }

    /**
     * clean the canvas
     */
    cleanCanvas(){
        // clean vertices
        Manager.Instance().vertexManager.destroyAllChildren();
        // clean edges
        Manager.Instance().edgeManager.destroyAllEdges();
        //reset camera
        Manager.Instance().cameraController.resetPosition();
        // clean UI
        Manager.Instance().UIManager.isNodeInfoEnable = false;
        Manager.Instance().UIManager.nodeInfoBar.active = false;
    }


    /**
     * clean the canvas and new a central node in Vec3(0,0,0)
     */
    resetCanvas(){
        // reset vertices
        Manager.Instance().vertexManager.destroyAllChildren();
        Manager.Instance().vertexManager.initiateOriginalVertex();
        // reset edges
        Manager.Instance().edgeManager.destroyAllEdges();
        // reset camera
        Manager.Instance().cameraController.resetPosition();
        // reset UI
        Manager.Instance().UIManager.isNodeInfoEnable = false;
        Manager.Instance().UIManager.nodeInfoBar.active = false;
        
        
    }

    
}
