import { IvioEventParams } from '../../Interfaces/IvioEventParams';

type handlerObject = (params:IvioEventParams)=>void;

export class VioEvents
{
    private static _instance:VioEvents;

    protected _storedEvents : Map<string,Array<handlerObject>>;

    private constructor()
    {
        this._storedEvents = new Map<string,Array<handlerObject>>();
    }

    public static registerEvent(event:string, callback:(params:IvioEventParams)=>void)
    {
        if(!this.instance._storedEvents.has(event))
        {
            this.instance._storedEvents.set(event,new Array<handlerObject>());
        }
        this.instance._storedEvents.get(event)!.push(callback);
    }

    public static unregisterEvent(event:string,callback:(params:IvioEventParams)=>void)
    {
        if(this.instance._storedEvents.has(event))
        {
            let handlersArray = this.instance._storedEvents.get(event)!;

            for(let num = handlersArray.length - 1; num >= 0 ; num--)
            {
                if(handlersArray[num] == callback)
                {
                    this.instance._storedEvents.get(event)!.splice(num,1);
                }
            }
        }
    }

    public static broadcastEvent(event:string, params:any = null, target:any = null)
    {
        if(this.instance._storedEvents.has(event))
        {
            const eventParams = {event:event, target:target, params:params};

            this.instance._storedEvents.get(event)!.forEach((handlerItem:handlerObject)=>
            {
                handlerItem(eventParams);
            });
        }
    }

    private static get instance():VioEvents
    {
        if(!VioEvents._instance)
        {
            VioEvents._instance = new VioEvents();
        }
        return VioEvents._instance;
    }
}