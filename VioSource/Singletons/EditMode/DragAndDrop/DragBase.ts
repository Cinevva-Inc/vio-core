import { DoubleSide, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry } from "three";
import { VioRaycast } from "../../Raycast/VioRaycast";
import { VioRender } from "../../Render/VioRender";

export class DragBase
{
    protected _sceneDragPlane : Mesh|null=null;

    protected _getRayIntersectableObjects(intersectables:Array<Object3D>|null = null)
    {
        return (intersectables && intersectables.length>0 ? intersectables : VioRender.scene.objects);
    }
    
    protected _getRay(point:{x:number,y:number},intersectables:Array<Object3D>|null = null, priority:string = '')
    {
        intersectables = this._getRayIntersectableObjects(intersectables);

        let items = VioRaycast.getRay(point,intersectables,true);
        
        if(items.length>0)
        {
            if(priority.length > 0)
            {
                for(let num = 0; num < items.length; num++)
                {
                    if(items[num].object.type.includes(priority))
                    {
                        return items[num];
                    }
                }
            }
            return items[0];
        }
        return null;
    }

    public pointerDown(target:HTMLElement,button:number,point:{x:number,y:number}){}

    public pointerUp(target:HTMLElement,button:number,point:{x:number,y:number}){}

    public pointerMove(target:HTMLElement,button:number,point:{x:number,y:number}){}

    public setSeneDragPlane(plane:Mesh)
    {
        this._sceneDragPlane = plane;
    }
}