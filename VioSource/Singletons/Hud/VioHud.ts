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

    public get data(): any {
        return super.data
    }

    public set data(data: any) {
        super.data = data
        this.size = {width:'100%',height:'100%'}
    }

    public get anchor() {
        return this._anchor
    }

    public set anchor(anchor: {x:number, y:number}) {
        this._anchor = anchor
    }

    public set padding(padding:{top:number,left:number,right:number,bottom:number}) {
        console.log('VioHud.padding', padding)
        this._updateStyle({
            'padding-top': `${padding.top}px`,
            'padding-left': `${padding.left}px`,
            'padding-right': `${padding.right}px`,
            'padding-bottom': `${padding.bottom}px`,
        })
    }
}
