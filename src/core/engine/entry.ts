import * as backs from "./ops"
import * as layers from "./layers"

export let deepnet = {
    platforms: backs,
    nn: layers
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