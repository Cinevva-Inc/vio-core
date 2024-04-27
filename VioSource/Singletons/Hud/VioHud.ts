import { VioHudElement } from "../../Objects/VioHud/Elements/VioHudElement";

export class VioHud extends VioHudElement {

    private static _instance: VioHud
    private _anchor: {x:number, y:number}

    public get type() {
        return 'VioHud'
    }

    public static get instance():VioHud {
        if (!VioHud._instance)
            VioHud._instance = new VioHud()
        return VioHud._instance
    }

    private constructor() {
        super()
        this._anchor = {x:0, y:0}
        this.size = {width:'100%',height:'100%'}
        this._updateStyle({
            // 'pointer-events': 'none',
        })
        this.element.className = 'vio-hud'
    }

    public get anchor(): {x:number, y:number} {
        return this._anchor
    }

    public set anchor(anchor: {x:number, y:number}) {
        this._anchor = anchor
    }
}
