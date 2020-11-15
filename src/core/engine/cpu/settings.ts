import { IGPUSettings } from "gpu.js";

interface Settings {
    mode: "cpu_js" | "gpu",
    gpu_settings?:IGPUSettings
}

export let settings:Settings = {
    mode:"cpu_js",
    gpu_settings: {},
}
