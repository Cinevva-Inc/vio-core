import { Euler, Vector3  } from "three";
import { VioMicroTaskObject } from "./Base/VioMicroTaskObject";

export class RotateToTask extends VioMicroTaskObject
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

    public doTask(delta: number): boolean
    {
        this.elapsed+=delta;

        if(this._object)
        {
            this._object.rotation.x = this.lerp(this._object.rotation.x,this.rotateTo.x,this.elapsed * this.speed);
            this._object.rotation.y = this.lerp(this._object.rotation.y,this.rotateTo.y,this.elapsed * this.speed);
            this._object.rotation.z = this.lerp(this._object.rotation.z,this.rotateTo.z,this.elapsed * this.speed);
    
            if(Math.abs(this._object.rotation.x - this.rotateTo.x) <0.1 && 
               Math.abs(this._object.rotation.y - this.rotateTo.y) <0.1 && 
               Math.abs(this._object.rotation.z - this.rotateTo.z) <0.1)
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

    protected lerp(start:number, end:number, amount:number)
    {
        return (1-amount) * start + amount * end;
    }
}