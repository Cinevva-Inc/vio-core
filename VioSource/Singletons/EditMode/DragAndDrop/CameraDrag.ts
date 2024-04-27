import { Euler, Vector3 } from "three";
import { VioInput } from "../../Input/VioInput";
import { RayParams } from "../../Raycast/VioRaycast";
import { VioRender } from "../../Render/VioRender";
import { DragBase  } from "./DragBase";

export class CameraDrag extends DragBase
{
    public    sensitivity         :number = 20;
    public    bounds              :{min:{x:number,y:number,zoom:number},max:{x:number,y:number,zoom:number}} | null=null;// = {min:{x:0,y:0,zoom:0},max:{x:70,y:30,zoom:20}}
    // protected _cameraSavedPosition:Vector3;
    // protected _cameraSavedRotation:Euler;
    protected _isDragging         :boolean = false;
    protected _isZooming          :boolean = false;
    protected _pointer            :{x:number,y:number};
    protected _button             :number = -1;

    constructor()
    {
        super();
        this._pointer = {x:0,y:0};
    }

    public pointerDown(target:HTMLElement,button:number,point:{x:number,y:number})
    {
        if(target == VioRender.canvasElement)
        {
            this._pointer.x  = point.x;
            this._pointer.y  = point.y;

            if(button == 1)
            {
                this._isZooming  = true;
                this._isDragging = false;
            }
            if(button == 0 || button == 2)
            {
                this._isZooming  = false;
                this._isDragging = true;
            }
        }
        return this._isDragging || this._isZooming;
    }

    public pointerUp(target:HTMLElement,button:number,point:{x:number,y:number})
    {
        this._isDragging = false;
        this._isZooming  = false;

        if(button>-1)
        {
            this.pointerDown(target,button,point);
        }
    }

    public pointerMove(target:HTMLElement,button:number,point:{x:number,y:number})
    { 
        if(this._isDragging || this._isZooming)
        {
            if(this._isDragging)
            {
                VioRender.camera.position.x -= ((point.x - this._pointer.x) * this.sensitivity);
                VioRender.camera.position.y += ((point.y - this._pointer.y) * this.sensitivity);

                if(this.bounds)
                {
                    if(VioRender.camera.position.x < this.bounds.min.x){ VioRender.camera.position.x = this.bounds.min.x; }
                    if(VioRender.camera.position.y < this.bounds.min.y){ VioRender.camera.position.y = this.bounds.min.y; }
    
                    if(VioRender.camera.position.x > this.bounds.max.x){ VioRender.camera.position.x = this.bounds.max.x; }
                    if(VioRender.camera.position.y > this.bounds.max.y){ VioRender.camera.position.y = this.bounds.max.y; }
                }
            }
            if(this._isZooming)
            {
                VioRender.camera.zoom += ((point.y - this._pointer.y) * this.sensitivity);
                
                if(this.bounds)
                {
                    if(VioRender.camera.zoom < this.bounds.min.zoom){ VioRender.camera.zoom = this.bounds.min.zoom; }
                    if(VioRender.camera.zoom > this.bounds.max.zoom){ VioRender.camera.zoom = this.bounds.max.zoom; }
                }
            }
            this._pointer.x = point.x;
            this._pointer.y = point.y;
        }
        return this._isDragging || this._isZooming;
    }

    public saveCamera()
    {
        // this._cameraSavedPosition = VioRender.camera.position.clone();
        // this._cameraSavedRotation = VioRender.camera.rotation.clone();
    }

    public restoreCamera()
    {
        // if(this._cameraSavedPosition)
        // {
        //     VioRender.camera.position.copy(this._cameraSavedPosition);
        // }
        // if(this._cameraSavedRotation)
        // {
        //     VioRender.camera.rotation.copy(this._cameraSavedRotation);
        // }
    }
}