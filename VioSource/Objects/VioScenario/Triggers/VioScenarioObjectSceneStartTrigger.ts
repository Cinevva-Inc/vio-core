import { VioScenarioTriggerBase } from "../../../Singletons/Scenarios/Scenario/_Base/VioScenarioTriggerBase";

export class VioScenarioObjectSceneStartTrigger extends VioScenarioTriggerBase
{
    protected event: string = 'sceneStart';

    constructor()
    {
        super('SceneStart');
        
        if(this.event)
        {
            this.registerTrigger(this.event);
        }
    }

    protected _generateData():any
    {
        let obj:any = super._generateData();
        delete obj.target;
        delete obj.icon;

        return obj;
    }
}