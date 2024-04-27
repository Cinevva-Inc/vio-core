import { Audio, PositionalAudio } from "three";
import { VioRender    } from "./../Singletons/Render/VioRender";
import { VioObject    } from "../Objects/VioObject/VioObject";
import { VioComponent } from "./Base/VioComponent";
import { VioResources } from "./../Singletons/Resources/VioResources";

export class AudioComponent extends VioComponent
{
    private _audio3D      :PositionalAudio|null;
    private _audio2D      :Audio|null;
    private _audioSource  :string|null=null;
    private _currentBuffer:AudioBuffer|null=null;
    private _loop         :boolean = true;
    private _3dAudioActive:boolean = true;
    private _autoplay     :boolean = true;
    private _volume       :number  = 1;
    private _distance     :number  = 0.5;

    constructor()
    {
        super('AudioComponent');
        this._audio2D = null
        this._audio3D = null
        // this._audio2D = new Audio(VioRender.audioListener);
        // this._audio3D = new PositionalAudio(VioRender.audioListener);

        if(this.object)
        {
            // this.object.add(this._audio3D);
        }
    }


    public get audio()
    {
        return this._audioSource !== null ? this._audioSource : '';
    }

    public set audio(val:string)
    {
        this._audioSource = val;

        setTimeout(async ()=>
        {
            if(this._audioSource)
            {
                this._currentBuffer = await VioResources.getAudio(this._audioSource);
                this._updateAudios();
            }
        },0)
    }

    protected _updateAudios()
    {
        this.stop();
        if(this._3dAudioActive)
        {
            // this._audio3D.setBuffer(this._currentBuffer);
            // this._audio3D.setLoop(this._loop);
            // this._audio3D.setVolume(this._volume);
            // this._audio3D.setRefDistance(this._distance);
        }
        else
        {
            // this._audio2D.setBuffer(this._currentBuffer);
            // this._audio2D.setLoop(this._loop);
            // this._audio2D.setVolume(this._volume);
        }
        
        if(this._autoplay)
        {
            this.play();
        }
    }

    public setData(data:any)
    {
        this.loop     = data.loop     !== undefined ? data.loop     : this.loop;
        this.autoplay = data.autoplay !== undefined ? data.autoplay : this.autoplay;
        this.area     = data.area     !== undefined ? data.area     : this.area;
        this.volume   = data.volume   !== undefined ? data.volume   : this.volume;
        this.audio3D  = data.audio3D  !== undefined ? data.audio3D  : this.audio3D;
        this.audio    = data.audio    !== undefined ? data.audio    : this.audio;
    }

    public getData():any
    {
        let obj      = super.getData() as any;
        obj.loop     = this.loop;
        obj.autoplay = this.autoplay;
        obj.area     = this.area;
        obj.volume   = this.volume;
        obj.audio3D  = this.audio3D;
        obj.audio    = this.audio;

        return obj;
    }

    public stop()
    {
        // if(this._audio2D.isPlaying)
        // {
        //     this._audio2D.stop();
        // }
        // if(this._audio3D.isPlaying)
        // {
        //     this._audio3D.stop();
        // }
    }

    public play()
    {
        // if(this._3dAudioActive)
        // {
        //     this._audio3D.play();
        // }
        // else
        // {
        //     this._audio2D.play();
        // }
    }

    public playAudio(source:string)
    {
        this._audioSource = source;

        setTimeout(async ()=>
        {
            if(this._audioSource)
            {
                this._currentBuffer = await VioResources.getAudio(this._audioSource);
                this._updateAudios();
                this.play();
            }
        },0)
    }

    public get autoplay()
    {
        return this._autoplay;
    }

    public set autoplay(val:boolean)
    {
        this._autoplay = val;
    }

    public get loop()
    {
        return this._loop;
    }

    public set loop(val:boolean)
    {
        this._loop = val;
    }

    public get area()
    {
        return this._distance;
    }

    public set area(val:number)
    {
        this._distance = val;
    }

    public get volume()
    {
        return this._volume;
    }

    public set volume(val:number)
    {
        this._volume = val;
    }

    public get audio3D()
    {
        return this._3dAudioActive;
    }

    public set audio3D(val:boolean)
    {
        this._3dAudioActive = val;
        this._updateAudios();
    }
}