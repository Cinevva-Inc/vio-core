import { VioCameraComponent } from "../../CameraComponents/Base/VioCameraComponent";
import { VioCameraFollowComponent } from "../../CameraComponents/VioCameraFollowComponent";
import { IvioCameraComponent } from "../../Interfaces/IvioCameraComponent";

export class VioCameraComponentRegistry
{
    private static _instance:VioCameraComponentRegistry;

    private _components:Record<string,any> = 
    {
        'VioCameraFollowComponent':VioCameraFollowComponent
    };

    private constructor()
    {
    }

    public static registerComponent(componentName:string,componentClass:any)
    {
        if(!this.instance._components[componentName])
        {
            if(Object.getPrototypeOf(componentClass) == VioCameraComponent)
            {
                this.instance._components[componentName] = componentClass;
            }
        }
    }

    public static getComponent(componentName:string)
    {
        if(!this.instance._components[componentName])
        {
            throw new Error("Component with "+componentName+" is not Registered in registry!");
        }
        return this.instance._components[componentName];
    }
    
    public static createComponent(componentName:string,params:any = undefined)
    {
        if(!this.instance._components[componentName])
        {
            console.warn("Component with "+componentName+" is not Registered in registry!");
            return null
        }
        let comp = new this.instance._components[componentName]() as IvioCameraComponent;
        comp.setData(params);
        
        return comp;
    }

    public static get data()
    {
        const obj:Array<any> = [];

        return obj;
    }

    private static get instance():VioCameraComponentRegistry
    {
        if(!VioCameraComponentRegistry._instance)
        {
            VioCameraComponentRegistry._instance = new VioCameraComponentRegistry();
        }
        return VioCameraComponentRegistry._instance;
    }
}