import { IvioEventParams } from "./IvioEventParams";

export interface IvioEventListener
{
	listenEvent(event:string,handler:(params:IvioEventParams)=>void):void;
}
