import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Constant')
export class Constant extends Component {

}

export const PHY_GROUP = {
    DEFAULT: 1 << 0,
    MOUSE: 1 << 1,
    EDGE: 1 << 2,
    VERTEX: 1 << 3,
};