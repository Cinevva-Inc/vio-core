import { AnimationStatesComponent } from "../../../../Components/AnimationStatesComponent";
import { VioObject                } from "../../../VioObject/VioObject";
import { VioTaskObject            } from "./Base/VioTaskObject";

export class StateTask extends VioTaskObject
{
    protected animationComponent:AnimationStatesComponent|null=null;

    constructor(protected changeStateTo:string)
    {
        super('StateTask',true);
    }

    public setObject(object: VioObject): void
    {
        super.setObject(object);
        if(this._object)
        {
            this.animationComponent = (this._object.getComponent('AnimationStatesComponent') as AnimationStatesComponent);
        }
    }

    public doTask(delta: number): void
    {
        if(this.animationComponent)
        {
            this.animationComponent.state = this.changeStateTo;
        }
        this.setExecuted(true);
    }
}