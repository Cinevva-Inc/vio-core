import { Vector3,Object3D, Face, Euler } from "three";
import { VioObject } from "../Objects/VioObject/VioObject";

export interface IvioProjectile
{
    destroy():void;

	fire(owner:VioObject,dir?:Euler):void;

	object:VioObject|null;

	isProjectile:boolean;
}
