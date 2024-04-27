import { Object3D } from "three";
import { VioCameraComponent } from "./Base/VioCameraComponent";

export class VioCameraFollowComponent extends VioCameraComponent
{
    componentName : string  = 'VioCameraFollowComponent';
    exposable     : boolean = true;
    listable      : boolean = true;

    private _targetID:string = '';
    private _target  :Object3D|null=null;

    constructor()
    {
        super();
    }

    update(delta: number): void 
    {
        if(!this._target)
        {
            this.targetID = this._targetID;
        }
        if(this.object && this._target)
        {
            this.object.position.x = this._target.position.x;
        }
    }

    OnRemoved(): void 
    {
        this.object = null;
    }

    Dispose(): void
    {
        this.object = null;
    }

    public setData(data: any): void 
    {
        this.targetID = data && data.targetID ? data.targetID : '';
    }

    public getData()
    {
        let obj      = super.getData() as any;
        obj.targetID = this.targetID;
        return obj
    }

    public get targetID()
    {
        return this._targetID;
    }

    public set targetID(val:string)
    {
        this._targetID = val;
        this._target   = this._targetID.length > 0 ? this._getObjectByID(this._targetID) : null;
    }
}