import { VioHudElement              } from "../../Objects/VioHud/Elements/VioHudElement";
import { VioHudImage                } from "../../Objects/VioHud/Elements/VioHudImage";
import { VioHudText                 } from "../../Objects/VioHud/Elements/VioHudText";
// import { VioHudPanel                } from "../../Objects/VioHud/VioHudPanel";
import { VioHudLabel                } from "../../Objects/VioHud/VioHudLabel";
// import { VioHudButton               } from "../../Objects/VioHud/VioHudButton";
import { VioHudDialogPanel          } from "../../Objects/VioHud/VioHudDialogPanel";
// import { VioHudSelectionDialogPanel } from "../../Objects/VioHud/VioHudSelectionDialogPanel";
import { VioHudCursor               } from "../../Objects/VioHud/VioHudCursor";
import { VioHudInventory            } from "../../Objects/VioHud/VioHudInventory";

export class VioHudElementsRegistry
{
    private static _instance:VioHudElementsRegistry;

    private constructor() {
        VioHudElement.register('VioHudLabel', VioHudLabel)
        VioHudElement.register('VioHudImage', VioHudImage)
        VioHudElement.register('VioHudText', VioHudText)
        VioHudElement.register('VioHudCursor', VioHudCursor)
        VioHudElement.register('VioHudDialogPanel', VioHudDialogPanel)
        VioHudElement.register('VioHudInventory', VioHudInventory)
    }

    private _create(type: string, id: string|null = null, data: any = {}): VioHudElement|null {
        return VioHudElement.create(type, id, data)
    }

    public static create(type: string, id: string|null = null, data: any = {}) {
        return VioHudElementsRegistry.instance._create(type, id, data)
    }

    private static get instance():VioHudElementsRegistry
    {
        if(!VioHudElementsRegistry._instance)
            VioHudElementsRegistry._instance = new VioHudElementsRegistry();
        return VioHudElementsRegistry._instance;
    }

    public static init() {
        return VioHudElementsRegistry.instance != null
    }
}