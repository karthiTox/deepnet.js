import path from "path";
import fs from "fs";

export function copyto(from, to) {
    return {
        name: 'copy-to',
        generateBundle() {
            if(!fs.existsSync(to)) fs.mkdirSync(to);            

            const log = msg => console.log('\x1b[36m%s\x1b[0m', msg)
     
            // single file;
            const stat = fs.statSync(from);
            if(stat.isFile()){
                log(`• ${from} → ${to}`)
                fs.copyFileSync(
                    path.resolve(from),
                    path.resolve(to + "/" + from.substr(from.lastIndexOf("/") + 1))
                )
                return;
            }

            // single folder;
            log(`copy files: ${from} → ${to}`)
            

            fs.readdirSync(from).forEach(file => {
                const fromFile = `${from}/${file}`
                const toFile = `${to}/${file}`
                
                log(`• ${fromFile} → ${toFile}`)
                fs.copyFileSync(
                    path.resolve(fromFile),
                    path.resolve(toFile)
                )
            })
        }
    }
}