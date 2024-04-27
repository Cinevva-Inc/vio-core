import { AnimationStatesComponent } from "../../../Components/AnimationStatesComponent";
// import { DialogueComponent    } from "../../../Components/DialogueComponent";
import { ExposedPropertiesObject } from "../../../Exposables/Types/ExposableProperties";
import { VioScenarioActionBase} from "../../../Singletons/Scenarios/Scenario/_Base/VioScenarioActionBase";
import { TriggerTask          } from "../../VioTasks/VioTask/TaskObject/TriggerTask";

export class VioScenarioMetaAction extends VioScenarioActionBase
{
    public meta:any = {};
    constructor()
    {
        super('MetaObject');
    }

    protected _generateData():any
    {
        let obj  :any  = super._generateData();
        obj.meta = this.meta
        return obj;
    }

    public setData(data: any): void 
    {
        super.setData(data);
        this.meta = data.meta;
    }
    
    GetExposedProperties() 
    {   
        let values:Array<any> = [];

        let props:ExposedPropertiesObject = 
        {
            name:this.name,
            class:'scenarioAction scenarioMetaAction',
            type:'',
            controller:
            {
                logic:null,
                data :null
            },
            properties:
            [
            ]
        };
        
        return props;
    }

    public override execute(): void 
    {
        this.clearTasks();
        super.execute();
    }
}