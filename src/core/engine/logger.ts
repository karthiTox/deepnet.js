class logger{
    private ColorOff = '\x1b[0m';
    private ColorWhite = '\x1b[37m';
    private ColorGreen = '\x1b[32m';
    private ColorRed = '\x1b[31m';
    private ColorYellow = '\x1b[33m';
    private ColorCyan = '\x1b[36m'; 
    private ColorBlue = '\x1b[36m%s\x1b[0m';  

    constructor(
        private name?:string, 
        private logTime:boolean = false, 
        private default_color:"white"|"green"|"red"|"yellow"|"cyan"|"blue" = "blue"
    ) {

    }

    private allow_log:boolean = false;
    
    setLog(y:boolean){
        this.allow_log = y;
    }

    color_it(color:string, msg:string) {
        return `${color}${msg}${this.ColorOff} `
    }

    log(msg:string) {
        if(!this.allow_log) return;
        
        let color = this.ColorBlue;
        switch (this.default_color) {
            case "white":
                color = this.ColorWhite;
                break;
            case "yellow":
                color = this.ColorYellow;
                break;
            case "red":
                color = this.ColorRed;
                break;
            case "green":
                color = this.ColorGreen;
                break;
            case "cyan":
                color = this.ColorCyan;
                break;        
        }

        const dateTime = new Date();
        const date = dateTime.toLocaleDateString();
        const time = dateTime.toLocaleTimeString();
        const dateTimeString = '[' + date + '  ' + time + ']';        
            
        console.log(
          this.name ? this.color_it(color, '[' + this.name + ']') : '',
          this.logTime ? this.color_it(color, dateTimeString) : '',
          this.color_it(this.ColorWhite, msg)
        )
    }

}


export const debug = new logger("debug-cpu", false, "blue");
export const debug_cpu = new logger("debug-cpu", false, "red");
export const debug_wasm = new logger("debug-wasm", false, "cyan");