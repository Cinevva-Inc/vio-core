import { VioRender } from "../../Singletons/Render/VioRender";
import { IvioCameraComponent } from "../../Interfaces/IvioCameraComponent";
import { VioCamera } from "../../Singletons/Render/Camera/VioCamera";
import { ExposedPropertiesObject } from "../../Exposables/Types/ExposableProperties";

export abstract class VioCameraComponent implements IvioCameraComponent
{
    object       : VioCamera | null = null;
    componentName: string  = 'VioCameraComponent';
    exposable    : boolean = false;
    listable:boolean       = true;
    
    private _isInEditMode:boolean = false;
    
    setEditMode(isInEdit: boolean): void
    {
        this._isInEditMode = isInEdit;
    }
    
    update(delta: number): void 
    {
    }

    OnAdded(object:VioCamera): void 
    {
        this.object = object;
    }

    OnRemoved(): void 
    {
        this.object = null;
    }

    Dispose(): void
    {
    }

    protected _getObjectByID(id:string)
    {
        return VioRender.scene.getObjectByObjectID(id);
    }

    public getData():any
    {
        const obj =
        {
            name:this.componentName
        }
        return obj;
    }

    public setData(object: any): void
    {
    }

    public get editMode()
    {
        return this._isInEditMode;
    }
}