import { BoxGeometry, Event, Face, Mesh, MeshBasicMaterial, Object3D, Vector3 } from "three";
import { IvioInteractable, RayParams } from "../../../Interfaces/IvioInteractable";
import { VioEvents } from "../../Events/VioEvents";
import { VioRaycast } from "../../Raycast/VioRaycast";
import { VioRender } from "../../Render/VioRender";

export class VioPathFindingGround extends Mesh implements IvioInteractable
{
    interactable: boolean  = true;
    buttonMode  : boolean  = false;
    object      : Object3D = this;

    protected _handlers:Array<(point:Vector3)=>void>;

    constructor()
    {
        super(new BoxGeometry(1,1,1), new MeshBasicMaterial({color: 0x00ff00, transparent:true, opacity: 0.3}));
        this._handlers = [];
    }

    onClick(buttonID: number, param: RayParams): void
    {
        this._handlers.forEach(cb=>
        {
            cb(param.point);
        });
    }

    onOver(param: { distance: number; point: Vector3; face: Face; faceIndex: number; object: Object3D}): void
    {
        if(this.buttonMode)
        {
            VioRender.canvasElement.style.setProperty('cursor','pointer');
        }
        VioEvents.broadcastEvent('over',null,this.object);
    }

    onOut(): void 
    {
        if(this.buttonMode)
        {
            VioRender.canvasElement.style.setProperty('cursor','unset');
        }
        VioEvents.broadcastEvent('out',null,this.object);
    }

    public registerCallback(cb:(point:Vector3)=>void)
    {
        if(!this._handlers.includes(cb))
        {
            this._handlers.push(cb);
            VioRaycast.addInteractableObject(this);
        }
    }

    public unregisterCallback(cb:(point:Vector3)=>void)
    {
        for(let num = this._handlers.length - 1; num >= 0 ; num--)
        {
            if(this._handlers[num] == cb)
            {
                this._handlers.splice(num,1);
            }
        }
        
        if(this._handlers.length == 0)
        {
            VioRaycast.removeInteractableObject(this);
        }
    }

}