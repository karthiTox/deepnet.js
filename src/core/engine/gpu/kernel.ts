import { GPU, IGPUKernelSettings, IKernelRunShortcut, IKernelSettings } from "gpu.js";
const gpu = new GPU

interface _kernal {
    name:string, 
    setting:IGPUKernelSettings,
    kernal:IKernelRunShortcut,
}

export class kernels{
    private static kernels:_kernal[] = [];

    static makekernal(name:string, fn:any, settings:IKernelSettings):IKernelRunShortcut{                
        for (let k = 0; k < this.kernels.length; k++) {
            if(this.kernels[k])
                if(this.kernels[k].name == name)
                    if(JSON.stringify(this.kernels[k].setting) == JSON.stringify(settings))
                        return this.kernels[k].kernal;                                         
        }

        const kernal:_kernal = {
            name: name,
            setting: settings,
            kernal: gpu.createKernel(fn, settings)
        }

        this.kernels.push(kernal);        
        return kernal.kernal;
    }

    static destroy(name:string, setting?:IKernelSettings){
        this.kernels.forEach((k, i) => {
            if(k){
                if(k.name == name){
                    if(setting){
                        if(JSON.stringify(this.kernels[i].setting) == JSON.stringify(setting)){
                            k.kernal.destroy(true);
                            delete this.kernels[i];
                        }
                    }
                    else{
                        k.kernal.destroy(true);
                        delete this.kernels[i];
                    }
                }
            }            
        })
    }

    static destroyAll(){        
        this.kernels.forEach((k, i) => {
            k.kernal.destroy(true);
            delete this.kernels[i];
        })
        this.kernels = [];
    }
}