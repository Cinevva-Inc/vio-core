import { VioHud } from "../../../Singletons/Hud/VioHud";

export type Scale = {
   x: number|string,
   y: number|string,
}

export type Size = {
   width: number|string,
   height: number|string,
}

export type Offset = {
   x: number|string,
   y: number|string 
}

export type Origin = {
    top: number|string|null,
    left: number|string|null,
    right: number|string|null,
    bottom: number|string|null,
}

export class VioHudElement {
    private _id: string
    private _element: HTMLElement
    private _parent: VioHudElement|null
    private _shadow: boolean
    private _visible: boolean
    private _style: Record<string,string>
    private _size: Size
    private _scale: Scale
    private _offset: Offset
    private _origin: Origin
    private _children: Record<string, VioHudElement>
    private static _registry: Record<string, any> = {}

    public get props(): Array<string> {
        return ["visible", "size", "scale", "offset", "origin", "type"]
    }

    public static register(type: string, Element: any) {
        VioHudElement._registry[type] = Element
    }

    public static create(type: string, id: string|null = null, data: any = {}): VioHudElement | null {
        let Element = VioHudElement._registry[type]
        if (Element) {
            let element = new Element(id)
            element.data = data
            return element
        }
        return null
    }

    constructor(id: string|null = null) {
        this._id = id ?? Math.random().toString(36).substring(2,16)
        this._element = document.createElement('div')
        this._parent = null
        this._visible = true
        this._children = {}
        this._shadow = false
        this._style = {}
        this._updateStyle({
            position: 'absolute',
        })
        this.size = this._size = {width:0, height:0}
        this._scale = {x:1, y:1}
        this._offset = {x:0, y:0}
        this._applyTransform()
        this.origin = this._origin = {top:0, left:0, right:null, bottom:null}
    }

    public get id(): string {
        return this._id
    }

    public get type(): string {
        return "VioHudElement"
    }

    public get children(): Record<string, VioHudElement> {
        return this._children
    }

    public get element(): HTMLElement {
        return this._element
    }

    public get shadow(): boolean {
        return this._shadow
    }

    public set shadow(shadow: boolean) {
        this._shadow = shadow
    }

    public get parent(): VioHudElement|null {
        return this._parent
    }

    public set parent(parent: VioHudElement|null) {
        if (this._parent === parent)
            return

        if (this._parent) {
            delete this._parent.children[this.id]
            if (this._visible) {
                this.element.remove()
                this._onHide()
            }
        }
        this._parent = parent
        if (this._parent) {
            this._parent.children[this.id] = this
            if (this._visible) {
                this._parent.element.appendChild(this.element)
                this._onShow()
            }
        }
    }

    public getElementById(id: string): VioHudElement | null {
        if (this._children[id])
            return this._children[id]
       
        for (let child of Object.values(this._children)) {
            let element = child.getElementById(id)
            if (element)
                return element
        }
        return null
    }

    public get visible(): boolean {
        return this._visible
    }

    public set visible(visible: boolean) {
        if (this._visible == visible)
            return
        if (this._parent && this._visible) {
            this.element.remove()
            this._onHide()
        }
        this._visible = visible
        if (this._parent && this._visible) {
            this._parent.element.appendChild(this.element)
            this._onShow()
        }
    }

    public get size(): Size {
        return this._size
    }

    public set size(size: Size) {
        this._size = size
        this._updateStyle({
            width: this._typed(size.width),
            height: this._typed(size.height),
        })
    }

    protected _applyTransform() {
        this._updateStyle({
            transform: `translate(${this._typed(this._offset.x)}, ${this._typed(this._offset.y)}) scale(${this._scale.x}, ${this._scale.y})`
        })
    }

    public get scale(): Scale {
        return this._scale
    }

    public set scale(scale: Scale) {
        this._scale = scale
        this._applyTransform()
    }

    public get offset(): Offset {
        return this._offset
    }

    public set offset(offset: Offset) {
        this._offset = offset
        this._applyTransform()
    }

    public get origin(): Origin {
        return this._origin
    }

    public set origin(origin: Origin) {
        this._origin = origin
        this._updateStyle({
            top: this._typed(origin.top),
            left: this._typed(origin.left),
            right: this._typed(origin.right),
            bottom: this._typed(origin.bottom),
        })
    }

    public get data(): any {
        let data = {type: this.type} as any
        for (let prop of this.props)
            data[prop] = (this as any)[prop]
        data.children = {} as any
        for (let [id, child] of Object.entries(this._children)) {
            if (!child.shadow)
                data.children[id] = child.data
        }
        return data
    }

    public set data(data: any) {
        console.log({data})
        for (let prop in data)
            if (prop != 'type' && prop != 'children')
                (this as any)[prop] = data[prop]

        for (let id in data.children ?? {}) {
            let childData = data.children[id] as any
            if (this._children[id])
                this._children[id].data = childData
            else {
                let child = VioHudElement.create(childData.type, id, childData)
                if (child)
                    child.parent = this
            }
        }
        for (let [id, child] of Object.entries(this._children))
            if (!data.children[id] && !child.shadow)
                child.parent = null
    }

    protected _updateStyle(style: Record<string,string>) {
        for (let [key, val] of Object.entries(style)) {
            if (this._style[key] != val) {
                this._style[key as string] = val;
                (this._element.style as any)[key] = val
            }
        }
    }

    private _typed(x:any) {
        return typeof x == 'number' ? `${x}px` : x ?? ''
    }

    protected _onShow() { }
    protected _onHide() { }
}
