export function randFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}


export function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}


export function rand(size: number):number[]{
    const array = [];
    
    for (let i = 0; i < size; i++) {
        array[i] = Math.random() * 0.4 - 0.2;
    }

    return array;
}

export function randGauss(): number {
    if (randGauss.return) {
      randGauss.return = false;
      return randGauss.val;
    }

    const u = 2 * Math.random() - 1;
    const v = 2 * Math.random() - 1;
    const r = u * u + v * v;
    
    if (r === 0 || r > 1) return randGauss();    

    const c = Math.sqrt((-2 * Math.log(r)) / r);
    randGauss.val = v * c;
    randGauss.return = true;
    return u * c;
}

randGauss.return = false;
randGauss.val = 0;
  

export function randn(m: number, std: number): number {
    return m + randGauss() * std;
}

  
