import { Euler, Vector3, Quaternion  } from "three";
import { VioHelpers } from "../../../../Helpers/VioHelpers";
import { VioMicroTaskObject } from "./Base/VioMicroTaskObject";

export class RotateAnglesToTask extends VioMicroTaskObject
{
    protected elapsed:number = 0;
    constructor(protected rotateTo:Euler, protected speed:number = 0.01)
    {
        super('RotateAnglesToTask');
    }

    public clearState(): void 
    {
        this.elapsed = 0;
    }
 
    public doTask(delta: number): boolean
    {
        this.elapsed += delta;

        if(this._object)
        {
            let startQ = new Quaternion();
            startQ.setFromEuler(this._object.rotation);

            let endQ = new Quaternion();
            endQ.setFromEuler(this.rotateTo);

            if (startQ.angleTo(endQ) < 0.1) {
                this._object.rotation.copy(this.rotateTo);
                return true;
            }

            let amount = Math.min(1, this.speed * this.elapsed);
            let newQ = startQ.slerp(endQ, amount);

            this._object.rotation.setFromQuaternion(newQ);
        }
        else
        {
            return true;
        }
        return true;
    }
}