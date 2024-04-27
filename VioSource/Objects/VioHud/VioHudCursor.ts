import { VioEvents } from '../../Singletons/Events/VioEvents';
import { IvioEventParams } from '../../Interfaces/IvioEventParams';
import { VioInput, PointerData } from '../../Singletons/Input/VioInput';
import { VioHudElement } from './Elements/VioHudElement';
import { VioHudImage } from './Elements/VioHudImage';
import { VioEditMode  } from '../../Singletons/EditMode/VioEditMode';
import { VioRender } from '../../Singletons/Render/VioRender';
import { VioHud } from '../../Singletons/Hud/VioHud';

export type VioCursorState = {
    image: string,
    size: {width:number, height:number},
    offset: {x: number, y: number}
}

export class VioHudCursor extends VioHudElement {

    private _states: Record<string, VioCursorState>;
    private _state: string|null=null;
    private _image: VioHudImage;

    private __onInput: (data:PointerData) => void
    private __onObjectOver: (e:IvioEventParams) => void
    private __onObjectOut: (e:IvioEventParams) => void

    public get type(): string {
        return 'VioHudCursor'
    }

    public get props(): Array<string> {
        return super.props.concat(["states", "state"])
    }

    constructor(id: string|null) {
        super(id)
        this._states = {
            normal: {
                image: '/assets/images/cursor.png',
                size: {width: 20, height: 20},
                offset: {x: -10, y: -10},
            },
            hover: {
                image: '/assets/images/cursor_hover.png',
                size: {width: 30, height: 30},
                offset: {x: -15, y: -15},
            }
        }
        this._image = new VioHudImage()
        this._image.parent = this
        this._image.shadow = true
        this._updateStyle({
            'z-index': '100',
            'pointer-events': 'none',
        })
        this.state = 'normal'

        this.__onInput = this._onInput.bind(this)
        this.__onObjectOver = this._onObjectOver.bind(this)
        this.__onObjectOut = this._onObjectOut.bind(this)
    }

    public get state(): string {
        return this._state!
    }

    public set state(state: string) {
        this._state = state
        if (this._states[state]) {
            let {image, size, offset} = this._states[state]
            this._image.image = image
            this._image.size = size
            this._image.offset = offset
        }
    }

    public get states(): Record<string, VioCursorState> {
        return this._states
    }

    public set states(states: Record<string, VioCursorState>) {
        this._states = states
        this.state = this._state!
    }

    private _onInput(data:PointerData) {
        this.offset = {
            x: data.rawPosition.x - VioHud.instance.anchor.x,
            y: data.rawPosition.y - VioHud.instance.anchor.y,
        }
    }

    private _onObjectOver(e:IvioEventParams) {
        this.state = 'hover'
    }

    private _onObjectOut(e:IvioEventParams) {
        this.state = 'normal'
    }

    protected _onShow() {
        VioInput.onPointerMove.push(this.__onInput)
        VioEvents.registerEvent('over', this.__onObjectOver)
        VioEvents.registerEvent('out', this.__onObjectOut)
    }

    protected _onHide() {
        VioInput.onPointerMove.splice(VioInput.onPointerMove.indexOf(this.__onInput), 1)
        VioEvents.unregisterEvent('over', this.__onObjectOver)
        VioEvents.unregisterEvent('out', this.__onObjectOut)
    }
}
