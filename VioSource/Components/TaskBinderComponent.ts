import { VioComponent  } from "./Base/VioComponent";
import { VioTaskObject } from "../Objects/VioTasks/VioBindableTasks/BindableTaskObject/Base/VioTaskObject";
import { TaskParams, VioBindableTasks } from "../Objects/VioTasks/VioBindableTasks/VioBindableTasks";
import { VioObject } from "../Objects/VioObject/VioObject";

export class TaskBinderComponent extends VioComponent
{
    protected _task:VioBindableTasks;

    constructor()
    {
        super('TaskBinderComponent');
        this._task = new VioBindableTasks();
    }

    get object() { return super.object }
    public set object(object: VioObject|null) {
        super.object = object;
        this._task.object = this.object!;
    }

    public setIdleTask(taskType:string)
    {
        this._task.setIdleTask(taskType);
    }

    public activateTask(taskType:string)
    {
        this._task.activateTask(taskType);
    }

    public deActivateTask(taskType:string)
    {
        this._task.deActivateTask(taskType);
    }

    public addTask(taskType:string,task:VioTaskObject)
    {
        this._task.addTask(taskType,task);
    }

    public removeTask(task:VioTaskObject)
    {
        this._task.removeTask(task);
    }

    public getTasksByType(taskType:string):TaskParams
    {
        return this._task.getTasksByType(taskType);
    }

    public markTaskClearAtTheEndOfFrame(taskType:string,clear:boolean)
    {
        this._task.markTaskClearAtTheEndOfFrame(taskType,clear);
    }

    public clearTasks()
    {
        this._task.clearTasks();
    }

    public update(delta: number): void
    {
        super.update(delta);

        this._task.update(delta);
    }
}