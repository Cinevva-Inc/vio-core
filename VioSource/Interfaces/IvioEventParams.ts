import { VioObject } from "../Objects/VioObject/VioObject";

export interface IvioEventParams
{
	readonly event	:string;
	readonly target	:any | null;
	readonly params :any | null;
}
