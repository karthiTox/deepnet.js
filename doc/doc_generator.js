const fs = require("fs");
const path = require("path");

const source = "" + fs.readFileSync(path.join(__dirname, "../src/core/engine/cpu/tensor_ops.ts")).toString();

function clean(string) {
    if(string)
        return string
            .toString()
            .replace(/[^\w\s]/gi, '')
            .replace(/\n+/g, '\n')
            .replace(/\t+/g, ' ')
            .replace(/\r+/g, '')
            .trim();
    else 
        return ''
}

function parse(str = "") {
    let raw = [];
    let value = [];

    try {
        raw = str.match(/[/][*][*](.|\n|\r)*?[*][/]/g);    
        value = str.match(/[*][/](\r*)(\n*)(.|\n|\r)*?(.|\n)*?\n/g);    
    } catch (error) {
        raw = [];
        value = [];
    }

    let results = [];

    value.forEach((v, i) => {
        
        let name = v.match(/\w+([<]\w+[>])*[(]/g);
        if(Array.isArray(name)) {
            name = name[0];    
            name = name.search(/[<]\w+[>]/g) != -1 ? v.split('<')[0] : name;
        }        
        name = clean(name);  
        let type = '';

        if (v.search(/class/g) != -1) {
            type = 'class';
        } else if (v.search(/function/g) != -1) {
            type = 'function';
        } else if (v.search(/constructor/g) != -1) {
            type = 'new';
        } else if (v.search(/(var|let|const)/g) != -1) {
            type = 'inside';
        } else if (v.search(/\w+(.)/g) != -1) {
            type = 'method';
        } else {
            type = 'method';
        }         

        results[i] = {
            name: name,
            type: type
        };        

    })

    raw.forEach((r, i) => {
        let header = '';
        let footer = '';
        
        let tags = [];

        r = r.replace(/[/][*][*](\n*|\r*)/g, '')
            .replace(/[*][/]/g, '')
            .replace(/\n+/g, '\n')
            .replace(/\r+/g, '\r')
            .replace(/ +/g, ' ');

        let header_finished = false;
        r.split('* ').forEach(l => {
            l = l.replace(/\n\s+/g, '\n');
            // tag
            if (l.search(/@/g) != -1) {
                header_finished = true;
                
                let tag = l.search(/@\w+[ ]/g) != -1 ? l.match(/@\w+[ ]/g)[0] : '';
                let type = l.search(/{\w+}/g) != -1 ? l.match(/{\w+}/g)[0] : '';
                let name  = '';
                let description = '';

                let sl = l.split(' ');
                if(sl[1].search(/{/g) != -1){
                    name = sl[2];
                    description = sl.slice(3).join(' ');
                } else {
                    description = sl.slice(1).join(' ');
                }

                tags.push({
                    tag:clean(tag), 
                    type:clean(type), 
                    name:clean(name),
                    description: clean(description)
                });
            }
            // detail
            else {
                if (header_finished == false) {
                    header += l.trimStart();
                } else {
                    footer += l.trimStart();
                }
            }
        })

        results[i]['header'] = header.replace('*', ''),
        results[i]['tags'] = tags,
        results[i]['footer'] = footer.replace('*', '')
        
    })

    return results;
}

function gen_readme(res = []) {

    let page = "";

    res.forEach(r => {
        
        let name =  r.name != ""
        ? "## " + r.name + " - " + r.type + "\n\n"
        : "";
        
        page += name;
        page += r.header;

        let tags = {}
        r.tags.forEach(t => {
            if(!(t.tag in tags)) tags[t.tag] = ""            
            
            tags[t.tag] += t.name != "" 
                ? "\n__" + t.name + "__ " 
                    + (t.type != "" ? " { " + t.type + " } " : "")
                : "";
            tags[t.tag] += t.description + '\n';

        })

        for (const t in tags) {            
            page += "\n### " + t
            page += tags[t];
        }

        page += "\n" + r.footer
    })

    return page
}

fs.writeFileSync(path.join(__dirname, "./API-doc.md"), gen_readme(parse(source)));
console.log("successfully-generated-api-doc")