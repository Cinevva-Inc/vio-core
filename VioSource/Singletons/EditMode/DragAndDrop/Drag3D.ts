import { Matrix4, Object3D, Plane, Vector3 } from "three"
import { VioHelpers } from "../../../Helpers/VioHelpers";
import { VioInput } from "../../Input/VioInput";
import { RayParams, VioRaycast } from "../../Raycast/VioRaycast";
import { VioRender } from "../../Render/VioRender";
import { ObjectSelection } from "../Selection/ObjectSelection";
import { DragBase  } from "./DragBase";

type Point = {x:number,y:number};

export class Drag3D extends DragBase
{
    public  onMovable    :((obj:Object3D, point:Vector3, selected:boolean)=>void)|null=null;
    public  onItem       :((obj:Object3D, point:Vector3|null, selected:boolean)=>void)|null=null;
    public  onSelection  :((obj:ObjectSelection, type:string, point:Vector3)=>void)|null=null;
    public  onItemHandle :((obj:Object3D, pos:Vector3, diff:Vector3)=>void)|null=null;
    public  onItemPressed:((obj:Object3D)=>void)|null = null;

    public  selectChildren :boolean = false;

    private _currentObject   :Object3D | null = null;
    private _pointer         :Point   = {x:0,y:0};
    private _timoutUntilPress:number  = 500;
    private _offset          :Vector3 = new Vector3();
    private _initPos         :Vector3 = new Vector3();
    private _difference      :Vector3 = new Vector3();
    private _raycastables    :Array<Object3D>|null=null;
    private _selection       :{handler:ObjectSelection|null,object:Object3D|null,time:number,point:Point,vector:Vector3,type:string} = {handler:null,object:null,time:0,point:{x:0,y:0},vector:new Vector3(),type:''};
    private _pointerSelection:{object:Object3D|null,timeoutID:any,point:Vector3,mouseDown:boolean} = {object:null,timeoutID:-1,point:new Vector3(),mouseDown:false};

    protected invokeSelection = ()=>
    {
        if(!this._pointerSelection.object)
        {
            return;
        }

        if(this._pointerSelection.mouseDown)
        {
            this.onItemPressed!(this._pointerSelection.object);
        }
        else
        {
            if(this._selection.object)
            {
                if(this.onSelection)
                {
                    this.onSelection(this._selection.handler!,this._selection.type,this._selection.vector);
                }
            }
            else
            {
                this.onItem!(this._pointerSelection.object,this._pointerSelection.point,true);
            }
        }
        this._pointerSelection.timeoutID = -1;
        this._pointerSelection.object    = null;
    }

    public pointerDown(target:HTMLElement,button:number,point:{x:number,y:number})
    {
        this._pointer.x   = point.x;
        this._pointer.y   = point.y;

        let hasSelection = false;

        if(target == VioRender.canvasElement)
        {
            let item = this._getRaycastItem();

            if(item)
            {
                let obj     = item!.object;
                let type    = '';
                let point   = item!.point;
                let handler = VioHelpers.object.bubbleToType(obj,'ObjectSelection');
                
                if(obj.type == 'movable')
                {
                    hasSelection = true;
                    if(this.onMovable)
                    {
                        this.onMovable(obj,point,true);
                    }
                    return hasSelection;
                }
                if(handler)
                {
                    if(obj.type.includes('hud'))
                    {
                        if(obj.parent && obj.parent.type == 'hudCont')
                        {
                            type =  obj.type.replace('hud.','');
                        }
                    }

                    this._selection.object  = (handler as ObjectSelection).object;
                    this._selection.handler = handler;
                    this._selection.type    = type;
                    this._selection.time    = Date.now();
                    this._selection.point.x = this._pointer.x;
                    this._selection.point.y = this._pointer.y;
                    this._selection.vector.copy(point);

                    hasSelection = true;

                    this._pointerSelection.point.copy(point);
                    this._pointerSelection.mouseDown = true;
                    this._pointerSelection.object    = this._selection.object;
                    this._pointerSelection.timeoutID = setTimeout(this.invokeSelection,this._timoutUntilPress);
                }
                else
                {
                    this._selection.object = null;

                    hasSelection = true;
                    
                    if(this.onItem)
                    {
                        let selection = this.selectChildren ? ((obj.type == 'SkinnedMesh' || obj.type == 'Mesh' || obj.type == '[Baked]') ? VioHelpers.object.bubbleToType(obj,'VioObject',true) : obj) : VioHelpers.object.bubbleToType(obj,'VioObject');
                        
                        this._pointerSelection.point.copy(point);
                        this._pointerSelection.mouseDown = true;
                        this._pointerSelection.object    = selection;
                        this._pointerSelection.timeoutID = setTimeout(this.invokeSelection,this._timoutUntilPress);
                    }
                }
            }
        }
        return hasSelection;
    }

    public pointerUp(target:HTMLElement,button:number,point:{x:number,y:number})
    {
        if(this._pointerSelection.timeoutID>-1)
        {
            this._pointerSelection.mouseDown = false;
            clearTimeout(this._pointerSelection.timeoutID);
            this.invokeSelection();
        }

        if(Math.abs(this._selection.point.x-point.x) == 0 && Math.abs(this._selection.point.y-point.y) == 0)
        {
            if(this.onItem && this._selection.object)
            {
                this.onItem(this._selection.object,null,false);
            }

        }
        this._currentObject = null;
        VioRender.canvasElement.style.cursor = 'auto';
    }

    public setRaycastableObjects(arr:Array<Object3D>)
    {
        this._raycastables = arr;
    }

    public setCurrentObject(obj:Object3D, point:Vector3, horizontal:boolean = false)
    {
        this._currentObject = null;

        if(obj)
        {
            VioRender.canvasElement.style.cursor = 'move';
            
            obj.getWorldPosition(this._offset);
            this._offset.x = point.x - this._offset.x;
            this._offset.y = point.y - this._offset.y;
            this._offset.z = point.z - this._offset.z;
            
            this._initPos.copy(point);
            this._sceneDragPlane!.rotation.x = VioHelpers.Math.degToRad(horizontal ? 90 : 0);
            this._sceneDragPlane!.position.copy(point);
            this._sceneDragPlane!.updateMatrixWorld(true);

            this._currentObject = obj;
        }
    }

    public pointerMove(target:HTMLElement,button:number,point:{x:number,y:number},horizontal:boolean = false)
    {
        if(this._pointerSelection.timeoutID>-1)
        {
            this._pointerSelection.mouseDown = false;
            clearTimeout(this._pointerSelection.timeoutID);
            this.invokeSelection();
        }

        if(this._currentObject)
        {
            const item = this._getRay(point,[this._sceneDragPlane!]) as RayParams;

            this._pointer.x = point.x;
            this._pointer.y = point.y;

            if(item)
            {
                this._difference.set(item.point.x - this._initPos.x, item.point.y - this._initPos.y, item.point.z - this._initPos.z);
                this._initPos.copy(item.point);

                if(this.onItemHandle)
                {
                    this.onItemHandle(this._currentObject,item.point.sub(this._offset),this._difference);
                }
            }
        }
    }

    private _getRaycastItem()
    {
        let item:RayParams|null = null;
        if(this._raycastables && this._raycastables.length>0)
        {
            item = this._getRay(this._pointer, this._raycastables,'hud') as RayParams;
        }

        if(!item)
        {
            item = this._getRay(this._pointer,null,'hud') as RayParams;
        }
        return item;
    }

    public get selectedElement()
    {
        return this._currentObject;
    }
}