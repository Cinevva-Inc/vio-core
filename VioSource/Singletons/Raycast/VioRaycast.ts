import { Face, Object3D, Raycaster, Vector2, Vector3 } from 'three';
import { IvioInteractable } from '../../Interfaces/IvioInteractable';
import { VioEditMode } from '../EditMode/VioEditMode';
import { VioInput  } from '../Input/VioInput';
import { VioRender } from '../Render/VioRender';

export type Vector = {x:number,y:number};

export type RayParams = { distance:number, point:Vector3, face:Face, faceIndex:number, object:Object3D};

export class VioRaycast
{
    private static _instance:VioRaycast;

    private _interactables         : Array<IvioInteractable>;
    private _interactableObjects   : Array<Object3D>;
    private _intersected           : Set<Object3D>;
    private _enabled               : boolean = true;
    private _raycast               : Raycaster;
    private _objectScreenPosBuffer : {vector:Vector3,position:{position:Vector,normalized:Vector,viewport:Vector}};

    private constructor()
    {
        this._objectScreenPosBuffer = {vector:new Vector3(), position:{position:{x:-1,y:-1},normalized:{x:-1,y:-1},viewport:{x:-1,y:-1}}};
        this._raycast               = new Raycaster();
        // this._raycast.firstHitOnly  = true;
        this._interactables         = [];
        this._interactableObjects   = [];
        this._intersected           = new Set<Object3D>();
    }

    protected traverseReversed(obj: IvioInteractable, target:Object3D):boolean
    {
        if(obj.object === target || obj.object == target.parent)
        {
            return true;
        }
        if(!target.parent)
        {
            return false;
        }
        return this.traverseReversed(obj,target.parent);
    }

    protected addAndDispatch(item:RayParams, clickedButton:number = -1)
    {
        const interactable:IvioInteractable|undefined = this._interactables.find(obj => this.traverseReversed(obj,item.object));
        if (interactable) {
            this._intersected.add(item.object);
            
            if(clickedButton > -1)
            {
                interactable.onClick(clickedButton,item);
            }
            else
            {
                interactable.onOver(item);
            }
        }
    }

    protected checkAndDispatchOut(intersections:Array<RayParams>)
    {
        VioRaycast.intersectedObjects.forEach((item:Object3D)=>
        {
            if(!intersections.find(ray => ray.object === item ))
            {
                const interactable:IvioInteractable|undefined = this._interactables.find( obj => this.traverseReversed(obj,item));
        
                if(interactable)
                {
                    interactable.onOut();
                }
            }
        });
    }

    protected updateRaycast(clickedButton:number = -1)
    {
        if(this._interactables.length == 0 || VioEditMode.enabled)
        {
            return;
        }

        if(this._interactableObjects.length == 0)
        {
            this._interactableObjects = this._interactables.map(item => item.object!);
        }

        let intersected:Array<any> = VioRaycast.getRay(VioInput.mouseViewportPosition,this._interactableObjects,true);

        if( intersected.length != this._intersected.size || 
           (intersected.length == this._intersected.size && !intersected.every((object)=>!this._intersected.has(object))) ||
            clickedButton > -1)
        {
            if(clickedButton == -1)
            {
                this.checkAndDispatchOut(intersected);
            }

            this._intersected.clear();

            intersected.forEach((item:RayParams) => { this.addAndDispatch(item, clickedButton)});
        }
    }

    public static getObjectScreenPosition(obj:Object3D)
    {
        obj.getWorldPosition(this.instance._objectScreenPosBuffer.vector);

        return this.getVectorScreenPosition(this.instance._objectScreenPosBuffer.vector);
    }

    public static getVectorScreenPosition(vec:Vector3)
    {
        const buff  = this.instance._objectScreenPosBuffer;

        buff.vector = vec.project(VioRender.camera.selectedCamera);
        
        const data = VioInput.getPositionByCursor(((buff.vector.x + 1) / 2) * VioRender.canvasElement.width,(-(buff.vector.y - 1) / 2) * VioRender.canvasElement.height);

        buff.position.position.x   = data.position.x;
        buff.position.position.y   = data.position.y;
        buff.position.normalized.x = data.normalized.x;
        buff.position.normalized.y = data.normalized.y;
        buff.position.viewport.x   = data.viewport.x;
        buff.position.viewport.y   = data.viewport.y;
        
        return buff.position;
    }

    public static getRay(point:{x:number,y:number},items:Array<Object3D>, recursive: boolean = true)
    {
        this.instance._raycast.setFromCamera(new Vector2(point.x,point.y),VioRender.camera.selectedCamera);
        
        let arr:any = []
        try
        {
            arr = this.instance._raycast.intersectObjects(items, recursive);
        }
        catch(e){}
        return arr;
    }

    public static update(): void 
    {
        if(this.instance._enabled)
        {
            if(VioInput.clickedMouseButtons.length>0)
            {
                VioInput.clickedMouseButtons.forEach((button:number)=>
                {
                    this.instance.updateRaycast(button);
                });
            }
            else
            {
                this.instance.updateRaycast();
            }
        }
    }

    public static hasIneractableObject(object:IvioInteractable)
    {
        return this.instance._interactables.includes(object);
    }

    public static addInteractableObject(object:IvioInteractable)
    {
        if(!this.hasIneractableObject(object))
        {
            this.instance._interactables.push(object);

            this.instance._interactableObjects.length = 0;
        }
    }

    public static removeInteractableObject(object:IvioInteractable)
    {
        const index = this.instance._interactables.indexOf(object);

        if(index>-1)
        {
            this.instance._interactables.splice(index,1);

            this.instance._interactableObjects.length = 0;
        }
    }

    public static get interactables()
    {
        return this.instance._interactables;
    }

    public static get intersectedObjects()
    {
        return Array.from(this.instance._intersected.values());
    }

    public static get raycast()
    {
        return this.instance._raycast;
    }

    public static get enabled()
    {
        return this.instance._enabled;
    }

    public static set enabled(enabled:boolean)
    {
        this.instance._enabled = enabled;
    }

    private static get instance():VioRaycast
    {
        if(!VioRaycast._instance)
        {
            VioRaycast._instance = new VioRaycast();
        }
        return VioRaycast._instance;
    }
}