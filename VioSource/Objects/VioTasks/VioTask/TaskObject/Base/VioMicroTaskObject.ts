import { VioObject } from '../../../../VioObject/VioObject';
import { IVioTask  } from '../../../../../Interfaces/IVioTask';

export abstract class VioMicroTaskObject implements IVioTask
{
    protected _object:VioObject | null=null;

    constructor(readonly name:string){}

    public doTask(delta: number): boolean
    {
        return true;
    }

    public setObject(object:VioObject|null)
    {
        this._object = object;
    }

    public dispose()
    {
        this._object = null;
    }
}