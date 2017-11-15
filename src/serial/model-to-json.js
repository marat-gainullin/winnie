function forest(forest) {
    function toPlain(sheet) {
        const props = {};
        sheet
                .filter(p => p.edited)
                .forEach((p) => {
                    props[p.name] = p.value && p.value.src ? p.value.src : p.value;
                });
        return props;
    }
    function itemsToObj(items) {
        const itemsObj = {};
        items.forEach((item) => {
            itemsObj[item.name] = {
                from: item.source.from,
                body: toPlain(item.sheet),
                children: itemsToObj(item.children)
            };
        });
        return itemsObj;
    }
    return JSON.stringify(itemsToObj(forest), null, 4);
}

export default forest;