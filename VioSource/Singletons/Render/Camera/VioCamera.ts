import { Camera, Euler, Frustum, Matrix4, Object3D, OrthographicCamera, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { VioCameraComponent } from "../../../CameraComponents/Base/VioCameraComponent";
import { ExposedPropertiesObject } from "../../../Exposables/Types/ExposableProperties";
import { IvioCameraComponent } from "../../../Interfaces/IvioCameraComponent";
import { IvioSerializable } from "../../../Interfaces/IvioSerializable";
import { VioCameraComponentRegistry } from "../../Registry/VioCameraComponentRegistry";

export class VioCamera extends Object3D implements IvioSerializable
{
    private _frustum            : Frustum;
    private _buffer             : Matrix4;
    private _perspectiveCamera  : PerspectiveCamera;
    private _orthographicCamera : OrthographicCamera;
    private _selectedCamera     : Camera;
    private _aspect             : number = 1;
    private _orthoFrustumSize   : number = 10;
    // private _components         : Map<string,IvioCameraComponent>;
    private _onCameraModeChanged: (mode:'perspective' | 'orthographic')=>void;

    constructor(onCameraModeChanged:(mode:'perspective' | 'orthographic')=>void | null)
    {
        super();

        this._onCameraModeChanged = onCameraModeChanged;
        this._buffer              = new Matrix4();
        // this._components          = new Map<string,IvioCameraComponent>();
        this._perspectiveCamera   = new PerspectiveCamera();
        this._orthographicCamera  = new OrthographicCamera();
        this._frustum             = new Frustum();
        this._selectedCamera      = this._perspectiveCamera;

        this._perspectiveCamera.layers.enableAll();
        this._orthographicCamera.layers.enableAll();

        this.add(this._perspectiveCamera);
        this.add(this._orthographicCamera);
    }

    private _updateFrustum(forceUpdateMatrix:boolean = false)
    {
        if(forceUpdateMatrix)
        {
            this.updateMatrixWorld(true);
        }

        this._buffer.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
        this._buffer.multiplyMatrices(this.selectedCamera.projectionMatrix,this.selectedCamera.matrixWorldInverse );
        this._frustum.setFromProjectionMatrix(this._buffer);
    }
    
    public update(delta:number)
    {
        this._updateFrustum();
        // this._components.forEach((component:IvioCameraComponent)=>
        // {
        //     component.update(delta);
        // });
    }

    // public addComponent(component:IvioCameraComponent) : IvioCameraComponent|null
    // {
    //     if(this._components.has(component.componentName))
    //     {
    //         console.error("Component is already registered!");
    //         return null
    //     }
    //     else
    //     {
    //         component.OnAdded(this);
    //         this._components.set(component.componentName,component);
    //     }
    //     return this.getComponent(component.componentName);
    // }
    
    // public removeComponent(componentName:string) : IvioCameraComponent | undefined
    // {
    //     if(this._components.has(componentName))
    //     {
    //         const component:IvioCameraComponent | undefined = this._components.get(componentName);

    //         component?.OnRemoved();
    //         this._components.delete(componentName);

    //         return component;
    //     }
    //     return undefined;
    // }

    // public getComponentByType(type:any) : IvioCameraComponent | null
    // {
    //     let component: IvioCameraComponent|null = null;
    //     if(type)
    //     {
    //         this.components.forEach(comp=>
    //         {
    //             if(comp.constructor.name == type.name)
    //             {
    //                 component = comp;
    //                 return;
    //             }
    //         });
    //     }
    //     return component;
    // }

    // public getComponent(componentName:string) : IvioCameraComponent | null
    // {
    //     if(this._components.has(componentName))
    //     {
    //         return this._components.get(componentName)!;
    //     }
    //     return null;
    // }

    public resize(width:number, height:number)
    {
        this._aspect = width / height;
        this._perspectiveCamera.aspect = this._aspect;
        this._perspectiveCamera.updateProjectionMatrix();

        this._orthographicCamera.left   = -this._orthoFrustumSize * this._aspect / 2;
        this._orthographicCamera.right  =  this._orthoFrustumSize * this._aspect / 2;
        this._orthographicCamera.top    =  this._orthoFrustumSize / 2;
        this._orthographicCamera.bottom = -this._orthoFrustumSize / 2;
        this._orthographicCamera.updateProjectionMatrix();
    }
    
    public setData(data:any)
    {
        this.setCameraBaseData(data);
        // this.setCameraComponents(data);
    }

    // public setCameraComponents(data:any)
    // {
    //     if(data.components)
    //     {
    //         data.components.forEach((componentData:any) => 
    //         {
    //             let component = VioCameraComponentRegistry.createComponent(componentData.name,componentData);
    //             if(component)
    //             {
    //                 this.addComponent(component);
    //             }
    //         });
    //     }
    // }

    public setCameraBaseData(data:any)
    {
        // console.log('setCameraBaseData', data)
        if(data.position)
        {
            this.position.set(data.position.x,data.position.y,data.position.z);
        }
        if(data.rotation)
        {
            this.rotation.set(
                data.rotation.x,
                data.rotation.y,
                data.rotation.z,
                data.rotation.order);
        }
        if(data.mode)
        {
            this.cameraMode = data.mode;
        }
        if(data.zoom !== undefined)
        {
            this.zoom = data.zoom;
        }
        if(data.far) {
            this._perspectiveCamera.far = data.far
        }
        if(data.near) {
            this._perspectiveCamera.near = data.near
        }
        if(data.fov) {
            this._perspectiveCamera.fov = data.fov
        }
        if(data.focus) {
            this._perspectiveCamera.focus = data.focus
        }
        this._perspectiveCamera.updateProjectionMatrix()
        // this.parent.attach(this.selectedCamera)
        this._updateFrustum(true);
        // console.log("CAMERA DATA",data);
    }

    public getData()
    {
        // let compData:Array<any> = [];
        // this.components.forEach(component=>
        // {
        //     compData.push(component.getData());
        // });

        const obj =
        {
            position  :{x:this.position.x,y:this.position.y,z:this.position.z},
            rotation  :{x:this.rotation.x,y:this.rotation.y,z:this.rotation.z,order:this.rotation.order},
            mode      :this.cameraMode,
            zoom      :this.zoom,
            far       :this._perspectiveCamera.far,
            near      :this._perspectiveCamera.near,
            focus     :this._perspectiveCamera.focus,
            fov       :this._perspectiveCamera.fov,
            // components:compData
        }
        return obj;
    }

    // get components()
    // {
    //     return Array.from(this._components.values());
    // }

    public get zoom()
    {
        if(this._selectedCamera == this._perspectiveCamera)
        {
            return this.selectedCamera.position.z;
        }
        return this._orthoFrustumSize;
    }

    public set zoom(val:number)
    {
        this._perspectiveCamera .position.z = Number.parseFloat(val.toString());
        
        this._orthoFrustumSize              = Number.parseFloat(val.toString());
        this._orthoFrustumSize              = this._orthoFrustumSize >= 0.1 ? this._orthoFrustumSize : 0.1;
        this._orthographicCamera.left       = -this._orthoFrustumSize * this._aspect / 2;
        this._orthographicCamera.right      =  this._orthoFrustumSize * this._aspect / 2;
        this._orthographicCamera.top        =  this._orthoFrustumSize / 2;
        this._orthographicCamera.bottom     = -this._orthoFrustumSize / 2;

        this._orthographicCamera.updateProjectionMatrix();
    }

    public get cameraMode()
    {
        return this._selectedCamera == this._perspectiveCamera ? 'perspective' : 'orthographic';
    }

    public set cameraMode(val:'perspective' | 'orthographic')
    {
        this._selectedCamera = (val == 'perspective' ? this._perspectiveCamera : this._orthographicCamera);

        if(this._onCameraModeChanged)
        {
            this._onCameraModeChanged(this.cameraMode);
        }
        this._updateFrustum(true);
    }

    public get cameraFrustumDistance()
    {
        return this._perspectiveCamera.far;
    }

    public get selectedCamera()
    {
        return this._selectedCamera;
    }

    public get orthoFrustumSize()
    {
        return this._orthoFrustumSize;
    }

    public set orthoFrustumSize(val:number)
    {
        this._orthoFrustumSize = val;
    }

    public get frustum()
    {
        return this._frustum;
    }
}