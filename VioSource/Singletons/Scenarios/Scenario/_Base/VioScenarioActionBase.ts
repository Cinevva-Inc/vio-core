import { VioObject } from "../../../../Objects/VioObject/VioObject";
import { IVioTask     } from "../../../../Interfaces/IVioTask";
import { ExposedPropertiesObject } from "../../../../Exposables/Types/ExposableProperties";
import { VioRender    } from "../../../Render/VioRender";

export abstract class VioScenarioActionBase
{
    protected _name           :string  = '';
    protected _tasks          :Array<IVioTask>;
    protected _executableTasks:Array<IVioTask>;
    protected _executed       :boolean = false;
    protected _isAbortable    :boolean = false;
    public    whoID           :string  = '';

    constructor(name:string)
    {
        this._name = name;
        this._tasks           = [];
        this._executableTasks = [];
    }

    protected _getObjectByID(id:string):VioObject|null
    {
        return VioRender.scene.getObjectByObjectID(id);
    }

    protected _generateData()
    {
        const obj = 
        {
            name     :this.name,
            abortable:this.abortable,
            whoID    :this.whoID
        }
        return obj;
    }

    public setData(data:any)
    {
        this._isAbortable = data.abortable;
        this.whoID        = data.whoID;
    }

    public execute(obj:VioObject | null = null)
    {
        this._executed = false;

        obj = obj ? obj : this._getObjectByID(this.whoID);

        this._tasks.forEach(task=>
        {
            task.setObject(obj);
            this._executableTasks.push(task);
        });

        if(this._executableTasks.length == 0)
        {
            this._executed = true;
        }
    }
    
    update(delta: number) : void
    {
        if (this._executableTasks.length>0)
        {
            if(this._executableTasks[0].doTask(delta))
            {
                this._executableTasks[0].dispose();
                this._executableTasks.shift();

                if(this._executableTasks.length == 0)
                {
                    this._executed = true;
                }
            }
        }
    }

    addTask(task:IVioTask):void
    {
        let index = this._tasks.indexOf(task);
        
        if(task && index == -1)
        {
            this._tasks.push(task);
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

    GetExposedProperties():ExposedPropertiesObject
    {
        let props:ExposedPropertiesObject = 
        {
            name:this._name,
            controller:{logic:null,data:null},
            properties:
            [
                {property:'whoID',label:'Who',type:'droppableIcon',value:this.whoID,options:'objectReference'}
            ]
        };
        
        return props;
    }

    get isExecuting()
    {
        return this._executableTasks.length>0 && this._tasks.length>0;
    }

    get executed()
    {
        return this._executed;
    }

    get abortable()
    {
        return this._isAbortable;
    }

    get name()
    {
        return this._name;
    }

    public get data()
    {
        return this._generateData();
    }

    public dispose() {
        
    }
}