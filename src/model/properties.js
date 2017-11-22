import Bound from 'kenga/bound';
import Widget from 'kenga/widget';
import BoxField from 'kenga/box-field';
import ColumnNode from 'kenga-grid/columns/column-node';
import * as PropsInfo from '../properties/info';
import WinnieProperty from '../properties/winnie-property';

function createProps(model, item) {
    const propNames = Object.getOwnPropertyNames(item.delegate);
    if (item.delegate instanceof Widget) {
        propNames.push(...PropsInfo.pathProps);
    }
    return propNames
            .filter(key =>
                typeof item.delegate[key] !== 'function' &&
                        (!(item.delegate instanceof Widget) || !PropsInfo.widgetHidden.has(key)) &&
                        (!(item.delegate instanceof ColumnNode) || !PropsInfo.dataGridColumnsHidden.has(key)) &&
                        (!(item.delegate instanceof BoxField) || !PropsInfo.fieldsHidden.has(key)) &&
                        !item.source.hidden.has(key) &&
                        !key.startsWith('on')
            )
            .map((key) => {
                const prop = new WinnieProperty(item.delegate, key, newValue => {
                    const editBody = {
                        name: `Property '${key}' of widget '${item.name}' change`,
                        redo: () => {
                            const oldValue = key.includes('.') ? Bound.getPathData(item.delegate, key) : item.delegate[key];
                            if (key.includes('.')) {
                                Bound.setPathData(item.delegate, key, newValue);
                            } else {
                                item.delegate[key] = newValue;
                            }
                            if (!prop.silent) {
                                model.layout.properties.changed(prop);
                                model.layout.properties.goTo(prop, true);
                            }
                            prop.silent = false;
                            model.stickDecors();
                            editBody.undo = () => {
                                if (key.includes('.')) {
                                    Bound.setPathData(item.delegate, key, oldValue);
                                } else {
                                    item.delegate[key] = oldValue;
                                }
                                model.layout.properties.changed(prop);
                                model.layout.properties.goTo(prop, true);
                                model.stickDecors();
                            };
                        }
                    };
                    model.edit(editBody);
                    model.checkEnabled();
                }, key.includes('.') ? Bound.getPathData(item.defaultInstance, key) : item.defaultInstance[key]);
                return prop;
            });
}

export default createProps;