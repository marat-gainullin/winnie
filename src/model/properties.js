import Ui from 'kenga/utils';
import Bound from 'kenga/bound';
import Widget from 'kenga/widget';
import BoxField from 'kenga/box-field';
import ColumnNode from 'kenga-grid/columns/column-node';
import * as PropsInfo from '../properties/info';
import WinnieProperty from '../properties/winnie-property';

function createProps(model, item) {
    const propNames = Object.getOwnPropertyNames(item.delegate);
    if (item.delegate instanceof Widget) {
        if (item.delegate instanceof Widget && !propNames.includes('classes')) {
            propNames.push('classes');
        }
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
            const prop = new WinnieProperty(item, key, newValue => {
                const oldValue = key === 'visible' ? prop.visible :
                    key.includes('.') ? Bound.getPathData(item.delegate, key) :
                        item.delegate[key];
                const editBody = {
                    name: `Property '${key}' of widget '${item.name}' change`,
                    redo: () => {
                        if (key === 'visible') {
                            prop.visible = newValue;
                        } else if (key === 'classes' && item.delegate instanceof Widget) {
                            const element = item.delegate.element;
                            if (oldValue) {
                                oldValue.split(' ').forEach(className => element.classList.remove(className));
                            }
                            item.delegate[key] = newValue;
                            if (newValue) {
                                newValue.split(' ').forEach(className => element.classList.add(className));
                            }
                        } else {
                            if (key.includes('.')) {
                                Bound.setPathData(item.delegate, key, newValue);
                            } else {
                                item.delegate[key] = newValue;
                            }
                        }
                        if (!prop.silent && !model.layout.properties.activeEditor) {
                            model.layout.properties.changed(prop);
                            model.layout.properties.goTo(prop, true);
                        }
                        prop.silent = false;
                        Ui.delayed(10, () => {
                            model.stickDecors();
                        });
                    },
                    undo: () => {
                        if (key === 'visible') {
                            prop.visible = oldValue;
                        } else if (key === 'classes' && item.delegate instanceof Widget) {
                            const element = item.delegate.element;
                            if (newValue) {
                                newValue.split(' ').forEach(className => element.classList.remove(className));
                            }
                            item.delegate[key] = oldValue;
                            if (oldValue) {
                                oldValue.split(' ').forEach(className => element.classList.add(className));
                            }
                        } else {
                            if (key.includes('.')) {
                                Bound.setPathData(item.delegate, key, oldValue);
                            } else {
                                item.delegate[key] = oldValue;
                            }
                        }
                        if (!model.layout.properties.activeEditor) {
                            model.layout.properties.changed(prop);
                            model.layout.properties.goTo(prop, true);
                        }
                        Ui.delayed(10, () => {
                            model.stickDecors();
                        });
                    }
                };
                model.edit(editBody);
                model.checkEnabled();
            }, key.includes('.') ? Bound.getPathData(item.defaultInstance, key) : item.defaultInstance[key]);
            if (item.delegate instanceof Widget && key === 'classes' && item.delegate[key]) {
                item.delegate.element.className += ` ${item.delegate[key]}`;
            }
            return prop;
        });
}

export default createProps;