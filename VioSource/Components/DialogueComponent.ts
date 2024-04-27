import { VioObject    } from "../Objects/VioObject/VioObject";
import { VioHud       } from "../Singletons/Hud/VioHud";
import { AudioComponent } from "./AudioComponent";
import { VioComponent } from "./Base/VioComponent";
import { VioHudDialogPanel } from "../Objects/VioHud/VioHudDialogPanel";
import { VioResources } from "../Singletons/Resources/VioResources";
import { VioRender    } from "../Singletons/Render/VioRender";
import { Audio } from "three";
import { Howl, Howler } from 'howler'

export class DialogueComponent extends VioComponent
{
    protected _audioComponent : AudioComponent|null=null;
    public    displayName     :string = '';
    public    displayColor    :string = '#ffffff';
    public    speechTimeout   :number = 2;
    public    audio           :Audio|null = null;

    constructor() {
        super('DialogueComponent')
    }

    public setData(data:any)
    {
        this.displayName   = data.displayName   !== undefined ? data.displayName   : this.displayName;
        this.displayColor  = data.displayColor  !== undefined ? data.displayColor  : this.displayColor;
        this.speechTimeout = data.speechTimeout !== undefined ? data.speechTimeout : this.speechTimeout;
    }

    public getData():any
    {
        let obj      = super.getData() as any;

        obj.displayName   = this.displayName;
        obj.displayColor  = this.displayColor;
        obj.speechTimeout = this.speechTimeout;

        return obj;
    }

    public talk(textToTalk:string, audioSource:string = '', delay:number = 2, onHide:(()=>void) | null = null)
    {
        let dialog = VioHud.instance.getElementById('dialog') as VioHudDialogPanel;
        delay = delay ?? this.speechTimeout;

        let showDialog = () => {
            dialog.show(
                this.displayName || this.object!.name,
                textToTalk,
                delay,
                this.displayColor,
                this.displayColor,
                onHide);
        }

        if(dialog)
        {
            // console.log("audio source", audioSource)
            if (audioSource) {
                Howler.autoUnlock = false
                let sound = new Howl({
                    src: [audioSource],
                    format: ['m4a']
                });
                sound.play();
                sound.once('load', () => {
                    // console.log("sound loaded")
                    delay = Math.max(delay, sound.duration() + 0.2);
                    showDialog()
                });
                sound.once("loaderror", () => {
                    // console.log("sound failed to load")
                    showDialog()
                });

                (window as any).sound = sound;
            }
            else {
                showDialog()
            }
        }
        else if (onHide)
            onHide()
    }

}