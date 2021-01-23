import { ops_cpu as op_cpu} from "./cpu/tensor_ops";

export let ops_cpu = op_cpu;

export function cpu(){
    return Promise.resolve(new op_cpu);    
}