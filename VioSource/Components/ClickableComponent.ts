import { Vector3, Face, Object3D } from "three";
import { IvioInteractable } from "../Interfaces/IvioInteractable";
import { VioCursorState } from "../Objects/VioHud/VioHudCursor";
import { VioObject        } from "../Objects/VioObject/VioObject";
import { VioScene       } from "../Objects/VioScene/VioScene";
import { VioEvents } from "../Singletons/Events/VioEvents";
import { VioRaycast } from "../Singletons/Raycast/VioRaycast";
import { VioRender } from "../Singletons/Render/VioRender";
import { VioComponent } from "./Base/VioComponent";

export class ClickableComponent extends VioComponent implements IvioInteractable
{
    protected _interactable:boolean = true;
    protected _customCursor:VioCursorState|null=null;
    buttonMode: boolean = true;

    constructor() {
        super('ClickableComponent')
    }

    public setData(data:any)
    {
        this.interactable = data.interactable !== undefined ? data.interactable : this.interactable;
        this.buttonMode   = data.buttonMode   !== undefined ? data.buttonMode   : this.buttonMode;
    }

    get object() { return super.object }
    set object(object: VioObject|null) {
        if (this.object && this.interactable)
            VioRaycast.removeInteractableObject(this);
        super.object = object
        if (this.object && this.interactable)
            VioRaycast.addInteractableObject(this);
    }

    public get interactable() { return this._interactable; }

    set interactable(interactable: boolean) {
        if (this.object && this.interactable)
            VioRaycast.removeInteractableObject(this);
        this.interactable = interactable
        if (this.object && this.interactable)
            VioRaycast.addInteractableObject(this);
    }

    onClick(buttonID: number, param: { distance: number; point: Vector3; face: Face; faceIndex: number; object: Object3D}): void 
    {
        VioEvents.broadcastEvent('click',param,this.object);
    }

    onOver(param: { distance: number; point: Vector3; face: Face; faceIndex: number; object: Object3D}): void
    {
        if(this.buttonMode)
        {
            VioRender.canvasElement.style.setProperty('cursor','pointer');
        }
        VioEvents.broadcastEvent('over',{raycast:param,cursor:this._customCursor},this.object);
    }

    onOut(): void 
    {
        if(this.buttonMode)
        {
            VioRender.canvasElement.style.setProperty('cursor','unset');
        }
        VioEvents.broadcastEvent('out',null,this.object);
    }

    public getData():any
    {
        let obj      = super.getData() as any;

        obj.interactable = this.interactable;
        obj.buttonMode   = this.buttonMode;

        return obj;
    }
}