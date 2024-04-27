import { VioScenarioTriggerBase   } from './_Base/VioScenarioTriggerBase';
import { VioScenarioActionBase    } from './_Base/VioScenarioActionBase';
import { VioScenarioConditionBase } from './_Base/VioScenarioConditionBase';
import { VioScenarios } from '../VioScenarios';

export class VioScenario
{
    public  name             :string  = '';
    private _id              :string;
    private _actionInex      :number  = 0;
    private _abortable       :boolean = true;
    private _execute         :boolean = false;
    private _trigger         :VioScenarioTriggerBase|null = null;
    private _actions         :Array<VioScenarioActionBase>;
    private _conditions      :Array<VioScenarioConditionBase>;
    private _triggerListener :(target:any, params: any)=>void = this._onTrigger.bind(this);
    
    constructor(id:string|null = null)
    {
        this._id         = id ? id : (Date.now() + "-" + Math.random().toString(36).substring(2,16)).toString();
        this._actions    = [];
        this._conditions = [];
    }

    public update(delta: number) : boolean
    {
        if(this._execute)
        {
            if(this._actionInex < this._actions.length)
            {
                let action = this._actions[this._actionInex];
                // console.log("S", {
                //     actionInex:this._actionInex,
                //     isExecuting:action.isExecuting,
                //     executed:action.executed,
                // })

                if(!action.isExecuting)
                {
                    action.execute();
                }
                if(!action.executed)
                {
                    // console.log("UD2",action,action.isExecuting);
                    action.update(delta);

                }
                if(action.executed)
                {
                    // console.log("UD3",action,action.isExecuting);
                    this._actionInex++;

                    if(this._actionInex >= this._actions.length)
                    {
                        this._execute = false;
                    }
                }
            }
        }
        return this._execute;
    }

    public addAction(action:VioScenarioActionBase)
    {
        if(!this._actions.includes(action))
        {
            this._actions.push(action);
        }
    }

    public removeAction(action:VioScenarioActionBase)
    {
        const index = this._actions.indexOf(action);

        if(index>=0)
        {
            this._actions.splice(index,1);
        }
    }

    public addCondition(condition:VioScenarioConditionBase)
    {
        if(!this._conditions.includes(condition))
        {
            this._conditions.push(condition);
        }
    }

    public removeCondition(condition:VioScenarioConditionBase)
    {
        const index = this._conditions.indexOf(condition);

        if(index>=0)
        {
            this._conditions.splice(index,1);
        }
    }

    public registerTrigger(trigger:VioScenarioTriggerBase)
    {
        this._trigger = trigger;
        this._trigger.onTrigger = this._triggerListener;
    }

    public unregisterTrigger()
    {
        if(this._trigger)
        {
            this._trigger.onTrigger = null;
            this._trigger = null;
        }
    }
    
    public triggerScenario(target:any,params?:any)
    {
        this._onTrigger(target,params);
    }

    public abort()
    {
        if(this._abortable)
        {
            if(this._actions[this._actionInex].abortable && this._actions[this._actionInex].isExecuting)
            {
                this._execute = false;
            }
        }
    }

    private _onTrigger(target:any, params: any)
    {
        let canAdvance = true;
        
        this._conditions.forEach(condition=>
        {
            if(!condition.checkCondition(target,params))
            {
                canAdvance = false;
                return;
            }
        });

        if(canAdvance)
        {
            if(VioScenarios.executingScenarios.length>0)
            {
                for(let num = 0; num < VioScenarios.executingScenarios.length; num++)
                {
                    if(VioScenarios.executingScenarios[num].abortable)
                    {
                        VioScenarios.executingScenarios[num].abort();
                    }
                    else
                    {
                        return;
                    }
                }
            }
            this._actionInex = 0;
            this._execute    = true;
        }
    }

    protected _generateData()
    {
        let conditions:Array<any> = [];
        let actions   :Array<any> = [];

        this.conditions.forEach(cond=>
        {
            conditions.push(cond.data);
        });

        this.actions.forEach(action=>
        {
            actions.push(action.data);
        });

        const obj = 
        {
            id        :this._id,
            name      :this.name,
            abortable :this.abortable,
            trigger   :this.trigger?.data || null,
            conditions:conditions,
            actions   :actions
        }
        
        return obj;
    }

    public get id()
    {
        return this._id;
    }
    
    public get trigger()
    {
        return this._trigger;
    }

    public get abortable()
    {
        return this._abortable;
    }

    public set abortable(val:boolean)
    {
        this._abortable = val;
    }

    public get conditions()
    {
        return this._conditions;
    }

    public get actions()
    {
        return this._actions;
    }

    public get isExecuting()
    {
        return this._execute;
    }

    public get data()
    {
        return this._generateData();
    }

    public dispose() {
        if (this._trigger)
            this._trigger.dispose()
        for (let action of this._actions)
            action.dispose()
        for (let condition of this._conditions)
            condition.dispose()
    }
}