import { AnimationAction, AnimationClip, AnimationMixer, Group, Material, Bone } from "three";

export interface IvioModel
{
	mixer  :AnimationMixer | null;
	actions:Record<string,AnimationAction> | null;
	clips  :Array<AnimationClip>;
	object :Group;
	materials: Array<Material>;
	bones: Record<string, Bone>;
}
