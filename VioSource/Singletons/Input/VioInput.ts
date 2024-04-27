import { VioEditMode } from '../EditMode/VioEditMode';
import { VioEvents } from '../Events/VioEvents';
import { VioRender } from '../Render/VioRender';

export type Vector      = {x:number,y:number};
export type PointerData = {type:string,interactionType:string, identifier:number, button:number, target:any, rawPosition:Vector, position:Vector, normalized:Vector, viewport:Vector, interactions:TouchList | null}

export class VioInput
{
    private static _instance:VioInput;

    private _pressedKeys      : Array<string>;
    private _bindings         : Map<string,Array<string>>;
    private _bufferedPosition : {position:Vector,normalized:Vector,viewport:Vector};
    private _mousePosition    : {position:Vector,normalized:Vector,viewport:Vector};
    private _mousePressed     : Array<number>;
    private _mouseUp          : Array<number>;
    private _pointerBuffer    : PointerData|null=null;
    private _wheelMove        : Vector;
    private _pointerListeners : Array<(data:PointerData)=>void>;
    private _keyListeners     : Array<(type:string,keys:Array<string>)=>void>;
    private _onPointerMove    : Array<(data:PointerData)=>void>;

    private constructor()
    {
        this._bindings          = new Map<string,Array<string>>();
        this._onPointerMove     = [];
        this._pressedKeys       = [];
        this._mousePressed      = [];
        this._mouseUp           = [];
        this._pointerListeners  = [];
        this._keyListeners      = [];
        this._bufferedPosition  = {position:{x:-1,y:-1},normalized:{x:-1,y:-1},viewport:{x:-1,y:-1}};
        this._mousePosition     = {position:{x:-1,y:-1},normalized:{x:-1,y:-1},viewport:{x:-1,y:-1}};
        this._wheelMove         = {x:0,y:0};

        window.addEventListener('keydown'   ,this.onKey.bind(this));
        window.addEventListener('keyup'     ,this.onKey.bind(this));

        window.addEventListener('mousedown' ,this._onMouse.bind(this));
        window.addEventListener('mouseup'   ,this._onMouse.bind(this));
        window.addEventListener('mousemove' ,this._onMouse.bind(this));

        // window.addEventListener('touchstart',this._onTouch.bind(this));
        // window.addEventListener('touchend'  ,this._onTouch.bind(this));
        // window.addEventListener('touchmove' ,this._onTouch.bind(this));
        
        VioRender.canvasElement.addEventListener('wheel'       ,this.onMouseWheel .bind(this));
        VioRender.canvasElement.addEventListener('contextmenu' ,this.onContextMenu.bind(this));
    }

    _clearPointerBuffer()
    {
        if(!this._pointerBuffer)
        {
            this._pointerBuffer = {type:'',interactionType:'',button:-1,identifier:-1,rawPosition:{x:-1,y:-1},position:{x:-1,y:-1},normalized:{x:-1,y:-1},viewport:{x:-1,y:-1},target:null,interactions:null};
        }
        this._pointerBuffer!.type            = '';
        this._pointerBuffer!.interactionType = '';
        this._pointerBuffer!.button          = -1;
        this._pointerBuffer!.identifier      = -1;
        this._pointerBuffer!.rawPosition.x   = -1;
        this._pointerBuffer!.rawPosition.y   = -1; 
        this._pointerBuffer!.position.x      = -1;
        this._pointerBuffer!.position.y      = -1; 
        this._pointerBuffer!.normalized.x    = -1;
        this._pointerBuffer!.normalized.y    = -1; 
        this._pointerBuffer!.viewport.x      = -1;
        this._pointerBuffer!.viewport.y      = -1; 
        this._pointerBuffer!.target          = null;
        this._pointerBuffer!.interactions    = null;
    }

    _onTouch(e:TouchEvent)
    {
        console.log("_onTouch", e)
        if(!VioInput.isTouchEnabled)
        {
            return;
        }

        let PosX          = this._pointerBuffer ? this._pointerBuffer.rawPosition.x : -1;
        let PosY          = this._pointerBuffer ? this._pointerBuffer.rawPosition.y : -1;
        let oldIdentifier = this._pointerBuffer ? this._pointerBuffer.identifier    : -1;

        this._clearPointerBuffer();
        
        if(e.type == 'touchstart' && oldIdentifier == -1)
        {
            this._pointerBuffer!.identifier = e.changedTouches[e.changedTouches.length-1].identifier;
        }
        
        let touch = e.changedTouches.length-1;

        if(e.type == 'touchmove')
        {
            // for(let num = 0; num < e.touches.length; num++)
            // {
            //     if(e.touches[num].identifier == this._pointerBuffer.identifier)
            //     {
            //         touch = num;
            //         break;
            //     }
            // }
        }

        PosX = e.changedTouches[touch] ? e.changedTouches[touch].clientX : PosX;
        PosY = e.changedTouches[touch] ? e.changedTouches[touch].clientY : PosY;

        const pos = VioInput.getPositionByCursor(PosX,PosY);

        this._pointerBuffer!.type            = e.type == 'touchmove' ? 'move' : (e.type == 'touchstart' ? 'down' : 'up');
        this._pointerBuffer!.interactionType = 'touch';
        this._pointerBuffer!.button          = touch;
        this._pointerBuffer!.target          = document.elementFromPoint(PosX,PosY);
        this._pointerBuffer!.rawPosition.x   = PosX;
        this._pointerBuffer!.rawPosition.y   = PosY;
        this._pointerBuffer!.position.x      = pos.position.x;
        this._pointerBuffer!.position.y      = pos.position.y;
        this._pointerBuffer!.normalized.x    = pos.normalized.x;
        this._pointerBuffer!.normalized.y    = pos.normalized.y;
        this._pointerBuffer!.viewport.x      = pos.viewport.x;
        this._pointerBuffer!.viewport.y      = pos.viewport.y;

        this.onPointer(this._pointerBuffer!);
    }

    _onMouse(e:MouseEvent)
    {
        if(VioInput.isTouchEnabled)
        {
            return;
        }

        let button = VioEditMode.enabled ? e.type == 'mousemove' ? (this._pointerBuffer ? this._pointerBuffer.button :  -1) : (e.type == 'mousedown' ? e.button : -1) : e.button;
        this._clearPointerBuffer();

        const pos  = VioInput.getPositionByCursor(e.clientX,e.clientY);

        this._pointerBuffer!.type            = e.type == 'mousemove' ? 'move' : (e.type == 'mousedown' ? 'down' : 'up');
        this._pointerBuffer!.interactionType = 'mouse';
        this._pointerBuffer!.button          = button;
        this._pointerBuffer!.target          = e.target;
        this._pointerBuffer!.rawPosition.x   = e.clientX;
        this._pointerBuffer!.rawPosition.y   = e.clientY;
        this._pointerBuffer!.position.x      = pos.position.x;
        this._pointerBuffer!.position.y      = pos.position.y;
        this._pointerBuffer!.normalized.x    = pos.normalized.x;
        this._pointerBuffer!.normalized.y    = pos.normalized.y;
        this._pointerBuffer!.viewport.x      = pos.viewport.x;
        this._pointerBuffer!.viewport.y      = pos.viewport.y;

        this.onPointer(this._pointerBuffer!);
    }

    onContextMenu(e:Event)
    {
        // e.preventDefault();
    }

    onMouseWheel(e:WheelEvent)
    {
        this._wheelMove.x = e.deltaX > 0 ? 1 : -1;
        this._wheelMove.y = e.deltaY > 0 ? 1 : -1;
    }

    onPointer(e:PointerData)
    {
        // console.log("onPointer", e)

        this._pointerListeners.forEach(listener=>
        {
            listener(e);
        });
        
        this._mousePosition.position.x   = e.position.x;
        this._mousePosition.position.y   = e.position.y;

        this._mousePosition.normalized.x = e.normalized.x;
        this._mousePosition.normalized.y = e.normalized.y;

        this._mousePosition.viewport.x   = e.viewport.x;
        this._mousePosition.viewport.y   = e.viewport.y;

        if(e.target == VioRender.canvasElement)
        {
            switch(e.type)
            {
                case 'down':
                {
                    if(!this._mousePressed.includes(e.button))
                    {
                        this._mousePressed.push(e.button);
                    }
                    break;
                }
                case 'up':
                {
                    let index = this._mousePressed.indexOf(e.button);
        
                    if(index>=0)
                    {
                        this._mousePressed.splice(index,1);
        
                        this._mouseUp.push(e.button);

                        VioEvents.broadcastEvent('viewportClick',this._pointerBuffer);
                    }
                    break;
                }
                case 'move':
                {
                    break;
                }
            }
        }
            
        this._onPointerMove.forEach(listener=>
        {
            listener(this._pointerBuffer!);
        });
    }

    onKey(e:KeyboardEvent)
    {
        // if(document.activeElement == document.body)
        // {
            // e.preventDefault();
        // }
        // else
        // {
            // return;
        // }

        let key = e.code?.replace('Key','')?.toUpperCase();
        
        if(e.type == 'keydown')
        {
            if(!this._pressedKeys.includes(key))
            {
                this._pressedKeys.push(key);

                this._keyListeners.forEach(listener=>
                {
                    listener('down',VioInput.pressedKeys);
                });
            }
        }
        else
        {
            let index = this._pressedKeys.indexOf(key);

            if(index>=0)
            {
                this._pressedKeys.splice(index,1);

                this._keyListeners.forEach(listener=>
                {
                    listener('up',VioInput.pressedKeys);
                });
            }
        }
    }

    private static get instance():VioInput
    {
        if(!VioInput._instance)
        {
            VioInput._instance = new VioInput();
        }
        return VioInput._instance;
    }

    public static get isTouchEnabled()
    {
        return false;
        // return ( 'ontouchstart' in window ) || ((navigator as any).maxTouchPoints > 0 ) || ((navigator as any).msMaxTouchPoints > 0);
    }

    public static get mousePosition():{x:number,y:number}
    {
        return this.instance._mousePosition.position;
    }

    public static get mousePositionNormalized():{x:number,y:number}
    {
        return this.instance._mousePosition.normalized;
    }

    public static get mouseViewportPosition():{x:number,y:number}
    {
        return this.instance._mousePosition.viewport;
    }

    public static get clickedMouseButtons():Array<number>
    {
        return this.instance._mouseUp;
    }

    public static get pressedKeys()
    {
        return this.instance._pressedKeys;
    }

    public static get bindings()
    {
        return this.instance._bindings;
    }

    public static get onPointerMove()
    {
        return this.instance._onPointerMove;
    }

    public static click(buttonID:number):boolean
    {
        return this.instance._mouseUp.includes(buttonID);
    }

    public static getMouseButton(buttonID:number):boolean
    {
        return this.instance._mousePressed.includes(buttonID);
    }

    public static keyPressed(key:string):boolean
    {
        return this.instance._pressedKeys.includes(key.toUpperCase());
    }
    
    public static KeysPressed(keys:Array<string> | Array<Array<string>>)
    {
        let isPressed = false;
        if(keys && keys.length)
        {
            isPressed = true;
            for(let num = 0; num < keys.length; num++)
            {
                let obj = keys[num];
                
                if(Array.isArray(obj))
                {
                    isPressed = false;
                    if(this.KeysPressed(obj))
                    {
                        isPressed = true;
                        break;
                    }
                }
                else
                {
                    if(!this.keyPressed(obj))
                    {
                        isPressed = false;
                    }
                }
            }
        }
        return isPressed;
    }

    public static pressed(keyWord:string):boolean
    {
        if(this.instance._bindings.has(keyWord))
        {
            let includes:boolean = false;
            this.instance._pressedKeys.forEach(key=>
            {
                if(this.instance._bindings.get(keyWord)!.includes(key))
                {
                    includes = true;
                }
            });
            return includes;
        }
        return false;
    }

    public static addBindingKeys(keyWord:string,keys:string[])
    {
        keys.forEach(key=>
        {
            this.addBinding(keyWord,key);
        });
    }

    public static addBinding(keyWord:string,key:string)
    {
        if(!this.instance._bindings.has(keyWord))
        {
            this.instance._bindings.set(keyWord,new Array<string>());
        }
        this.instance._bindings.get(keyWord)!.push(key.toUpperCase());
    }

    public static removeBinding(keyWord:string,key:string)
    {
        if(this.instance._bindings.has(keyWord))
        {
            const index:number = this.instance._bindings.get(keyWord)!.indexOf(key.toUpperCase());

            if(index>-1)
            {
                this.instance._bindings.get(keyWord)!.splice(index,1);
            }
        }
    }

    public static clearBinding(keyWord:string)
    {
        if(this.instance._bindings.has(keyWord))
        {
            this.instance._bindings.delete(keyWord);
        }
    }

    public static registerKeyEvent(listener:(type:string,keys:Array<string>)=>void)
    {
        if(!this.instance._keyListeners.includes(listener))
        {
            this.instance._keyListeners.push(listener);
        }
    }
    
    public static unregisterKeyEvent(listener:(type:string,keys:Array<string>)=>void)
    {
        const index = this.instance._keyListeners.indexOf(listener);

        if(index>=0)
        {
            this.instance._keyListeners.splice(index,1);
        }
    }

    public static registerPointerEvent(listener:(data:PointerData)=>void)
    {
        if(!this.instance._pointerListeners.includes(listener))
        {
            this.instance._pointerListeners.push(listener);
        }
    }
    
    public static unregisterPointerEvent(listener:(data:PointerData)=>void)
    {
        const index = this.instance._pointerListeners.indexOf(listener);

        if(index>=0)
        {
            this.instance._pointerListeners.splice(index,1);
        }
    }

    public static clearPointerEventListeners()
    {
        this.instance._pointerListeners.length = 0;
    }

    public static update()
    {
        this.instance._wheelMove.x = this.instance._wheelMove.y = 0;

        this.instance._mouseUp.length = 0;
    }

    public static getPositionByCursor(pointX:number,pointY:number):{position:Vector,normalized:Vector,viewport:Vector}
    { 
        const rect:DOMRect = VioRender.canvasElementRect;
         
        this.instance._bufferedPosition.position.x   =   pointX - rect.left;
        this.instance._bufferedPosition.position.y   =   pointY - rect.top;

        this.instance._bufferedPosition.normalized.x =   this.instance._bufferedPosition.position.x / rect.width;
        this.instance._bufferedPosition.normalized.y =   this.instance._bufferedPosition.position.y / rect.height;

        this.instance._bufferedPosition.viewport.x   =   this.instance._bufferedPosition.normalized.x * 2 - 1;
        this.instance._bufferedPosition.viewport.y   = - this.instance._bufferedPosition.normalized.y * 2 + 1;

        return this.instance._bufferedPosition;
    }
}