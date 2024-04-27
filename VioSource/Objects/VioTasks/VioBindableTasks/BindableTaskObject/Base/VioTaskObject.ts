import { VioObject } from "../../../../VioObject/VioObject";

export abstract class VioTaskObject
{
    protected _object  :VioObject | null=null;
    protected _executed:boolean = false;

    constructor(readonly name:string, readonly executeOnce:boolean = false){}

    public clearState()
    {
    }

    public doTask(delta: number): void
    {
    }

    public setObject(object:VioObject)
    {
        this._object = object;
    }

    public setExecuted(val:boolean)
    {
        this._executed = val;
    }

    public dispose()
    {
        this._object = null;
    }

    public get taskExecuted()
    {
        if(this.executeOnce && this._executed)
        {
            return true;
        }
        return false;
    }
}