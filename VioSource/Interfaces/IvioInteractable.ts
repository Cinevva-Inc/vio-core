import { Vector3,Object3D, Face } from "three";
import { VioObject } from "../Objects/VioObject/VioObject";

export type RayParams = { distance:number, point:Vector3, face:Face, faceIndex:number, object:Object3D };

export interface IvioInteractable
{
	interactable: boolean;

	buttonMode  : boolean;

	object		: Object3D|null;

	onClick(buttonID:number, param:RayParams):void;

	onOver(param:RayParams):void;

	onOut():void;
}
