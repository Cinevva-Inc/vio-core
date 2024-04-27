import { VioComponent } from "./Base/VioComponent";
import { VioTask       } from "../Objects/VioTasks/VioTask/VioTask";
import { VioMicroTaskObject } from "../Objects/VioTasks/VioTask/TaskObject/Base/VioMicroTaskObject";
import { VioObject } from "../Objects/VioObject/VioObject";

export class TaskComponent extends VioComponent
{
    protected _microTasks:VioTask;

    protected index:number = 0;

    public repeat:boolean = false;

    constructor()
    {
        super('TaskComponent');
        this._microTasks = new VioTask();
    }

    get object() { return super.object }
    set object(object: VioObject|null) {
        super.object = object;
        this._microTasks.object = this.object!;
    }

    addTask(task:VioMicroTaskObject):void
    {
        this._microTasks.addTask(task);
    }

    addTaskAt(task:VioMicroTaskObject, indexToAdd:number = 0):void
    {
        this._microTasks.addTaskAt(task,indexToAdd);
    }

    removeTask(task:VioMicroTaskObject):void
    {
        this._microTasks.removeTask(task);
    }

    removeTaskAt(indexToRemove:number):void
    {
        this._microTasks.removeTaskAt(indexToRemove);
    }

    clearTasks()
    {
        this._microTasks.clearTasks();
    }

    hasTask(task:VioMicroTaskObject):boolean
    {
        return this._microTasks.hasTask(task);
    }

    update(delta: number): void
    {
        super.update(delta);

        this._microTasks.update(delta,this.repeat);
    }

    public get onFinished()
    {
        return this._microTasks.onFinished;
    }

    public set onFinished(val:(()=>void)|null)
    {
        this._microTasks.onFinished = val;
    }
}