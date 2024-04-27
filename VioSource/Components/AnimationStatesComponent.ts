import { VioComponent } from "./Base/VioComponent";
import { VioObject } from "../Objects/VioObject/VioObject";
import { AnimationAction } from "three";
import { ExposedPropertiesObject } from "../Exposables/Types/ExposableProperties";
import { AnimationComponent } from "./AnimationComponent";
import { VioHelpers } from "../Helpers/VioHelpers";

export type AnimationState = {
    name: string,
    loop: boolean,
    fade: number,
    animation: string,
}

export class AnimationStatesComponent extends VioComponent {
    private _state: string|null
    private _states: Array<AnimationState>

    constructor() {
        super('AnimationStatesComponent')
        this._state = null
        this._states = []
    }

    public async setData(data:any) {
        this._state = data.state ?? null
        this._states = data.states ?? []
        // migration from previous format
        if (data.data) {
            for (let name in data.data) {
                let entry = data.data[name] as any
                if (entry.actionName) {
                    this._states.push({
                        name,
                        loop: entry.loop,
                        fade: 1 / entry.fade,
                        animation: entry.actionName
                    })
                    if (entry.default)
                        this._state = name
                }
            }
        }
        super.setData(data)
    }

    public getData(): any {
        let data = super.getData()
        data.state = this._state
        data.states = this._states
        return data
    }

    public get state(): string {
        return this._state!
    }

    public set state(state:string) {
        if (this._state != state) {
            console.log("state", state)
            this._state = state
        }
    }

    public get states(): Array<AnimationState> {
        return this._states
    }

    update(delta: number) {
        super.update(delta)
        if (this._state == null)
            return
        let animationComponent = this.object!.getComponentByType(AnimationComponent) as AnimationComponent
        if (animationComponent) {
            let runningActions: Array<any> = []
            for (let animation of animationComponent.animations) {
                let state = this._states.find(state => state.animation == animation.name)
                // the animation is controlled by state and is ready to play
                if (state && animation.action) {
                    if (state.name == this._state) {
                        if (animation.action.isRunning()) {
                            if (state.fade > 0)
                                animation.action.weight = Math.min(1, animation.action.weight + delta / state.fade)
                            else
                                animation.action.weight = 1
                        }
                        else {
                            animation.action.play()
                            animation.action.weight = state.fade > 0 ? Math.min(1, delta / state.fade) : 1;
                            (animationComponent as any)._boundingBoxUpdateRequested = true
                        }
                    }
                    else {
                        if (animation.action.isRunning()) {
                            if (state.fade > 0)
                                animation.action.weight = Math.max(0, animation.action.weight - delta / state.fade)
                            else
                                animation.action.weight = 0
                            if (animation.action.weight == 0) {
                                animation.action.stop()
                            }
                        }
                    }
                    if (animation.action.isRunning())
                        runningActions.push(animation!.action)
                }
            }
            let totalWeight = 0
            for (let action of runningActions)
                totalWeight += action.weight
            if (totalWeight > 0)
                for (let action of runningActions)
                    action.weight *= 1 / totalWeight
        }
    }
}
