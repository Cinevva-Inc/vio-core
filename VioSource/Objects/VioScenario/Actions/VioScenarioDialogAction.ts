import { DialogueComponent    } from "../../../Components/DialogueComponent";
import { ExposedPropertiesObject } from "../../../Exposables/Types/ExposableProperties";
import { VioScenarioActionBase} from "../../../Singletons/Scenarios/Scenario/_Base/VioScenarioActionBase";
import { TriggerTask          } from "../../VioTasks/VioTask/TaskObject/TriggerTask";
import { VioHud, VioHudElement } from "../../../../VioCore"

export class VioScenarioDialogAction extends VioScenarioActionBase
{
    public textToTalk : Array<{whoID:string, text:string, audio:string, delay:number, voice:any}>;
    private panel: VioHudElement

    constructor()
    {
        super('DialogueObject');
        this.textToTalk = [];
        this.panel = new VioHudElement
        this.panel.element.className = "dialogue-panel"
        this.panel.element.innerHTML = `
          <label></label>
          <p></p>
          `
    }

    protected _generateData():any
    {
        let obj  :any  = super._generateData();
        obj.textToTalk = this.textToTalk;

        return obj;
    }

    public setData(data: any): void 
    {
        super.setData(data);
        this.textToTalk = data.textToTalk;
    }

    public addText(whoID:string, text:string, audio:string, delay:number = 2, voice = null)
    {
        this.textToTalk.push({whoID:whoID, text:text, audio:audio, delay, voice});
    }

    public override execute(): void 
    {
        this.clearTasks();
        this.textToTalk.forEach(item=>
        {
            this.addTask(new TriggerTask(async (finish:() => void)=> {
                let obj   = this._getObjectByID(item.whoID);
                let text  = item.text;
                let audio = item.audio;
                let delay = item.delay;
                this.panel.parent = VioHud.instance
                this.panel.element.querySelector('label')!.textContent = obj?.meta?.name ?? ''
                this.panel.element.querySelector('p')!.textContent = text
                let dialogue = obj?.getComponentByType(DialogueComponent) as DialogueComponent;
                if (dialogue) {
                    if (dialogue.displayName)
                        this.panel.element.querySelector('label')!.textContent = dialogue.displayName
                    if (dialogue.displayColor) {
                        this.panel.element.querySelector('label')!.style.color = dialogue.displayColor
                        this.panel.element.querySelector('p')!.style.color = dialogue.displayColor
                    }

                }
                if (audio) {
                    Howler.autoUnlock = false
                    let sound = new Howl({
                        src: [audio],
                        format: ['m4a']
                    });
                    delay = await new Promise(resolve => {
                        sound.once('play', () => resolve(sound.duration() + 0.2))
                        sound.once('playerror', () => resolve(delay))
                        sound.play();
                    })
                }
                await new Promise(resolve => setTimeout(resolve, delay * 1000))
                this.panel.parent = null
                finish()
            }))
        });
        super.execute();
    }
}