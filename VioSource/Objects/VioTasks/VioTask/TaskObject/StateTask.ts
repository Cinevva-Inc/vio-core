import { AnimationStatesComponent } from "../../../../Components/AnimationStatesComponent";
import { VioObject                } from "../../../VioObject/VioObject";
import { VioMicroTaskObject       } from "./Base/VioMicroTaskObject";

export class AnimationStateTask extends VioMicroTaskObject
{
    protected animationComponent:AnimationStatesComponent|null=null;

    constructor(protected changeStateTo:string)
    {
        super('AnimationStateTask');
    }

    public setObject(object: VioObject): void
    {
        super.setObject(object);
        if(this._object)
        {
            this.animationComponent = (this._object.getComponent('AnimationStatesComponent') as unknown as AnimationStatesComponent)
        }
    }

    public doTask(delta: number): boolean
    {
        if (this.animationComponent)
        {
            this.animationComponent.state = this.changeStateTo;
        }
        return true;
    }
}