import { VioCamera } from "../Singletons/Render/Camera/VioCamera";
import { IvioSerializable } from "./IvioSerializable";

export interface IvioCameraComponent extends IvioSerializable
{
	readonly object			:VioCamera | null;
	readonly componentName	:string;
	readonly editMode		:boolean;
	readonly exposable		:boolean;
	readonly listable		:boolean;

    update 			  		(delta:number):void;
	OnAdded			  		(object:VioCamera):void;
	OnRemoved		  		():void;
	Dispose					():void;
	setEditMode				(isInEdit:boolean):void,
}
