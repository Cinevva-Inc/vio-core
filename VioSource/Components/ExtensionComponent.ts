import { VioComponent } from "./Base/VioComponent";
import { VioObject } from "../Objects/VioObject/VioObject";

export class ExtensionComponent {
  static registerExtension(name:string, extension: any) {
    class Component extends VioComponent {
      extension: any;
      active: boolean = false;
      inited: boolean = false;
      funcs: any;
      slots: any;
      deps: Array<any>;
      constructor() {
        super(name)
        this.extension = extension;
        this.deps = extension.deps ?? [];
        this.slots = {}
        for (let slot of extension.slots || []) {
          this.slots[slot.code] = slot.default;
        }
        let funcs = Object.assign({}, extension.funcs)
        funcs.init = funcs.init ?? 'void(0)'
        funcs.term = funcs.term ?? 'void(0)'
        this.funcs = {}
        for (let name of Object.keys(funcs)) {
          let code = funcs[name];
          if (code?.trim()) {
            let args = ''
            switch (name) {
            case 'init': args = 'object'; break
            case 'tick': args = 'delta'; break
            }
            try {
              this.funcs[name] = eval(`
                ${name == 'init' ? 'async' : ''} (${args}) => {
                  try {
                    ${code}
                  }
                  catch (ex) {
                    console.error(ex)
                  }
                  finally {
                    ${name == 'init' ? 'this.inited = true' : ''}
                    ${name == 'term' ? 'this.inited = false' : ''}
                  }
                }
              `)
            }
            catch (ex) {
              console.error(ex)
            }
          }
        }
      }
      public getData():any {
        let data = super.getData() as any
        for (let slot of this.extension.slots || []) {
          data[slot.code] = this.slots[slot.code]
        }
        return data
      }
      public setData(data:any): void {
        super.setData(data)
        for (let slot of this.extension.slots || []) {
          this.slots[slot.code] = data[slot.code] ?? slot.default
        }
        if (this.active) {
          if (this.funcs.tune) {
            this.funcs.tune()
          }
          else {
            if (this.funcs.term)
              this.funcs.term()
            if (this.funcs.init)
              this.funcs.init()
          }
        }
      }
      public get missingDeps(): Array<any> {
        return this.deps.filter((dep:any) =>
          this.object &&
          !this.object!.getComponent(dep.uuid) &&
          !this.object!.getComponent(dep.load) &&
          !(window as any).app.activeEffects.includes(dep.uuid))
      }
      public get depsSatisified():boolean {
        return this.missingDeps.length == 0
      }
      get object() { return super.object }
      set object(object: VioObject|null) {
        if (this.object) {
          if (this.active) {
            this.active = false
            if (this.funcs.term)
              this.funcs.term();
          }
        }
        super.object = object
        if (this.object) {
          if (this.depsSatisified) {
            if (this.funcs.init)
              this.funcs.init(object);
            this.active = true
          }
        }
      }
      onComponentAdded(component: VioComponent) {
        if (!this.active) {
          if (this.depsSatisified) {
            if (this.funcs.init)
              this.funcs.init()
            this.active = true;
          }
        }
      }
      onComponentRemoved(component: VioComponent) {
        if (this.active) {
          if (!this.depsSatisified) {
            this.active = false;
            if (this.funcs.term)
              this.funcs.term()
          }
        }
      }
      update(delta:number) {
        if (this.active && this.inited) {
          if (this.funcs.tick)
            this.funcs.tick(delta);
        }
      }
      tune() {
        if (this.active) {
          if (this.funcs.tune)
            this.funcs.tune();
        }
      }
      step() {
        if (this.active && this.inited) {
          if (this.funcs.step)
            this.funcs.step();
        }
      }
    }
    VioComponent.registerComponent(name, Component)
  }
}


