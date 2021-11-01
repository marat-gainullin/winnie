import Grid from 'kenga-containers/grid-pane';
import ColumnNode from 'kenga-grid/columns/column-node';
import Widget from "kenga/widget";
import * as Serials from "./serials";

function concat(prev, item) {
    if (!!prev && !!item)
        return `${prev}\n${item}`;
    else if (!!prev)
        return prev;
    else
        return item;
}

function decapitalize(name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
}

function capitalize(name) {
    return name.split('-')
        .map((item => {
            return item.substring(0, 1).toUpperCase() + item.substring(1);
        }))
        .join('');
}

function lastSlashTail(name) {
    const lsi = name.lastIndexOf('/');
    if (lsi > -1) {
        return name.substring(lsi + 1, name.length);
    } else {
        return name;
    }
}

function nvl(placeholder, name) {
    return name ? name : placeholder;
}

class Es6Generator {

    constructor(model) {
        this.model = model;
        this.consts = new Set();
        this.fromToLocalConstructor = new Map(); // item.from -> local constructor name
        this.widgetToConstName = new Map(); // widget name -> program 'const' name
    }

    generateConstName(base) {
        let localConstName = base;
        let nameAttempt = 1;
        while (this.consts.has(localConstName)) {
            localConstName = `${base}${nameAttempt++}`;
        }
        this.consts.add(localConstName);
        return localConstName;
    }

    constructorNameOf(item) {
        if (this.fromToLocalConstructor.has(item.from)) {
            return this.fromToLocalConstructor.get(item.from);
        } else {
            const base = nvl('W',
                capitalize(lastSlashTail(item.from))
                    .replace(/[^a-z0-9_]/gi, '')
            );
            const constructorLocalName = this.generateConstName(base);
            this.fromToLocalConstructor.set(item.from, constructorLocalName);
            return constructorLocalName;
        }

    }

    constNameOf(widgetName) {
        if (this.widgetToConstName.has(widgetName)) {
            return this.widgetToConstName.get(widgetName);
        } else {
            const base = decapitalize(widgetName);
            const constName = this.generateConstName(base);
            this.widgetToConstName.set(widgetName, constName);
            return constName;
        }
    }

    imports() {
        const importsContent = Array.from(new Set(Array.from(this.model.widgets.values())
            .sort((item1, item2) => {
                return item1.source.from < item2.source.from ?
                    -1 : item1.source.from > item2.source.from ?
                        1 : 0;
            })
            .map((item) => {
                return `import ${this.constructorNameOf(item.source)} from '${item.source.from}';`;
            })))
            .reduce(concat);
        return !!importsContent ? `${importsContent}\n` : ''
    }

    instances(indent) {
        return Array.from(this.model.widgets.entries())
            .map(([key, item]) => {
                const widgetConstName = this.constNameOf(key);
                return [item.delegate instanceof Grid ?
                    `${indent}const ${widgetConstName} = new ${this.constructorNameOf(item.source)}(${item.delegate.rows}, ${item.delegate.columns});` :
                    `${indent}const ${widgetConstName} = new ${this.constructorNameOf(item.source)}();`,
                    `${indent}this.${widgetConstName} = ${widgetConstName};`
                ].reduce(concat);
            })
            .reduce(concat, '');
    }

    forest(indent) {
        const queue = [];
        this.model.forest.forEach((item) => {
            queue.push(...item.children);
        });
        for (let i = 0; i < queue.length; i++) {
            queue.push(...queue[i].children);
        }
        return queue
            .map((item) => {
                return `${indent}${this.constNameOf(item.parent.name)}.${item.delegate instanceof ColumnNode ? 'addColumnNode' : 'add'}(${this.constNameOf(item.name)});`;
            })
            .reduce(concat, '');
    }

    sheets(indent) {
        return Array.from(this.model.widgets.entries())
            .map(([key, item]) => {
                const widgetConstName = this.constNameOf(key);
                const props = item.sheet
                    .filter(p => p.edited && (!(item.delegate instanceof Grid) || (p.name !== 'rows' && p.name !== 'columns')))
                    .map((p) => {
                        let assignment = `${indent}    ${widgetConstName}.${p.name} = ${typeof p.value === 'string' ? `'${p.value}'` : (p.value && p.value.src ? `'${Serials.relativize(p.value.src)}'` : p.value)};`;
                        if (item.delegate instanceof Widget && p.name === 'classes' && p.value) {
                            assignment += `\n${indent}    ${widgetConstName}.element.className += ' ' + ${widgetConstName}.${p.name};`;
                        }
                        return assignment;
                    })
                    .reduce(concat, '');
                return !!props ? [
                    `${indent}{`,
                    props,
                    `${indent}}`
                ].reduce(concat) : '';
            })
            .reduce(concat, '');
    }

    assemble() {
        const generatedName = 'KengaView';
        const indent8 = '        ';
        return [
            this.imports(),
            `class ${generatedName} {`,
            '    constructor () {',
            this.instances(indent8),
            this.forest(indent8),
            this.sheets(indent8),
            '    }',
            '}\n',
            `export default ${generatedName};`]
            .reduce(concat);
    }
}

function generate(model) {
    const generator = new Es6Generator(model);
    return generator.assemble();
}

export default generate;