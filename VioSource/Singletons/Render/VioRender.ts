import { AmbientLight, HemisphereLight, AudioListener, Clock, Color, DirectionalLight, Mesh, PCFShadowMap, PCFSoftShadowMap, PerspectiveCamera, Scene, VSMShadowMap, WebGLRenderer, SRGBColorSpace, LinearSRGBColorSpace } from 'three';

import { EffectComposer, Pass  } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass            } from 'three/examples/jsm/postprocessing/RenderPass';
import { VioScene              } from '../../Objects/VioScene/VioScene';
import { VioEditMode           } from '../EditMode/VioEditMode';
import { VioInput              } from '../Input/VioInput';
import { VioRaycast            } from '../Raycast/VioRaycast';
import { VioScenarios          } from '../Scenarios/VioScenarios';
import { ThreePolyFills        } from './ThreePolyfills';
import { VioCamera             } from './Camera/VioCamera';

type OffscreenCanvas = any

export class VioRender
{
    private static _instance:VioRender;

    private   _frameID      :number  = 0;
    private   _enabled      :boolean = true;
    private   _antialias    :boolean = true;

    protected _canvas       :HTMLCanvasElement;
    protected _offScreen    :OffscreenCanvas;
    protected _elementRect  :DOMRect|null = null;

    // powerPreference: "high-performance"
    // renderer.physicallyCorrectLights
    protected _renderer     :WebGLRenderer|null = null;
    protected _rendererPass :RenderPass;
    protected _composer     :EffectComposer|null = null;
    protected _camera       :VioCamera;
    // protected _audioListener:AudioListener|null;
    protected _rootScene    :Scene;
    protected _scene        :VioScene|null = null;
    protected _clock        :Clock;
    protected _clearColor   :Color;
    protected _alpha        :number = 1;
    protected _elapsed      :number = 0;
    protected _interval     :number = 1/60;
    protected _perfomance   :{delta:number,fps   :number,times:Array<number>};
    protected _screenSize   :{width:number,height:number,dpi  :number};
    protected _onUpdate     :((delta:number)=>void)|null = null;

    private constructor()
    {
        let isMobileDevice = window.matchMedia("only screen and (max-width: 760px)").matches;

        if (isMobileDevice)
            this._interval = 1/30;

        ThreePolyFills.setPolyfills();

        let isIOS = /iPad|iPhone|iPod|Safari/.test(navigator.userAgent)

        this._canvas        = document.createElement('canvas');
        this._offScreen     = !isIOS && (this._canvas as any).transferControlToOffscreen ? (this._canvas as any).transferControlToOffscreen() : null;
        this._camera        = new VioCamera(this._onCameraModeChanged.bind(this));
        // this._audioListener = null;
        this._rootScene     = new Scene();
        this._clock         = new Clock();
        this._clearColor    = new Color();
        this._rendererPass  = new RenderPass( this._rootScene, this._camera.selectedCamera );
        // this._perfomance    = { delta:0, fps:0, times:[] };

        this._screenSize    = { width:0, height:0, dpi:1};

        this._rootScene.add(this._camera);
        // this._rootScene.add(this._directionalLight.target);

        // this._directionalLight.target.position.set(0,-5,-10);

        this._createRenderer();
        this._render();
    }

    private _createRenderer()
    {
        let dpi = this._screenSize.dpi;

        if(this._renderer)
        {
            this._renderer.dispose();
        }
        try {
            this._renderer = new WebGLRenderer({
                canvas:this._offScreen ? this._offScreen : this._canvas,
                antialias: this._antialias,
                alpha:false,
                preserveDrawingBuffer: false,
                // logarithmicDepthBuffer: true,
            });
        }
        catch (err) {
            this._offScreen = null
            this._renderer = new WebGLRenderer({
                canvas:this._canvas,
                antialias: this._antialias,
                alpha:false,
                preserveDrawingBuffer: false,
                // logarithmicDepthBuffer: true,
            });
        }
        this._composer = new EffectComposer(this._renderer);
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = PCFSoftShadowMap;
        this._renderer.outputColorSpace  = LinearSRGBColorSpace;
        this._renderer.info.autoReset = false
        // this._renderer.outputColorSpace  = SRGBColorSpace;
        // this._renderer.useLegacyLights = false;

        this._composer.renderer = this._renderer;
        // this._composer.renderToScreen = true;

        // this._renderer.setPixelRatio( dpi );
        // this._composer.setPixelRatio( dpi );
    }

    /*private _updatePerfomance(timeStamp:number = 0)
    {
        while (this._perfomance.times.length > 0 && this._perfomance.times[0] <= timeStamp - 1000)
        {
            this._perfomance.times.shift();
        }
        this._perfomance.times.push(timeStamp);

        this._perfomance.fps   = this._perfomance.times.length;
        this._perfomance.delta = this._clock.getDelta();
    }*/

    private _render(inAnimationLoop: boolean = false) {
        if (this._scene && this._camera) {
            this.render2(this._clock.getDelta())
        }
        // this._frameID = requestAnimationFrame( this._render.bind(this) );

        // if(this._scene && this._camera)
        // {
            // let delta = this._clock.getDelta();
            // this._perfomance.delta = delta;
            // this._scene.update(delta);
            // if(!VioEditMode.enabled) {
            //     this._camera.update(delta);
            //     VioScenarios.update(delta);
            // }
            // if(this._onUpdate) {
            //     this._onUpdate(delta);
            // }
            // this._renderer!.info.reset()
            // if(this._composer!.passes.length>0)
            //     this._composer!.render(this._perfomance.delta);
            // else
            //     this._renderer!.render( this._rootScene, this._camera.selectedCamera );

            // if(!VioEditMode.enabled)
            // {
            //     VioInput.update();
            // }

            // this._updatePerfomance(timeStamp);
            
            // this._elapsed += this._clock.getDelta();

            // let framesPassed = Math.round(this._elapsed / this._interval)
            // // console.log({framesPassed, inAnimationLoop})
            // if (!inAnimationLoop || framesPassed > 0) {

            //     let delta = framesPassed * this._interval
            //     this._elapsed -= delta

            //     if (delta > this._interval * 2)
            //         delta = this._interval * 2

            //     // if (!inAnimationLoop)
            //     //     delta = 0

            //     this._perfomance.delta = delta


            //     if (delta > 0) {
        
            //         this._scene.update(this._perfomance.delta);
                    
            //         if(!VioEditMode.enabled) {
            //             this._camera.update(this._perfomance.delta);
            //             VioScenarios.update(this._perfomance.delta);
            //         }
                    
            //         if(this._onUpdate)
            //             this._onUpdate(this._perfomance.delta);
            //     }


            //     this._renderer!.info.reset()
            //     if(this._composer!.passes.length>0)
            //         this._composer!.render(this._perfomance.delta);
            //     else
            //         this._renderer!.render( this._rootScene, this._camera.selectedCamera );

            //     if(!VioEditMode.enabled)
            //     {
            //         VioInput.update();
            //     }
            // }
        // }
    }

    public render2(delta:number) {
        // this._perfomance.delta = delta
        this._scene!.update(delta);
        this._camera.update(delta);
        VioScenarios.update(delta);

        if (this._onUpdate)
            this._onUpdate(delta);

        this._renderer!.info.reset()
        if(this._composer!.passes.length > 0)
            this._composer!.render(delta);
        else
            this._renderer!.render(this._rootScene, this._camera.selectedCamera);
        VioInput.update();
    }

    private _onCameraModeChanged(mode:any | undefined)
    {
        if(this._rendererPass.camera != this._camera.selectedCamera)
        {
            this._rendererPass.camera = this._camera.selectedCamera;
        }
    }

    public static get instance():VioRender
    {
        if(!VioRender._instance)
        {
            VioRender._instance = new VioRender();
        }
        return VioRender._instance;
    }
    
    public static get canvas()
    {
        if(this.instance._offScreen)
        {
            return this.instance._offScreen;
        }
        return this.instance._canvas;
    }

    public static get onScreenCanvas()
    {
        return this.instance._canvas;
    }


    public static get camera():VioCamera
    {
        return this.instance._camera;
    }

    public static get canvasElement():HTMLCanvasElement
    {
        return this.instance._canvas;
    }

    public static get canvasElementRect():DOMRect
    {
        if(!this.instance._elementRect)
        {
            this.instance._elementRect = this.canvasElement.getBoundingClientRect();
        }
        return this.instance._elementRect;
    }

    public static get rootScene()
    {
        return this.instance._rootScene;
    }

    // public static get audioListener()
    // {
    //     return this.instance._audioListener;
    // }

    // public static createAudioListener()
    // {
    //     if (!this.instance._audioListener) {
    //         this.instance._audioListener = new AudioListener();
    //         this.instance._camera.add(this._instance._audioListener);
    //     }
    // }

    // public static deleteAudioListener()
    // {
    //     if (this.instance._audioListener) {
    //         this.instance._camera.remove(this._instance._audioListener);
    //         this.instance._audioListener = null;
    //     }
    // }

    // public static resetAudioListener()
    // {
    //     this.deleteAudioListener();
    //     this.createAudioListener();
    // }

    public static get screenSize()
    {
        return this.instance._screenSize;
    }

    public static get scene()
    {
        return this.instance._scene!;
    }

    public static set scene(scene:VioScene)
    {
        if(this.instance._scene)
        {
            this.instance._rootScene.remove(this._instance._scene!);
        }
        this.instance._scene = scene;

        if(this.instance._scene)
        {
            this.instance._rootScene.add(this._instance._scene!);
        }
    }

    public static get clearColor()
    {
        this.instance._renderer!.getClearColor(this.instance._clearColor);

        return this.instance._clearColor.getHex().toString(16);
    }

    public static set clearColor(colorHex:string)
    {
        let hex = parseInt(colorHex[0] == '#' ? colorHex.slice(1,7) : colorHex,16);
        
        this.instance._clearColor.setHex(hex)
        this.instance._renderer!.setClearColor(this.instance._clearColor,this.instance._alpha);
    }

    public static get renderPasses():Array<Pass>
    {
        return this.instance._composer!.passes
    }
    
    public static get rendererPass():Pass
    {
        return this.instance._rendererPass
    }

    public static set renderPasses(passes:Array<Pass>)
    {
        this.instance._composer!.passes.length = 0;

        if(passes.length>0)
        {
            this._instance._onCameraModeChanged(undefined);
            this.instance._composer!.addPass(this.instance._rendererPass);
            this.instance._rendererPass.setSize(this.instance._screenSize.width,this.instance._screenSize.height);
            
            passes.forEach((postProcess:Pass)=>
            {
                this.instance._composer!.addPass(postProcess);
                postProcess.setSize(this.instance._screenSize.width,this.instance._screenSize.height);
            });
        }
    }

    public static addRenderPass(pass: Pass) {
        if (VioRender.renderPasses.length == 0)
            VioRender.renderPasses = [pass];
        else
            VioRender.renderPasses.push(pass);
    }

    public static removeRenderPass(pass: Pass) {
        let i = VioRender.renderPasses.indexOf(pass);
        if (i != -1)
            VioRender.renderPasses.splice(i, 1);
    }

    public static get enabled()
    {
        return this.instance._enabled;
    }

    public static set enabled(enabled:boolean)
    {
        this.instance._enabled = enabled;

        if(!enabled)
        {
            cancelAnimationFrame(this.instance._frameID);
            // this.instance._frameID = 0;
            this.instance._renderer!.setAnimationLoop(null);
        }
        else {
            this.instance._renderer!.setAnimationLoop(() => {
                this.instance._render(true)
            });
            // this.instance._frameID = requestAnimationFrame( this.instance._render.bind(this.instance) );
        }

        // this.instance._perfomance.times.length = 0;

        // this.instance._render();
    }

    public static get update()
    {
        return this.instance._onUpdate;
    }

    public static set update(callback:((delta:number)=>void)|null)
    {
        this.instance._onUpdate = callback;
    }

    public static resize(width:number, height:number, dpi:number = 1)
    {
        let inst = this.instance;

        inst._screenSize.width  = width;
        inst._screenSize.height = height;
        inst._screenSize.dpi    = dpi;

        if(inst._renderer)
        {
            inst._renderer.setPixelRatio( dpi );
            inst._renderer.setSize( width, height, false);
        }

        if(inst._composer)
        {
            inst._composer.setPixelRatio( dpi );
            inst._composer.setSize(width, height);
        }

        if(inst._camera)
        { 
            inst._camera.resize(width,height);
        }

        if(inst._canvas)
        {
			inst._canvas.style.width = width + 'px';
			inst._canvas.style.height = height + 'px';
        }
        
        inst._elementRect = this.canvasElement.getBoundingClientRect();
    }

    public static render() {
        this.instance._render()
    }

    public static get renderer(): WebGLRenderer {
        return this.instance._renderer!;
    }

    public static get composer(): EffectComposer {
        return this.instance._composer!;   
    }

    public static get mobileCheck() {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
      return check;
    }
}