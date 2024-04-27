import { Sprite, SpriteMaterial } from "three";
import { VioCanvasHud } from "../../Singletons/Hud/VioCanvasHud";

export type CoordinateValue =
{
    value:number,
    type :'px' | '%'
}

export class VioCanvasHudElement
{
    private _object:Sprite;
    private _rectangle:{x:CoordinateValue,y:CoordinateValue,width:CoordinateValue,height:CoordinateValue};

    constructor(name:string = '', id:string | null = null)
    {
        this._rectangle = {x:{value:0,type:'px'},y:{value:0,type:'px'},width:{value:100,type:'px'},height:{value:100,type:'px'}};
        this._object    = new Sprite(new SpriteMaterial({color:0xff0000}));
        this._object.center.set(0,1);
    }

    protected _updateTransform()
    {
    }

    protected _generateData():any
    {
    }

    public setData(data:any)
    {
    }

    public get object()
    {
        return this._object;
    }

    public get rectangle()
    {
        return this._rectangle;
    }

    public set rectangle(val:{x:CoordinateValue,y:CoordinateValue,width:CoordinateValue,height:CoordinateValue})
    {
        this._rectangle.x.value      = val.x.value;
        this._rectangle.x.type       = val.x.type;
    
        this._rectangle.y.value      = val.y.value;
        this._rectangle.y.type       = val.y.type;
        
        this._rectangle.width.value  = val.width.value;
        this._rectangle.width.type   = val.width.type;
        
        this._rectangle.height.value = val.height.value;
        this._rectangle.height.type  = val.height.type;

        VioCanvasHud.updateElementRect(this);
    }

    public get layer()
    {
        return this._object.renderOrder - VioCanvasHud.renderOrder;
    }

    public set layer(val:number)
    {
        if(val <= 0)
        {
            console.error('Layer should be more then 0!');
            val = 1
        }
        this._object.renderOrder = VioCanvasHud.renderOrder + val;
    }

    public get anchorX()
    {
        return this._object.center.x;
    }

    public set anchorX(val:number)
    {
        this._object.center.x = val;
    }

    public get anchorY()
    {
        return this._object.center.y;
    }

    public set anchorY(val:number)
    {
        this._object.center.y = 1 - val;
    }

    public get x()
    {
        return this._rectangle.x.value;
    }

    public set x(val:number)
    {
        this._rectangle.x.value = val;
        VioCanvasHud.updateElementRect(this);
    }
    
    public get xType()
    {
        return this._rectangle.x.type;
    }

    public set xType(val:'px' | '%')
    {
        this._rectangle.x.type = val;
        VioCanvasHud.updateElementRect(this);
    }

    public get y()
    {
        return this._rectangle.y.value;
    }

    public set y(val:number)
    {
        this._rectangle.y.value = val;
        VioCanvasHud.updateElementRect(this);
    }
    
    public get yType()
    {
        return this._rectangle.y.type;
    }

    public set yType(val:'px' | '%')
    {
        this._rectangle.y.type = val;
        VioCanvasHud.updateElementRect(this);
    }

    public get width()
    {
        return this._rectangle.width.value;
    }

    public set width(val:number)
    {
        this._rectangle.width.value = val;
        VioCanvasHud.updateElementRect(this);
    }
    
    public get widthType()
    {
        return this._rectangle.width.type;
    }

    public set widthType(val:'px' | '%')
    {
        this._rectangle.width.type = val;
        VioCanvasHud.updateElementRect(this);
    }

    public get height()
    {
        return this._rectangle.height.value;
    }

    public set height(val:number)
    {
        this._rectangle.height.value = val;
        VioCanvasHud.updateElementRect(this);
    }
    
    public get heightType()
    {
        return this._rectangle.height.type;
    }

    public set heightType(val:'px' | '%')
    {
        this._rectangle.height.type = val;
        VioCanvasHud.updateElementRect(this);
    }
}