import { Vector3 } from "three";
import { VioMicroTaskObject } from "./Base/VioMicroTaskObject";

export class MoveToTask extends VioMicroTaskObject
{
    protected elapsed:number = 0;
    constructor(protected moveTo:Vector3, protected speed:number = 0.01)
    {
        super('MoveToTask');
    }

    public doTask(delta: number): boolean
    {
        this.elapsed+=delta;
        
        if(this._object)
        {
            // this.object.position.x = this.lerp(this.object.position.x,this.moveTo.x,this.speed);
            // this.object.position.y = this.lerp(this.object.position.y,this.moveTo.y,this.speed);
            // this.object.position.z = this.lerp(this.object.position.z,this.moveTo.z,this.speed);
            this._object.position.x = this.increment(this._object.position.x,this.moveTo.x,delta * this.speed);
            this._object.position.y = this.increment(this._object.position.y,this.moveTo.y,delta * this.speed);
            this._object.position.z = this.increment(this._object.position.z,this.moveTo.z,delta * this.speed);
    
            if(this._object.position.distanceTo(this.moveTo)<0.01)
            {
                return true;
            }
        }
        else
        {
            return true;
        }
        return false;
    }

    protected increment(start:number,end:number,amount:number)
    {
        if(start != end)
        {
            let less = start < end;
            start += (start < end ? amount : -amount);
            start  = (start > end &&  less ? end : start);
            start  = (start < end && !less ? end : start);
        }
        
        return start;
    }

    
    protected lerp(start:number, end:number, amount:number)
    {
        return (1-amount) * start + amount * end;
    }
}