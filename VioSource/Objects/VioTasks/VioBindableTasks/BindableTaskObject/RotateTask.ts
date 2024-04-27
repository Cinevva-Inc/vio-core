import { Euler  } from "three";
import { VioTaskObject } from "./Base/VioTaskObject";

export class RotateTask extends VioTaskObject
{
    protected elapsed:number = 0;
    constructor(protected rotateTo:Euler, protected speed:number = 0.01)
    {
        super('RotateToTask');
    }

    public clearState(): void 
    {
        this.elapsed = 0;
    }

    public doTask(delta: number):void
    {
        this.elapsed+=delta;

        if(!this._object)
        {
            return;
        }

        if(this.rotateTo.x!=0)
        {
            this._object.rotation.x = this.lerp(this._object.rotation.x,this.rotateTo.x,this.elapsed * this.speed);
        }
        if(this.rotateTo.y!=0)
        {
            this._object.rotation.y = this.lerp(this._object.rotation.y,this.rotateTo.y,this.elapsed * this.speed);
        }
        if(this.rotateTo.z!=0)
        {
            this._object.rotation.z = this.lerp(this._object.rotation.z,this.rotateTo.z,this.elapsed * this.speed);
        }

    }

    protected lerp(start:number, end:number, amount:number)
    {
        return (1-amount) * start + amount * end;
    }
}