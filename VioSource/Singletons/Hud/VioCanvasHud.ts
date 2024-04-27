import { Object3D, Sprite, SpriteMaterial, Texture, TextureLoader, Vector3 } from "three";
import { VioHudElement } from "../../Objects/VioHud/Elements/VioHudElement";
import { VioRender } from "../Render/VioRender";
import { VioCanvasHudElement } from "../../Objects/VioCanvasHud/VioCanvasHudElement";

export class VioCanvasHud
{
    private static _instance:VioCanvasHud;

    private _size         :{width:number,height:number} = {width:0,height:0};
    private _elements     :Array<VioCanvasHudElement>;
    private _elementData  :Record<string,VioCanvasHudElement>;
    private _hudContainer :Object3D;
    private _buffers      :{coords:{position:Vector3,scale:Vector3},buff0:Vector3,buff1:Vector3,buff2:Vector3}|null=null;
    
    private constructor()
    {
        this._elementData  = {};
        this._elements     = [];
        // this._hudContainer = new Sprite(new SpriteMaterial({map:new Texture(), sizeAttenuation:false}));
        // this._hudContainer = new Sprite(new SpriteMaterial({map:new Texture()}));
        this._hudContainer = new Object3D();
        // this._hudContainer.center.set(0,1);
        this._hudContainer.name = 'Hud';

        VioRender.rootScene.add(this._hudContainer);
        
        setTimeout(()=>
        {
            this._size.width  = VioRender.screenSize.width;
            this._size.height = VioRender.screenSize.height;
            this._resize();
        },0);
    }

    private _createBuffers()
    {
        if(!this._buffers)
        {
            this._buffers = {coords:{position:new Vector3(),scale:new Vector3()},buff0:new Vector3(),buff1:new Vector3(),buff2:new Vector3()};
        }
    }

    private _getPosition(x:number,y:number)
    {
        this._createBuffers();
        this._buffers!.buff1.set((x / VioRender.screenSize.width) * 2 - 1, - (y / VioRender.screenSize.height) * 2 + 1,0.5);
        this._buffers!.buff1 = this._buffers!.buff1.unproject(VioRender.camera.selectedCamera).sub(VioRender.camera.position).normalize();

        var distance = - VioRender.camera.position.z / this._buffers!.buff1.z;
 
        this._buffers!.buff2.copy(VioRender.camera.position).add(this._buffers!.buff1.multiplyScalar( distance ));
        return this._buffers!.buff2;
    }

    private _getScreenSize(x:number,y:number)
    {
        this._createBuffers();
        this._buffers!.buff0.copy(this._getPosition(0,0));
        this._buffers!.buff1.copy(this._getPosition(x,y));

        this._buffers!.buff2.set(this._buffers!.buff1.x - this._buffers!.buff0.x,
                                this._buffers!.buff0.y - this._buffers!.buff1.y,
                                0);

        return this._buffers!.buff2;
    }

    private _getCoordinates(x:number,y:number,width:number,height:number)
    {
        this._createBuffers();
        this._buffers!.coords.position.copy(this._getPosition(x,y));
        this._buffers!.coords.scale   .copy(this._getScreenSize(width,height));

        return this._buffers!.coords;
    }

    private _resize()
    {
        if(this._size.width > 0 && this._size.height > 0)
        {
            let coords = this._getCoordinates(0,0,this._size.width,this._size.height);
            this._hudContainer.position.copy(coords.position);
            this._hudContainer.scale.copy(coords.scale);
            
            this._elements.forEach(element=>
            {
                VioCanvasHud.updateElementRect(element);
            });
        }
    }

    public static updateElementRect(element:VioCanvasHudElement)
    {
        if(element && this.instance._elements.includes(element))
        {
            element.object.position.x = element.x      != 0 ? element.xType      == 'px' ?  element.x      / this.instance._size.width  :  1 * (element.x      / 100) : 0;
            element.object.position.y = element.y      != 0 ? element.yType      == 'px' ? -element.y      / this.instance._size.height : -1 * (element.y      / 100) : 0;
            element.object.scale.x    = element.width  != 0 ? element.widthType  == 'px' ?  element.width  / this.instance._size.width  :  1 * (element.width  / 100) : 0;
            element.object.scale.y    = element.height != 0 ? element.heightType == 'px' ? -element.height / this.instance._size.height : -1 * (element.height / 100) : 0;
        }
    }
    
    public static addElement(hudElement:VioCanvasHudElement)
    {
        if(!this.instance._elements.includes(hudElement))
        {
            this.instance._elements.push(hudElement);
            
            this.instance._hudContainer.add(hudElement.object);
        }
    }

    public static removeElement(hudElement:VioCanvasHudElement)
    {
        const index = this.instance._elements.indexOf(hudElement);

        if(index>-1)
        {
            this.instance._elements.splice(index,1);

            // if(hudElement.element.parentElement == this.instance._hudContainer)
            // {
            //     this.instance._hudContainer.removeChild(hudElement.element);
            // }
        }
    }

    public static registerElement(key:string,element:VioCanvasHudElement)
    {
        if(!this.instance._elementData[key])
        {
            this.instance._elementData[key] = element;
        }
    }

    public static unregisterElement(key:string)
    {
        if(this.instance._elementData[key])
        {
            // this.instance._elementData[key] = null;
        }
    }

    public static getElement(key:string)
    {
        if(this.instance._elementData[key])
        {
            return this.instance._elementData[key];
        }
        return null;
    }

    // public static getElementByID(id:string)
    // {
    //     for(let num = 0; num < this.instance._elements.length; num++)
    //     {
    //         // if(this.instance._elements[num].id == id)
    //         // {
    //         //     return this.instance._elements[num];
    //         // }
    //     }
    //     return null;
    // }

    public static resize(width:number,height:number)
    {
        this.instance._size.width  = width;
        this.instance._size.height = height;
        this.instance._resize();
    }

    public static get hud()
    {
        return this.instance._hudContainer;
    }

    public static get data()
    {
        const dataObj = this.instance._elementData;
        const obj:any = {};

        obj.elementData     = {};
        obj.children        = [];

        this.instance._elements.forEach(element=>
        {
            // obj.children.push(element.data);
        });

        for(let key in dataObj)
        {
            // obj.elementData[key] = dataObj[key].id;
        }

        return obj;
    }

    public static get renderOrder()
    {
        return this.instance._hudContainer.renderOrder;
    }

    public static set renderOrder(val:number)
    {
        this.instance._hudContainer.renderOrder = val;
    }

    public static get elements()
    {
        return this.instance._elements;
    }

    private static get instance():VioCanvasHud
    {
        if(!VioCanvasHud._instance)
        {
            VioCanvasHud._instance = new VioCanvasHud();
        }
        return VioCanvasHud._instance;
    }
}