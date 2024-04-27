import { DoubleSide, Event, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Sprite, SpriteMaterial, TextureLoader, Vector3 } from "three";
import { VioInput  } from "../../Input/VioInput";
import { RayParams } from "../../Raycast/VioRaycast";
import { VioRender } from "../../Render/VioRender";
import { DragBase  } from "./DragBase";

export class Drag2D extends DragBase
{
    public  onDragResult        :((type:string,value:string,object:Object3D|null,point:Vector3|null,referene:boolean)=>void)|null=null;
    public  onDragElementResult :((type:string,value:string,target:HTMLElement,referene:boolean)=>void)|null=null;
    public  uiScale             :number = 1;
    private _handler            :Object3D;
    private _plane              :Sprite;
    private _loading            :Mesh;
    private _cursorOffset       :{x:number,y:number};
    private _draggable          :
    {
        element       :HTMLElement|null,
        elementDisplay:string,
        iconURL       :string,
        type          :string,
        value         :string,
        isReference   :boolean,
        is3DObject    :boolean,
        applyOnObject :boolean
    }
    private _draggableStyleProps:Array<string> = [
                                                    'width',
                                                    'height',
                                                    'src',
                                                    'object-fit',
                                                 ];

    constructor()
    {
        super();
        this._cursorOffset = {x:0,y:0};
        this._draggable    = {element:null,iconURL:'',type:'',value:'',elementDisplay:'',isReference:false,is3DObject:false,applyOnObject:false};
        this._handler      = new Object3D(); 
        this._plane        = new Sprite(new SpriteMaterial( {color: 0xffffff, transparent:true, opacity:0.6, side: DoubleSide, depthWrite:false, depthTest:false}));
        this._loading      = new Mesh(new PlaneGeometry( 1, 1 ), new MeshBasicMaterial( {color: 0xffffff, transparent:true, side: DoubleSide, depthWrite:false, depthTest:false, map:new TextureLoader().load('./assets/tools/editor/icons/loading.png')}));
        VioRender.rootScene.add(this._handler);
        this._handler.add(this._plane);
        this._handler.add(this._loading);
        this.reset3DSpaceCursor();
    }

    private _setDraggableElement(element:HTMLElement,point:{x:number,y:number})
    {   
        this._resetDraggable();
        this._setDraggableObject(element);
        this._draggable.is3DObject = element.hasAttribute('sceneObject');

        if(this._draggable.is3DObject)
        {
            this._draggable.applyOnObject = element.hasAttribute('applyonobject') && element.getAttribute('applyonobject') == 'true';

            this._updateDraggableObjectStyle(element);
        }
        else
        {
            if(this._draggable.type != "dragHandler")
            {
                this._completeCloneStyle(element,this._draggable.element!);
            }
        }

        this._setClonedElementPosition(element,point);

        const pointX = element.hasAttribute('pointx') ?     Number.parseFloat(element.getAttribute('pointx')!) : 0.5;
        const pointY = element.hasAttribute('pointy') ? 1 - Number.parseFloat(element.getAttribute('pointy')!) : 0.5;

        this._plane.center.set(pointX,pointY);

        //@ts-ignore
        this._plane.material.map = new TextureLoader().load(this._draggable.iconURL,(tex)=>
        {
            const imgWidth  = tex.source.data.width;
            const imgHeight = tex.source.data.height;
            const aspect    = Math.max(imgWidth,imgHeight)/Math.min(imgWidth,imgHeight);
            this._plane.scale.set(imgWidth<imgHeight ? 1 : aspect,imgWidth>imgHeight ? 1 : aspect,1);
        });
    }
    
    private _setDraggableObject(element:HTMLElement)
    {
        const attributes            = element.attributes;
        this._draggable.type        = attributes.getNamedItem('type'     )!.nodeValue!;
        this._draggable.value       = attributes.getNamedItem('value'    )!.nodeValue!;
        this._draggable.isReference = attributes.getNamedItem('reference') ? (attributes.getNamedItem('reference')!.nodeValue == 'true' ? true : false) : false;

        if(this._draggable.type == "dragHandler")
        {
            if(this._draggable.value.length>0)
            {
                let oldElement = element;
                let elements   = document.getElementsByTagName("*");

                for(let num = 0; num < elements.length; num++)
                {
                    if(elements[num].hasAttribute('dragID'))
                    {
                        if(elements[num].getAttribute('dragID') == this._draggable.value)
                        {
                            element = elements[num] as HTMLElement;
                            
                            const newRect = element   .getBoundingClientRect();
                            const oldRect = oldElement.getBoundingClientRect();

                            (element as HTMLElement).style.setProperty('left' ,((newRect.x + (newRect.x - oldRect.x)) / this.uiScale)+'px');
                            (element as HTMLElement).style.setProperty('top'  ,((newRect.y + (newRect.y - oldRect.y)) / this.uiScale)+'px');
                            break;
                        }
                    }
                }
            }
            this._draggable.element = element as HTMLElement;
        }
        else
        {
            this._draggable.element = element.cloneNode(true) as HTMLElement;
            document.body.appendChild(this._draggable.element);
        }
    }

    private _resetDraggable()
    {
        if(this._draggable.element && this._draggable.type != "dragHandler")
        {
            this._draggable.element!.parentElement!.removeChild(this._draggable.element);
            this._draggable.element = null;
        }

        this._draggable.element        = null;
        this._draggable.is3DObject     = false;
        this._draggable.applyOnObject  = false;
        this._draggable.isReference    = false;
        this._draggable.type           = '';
        this._draggable.value          = '';
        this._draggable.elementDisplay = '';
    }

    private _updateDraggableObjectStyle(element:HTMLElement)
    {
        const style             = window.getComputedStyle(element, null);
        this._draggable.iconURL = element.dataset.icon!
        // style.getPropertyValue('background-image').replace('url("','').replace('")','')
        
        this._draggable.element!.style.setProperty('margin' ,'0');
        this._draggable.element!.style.setProperty('opacity','0.6');
        this._draggable.elementDisplay = 'block';

        this._draggableStyleProps.forEach(prop=>
        {
            this._draggable.element!.style.setProperty(prop, style.getPropertyValue(prop));
        });
    }

    private _completeCloneStyle(original:HTMLElement,cloned:HTMLElement)
    {
        if(!original || !cloned)
        {
            return;
        }

        const style = window.getComputedStyle(original, null);
        const isTop = this._draggable.elementDisplay.length == 0;

        Object.keys(style).forEach(key=>
        {
            let prop = key.split(/(?=[A-Z])/).join('-').toLowerCase();

            if(prop == 'display' && isTop)
            {
                this._draggable.elementDisplay = style.getPropertyValue(prop);
            }

            cloned.style.setProperty(prop,style.getPropertyValue(prop));
        });

        if(original.children.length == cloned.children.length)
        {
            for(let num = 0; num < original.children.length; num++)
            {
                this._completeCloneStyle(original.children[num] as HTMLElement, cloned.children[num] as HTMLElement);
            }
        }
    }

    private _setClonedElementPosition(element:HTMLElement,point:{x:number,y:number})
    {
        const rect           = element.getBoundingClientRect();
        this._cursorOffset.x = rect.x - point.x;
        this._cursorOffset.y = rect.y - point.y;

        this._draggable.element!.style.setProperty('position'        ,'fixed');
        this._draggable.element!.style.setProperty('margin'          ,'0');
        this._draggable.element!.style.setProperty('padding'         ,'0');
        this._draggable.element!.style.setProperty('transform-origin','top left');

        if(this._draggable.type == "dragHandler")
        {
            this._draggable.element!.style.setProperty('left',(rect.x / this.uiScale)+'px');
            this._draggable.element!.style.setProperty('top' ,(rect.y / this.uiScale)+'px');
        }
        else
        {
            this._draggable.element!.style.setProperty('transform'       ,'scale('+this.uiScale+')');
            this._draggable.element!.style.setProperty('pointer-events'  ,'none');
            this._draggable.element!.style.setProperty('touch-action'    ,'none');
            this._draggable.element!.style.setProperty('z-index'         ,'100');
            this._draggable.element!.style.setProperty('left'            ,rect.x+'px');
            this._draggable.element!.style.setProperty('top'             ,rect.y+'px');
        }
    }

    private async _makeActionByDraggable(useRay:boolean, rayData:RayParams|null, target:HTMLElement|null = null)
    {
        this._plane.visible = false;

        if(useRay && !rayData)
        {
            return;
        }
        if(this._draggable.type.length>0 && this._draggable.value.length>0)
        {
            this._loading.visible = true;
            this._spinLoading();
            
            if( useRay && this.onDragResult)
            {
                this.onDragResult(this._draggable.type,this._draggable.value,rayData ? rayData.object : null,rayData ? rayData.point : null, this._draggable.isReference);
            }
            if(!useRay)
            {
                target!.dispatchEvent(new CustomEvent('elementDropped',{'detail': {type:this._draggable.type, isReference:this._draggable.isReference, value: this._draggable.value, image:this._draggable.iconURL}}));

                if(this.onDragElementResult)
                {
                    this.onDragElementResult(this._draggable.type,this._draggable.value,target!,this._draggable.isReference);
                }
                this.reset3DSpaceCursor();
            }
        }
    }

    protected _getRayIntersectableObjects(intersectables:Array<Object3D>|null = null): Array<Object3D>
    {
        if (intersectables && intersectables.length>0)
            return intersectables
        if (this._draggable.is3DObject && !this._draggable.applyOnObject)
            return [this._sceneDragPlane as Object3D]
        return VioRender.scene.objects
    }

    private _spinLoading()
    {
        if(this._loading.visible)
        {
            this._loading.rotation.z+=(60/1000);
            setTimeout(()=>
            {
                this._spinLoading();
            },60/1000);
        }
    }

    public reset3DSpaceCursor()
    {
        this._plane.visible   = false;
        this._loading.visible = false;
    }

    public createDraggableItem(iconURL:string,itemType:string,itemValue:string, pointerPosition:{x:number,y:number})
    {
        this._resetDraggable();
        this.reset3DSpaceCursor();
        
        this._cursorOffset.x           = -50;
        this._cursorOffset.y           = -50;

        this._draggable.element        = document.createElement('div') as HTMLElement;
        this._draggable.is3DObject     = false;
        this._draggable.type           = itemType;
        this._draggable.value          = itemValue;
        this._draggable.elementDisplay = 'block';
        this._draggable.iconURL        = iconURL;
        this._draggable.element.setAttribute('class','draggableObjectReference');
        this._draggable.element.setAttribute('icon' ,iconURL);
        this._draggable.element.setAttribute('type' ,itemType);
        this._draggable.element.setAttribute('value',itemValue);
        
        this._draggable.element.style.setProperty('width' ,'100px');
        this._draggable.element.style.setProperty('height' ,'100px');
        this._draggable.element.style.setProperty('margin' ,'0');
        this._draggable.element.style.setProperty('z-index' ,'100');
        this._draggable.element.style.setProperty('opacity','0.6');
        this._draggable.element.style.setProperty('position','fixed');
        this._draggable.element.style.setProperty('pointer-events','none');
        this._draggable.element.style.setProperty('background-size','contain');
        this._draggable.element.style.setProperty('background-repeat','no-repeat');
        this._draggable.element.style.setProperty('background-position','center center');
        this._draggable.element.style.setProperty('background-image','url('+iconURL+')');

        this._draggable.element.style.setProperty('left',(pointerPosition.x + this._cursorOffset.x)+'px');
        this._draggable.element.style.setProperty('top' ,(pointerPosition.y + this._cursorOffset.y)+'px');
        document.body.appendChild(this._draggable.element);
    }

    public pointerDown(target:HTMLElement,button:number,point:{x:number,y:number})
    {
        let hasSelection = false;
        this.reset3DSpaceCursor();
        if(target.hasAttribute('draggable'))
        {
            this._setDraggableElement(target,point);
            hasSelection = true;
        }
        return hasSelection;
    }

    public pointerUp(target:HTMLElement,button:number,point:{x:number,y:number})
    {
        if(target != VioRender.canvasElement && target.hasAttribute('dropable'))
        {
            this._makeActionByDraggable(false,null,target);
        }
        if(target == VioRender.canvasElement && this._draggable.element && VioRender.scene)
        {
            let item = this._getRay(VioInput.getPositionByCursor(point.x,point.y).viewport,null,'Mesh') as RayParams;

            this._makeActionByDraggable(true,item,target);
        }
        this._resetDraggable();
    }

    public pointerMove(target:HTMLElement,button:number,point:{x:number,y:number})
    {
        const item = this._getRay(VioInput.getPositionByCursor(point.x,point.y).viewport,null,'Mesh') as RayParams;

        if(this._draggable.element)
        {
            if(this._draggable.is3DObject)
            {
                if(target != VioRender.canvasElement || !item)
                {
                    const x    = point.x+this._cursorOffset.x;
                    const y    = point.y+this._cursorOffset.y;
    
                    this._draggable.element.style.setProperty('left',x+'px');
                    this._draggable.element.style.setProperty('top' ,y+'px');
                    this._draggable.element.style.setProperty('display',this._draggable.elementDisplay);
                    this._plane.visible = false;
                }
                else if(item)
                {
                    this._draggable.element.style.setProperty('display','none');
                    this._plane.visible = true;
                    this._handler.position.copy(item.point);
                }
            }
            else
            {
                const x    = point.x+this._cursorOffset.x;
                const y    = point.y+this._cursorOffset.y;

                if(this._draggable.type == "dragHandler")
                {
                    this._draggable.element.style.setProperty('left',(x / this.uiScale)+'px');
                    this._draggable.element.style.setProperty('top' ,(y / this.uiScale)+'px');
                }
                else
                {
                    this._draggable.element.style.setProperty('left',x+'px');
                    this._draggable.element.style.setProperty('top' ,y+'px');
                }

                this._draggable.element.style.setProperty('display',this._draggable.elementDisplay);
                this._plane.visible = false;
            }
        }
    }
}