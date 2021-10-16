import Ui from 'kenga/utils';
import Model from './model';
import kenga from './palette/kenga';
import templates from './templates';
import blankTemplate from './templates/blank';

const model = new Model();

model.palette.add(kenga);
model.adopts.add(templates);

model.layout.ground.element.style.width = '100%';
model.layout.ground.element.style.height = '100%';
document.body.appendChild(model.layout.ground.element);
Ui.later(() => {
    model.layout.paletteExplorerSplit.dividerLocation = (model.layout.paletteExplorerSplit.height - model.layout.paletteExplorerSplit.dividerSize) / 2;
    model.openNatives(blankTemplate);
});
