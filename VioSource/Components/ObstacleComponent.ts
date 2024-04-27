import { VioObject } from "../Objects/VioObject/VioObject";
import { VioComponent } from "./Base/VioComponent";

export class ObstacleComponent extends VioComponent
{
    public damage:number = 1;
    public canKillWithJump:boolean = true;

    constructor()
    {
        super('ObstacleComponent');
    }

    public setData(data:any)
    {
    }

    public getData()
    {
        let obj  = super.getData() as any;
        return obj;
    }
}