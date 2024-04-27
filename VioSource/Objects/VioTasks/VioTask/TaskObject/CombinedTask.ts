import { VioObject          } from "../../../VioObject/VioObject";
import { VioMicroTaskObject } from "./Base/VioMicroTaskObject";

export class CombinedTask extends VioMicroTaskObject
{
    private _tasks:Array<VioMicroTaskObject>;

    constructor(tasks:Array<VioMicroTaskObject> = [])
    {
        super('CombinedTask');
        this._tasks = tasks;
    }

    public setObject(object: VioObject): void 
    {
        super.setObject(object);
        if(this._tasks)
        {
            this._tasks.forEach((task:VioMicroTaskObject)=>
            {
                task.setObject(object);
            });
        }
    }

    public doTask(delta: number): boolean
    {
        let isDone:boolean = true;

        this._tasks.forEach((task:VioMicroTaskObject)=>
        {
            if(!task.doTask(delta))
            {
                isDone = false;
            }
        });
        return isDone;
    }

    public addTask(task:VioMicroTaskObject)
    {
        if(!this._tasks.includes(task))
        {
            this._tasks.push(task);
            if(this._object)
            {
                task.setObject(this._object);
            }
        }
    }

    public removeTask(task:VioMicroTaskObject)
    {
        const index = this._tasks.indexOf(task);

        if(index>=0)
        {
            this._tasks.splice(index,1);
        }
    }

    public dispose(): void 
    {
        this._tasks.forEach((task:VioMicroTaskObject)=>
        {
            task.dispose();
        });
        this._tasks.length = 0;
    }
}