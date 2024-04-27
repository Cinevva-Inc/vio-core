import { Vector2 } from "three";
import { Pass } from "three/examples/jsm/postprocessing/Pass";
// import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass";
// import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
// import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass';
// import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader';
// import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
// import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

import { VioRender } from "../Render/VioRender";

export {
    // SAOPass, GlitchPass, UnrealBloomPass, RenderPixelatedPass, DotScreenShader, RGBShiftShader, OutlinePass
}

export class VioPostProcessing
{
    private static _instance:VioPostProcessing;

    private _effects:Map<string,Pass>;
    private _activeEffects:Array<string>;
    private _availableEffects:Array<string> = ['bloom','ssao','glitch', 'pixelated','outline'];

    private constructor()
    {
        this._activeEffects = [];
        this._effects = new Map<string,Pass>();
    }

    public static getEffect(name:string,props:any)
    {
        return this.instance._effects.get(name);
    }

    public static activateEffects(effects:Array<{name:string,props:any}>)
    {
        VioRender.renderPasses.length = 0;
        this.instance._activeEffects.length = 0;

        let fx:Array<Pass> = [];
        effects.forEach(effect=>
        {
            if(this.availableEffects.includes(effect.name))
            {
                fx.push(this.getEffect(effect.name,effect.props) as Pass);
                this.instance._activeEffects.push(effect.name);
            }
        });
        // console.log("FF",fx);
        VioRender.renderPasses = fx;
    }

    public static get availableEffects()
    {
        return this.instance._availableEffects;
    }
    
    public static get effects(): Map<string,Pass> {
        return this.instance._effects
    }

    public static get activeEffects(): Array<string> {
        return this.instance._activeEffects;
    }

    public static get data()
    {
        const obj:Array<any> = [];

        this.instance._activeEffects.forEach(effectName=>
        {
            if(this.instance._effects.has(effectName))
            {
                let props = {} as any;
                obj.push({name:effectName,props:props});
            }
        });

        return obj;
    }

    private static get instance():VioPostProcessing
    {
        if(!VioPostProcessing._instance)
        {
            VioPostProcessing._instance = new VioPostProcessing();
        }
        return VioPostProcessing._instance;
    }
}