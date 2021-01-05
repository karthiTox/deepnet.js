import * as autograd from "./core/engine/engine_entry";

export const deepnet = {    
    autograd:autograd,
    layers:{}
}

declare global {
    interface Window {
        deepnet: typeof deepnet;
    }
}
  
if (typeof window !== 'undefined') {
    window.deepnet = deepnet;
}
  
if (typeof module !== 'undefined') {
    module.exports = deepnet;
}