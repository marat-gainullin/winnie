import Invoke from 'septima-utils/invoke';
import Model from './model';
import Palette from './palette';

const model = new Model();
Palette.fill(model.palette);
model.layout.ground.element.style.width = '100%';
model.layout.ground.element.style.height = '100%';
document.body.appendChild(model.layout.ground.element);
Invoke.later(() => {
    model.layout.view.element.scrollLeft = (model.layout.widgets.element.offsetWidth - model.layout.view.element.clientWidth) / 2;
    model.layout.view.element.scrollTop = (model.layout.widgets.element.offsetHeight - model.layout.view.element.clientHeight) / 2;
    model.layout.paletteExplorerSplit.dividerLocation = (model.layout.paletteExplorerSplit.height - model.layout.paletteExplorerSplit.dividerSize) / 2;
});
