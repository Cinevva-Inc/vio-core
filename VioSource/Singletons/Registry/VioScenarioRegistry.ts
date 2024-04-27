import { VioScenarioTriggerBase              } from "./../Scenarios/Scenario/_Base/VioScenarioTriggerBase";
import { VioScenarioConditionBase            } from "./../Scenarios/Scenario/_Base/VioScenarioConditionBase";
import { VioScenarioActionBase               } from "./../Scenarios/Scenario/_Base/VioScenarioActionBase";
// import { VioScenarioMoveToObjectAction       } from "../../Objects/VioScenario/Actions/VioScenarioMoveToObjectAction";
// import { VioScenarioUseItemObjectAction      } from "../../Objects/VioScenario/Actions/VioScenarioUseItemObjectAction";
// import { VioScenarioTakeItemObjectAction     } from "../../Objects/VioScenario/Actions/VioScenarioTakeItemObjectAction";
// import { VioScenarioDropItemObjectAction     } from "../../Objects/VioScenario/Actions/VioScenarioDropItemObjectAction";
// import { VioScenarioTakeAllItemsObjectAction } from "../../Objects/VioScenario/Actions/VioScenarioTakeAllItemsObjectAction";
// import { VioScenarioInventoryCondition       } from "../../Objects/VioScenario/Conditions/VioScenarioInventoryCondition";
import { VioScenarioObjectClickTrigger       } from "../../Objects/VioScenario/Triggers/VioScenarioObjectClickTrigger";
import { VioScenarioDialogAction             } from "../../Objects/VioScenario/Actions/VioScenarioDialogAction";
// import { VioScenarioDropItemsAction          } from "../../Objects/VioScenario/Actions/VioScenarioDropItemsAction";
// import { VioScenarioStateAction              } from "../../Objects/VioScenario/Actions/VioScenarioStateAction";
import { VioScenarioAnimationAction          } from "../../Objects/VioScenario/Actions/VioScenarioAnimationAction";
import { VioScenarioMetaAction               } from "../../Objects/VioScenario/Actions/VioScenarioMetaAction";
import { VioScenarioObjectSceneStartTrigger  } from "../../Objects/VioScenario/Triggers/VioScenarioObjectSceneStartTrigger";

export class VioScenarioRegistry
{
    private static _instance:VioScenarioRegistry;

    private _triggers:Record<string,any> = 
    {
        'TargetClick' :VioScenarioObjectClickTrigger,
        'SceneStart'  :VioScenarioObjectSceneStartTrigger
    };

    private _conditions:Record<string,any> = 
    {
        // 'InventoryCheck':VioScenarioInventoryCondition
    };

    private _actions:Record<string,any> =
    {
        // 'DropItemObject'    :VioScenarioDropItemObjectAction,
        // 'DropItemsObject'   :VioScenarioDropItemsAction,
        // 'TakeItemObject'    :VioScenarioTakeItemObjectAction,
        // 'TakeAllItemsObject':VioScenarioTakeAllItemsObjectAction,
        // "UserItemObject"    :VioScenarioUseItemObjectAction,
        // 'MoveToObject'      :VioScenarioMoveToObjectAction,
        'DialogueObject'    :VioScenarioDialogAction,
        // 'StateObject'       :VioScenarioStateAction,
        'AnimationObject'   :VioScenarioAnimationAction,
        'MetaObject'        :VioScenarioMetaAction,
    }

    private constructor()
    {
    }

    public static registerTrigger(triggerName:string,triggerClass:any)
    {
        if(!this.instance._triggers[triggerName])
        {
            if(Object.getPrototypeOf(triggerClass) == VioScenarioTriggerBase)
            {
                this.instance._triggers[triggerName] = triggerClass;
            }
        }
    }

    public static unregisterTrigger(triggerName:string) {
        delete this.instance._triggers[triggerName]
    }

    public static registerCondition(conditionName:string,conditionClass:any)
    {
        if(!this.instance._conditions[conditionName])
        {
            if(Object.getPrototypeOf(conditionClass) == VioScenarioConditionBase)
            {
                this.instance._conditions[conditionName] = conditionClass;
            }
        }
    }

    public static unregisterCondition(conditionName:string) {
        delete this.instance._conditions[conditionName]
    }

    public static registerAction(actionName:string,actionClass:any)
    {
        if(!this.instance._actions[actionName])
        {
            if(Object.getPrototypeOf(actionClass) == VioScenarioActionBase)
            {
                this.instance._actions[actionName] = actionClass;
            }
        }
    }

    public static unregisterAction(actionName:string) {
        delete this.instance._actions[actionName]
    }

    public static getTrigger(triggerName:string)
    {
        if(!this.instance._triggers[triggerName])
        {
            console.warn("Scenario trigger with "+triggerName+" is not registered in registry!");
            return null
        }
        return this.instance._triggers[triggerName];
    }

    public static getCondition(conditionName:string)
    {
        if(!this.instance._conditions[conditionName])
        {
            console.warn("Scenario condition with "+conditionName+" is not registered in registry!");
            return null
        }
        return this.instance._conditions[conditionName];
    }

    public static getAction(actionName:string)
    {
        if(!this.instance._actions[actionName])
        {
            console.warn("Scenario action with "+actionName+" is not registered in registry!");
            return null
        }
        return this.instance._actions[actionName];
    }
    
    public static get data()
    {
        const obj:Array<any> = [];

        return obj;
    }

    private static get instance():VioScenarioRegistry
    {
        if(!VioScenarioRegistry._instance)
        {
            VioScenarioRegistry._instance = new VioScenarioRegistry();
        }
        return VioScenarioRegistry._instance;
    }

    public static get triggers():Record<string,any> { return VioScenarioRegistry.instance._triggers }
    public static get conditions():Record<string,any> { return VioScenarioRegistry.instance._conditions }
    public static get actions():Record<string,any> { return VioScenarioRegistry.instance._actions }
}