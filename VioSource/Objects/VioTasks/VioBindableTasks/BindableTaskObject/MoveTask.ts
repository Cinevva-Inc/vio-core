import { Vector3 } from "three";
import { VioTaskObject } from "./Base/VioTaskObject";

export class MoveTask extends VioTaskObject
{
    constructor(protected moveTo:Vector3, protected speed:number = 0.01)
    {
        super('MoveToTask');
    }

    public doTask(delta: number):void
    {
        if(!this._object)
        {
            return;
        }

        if(this.moveTo.x!=0)
        {
            this._object.position.x += this.moveTo.x * (delta * this.speed);
        }
        if(this.moveTo.y!=0)
        {
            this._object.position.y += this.moveTo.y * (delta * this.speed);
        }
        if(this.moveTo.z!=0)
        {
            this._object.position.z += this.moveTo.z * (delta * this.speed);
        }
    }
}