import { GPU, IGPUKernelSettings, IKernelRunShortcut, IKernelSettings } from "gpu.js";
const gpu = new GPU

interface _kernal {
    name:string, 
    setting:IGPUKernelSettings,
    kernal:IKernelRunShortcut,
}

export const kernel = {
    kernels: <_kernal[]>[],
    
    makekernal: function(name:string, fn:any, settings:IKernelSettings):IKernelRunShortcut{                
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
    },

    destroy: function(name:string, setting?:IKernelSettings){
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

        this.kernels = this.kernels.filter(n => n);
    },

    destroyAll: function(){        
        this.kernels.forEach((k, i) => {
            k.kernal.destroy(true);
            delete this.kernels[i];
        })
        this.kernels = [];
    }
}