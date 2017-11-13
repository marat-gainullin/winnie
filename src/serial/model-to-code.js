const concat = (prev, item) => {
    return `${prev}\n${item}`;
};

function imports(model) {
    return Array.from(new Set(Array.from(model.widgets.values())
            .sort((item1, item2) => {
                return item1.source.from < item2.source.from ?
                        -1 : item1.source.from > item2.source.from ?
                        1 : 0;
            })
            .map((item) => {
                return `import ${item.delegate.constructor.name} from '${item.source.from}';`;
            })))
            .reduce(concat);
}

function instances(model, indent) {
    return Array.from(model.widgets.entries())
            .map(([key, item]) => {
                return [`${indent}const ${key} = new ${item.delegate.constructor.name}();`,
                    `${indent}{`,
                    item.sheet
                            .filter(p => p.edited)
                            .map((p) => {
                                return `${indent}    ${key}.${p.name} = ${typeof p.value === 'string' ? `'${p.value}'` : (p.value && p.value.src ? `'${p.value.src}'` : p.value)};`;
                            })
                            .reduce(concat),
                    `${indent}}`,
                    `${indent}this.${key} = ${key};`]
                        .reduce(concat);
            })
            .reduce(concat);
}

function forest(model, indent) {
    const queue = [];
    model.forest.forEach((item) => {
        queue.push(...item.children);
    });
    for (let i = 0; i < queue.length; i++) {
        queue.push(...queue[i].children);
    }
    return queue
            .map((item) => {
                return `${indent}${item.parent.name}.add(${item.name});`;
            })
            .reduce(concat);
}

function generate(model) {
    const generatedName = 'SavedWidgetsRenameMe';
    return [
        imports(model),
        '',
        `class ${generatedName} {`,
        '    constructor () {',
        instances(model, '        '),
        forest(model, '        '),
        '    }',
        '}',
        `export default ${generatedName};`]
            .reduce(concat);
}

export default generate;