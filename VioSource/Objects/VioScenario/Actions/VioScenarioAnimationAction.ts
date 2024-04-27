import { AnimationComponent    } from "../../../Components/AnimationComponent";
import { VioScenarioActionBase} from "../../../Singletons/Scenarios/Scenario/_Base/VioScenarioActionBase";
import { TriggerTask          } from "../../VioTasks/VioTask/TaskObject/TriggerTask";

export class VioScenarioAnimationAction extends VioScenarioActionBase
{
    public animation: string = '';
    public loop: boolean = true;
    public wait: boolean = true;

    constructor()
    {
        super('AnimationObject');
    }

    protected _generateData():any
    {
        let obj  :any  = super._generateData();
        obj.animation = this.animation;
        obj.loop = this.loop;
        obj.wait = this.wait;
        return obj;
    }

    public setData(data: any): void 
    {
        super.setData(data);
        this.animation = data.animation ?? this.animation;
        this.loop = data.loop ?? this.loop;
        this.wait = data.wait ?? this.wait;
    }


    public override execute(): void 
    {
        this.clearTasks();
        this.addTask(new TriggerTask(async (finish:() => void)=> {
            console.log('set animation', this.animation)
            let object = this._getObjectByID(this.whoID);
            let component = object?.getComponent('AnimationComponent') as AnimationComponent;
            if (component) {
                component.play(this.animation, true)
            }
            finish()
        }))
        super.execute();
    }
}