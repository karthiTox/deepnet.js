import * as nn from "./entry_layers";
import * as dn from "../core/engine/engine_entry";


const linear = nn.Linear(2, 1, true);
const sig = nn.Sigmoid();


for(let i = 0; i < 1000; i++){
    const lop = linear(dn.vertex(dn.tensor([1, 1], [1, 2])));
    const op = sig(lop) as any;
    const loss = dn.sub(op.tensor_, dn.tensor([1], [1, 1]));
    
    dn.backpass(op, loss as any);
    dn.update_loss(op);
    dn.grad_zero(op);
    dn.detach(op);
}

const lop = linear(dn.tensor([1, 2], [1, 2]));
const op = sig(lop) as any;

op.print();



