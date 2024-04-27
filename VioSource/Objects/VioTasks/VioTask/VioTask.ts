import { IVioTask } from "../../../Interfaces/IVioTask";
import { VioObject } from "../../VioObject/VioObject";

export class VioTask
{
    protected _onFinished: (()=>void)|null=null;
    protected _tasks     : Array<IVioTask>;
    protected _index     : number = 0;
    protected _object    : VioObject | null=null;

    constructor()
    {
        this._tasks = [];
    }

    addTask(task:IVioTask):void
    {
        let index = this._tasks.indexOf(task);
        
        if(task && index == -1)
        {
            this._tasks.push(task);
            task.setObject(this._object);
        }
    }

    addTaskAt(task:IVioTask, indexToAdd:number = 0):void
    {
        let index = this._tasks.indexOf(task);
        
        if(task && index == -1)
        {
            if(indexToAdd<this._tasks.length)
            {
                this._tasks.splice(indexToAdd,0,task);
            }
            else
            {
                this._tasks.push(task);
            }
            task.setObject(this._object);
        }
    }

    removeTask(task:IVioTask):void
    {
        let index = this._tasks.indexOf(task);
        if(index>-1)
        {
            this._tasks.splice(index,1);
            task.dispose();
        }
    }

    removeTaskAt(indexToRemove:number):void
    {
        if(indexToRemove<this._tasks.length)
        {
            this._tasks[indexToRemove].dispose();
            this._tasks.splice(indexToRemove,1);
        }
    }

    clearTasks()
    {
        this._tasks.forEach((task:IVioTask)=>
        {
            task.dispose();
        });
        this._tasks.length = 0;
    }

    hasTask(task:IVioTask):boolean
    {
        return this._tasks.indexOf(task)>=0;
    }

    update(delta: number,repeat:boolean): void
    {
        if (this._tasks.length>0)
        {
            if(this._tasks[0].doTask(delta))
            {
                if(repeat)
                {
                    this._tasks.push(this._tasks.shift()!);
                }
                else
                {
                    this._tasks[0].dispose();
                    this._tasks.shift();
                }
            }

            if(this._tasks.length == 0)
            {
                if(this._onFinished)
                {
                    this._onFinished();
                }
            }
        }
    }

    public get onFinished()
    {
        return this._onFinished!;
    }

    public set onFinished(val:(()=>void)|null)
    {
        this._onFinished = val;
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