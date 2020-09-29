module.exports = {
    Quadraticfn: {
        fn: (a=[], y=[]) =>{  
            const totalErr = [];        
            for(let i = 0; i < a.length; i++){           
                totalErr[i] = 0.5 * (a[i] - y[i])**2;                             
            }
            return totalErr  
        },
        delta: (a=[], y=[], z=[]) => {
            let res = [];
            for(i = 0; i < a.length; i++){
                res[i] = (a[i]-y[i]) * z[i]
            }
            return res
        },
        totalerr: (err=[]) => {            
            let Err = 0;
            for(let e = 0; e < err.length; e++){
                Err += err[e];
            }
            return Err/err.length
        }
    },

    CrossEntropyfn: {
        fn: (a, y) =>{    
            const totalErr = [];        
            for(let i = 0; i < a.length; i++){           
                totalErr[i] = (y[i] * Math.log(a[i])) + ((1 - y[i]) * Math.log(1 - a[i]))             
            }
            return totalErr             
        },
        delta: (a=[], y=[], z=[]) => {
            let res = [];
            for(i = 0; i < a.length; i++){
                res[i] = (a[i]-y[i])
            }
            return res
        },
        totalerr: (err=[]) => {
            let Err = 0;
            for(let e = 0; e < err.length; e++){
                Err += err[e];
            }
            return -1 * (Err/err.length)
        }
    }
}