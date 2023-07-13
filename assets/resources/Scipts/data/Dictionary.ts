import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Dictionary')
export class Dictionary extends Component {
    public key:string = '';
    public value : [number];
}

