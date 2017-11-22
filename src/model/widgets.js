import Invoke from 'septima-utils/invoke';
import Ui from 'kenga/utils';
import Widget from 'kenga/widget';
import Container from 'kenga/container';
import ImageParagraph from 'kenga-labels/image-paragraph';
import CheckBox from 'kenga-buttons/check-box';
import RadioButton from 'kenga-buttons/radio-button';
import Box from 'kenga-containers/box-pane';
import FlowPane from 'kenga-containers/flow-pane';
import GridPane from 'kenga-containers/grid-pane';
import Anchors from 'kenga-containers/anchors-pane';
import HolyGrailPane from 'kenga-containers/holy-grail-pane';
import MenuItem from 'kenga-menu/menu-item';
import DataGrid from 'kenga-grid/grid';
import i18n from '../i18n';
import { mouseDrag, startItemsMove, proceedItemsMove, endItemsMove } from '../location-size';
import { startRectSelection, endRectSelection, proceedRectSelection } from '../rect-selection';

function produce(constr, widgetName, hgap, vgap) {
    let instance;
    if (constr === GridPane) {
        const input = prompt(i18n['winnie.grid.dimensions']);
        const matched = input.match(/(\d+),\s*(\d+)/);
        if (matched) {
            const rows = +matched[1];
            const columns = +matched[2];
            if (rows < 100 && columns < 100) {
                instance = new GridPane(rows, columns, hgap, vgap);
            } else {
                throw `Provided dimensions (rows: ${rows}; columns: ${columns}) are too wide.`;
            }
        } else {
            throw `Provided text: '${input}' is not useful.`;
        }
    } else if (constr === Box) {
        instance = new constr(Ui.Orientation.HORIZONTAL, hgap, vgap);
    } else if (constr === FlowPane || constr === HolyGrailPane) {
        instance = new constr(hgap, vgap);
    } else {
        instance = new constr();
    }
    if (instance instanceof ImageParagraph ||
            instance instanceof MenuItem ||
            instance instanceof CheckBox ||
            instance instanceof RadioButton) {
        instance.text = widgetName;
    }
    return instance;
}

function produced(model, instance) {
    if (instance instanceof Widget) {
        Ui.on(instance.element, Ui.Events.MOUSEOVER, () => {
            instance.element.classList.add('p-winnie-widget-hover');
        });
        Ui.on(instance.element, Ui.Events.MOUSEOUT, () => {
            instance.element.classList.remove('p-winnie-widget-hover');
        });
        mouseDrag(instance.element, (event) => {
            if (instance.element === model.visualRootElement()) {
                return startRectSelection(model.layout.view.element, event);
            } else {
                return startItemsMove(model, instance);
            }
        }, (start, diff, event) => {
            if (instance.element === model.visualRootElement()) {
                proceedRectSelection(start, diff);
            } else {
                proceedItemsMove(model, start, diff, event.ctrlKey ? model.settings.grid.snap : false);
            }
        }, (start, diff, event) => {
            if (instance.element === model.visualRootElement()) {
                endRectSelection(model, start, diff, event);
                const subject = instance['winnie.wrapper'];
                model.layout.explorer.goTo(subject);
            } else {
                if (diff.x !== 0 || diff.y !== 0) {
                    endItemsMove(model, start);
                } else {
                    const subject = instance['winnie.wrapper'];
                    model.layout.explorer.goTo(subject);
                    if (event.ctrlKey) {
                        if (model.layout.explorer.isSelected(subject)) {
                            model.layout.explorer.unselect(subject);
                        } else {
                            model.layout.explorer.select(subject);
                        }
                    } else {
                        model.layout.explorer.unselectAll();
                        model.layout.explorer.select(subject);
                    }
                    Invoke.later(() => {
                        model.layout.widgets.element.focus();
                    });
                }
            }
        });
        if (instance instanceof Container || instance instanceof DataGrid) {
            Ui.on(instance.element, Ui.Events.DRAGENTER, event => {
                if (model.paletteDrag) {
                    event.preventDefault();
                    event.stopPropagation();
                    instance.element.classList.add('p-winnie-container-dnd-target');
                }
            });
            Ui.on(instance.element, Ui.Events.DRAGLEAVE, event => {
                if (model.paletteDrag) {
                    event.preventDefault();
                    event.stopPropagation();
                    instance.element.classList.remove('p-winnie-container-dnd-target');
                }
            });
            Ui.on(instance.element, Ui.Events.DRAGOVER, event => {
                if (model.paletteDrag) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.dropEffect = 'move';
                }
            });
            Ui.on(instance.element, Ui.Events.DROP, event => {
                if (model.paletteDrag) {
                    event.preventDefault();
                    event.stopPropagation();
                    instance.element.classList.remove('p-winnie-container-dnd-target');
                    model.layout.explorer.goTo(instance['winnie.wrapper']);
                    model.lastSelected = instance['winnie.wrapper'];
                    const added = model.addWidget(model.paletteDrag.item);
                    if (instance instanceof Anchors && added.delegate instanceof Widget) {
                        const wX = Ui.absoluteLeft(added.delegate.element);
                        const wY = Ui.absoluteTop(added.delegate.element);
                        const left = event.clientX - wX - added.delegate.width / 2;
                        const top = event.clientY - wY - added.delegate.height / 2;
                        added.delegate.left = left > 0 ? left : model.settings.grid.x;
                        added.delegate.top = top > 0 ? top : model.settings.grid.y;
                    }
                    model.stickDecors();
                }
            });
        }
    }
    return instance;
}

function rename(model, created, newName) {
    if (model.widgets.has(newName)) {
        alert(i18n['winnie.name.used']);
        model.layout.explorer.abortEditing();
        return created.name;
    } else if (newName.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
        const oldName = created.name;
        model.edit({
            name: `Rename widget '${oldName}' as '${newName}'`,
            redo: () => {
                model.widgets.delete(oldName);
                created._name = newName;
                model.widgets.set(newName, created);
                model.layout.explorer.changed(created);
                model.layout.explorer.goTo(created, true);
            },
            undo: () => {
                model.widgets.delete(newName);
                created._name = oldName;
                model.widgets.set(oldName, created);
                model.layout.explorer.changed(created);
                model.layout.explorer.goTo(created, true);
            }
        });
        model.checkEnabled();
        return newName;
    } else {
        alert(i18n['winnie.bad.name']);
        model.layout.explorer.abortEditing();
        return created.name;
    }
}

export {produce, produced, rename};