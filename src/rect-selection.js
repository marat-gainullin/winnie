import Ui from 'kenga/utils';

function startRectSelection(rectHost, event) {
    const viewX = Ui.absoluteLeft(rectHost);
    const viewY = Ui.absoluteTop(rectHost);
    const rect = document.createElement('div');
    rect.className = 'p-winnie-selection-rect';
    rectHost.appendChild(rect);
    rect.style.position = 'absolute';
    const x = event.clientX - viewX;
    const y = event.clientY - viewY;
    rect.style.left = `${x}px`;
    rect.style.top = `${y}px`;
    rect.style.width = rect.style.height = '0px';
    return {x, y, rect};
}

function proceedRectSelection(start, diff) {
    if (diff.x > 0) {
        start.rect.style.left = `${start.x}px`;
        start.rect.style.width = `${diff.x}px`;
    } else {
        start.rect.style.left = `${start.x + diff.x}px`;
        start.rect.style.width = `${-diff.x}px`;
    }
    if (diff.y > 0) {
        start.rect.style.top = `${start.y}px`;
        start.rect.style.height = `${diff.y}px`;
    } else {
        start.rect.style.top = `${start.y + diff.y}px`;
        start.rect.style.height = `${-diff.y}px`;
    }
}

function endRectSelection(model, start, diff, event) {
    function hitTestElement(rectX, rectY, element) {
        if (element['p-widget'] && element['p-widget']['winnie.wrapper']) {
            const wX = Ui.absoluteLeft(element);
            const wY = Ui.absoluteTop(element);
            if (rectX < wX + element.offsetWidth && wX < rectX + start.rect.offsetWidth &&
                    rectY < wY + element.offsetHeight && wY < rectY + start.rect.offsetHeight) {
                model.layout.explorer.select(element['p-widget']['winnie.wrapper']);
                return true;
            }
        }
        return false;
    }

    const visualRootElement = model.visualRootElement();
    if (visualRootElement) {
        if (!event.ctrlKey) {
            model.layout.explorer.unselectAll();
        }
        const rectX = Ui.absoluteLeft(start.rect);
        const rectY = Ui.absoluteTop(start.rect);
        let child = visualRootElement.firstElementChild;
        let hitted = 0;
        while (child) {
            if (hitTestElement(rectX, rectY, child)) {
                hitted++;
            }
            child = child.nextElementSibling;
        }
        if (hitted === 0 && diff.x === 0 && diff.y === 0) {
            hitTestElement(rectX, rectY, visualRootElement);
        }
    }
    start.rect.parentElement.removeChild(start.rect);
}

export {startRectSelection, proceedRectSelection, endRectSelection};