import { VioScenarioTriggerBase } from "../../../Singletons/Scenarios/Scenario/_Base/VioScenarioTriggerBase";
import { VioRaycast } from "../../../Singletons/Raycast/VioRaycast";
import { VioRender } from "../../../Singletons/Render/VioRender";
import { VioHelpers } from "../../../Helpers/VioHelpers";

export class VioScenarioObjectClickTrigger extends VioScenarioTriggerBase
{
    protected event: string = 'viewportClick';

    constructor()
    {
        super('TargetClick');
        
        if(this.event)
        {
            this.registerTrigger(this.event);
        }
    }

    protected validateEvent(target: any, params: any): void
    {
        if(this.targetID.length>0)
        {
            let items = VioRaycast.getRay(params.viewport,VioRender.scene.objects);
        
            if(items.length>0)
            {
                target = VioHelpers.object.bubbleToType(items[0].object,'VioObject',true);
            }

            if(target && this.targetID == target.objectID)
            {
                super.validateEvent(target,params);
            }
        }
    }
}