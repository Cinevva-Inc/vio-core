import { ExposedPropertiesObject } from "../../../../Exposables/Types/ExposableProperties";
import { VioRender } from "../../../Render/VioRender";

export abstract class VioScenarioConditionBase
{
    public whoID :string = '';

    constructor(protected _conditionName:string)
    {
    }

    protected _getObjectByID(id:string)
    {
        return VioRender.scene.getObjectByObjectID(id);
    }

    protected _generateData()
    {
        const obj = 
        {
            name   :this.name,
            whoID  :this.whoID
        }
        return obj;
    }

    public setData(data:any)
    {
        this.whoID = data.whoID;
    }

    GetExposedProperties():ExposedPropertiesObject
    {
        let props:ExposedPropertiesObject = 
        {
            name:this.name,
            controller:{logic:null,data:null},
            properties:
            [
                {property:'whoID',label:'Who',type:'droppableIcon',value:this.whoID,options:'objectReference'}
            ]
        };
        
        return props;
    }

    public checkCondition(target:any,params:any)
    {
        return true;
    }

    public get who()
    {
        return this._getObjectByID(this.whoID);
    }

    public get name()
    {
        return this._conditionName
    }

    public get data()
    {
        return this._generateData();
    }

    public dispose() {
        
    }
}