import { module } from "./wasm/import_wasm";

export type backends = "CPU"  | "WASM";

export let current_backend:backends = "CPU";


export function setBackend(backend:backends){       
    switch (backend) {
        case "CPU":
            current_backend = "CPU";
            break;
            
        case "WASM":
            current_backend = "WASM";
            break;
    
        default:
            current_backend = "CPU";
            break;
    }

    return module();
}


