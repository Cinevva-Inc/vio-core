import { VioObject } from '../../../VioObject/VioObject';
import { VioMicroTaskObject } from './Base/VioMicroTaskObject';

export class TriggerTask extends VioMicroTaskObject
{
    protected _hasTaskFinished:boolean = false;
    protected _taskRunning    :boolean = false;
    protected _trigger        :{ (finish:()=>void) : void } | null = null;

    constructor(triggerFunction:{ (finish:()=>void) : void } | null = null)
    {
        super('TriggerTask');

        this._trigger = triggerFunction;
    }

    public restart()
    {
        this._hasTaskFinished = false;
        this._taskRunning     = false;
    }

    public doTask(delta: number): boolean
    {
        if(!this._taskRunning && !this._hasTaskFinished)
        {
            this._taskRunning = true;
            if(this._trigger)
            {
                this._trigger(()=>
                {
                    this.finishTask();
                });
            }
        }
        return this._hasTaskFinished;
    }

    protected finishTask()
    {
        this._taskRunning = false;
        this._hasTaskFinished = true;
    }

    public setTrigger(val:()=>void | null)
    {
        this._trigger = val;
    }

    public setObject(object:VioObject|null)
    {
        this._object = object;
    }

    public dispose()
    {
        this._trigger = null;
        this._object  = null;
    }
}