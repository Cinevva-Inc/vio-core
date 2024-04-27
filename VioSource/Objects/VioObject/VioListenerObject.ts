import { Object3D, Vector3 } from "three";
import { IvioEventListener } from "../../Interfaces/IvioEventListener";
import { IvioEventParams } from "../../Interfaces/IvioEventParams";
import { VioEvents } from "../../Singletons/Events/VioEvents";

export class VioListenerObject extends Object3D implements IvioEventListener 
{
    private   _objectID:string = '';
    protected _meta    :any;


    constructor(objectID:string | null = null, meta:any = {})
    {
        super();
        this._meta     = meta;
        this._objectID = objectID ? objectID : (Date.now() + "-" + Math.random().toString(36).substring(2,16)).toString();
    }

    listenEvent(event: string, handler: (params: IvioEventParams) => void): void
    {
        VioEvents.registerEvent(event,(params: IvioEventParams) =>
        {
            if(params.target == this)
            {
                handler(params);
            }
        });
    }

    public get meta()
    {
        return this._meta;
    }

    public get objectID()
    {
        return this._objectID;
    }
}