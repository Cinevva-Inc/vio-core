import { IvioEventParams } from "../../../../Interfaces/IvioEventParams";
import { ExposedPropertiesObject } from "../../../../Exposables/Types/ExposableProperties";
import { VioEvents } from "../../../Events/VioEvents";

export abstract class VioScenarioTriggerBase
{
    public    onTrigger :((target:any,params:any)=>void)|null =  null;
    protected event     :string = '';
    public    targetID  :string = '';
    private   listener  :(params: IvioEventParams)=>void = this.onEvent.bind(this);

    constructor(protected _triggerName:string)
    {
    }

    public registerTrigger(event:string)
    {
        this.unregisterTrigger();
        this.event = event;
        VioEvents.registerEvent(this.event,this.listener);
    }

    public unregisterTrigger()
    {
        if(this.event.length>0)
        {
            VioEvents.unregisterEvent(this.event,this.listener);
            this.event  = '';
        }
    }

    public setData(data:any)
    {
        this.event    = data.event;
        this.targetID = data.targetID;
    }

    private onEvent(params: IvioEventParams)
    {
        this.validateEvent(params.target,params.params);
    }

    protected validateEvent(target:any, params:any)
    {
        if(this.onTrigger)
        {
            this.onTrigger(target,params);
        }
    }

    protected _generateData()
    {
        const obj = 
        {
            name      :this.name,
            event     :this.event,
            targetID  :this.targetID
        }
        return obj;
    }

    public get name()
    {
        return this._triggerName
    }

    public get data()
    {
        return this._generateData();
    }

    public dispose() {
        
    }
}