import { VioObject } from "../Objects/VioObject/VioObject";

export interface IVioTask
{
	doTask	 :(delta: number)=>boolean
	setObject:(object:VioObject|null)=>void;
	dispose	 :()=>void;
}
