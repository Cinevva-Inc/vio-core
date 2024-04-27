import { VioObject     } from "../../VioObject/VioObject";
import { VioTaskObject } from "./BindableTaskObject/Base/VioTaskObject";

export type TaskParams = {deactivateAtEndOfFrame:boolean,tasks:Array<VioTaskObject>};

export class VioBindableTasks
{
    protected _taskBindings : Record<string,TaskParams>;
    protected _activeTasks  : Array<string>;
    protected _idleTask     : string="";
    protected _object       : VioObject|null=null;

    constructor()
    {
        this._taskBindings = {};
        this._activeTasks  = [];
    }

    public setIdleTask(taskType:string)
    {
        this._idleTask = taskType;
    }

    public activateTask(taskType:string)
    {
        if(!this._activeTasks.includes(taskType))
        {
            this._activeTasks.push(taskType);
            this.resetTaskExecuted();
        }
    }

    public deActivateTask(taskType:string)
    {
        let index = this._activeTasks.indexOf(taskType);

        if(index>=0)
        {
            this._activeTasks.splice(index,1);
            this.resetTaskExecuted();
        }
    }

    public addTask(taskType:string,task:VioTaskObject)
    {
        if(!this._taskBindings[taskType])
        {
            this._taskBindings[taskType] = {deactivateAtEndOfFrame:true,tasks:[]};
        }

        if(!this._taskBindings[taskType].tasks.includes(task))
        {
            this._taskBindings[taskType].tasks.push(task);
            task.setObject(this._object!);
        }
    }

    public removeTask(task:VioTaskObject)
    {
        for(let key in this._taskBindings)
        {
            let params = this._taskBindings[key];
            let index  = params.tasks.indexOf(task);

            if(index>-1)
            {
                params.tasks.splice(index,1);
                task.dispose();
            }
        }
    }

    public getTasksByType(taskType:string):TaskParams
    {
        return this._taskBindings[taskType];
    }

    public markTaskClearAtTheEndOfFrame(taskType:string,clear:boolean)
    {
        if(this._taskBindings[taskType])
        {
            this._taskBindings[taskType].deactivateAtEndOfFrame = clear;
        }
    }

    public clearTasks()
    {
        for(let key in this._taskBindings)
        {
            let params = this._taskBindings[key];
            params.tasks.forEach((task:VioTaskObject)=>
            {
                task.dispose();
            });
            params.tasks.length = 0;
        }
        this._taskBindings = {};
    }

    public update(delta: number): void
    {
        if(this._activeTasks.length>0)
        {
            this._activeTasks.forEach((taskType:string)=>
            {
                if(this._taskBindings[taskType])
                {
                    this.updateTask(taskType, delta, this._taskBindings[taskType]);
                }
            });
        }
        else if(this._idleTask && this._idleTask.length>0)
        {
            if(this._taskBindings[this._idleTask])
            {
                this.updateTask(this._idleTask, delta, this._taskBindings[this._idleTask]);
            }
        }
    }

    private resetTaskExecuted()
    {
        if(this._activeTasks.length>0)
        {
            this._activeTasks.forEach((taskType:string)=>
            {
                if(this._taskBindings[taskType])
                {
                    this._taskBindings[taskType].tasks.forEach((task:VioTaskObject)=>
                    {
                        task.setExecuted(false);
                    });
                }
            });
        }
        else if(this._idleTask)
        {
            if(this._taskBindings[this._idleTask])
            {
                this._taskBindings[this._idleTask].tasks.forEach((task:VioTaskObject)=>
                {
                    task.setExecuted(false);
                });
            }
        }
    }

    private updateTask(taskType:string, delta:number, taskParams:TaskParams)
    {
        taskParams.tasks.forEach((task:VioTaskObject)=>
        {
            if(!task.taskExecuted)
            {
                task.clearState();
                task.doTask(delta);
            }
        });

        if(taskParams.deactivateAtEndOfFrame)
        {
            this.deActivateTask(taskType);
        }
    }

    public get object()
    {
        return this._object!;
    }

    public set object(val:VioObject)
    {
        this._object = val;
    }
}