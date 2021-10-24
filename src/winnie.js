import Ui from 'kenga/utils';
import Model from './model';
import kenga from './palette/kenga';
import templates from './templates';

function winnie(module, moduleName) {
    const model = new Model();

    model.palette.add(kenga);
    model.adopts.add(templates);

    model.layout.ground.element.style.width = '100%';
    model.layout.ground.element.style.height = '100%';

    document.title = `Winnie - ${moduleName}`
    document.body.appendChild(model.layout.ground.element);

    Ui.later(() => {
        const split = model.layout.paletteExplorerSplit;
        split.dividerLocation = split.height / 2;
        model.openNatives(module);
    });
}

export default winnie
