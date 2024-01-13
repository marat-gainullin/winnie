import Model from './model';
import kenga from './palette/kenga';
import templates from './templates';

function winnie() {
    const model = new Model();

    model.palette.add(kenga);
    model.adopts.add(templates);

    document.body.appendChild(model.layout.ground.element);
    
    return model
}

export default winnie
