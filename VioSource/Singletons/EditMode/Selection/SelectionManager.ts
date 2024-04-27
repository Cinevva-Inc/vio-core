import { DoubleSide, GridHelper, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Vector3, LineBasicMaterial } from "three";
import { TransformControls } from "../../../../Libs/controls/TransformControls";
import { VioHelpers } from "../../../Helpers/VioHelpers";
import { VioRender } from "../../Render/VioRender";
import { VioSettings } from "../../Settings/VioSettings";
import { ObjectSelection } from './ObjectSelection';
import { VioObject } from "@/core/VioCore";

export type SkinnedMeshBake = {originalObject:Object3D,bakedObject:Mesh};

export class SelectionManager extends Object3D
{
    public    onHudsUpdated    :((obj:Array<Object3D>)=>void)|null=null;

    protected _selections      :Array<ObjectSelection>;
    protected _grids           :Array<GridHelper>;
    protected _handlingType    :string = '';
    protected _buffer          :Vector3 = new Vector3();
    protected _gridSize        :number  = 200;
    protected _gridCount       :number  = 3;
    protected _currentMode     :'translate' | 'rotate' | 'scale' | 'none' = 'none';
    protected _controlSpace    :'world' | 'local' = 'local';
    protected _onUpdated       :(()=>void)|null=null;
    public snapToGrid: boolean = false;

    constructor()
    {
        super();
        (this as any).type              = "SelectionManager";
        this._selections       = [];
        this._grids            = [];

        for(let {size, divisions, color, opacity} of [
            {size:200, divisions:200, color:0xcccccc, opacity: 0.4},
            {size:200, divisions:20, color:0xcccccc, opacity: 0.9},
            // {size:200, divisions:200, color:0x888888},
        ])
        {
            //console.log(color)
            let grid = new GridHelper(size, divisions, color, color);
            grid.position.y += 0.01
            grid.material.transparent = true
            grid.material.opacity = opacity
            grid.material.depthTest = true
            grid.material.depthWrite = true
            // grid.material = new LineBasicMaterial({
            //     color,
            //     depthTest:true, 
            //     depthWrite:false
            // });
            this._grids.push(grid);
            this.add(grid);
        }
    }

    private _getHud():ObjectSelection
    {
        for(let num = 0; num < this._selections.length; num++)
        {
            if(!this._selections[num].object)
            {
                return this._selections[num];
            }
        }

        let selection = new ObjectSelection();
        // this.add(selection.controls);
        this.attach(selection);

        this._selections.push(selection);

        this.controlMode  = this.controlMode;
        this.controlSpace = this.controlSpace;

        return selection;
    }

    private _onHudsUpdated()
    {
        if(this.onHudsUpdated)
        {
            let arr:Array<Object3D> = [];
            this._selections.forEach((selection:ObjectSelection)=>
            {
                if(selection.visible)
                {
                    arr.push(...selection.handlers);
                }
            });
            this.onHudsUpdated(arr);
        }
    }

    public isSelected(obj:Object3D)
    {
        for(let num = 0; num < this._selections.length; num++)
        {
            if(this._selections[num].object == obj)
            {
                return true;
            }
        }
        return false;
    }

    public setHandlingType(type:string)
    {
        this._handlingType = type;
    }

    public onHandle(selectionObject:ObjectSelection,pos:Vector3,diff:Vector3)
    {
        console.log('onHandle', selectionObject)
        selectionObject.update();

        this._selections.forEach(selection=>
        {
            if(selection != selectionObject && selection.object)
            {
                this._buffer.copy(selection.position);
                selection.update();
            }
        });
    }
    
    public addToSelection(obj:VioObject)
    {
        if(!this.isSelected(obj))
        {
            let selection = this._getHud();

            selection.setObject(obj);
            this._onHudsUpdated();
            return selection;
        }
    }

    public removeFromSelection(obj:VioObject)
    {
        this._selections.forEach((selection:ObjectSelection)=>
        {
            if(selection.object == obj)
            {
                selection.setObject(null);
            }
        });
        this._onHudsUpdated();
    }

    public syncSelections()
    {
        this._selections.forEach((selection:ObjectSelection)=>
        {
            selection.sync();
        });
    }

    public updateSelections()
    {
        this._selections.forEach((selection:ObjectSelection)=>
        {
            selection.update();
        });
    }

    public clearSelection(except:Object3D|null = null)
    {
        this._selections.forEach((selection:ObjectSelection)=>
        {
            if(except != selection.object)
            {
                selection.setObject(null);
            }
        });
        this._onHudsUpdated();
    }

    public get selectedItemsCount()
    {
        return this.selectedItems.length;
    }

    public get selectedItems()
    {
        let arr:Array<Object3D> = [];
        this._selections.forEach((selection:ObjectSelection)=>
        {
            if(selection.object)
            {
                arr.push(selection.object);
            }
        });
        return arr;
    }

    public get selectedHandlers()
    {
        let arr:Array<ObjectSelection> = [];
        this._selections.forEach((selection:ObjectSelection)=>
        {
            if(selection.object)
            {
                arr.push(selection);
            }
        });
        return arr;
    }

    public get handlerType()
    {
        return this._handlingType;
    }

    public set controlSpace(val:'world' | 'local')
    {
        this._controlSpace = val;
        for(let num = 0; num < this._selections.length; num++)
        {
            this._selections[num].controls.setSpace(val);
        }
        if (this._onUpdated)
            this._onUpdated()
    }

    public get controlSpace()
    {
        return this._controlSpace;
    }

    public set controlMode(val:'translate' | 'rotate' | 'scale' | 'none')
    {
        this._currentMode = val;
        for(let num = 0; num < this._selections.length; num++)
        {
            this._selections[num].updateControlType(val);
        }
        if (this._onUpdated)
            this._onUpdated()
    }

    public get controlMode()
    {
        return this._currentMode;
    }

    public set onUpdated(val:()=>void)
    {
        this._onUpdated = val
    }

}