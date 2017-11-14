import Invoke from 'septima-utils/invoke';
import Model from './model';
import kenga from './palette/kenga';
import winnie from './adopts/local';

const model = new Model();

model.palette.add(kenga);
model.adopts.add(winnie);

model.layout.ground.element.style.width = '100%';
model.layout.ground.element.style.height = '100%';
document.body.appendChild(model.layout.ground.element);
Invoke.later(() => {
    model.centerSurface();
    model.layout.paletteExplorerSplit.dividerLocation = (model.layout.paletteExplorerSplit.height - model.layout.paletteExplorerSplit.dividerSize) / 2;
});
