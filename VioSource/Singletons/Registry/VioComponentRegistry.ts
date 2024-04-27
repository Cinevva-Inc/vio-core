import { AnimationComponent              } from "../../Components/AnimationComponent";
import { AnimationStatesComponent        } from "../../Components/AnimationStatesComponent";
import { ClickableComponent              } from "../../Components/ClickableComponent";
import { MeshComponent                   } from "../../Components/MeshComponent";
import { TaskBinderComponent             } from "../../Components/TaskBinderComponent";
import { TaskComponent                   } from "../../Components/TaskComponent";
import { VioComponent                    } from "../../Components/Base/VioComponent";
import { DialogueComponent               } from "../../Components/DialogueComponent";
import { AudioComponent                  } from "../../Components/AudioComponent";
import { LightComponent                  } from "../../Components/LightComponent";
import { ZoneComponent                  } from "../../Components/ZoneComponent";

export class VioComponentRegistry {
    public static hasComponent(name: string) {
        return VioComponent.hasComponent(name);
    }
    public static createComponent(name: string, data: any = {}) {
        return VioComponent.createComponent(name, data);
    }
    public static registerComponent(name: string, Component: any) {
        VioComponent.registerComponent(name, Component);
    }
    public static unregisterComponent(name: string) {
        VioComponent.unregisterComponent(name);
    }
    public static init() {
        VioComponent.registerComponent('AnimationComponent', AnimationComponent);
        VioComponent.registerComponent('AnimationStatesComponent', AnimationStatesComponent);
        VioComponent.registerComponent('AudioComponent', AudioComponent);
        VioComponent.registerComponent('ClickableComponent', ClickableComponent);
        VioComponent.registerComponent('MeshComponent', MeshComponent);
        VioComponent.registerComponent('TaskBinderComponent', TaskBinderComponent);
        VioComponent.registerComponent('TaskComponent', TaskComponent);
        VioComponent.registerComponent('DialogueComponent', DialogueComponent);
        VioComponent.registerComponent('LightComponent', LightComponent);
        VioComponent.registerComponent('ZoneComponent', ZoneComponent);
    }
}