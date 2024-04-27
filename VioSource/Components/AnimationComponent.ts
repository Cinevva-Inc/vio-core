import { AnimationAction, AnimationClip, AnimationMixer, Object3D } from "three";
import { VioObject } from "./../Objects/VioObject/VioObject";
import { VioResources } from "./../Singletons/Resources/VioResources";
import { VioComponent } from "./Base/VioComponent";
import { MeshComponent } from "./MeshComponent";
import { VioHelpers } from "../Helpers/VioHelpers";
import { setAnimationClipDataData } from "../../VioCore";

// export type AnimationsData = {bindings:Record<string, string> | null, clips:Array<string>|Record<string,string>, default?:string, animationsUrl?:string};

let ObjectBindings:Record<string, string> = 
{
    "hips":"Hips",
    "leftupleg":"LeftUpLeg",
    "leftleg":"LeftLeg",
    "leftfoot":"LeftFoot",
    "lefttoebase":"LeftToeBase",
    "rightupleg":"RightUpLeg",
    "rightleg":"RightLeg",
    "rightfoot":"RightFoot",
    "righttoebase":"RightToeBase",
    "spine":"Spine",
    "spine1":"Spine1",
    "spine2":"Spine2",
    "leftshoulder":"LeftShoulder",
    "leftarm":"LeftArm",
    "leftforearm":"LeftForeArm",
    "lefthand":"LeftHand",
    "lefthandindex1":"LeftHandIndex1",
    "lefthandindex2":"LeftHandIndex2",
    "lefthandindex3":"LeftHandIndex3",
    "lefthandmiddle1":"LeftHandMiddle1",
    "lefthandmiddle2":"LeftHandMiddle2",
    "lefthandmiddle3":"LeftHandMiddle3",
    "lefthandpinky1":"LeftHandPinky1",
    "lefthandpinky2":"LeftHandPinky2",
    "lefthandpinky3":"LeftHandPinky3",
    "lefthandring1":"LeftHandRing1",
    "lefthandring2":"LeftHandRing2",
    "lefthandring3":"LeftHandRing3",
    "lefthandthumb1":"LeftHandThumb1",
    "lefthandthumb2":"LeftHandThumb2",
    "lefthandthumb3":"LeftHandThumb3",
    "neck":"Neck",
    "head":"Head",
    "rightshoulder":"RightShoulder",
    "rightarm":"RightArm",
    "rightforearm":"RightForeArm",
    "righthand":"RightHand",
    "righthandindex1":"RightHandIndex1",
    "righthandindex2":"RightHandIndex2",
    "righthandindex3":"RightHandIndex3",
    "righthandmiddle1":"RightHandMiddle1",
    "righthandmiddle2":"RightHandMiddle2",
    "righthandmiddle3":"RightHandMiddle3",
    "righthandpinky1":"RightHandPinky1",
    "righthandpinky2":"RightHandPinky2",
    "righthandpinky3":"RightHandPinky3",
    "righthandring1":"RightHandRing1",
    "righthandring2":"RightHandRing2",
    "righthandring3":"RightHandRing3",
    "righthandthumb1":"RightHandThumb1",
    "righthandthumb2":"RightHandThumb2",
    "righthandthumb3":"RightHandThumb3",

    "mixamorig:Hips":"Hips",
    "mixamorig:LeftUpLeg":"LeftUpLeg",
    "mixamorig:LeftLeg":"LeftLeg",
    "mixamorig:LeftFoot":"LeftFoot",
    "mixamorig:LeftToeBase":"LeftToeBase",
    "mixamorig:RightUpLeg":"RightUpLeg",
    "mixamorig:RightLeg":"RightLeg",
    "mixamorig:RightFoot":"RightFoot",
    "mixamorig:RightToeBase":"RightToeBase",
    "mixamorig:Spine":"Spine",
    "mixamorig:Spine1":"Spine1",
    "mixamorig:Spine2":"Spine2",
    "mixamorig:LeftShoulder":"LeftShoulder",
    "mixamorig:LeftArm":"LeftArm",
    "mixamorig:LeftForeArm":"LeftForeArm",
    "mixamorig:LeftHand":"LeftHand",
    "mixamorig:LeftHandIndex1":"LeftHandIndex1",
    "mixamorig:LeftHandIndex2":"LeftHandIndex2",
    "mixamorig:LeftHandIndex3":"LeftHandIndex3",
    "mixamorig:LeftHandMiddle1":"LeftHandMiddle1",
    "mixamorig:LeftHandMiddle2":"LeftHandMiddle2",
    "mixamorig:LeftHandMiddle3":"LeftHandMiddle3",
    "mixamorig:LeftHandPinky1":"LeftHandPinky1",
    "mixamorig:LeftHandPinky2":"LeftHandPinky2",
    "mixamorig:LeftHandPinky3":"LeftHandPinky3",
    "mixamorig:LeftHandRing1":"LeftHandRing1",
    "mixamorig:LeftHandRing2":"LeftHandRing2",
    "mixamorig:LeftHandRing3":"LeftHandRing3",
    "mixamorig:LeftHandThumb1":"LeftHandThumb1",
    "mixamorig:LeftHandThumb2":"LeftHandThumb2",
    "mixamorig:LeftHandThumb3":"LeftHandThumb3",
    "mixamorig:Neck":"Neck",
    "mixamorig:Head":"Head",
    "mixamorig:RightShoulder":"RightShoulder",
    "mixamorig:RightArm":"RightArm",
    "mixamorig:RightForeArm":"RightForeArm",
    "mixamorig:RightHand":"RightHand",
    "mixamorig:RightHandIndex1":"RightHandIndex1",
    "mixamorig:RightHandIndex2":"RightHandIndex2",
    "mixamorig:RightHandIndex3":"RightHandIndex3",
    "mixamorig:RightHandMiddle1":"RightHandMiddle1",
    "mixamorig:RightHandMiddle2":"RightHandMiddle2",
    "mixamorig:RightHandMiddle3":"RightHandMiddle3",
    "mixamorig:RightHandPinky1":"RightHandPinky1",
    "mixamorig:RightHandPinky2":"RightHandPinky2",
    "mixamorig:RightHandPinky3":"RightHandPinky3",
    "mixamorig:RightHandRing1":"RightHandRing1",
    "mixamorig:RightHandRing2":"RightHandRing2",
    "mixamorig:RightHandRing3":"RightHandRing3",
    "mixamorig:RightHandThumb1":"RightHandThumb1",
    "mixamorig:RightHandThumb2":"RightHandThumb2",
    "mixamorig:RightHandThumb3":"RightHandThumb3",

    "mixamorigHips.position":"Hips.position",
    "mixamorigHips.quaternion":"Hips.quaternion",
    "mixamorigSpine.quaternion":"Spine.quaternion",
    "mixamorigSpine1.quaternion":"Spine1.quaternion",
    "mixamorigSpine2.quaternion":"Spine2.quaternion",
    "mixamorigNeck.quaternion":"Neck.quaternion",
    "mixamorigHead.quaternion":"Head.quaternion",
    "mixamorigLeftShoulder.quaternion":"LeftShoulder.quaternion",
    "mixamorigLeftArm.quaternion":"LeftArm.quaternion",
    "mixamorigLeftForeArm.quaternion":"LeftForeArm.quaternion",
    "mixamorigLeftHand.quaternion":"LeftHand.quaternion",
    "mixamorigLeftHandThumb1.quaternion":"LeftHandThumb1.quaternion",
    "mixamorigLeftHandThumb2.quaternion":"LeftHandThumb2.quaternion",
    "mixamorigLeftHandThumb3.quaternion":"LeftHandThumb3.quaternion",
    "mixamorigLeftHandIndex1.quaternion":"LeftHandIndex1.quaternion",
    "mixamorigLeftHandIndex2.quaternion":"LeftHandIndex2.quaternion",
    "mixamorigLeftHandIndex3.quaternion":"LeftHandIndex3.quaternion",
    "mixamorigLeftHandMiddle1.quaternion":"LeftHandMiddle1.quaternion",
    "mixamorigLeftHandMiddle2.quaternion":"LeftHandMiddle2.quaternion",
    "mixamorigLeftHandMiddle3.quaternion":"LeftHandMiddle3.quaternion",
    "mixamorigLeftHandRing1.quaternion":"LeftHandRing1.quaternion",
    "mixamorigLeftHandRing2.quaternion":"LeftHandRing2.quaternion",
    "mixamorigLeftHandRing3.quaternion":"LeftHandRing3.quaternion",
    "mixamorigLeftHandPinky1.quaternion":"LeftHandPinky1.quaternion",
    "mixamorigLeftHandPinky2.quaternion":"LeftHandPinky2.quaternion",
    "mixamorigLeftHandPinky3.quaternion":"LeftHandPinky3.quaternion",
    "mixamorigRightShoulder.quaternion":"RightShoulder.quaternion",
    "mixamorigRightArm.quaternion":"RightArm.quaternion",
    "mixamorigRightForeArm.quaternion":"RightForeArm.quaternion",
    "mixamorigRightHand.quaternion":"RightHand.quaternion",
    "mixamorigRightHandThumb1.quaternion":"RightHandThumb1.quaternion",
    "mixamorigRightHandThumb2.quaternion":"RightHandThumb2.quaternion",
    "mixamorigRightHandThumb3.quaternion":"RightHandThumb3.quaternion",
    "mixamorigRightHandIndex1.quaternion":"RightHandIndex1.quaternion",
    "mixamorigRightHandIndex2.quaternion":"RightHandIndex2.quaternion",
    "mixamorigRightHandIndex3.quaternion":"RightHandIndex3.quaternion",
    "mixamorigRightHandMiddle1.quaternion":"RightHandMiddle1.quaternion",
    "mixamorigRightHandMiddle2.quaternion":"RightHandMiddle2.quaternion",
    "mixamorigRightHandMiddle3.quaternion":"RightHandMiddle3.quaternion",
    "mixamorigRightHandRing1.quaternion":"RightHandRing1.quaternion",
    "mixamorigRightHandRing2.quaternion":"RightHandRing2.quaternion",
    "mixamorigRightHandRing3.quaternion":"RightHandRing3.quaternion",
    "mixamorigRightHandPinky1.quaternion":"RightHandPinky1.quaternion",
    "mixamorigRightHandPinky2.quaternion":"RightHandPinky2.quaternion",
    "mixamorigRightHandPinky3.quaternion":"RightHandPinky3.quaternion",
    "mixamorigLeftUpLeg.quaternion":"LeftUpLeg.quaternion",
    "mixamorigLeftLeg.quaternion":"LeftLeg.quaternion",
    "mixamorigLeftFoot.quaternion":"LeftFoot.quaternion",
    "mixamorigLeftToeBase.quaternion":"LeftToeBase.quaternion",
    "mixamorigRightUpLeg.quaternion":"RightUpLeg.quaternion",
    "mixamorigRightLeg.quaternion":"RightLeg.quaternion",
    "mixamorigRightFoot.quaternion":"RightFoot.quaternion",
    "mixamorigRightToeBase.quaternion":"RightToeBase.quaternion"
}

export {ObjectBindings}

class PendingAnimationAction {
    public pending: boolean = true
    private _running: boolean = false
    private _weight: number = 1
    constructor(data:any = null) {
        this._running = data?.running ?? false
        this._weight = data?.weight ?? 1
    }
    public isRunning(): boolean {
        return this._running
    }
    public getClip(): AnimationClip|null {
        return null
    }
    public play() {
        this._running = true
    }
    public stop() {
        this._running = false
    }
    public get weight():number {
        return this._weight
    }
    public set weight(weight:number) {
        this._weight = weight
    }
}

type AnimationData = {
    name: string,
    action: AnimationAction|PendingAnimationAction|null,
    source: {url:string|null, clip:string, json:any, root:Object3D|null, bindings:Record<string,string>|null},
}

export class AnimationComponent extends VioComponent {
    private _animations: Array<AnimationData>
    private _meshComponent: MeshComponent|null
    private _boundingBoxUpdatePending: boolean = true
    private _boundingBoxUpdateRequested: boolean = false

    constructor() {
        super('AnimationComponent')
        this._animations = []
        this._meshComponent = null
    }

    private _replaceAction(animation: AnimationData, action: AnimationAction|null) {
        // we don't want to leave animation without action
        if (action) {
            action.weight = animation.action!.weight
            if (animation.action!.isRunning()) {
                action.play()
                this._boundingBoxUpdateRequested = true
            }
            animation.action = action
        }
    }

    public async setData(data:any) {
        this._animations = []
        for (let animation of data.animations ?? []) {
            if (animation.name && animation.source) {
                animation = Object.assign({}, animation)
                animation.action = new PendingAnimationAction(animation.action)
                let i = this._animations.findIndex(({name}) => animation.name == name)
                if (i != -1)
                    this._animations.splice(i, 1)
                this._animations.push(animation)
                this.loadAction(animation.source).then(
                    action => this._replaceAction(animation, action))
            }
        }
        super.setData(data)
    }

    public getData(): any {
        let data = super.getData()
        data.animations = this._animations.map(animation => ({
            name: animation.name,
            source: animation.source,
            action: {
                running: animation.action!.isRunning(),
                weight: animation.action!.weight
            }
        }))
        return data
    }

    update(delta: number): void {
        if (
            this._boundingBoxUpdatePending &&
            this._boundingBoxUpdateRequested &&
            this._meshComponent?.object)
        {
            this._boundingBoxUpdatePending = false
            VioHelpers.Mesh.getSizeAndPosition(this._meshComponent.object)
        }
    }

    public get animations(): Array<AnimationData> {
        return this._animations
    }

    public play(name:string, exclusive:boolean=false) {
        for (let animation of this._animations) {
            if (animation.name == name) {
                animation.action!.play()
                animation.action!.weight = 1
                this._boundingBoxUpdateRequested = true
            }
            else if (exclusive)
                animation.action!.stop()
        }
    }

    public stop(name:string) {
        for (let animation of this._animations)
            if (animation.name == name)
                animation.action!.stop()
    }

    public addAnimation(name:string, source:{url:string|null, clip:string, json:any, root:Object3D|null, bindings:Record<string,string>|null}) {
        console.log('addAnimation', name, source);
        let action = new PendingAnimationAction()
        this.removeAnimation(name)
        let animation = {name, action, source}
        this._animations.push(animation)
        this.loadAction(source).then(action => this._replaceAction(animation, action))
    }

    public removeAnimation(name:string) {
        // console.log('removeAnimation', name);
        this.stop(name)
        let i = this._animations.findIndex(animation => animation.name == name)
        if (i != -1) {
            let animation = this._animations[i]
            if (animation.action && animation.source.url) {
                let clip = animation.action.getClip()
                if (clip)
                    this._meshComponent!.animationMixer!.uncacheAction(clip)
            }
            this._animations.splice(i,1)
        }
    }

    public renameAnimation(oldName:string, newName:string) {
        let animation = this._animations.find(animation => animation.name == oldName)
        if (animation)
            animation.name = newName
    }

    private loadAction(source:{url:string|null, clip:string, json:any, root:Object3D|null, bindings:Record<string,string>|null}): Promise<AnimationAction|null> {
        return new Promise((resolve, reject) => {
            let meshComponent = this._meshComponent
            if (meshComponent) {
                meshComponent.isInitialized().then(async () => {
                    try {
                        if (source.json) {
                            let clip = new AnimationClip('', 0)
                            await setAnimationClipDataData(clip, source.json)
                            resolve(meshComponent.animationMixer!.clipAction(clip, source.root ?? meshComponent.meshObject!))
                        }
                        else if (source.url == null) {
                            resolve((meshComponent.animations ?? {}) [source.clip])
                        }
                        else {
                            let clip = await VioResources.getAnimation(source.url, source.clip, source.json, source.bindings ?? ObjectBindings)
                            if (clip)
                                resolve(meshComponent.animationMixer!.clipAction(clip, source.root ?? meshComponent.meshObject!))
                            else resolve(null)
                        }
                    }
                    catch (err:any) {
                        reject(err.message)
                    }
                })
            }
            else resolve(null)
        })
    }

    get object() { return this._object }
    set object(object: VioObject|null) {
        if (this.object)
            this.onRemoved()
        super.object = object
        if (this.object)
            this.onAdded(this.object)
    }

    onAdded(object: VioObject) {
        this._meshComponent = object.getComponentByType(MeshComponent) as MeshComponent
        if (this._meshComponent) {
            this._meshComponent.isInitialized().then(() => {
                for (let [name, action] of Object.entries(this._meshComponent!.animations ?? {}))
                    if (!this._animations.find(animation =>
                            animation.source.url == null &&
                            animation.source.clip == name))
                    {
                        let i = this._animations.findIndex(animation => animation.name == name)
                        if (i != -1)
                            this._animations.splice(i, 1)
                        this._animations.push({
                            name,
                            action,
                            source: {url:null, clip:name, json:null, root:null, bindings:null},
                        })
                    }
                for (let animation of this._animations)
                    if ((animation.action as any).pending)
                        this.loadAction(animation.source).then(
                            action => this._replaceAction(animation, action))
            })
        }
    }

    onRemoved() {
        for (let animation of this._animations) {
            if (animation.action) {
                animation.action.stop()
                if (animation.source.url) {
                    let clip = animation.action.getClip()
                    this._meshComponent!.animationMixer!.uncacheAction(clip!)
                }
                animation.action = null
            }
        }
        this._meshComponent = null
    }

    public get mixer(): AnimationMixer|null {
        return this._meshComponent?.animationMixer ?? null
    }

    public get initialized(): boolean {
        return !this._animations.some((animation:any) => animation.action.pending)
    }
}
