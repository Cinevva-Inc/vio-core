import { VioScenarioRegistry } from "../Registry/VioScenarioRegistry";
import { VioScenario } from "./Scenario/VioScenario";
import { VioScenarioActionBase } from "./Scenario/_Base/VioScenarioActionBase";
import { VioScenarioConditionBase } from "./Scenario/_Base/VioScenarioConditionBase";
import { VioScenarioTriggerBase } from "./Scenario/_Base/VioScenarioTriggerBase";

export class VioScenarios
{
    private static _instance:VioScenarios;

    private _scenarios         :Array<VioScenario>;
    private _executingScenarios:Array<VioScenario>;

    private constructor()
    {
        this._scenarios = [];
        this._executingScenarios = [];
    }

    protected _generateData()
    {
        let scenarios:Array<any> = [];

        this._scenarios.forEach(scenario=>
        {
            scenarios.push(scenario.data);
        });
        
        return scenarios;
    }

    public static setScenariosByData(scenariosData:Array<any>)
    {
        this.instance._scenarios.length = 0;
        scenariosData.forEach(scenarioData=>
        {
            let scenario           = new VioScenario(scenarioData.id);
                scenario.name      = scenarioData.name;
                scenario.abortable = scenarioData.abortable;
 
            if (scenarioData.trigger) {
                let Trigger = VioScenarioRegistry.getTrigger(scenarioData.trigger.name);
 
                if(Trigger)
                {
                    let trigger = new Trigger() as VioScenarioTriggerBase;
                    trigger.setData(scenarioData.trigger);
                    scenario.registerTrigger(trigger);
                }
            }
 
            scenarioData.conditions.forEach((conditionData:any)=>
            {
                let Condition = VioScenarioRegistry.getCondition(conditionData.name);
 
                if(Condition)
                {
                    let condition = new Condition() as VioScenarioConditionBase;
                    condition.setData(conditionData);
 
                    scenario.addCondition(condition);
                }
            });
 
            scenarioData.actions.forEach((actionData:any)=>
            {
                let Action = VioScenarioRegistry.getAction(actionData.name);
 
                if(Action)
                {
                    let action = new Action() as VioScenarioActionBase;
                    action.setData(actionData);
 
                    scenario.addAction(action);
                }
            });
 
            this.addScenario(scenario);
        });
    }

    public static addScenario(scenario:VioScenario)
    {
        if(!this.instance._scenarios.includes(scenario))
        {
            this.instance._scenarios.push(scenario);
        }
    }

    public static removeScenario(scenario:VioScenario)
    {
        let index = this.instance._scenarios.indexOf(scenario);

        if(!this.instance._scenarios.includes(scenario))
        {
            this.instance._scenarios.push(scenario);
        }
    }

    public static update(delta:number)
    {
        this.instance._executingScenarios.length = 0;

        this.instance._scenarios.forEach(scenario=>
        {
            if(scenario.update(delta))
            {
                this.instance._executingScenarios.push(scenario);
            }
        });
    }

    public static getScenarioByID(id:string)
    {
        for(let num = 0; num < this.instance._scenarios.length; num++)
        {
            if(this.instance._scenarios[num].id == id)
            {
                return this.instance._scenarios[num];
            }
        }
        return null;
    }

    public static triggerScenarioByID(id:string,target:any,params?:any)
    {
        let scenario = this.getScenarioByID(id);

        if(scenario)
        {
            scenario.triggerScenario(target,params);
        }
    }

    public static get executingScenarios()
    {
        return this.instance._executingScenarios;
    }

    public static get scenarios()
    {
        return this.instance._scenarios;
    }

    public static get data()
    {
        return this.instance._generateData();
    }

    private static get instance():VioScenarios
    {
        if(!VioScenarios._instance)
        {
            VioScenarios._instance = new VioScenarios();
        }
        return VioScenarios._instance;
    }
}