import { _decorator, Component, Node } from 'cc';
import { Manager } from './Manager';
const { ccclass, property } = _decorator;


@ccclass('Graphplayer')
export class Graphplayer extends Component {

    private serverAddress:string = "http://127.0.0.1:8050";
    private useServer:boolean = false;
    public isVertexIDFollowCamera = true; // if true, it might lead to a slight stutter each time the rotation occurs.
    protected start(): void {
        


    }



    /**
     * set variable -- useServer 
     * @param flag: true or false 
     */
    public setUseServerFlag(flag:boolean){
        this.useServer = flag;
    }

    /**
     * 
     * @returns variable -- useServer
     */
    public getUseServerFlag():boolean{
        return this.useServer;
    }
    /**
     * change the address of server
     * @param address：string 
     * @returns: serverAddress 
     */
    public changeServerAddress(address:string):string{
        this.serverAddress = address;
        return address;
    }

    
    /**
     * get address of server
     * @returns: serverAddress 
     */
    public getServerAddress():string{
        return this.serverAddress;
    }

    /**
     * vertex following camera or not
     * if true, it might lead to a slight stutter each time the rotation occurs.
     * @param flag: boolean
     */
    public setIsVertexIDFollowCamera(flag:boolean){
        this.isVertexIDFollowCamera = flag;
    }

    
}

