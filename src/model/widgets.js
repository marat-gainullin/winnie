import Ui from 'kenga/utils';
import Widget from 'kenga/widget';
import Container from 'kenga/container';
import ImageParagraph from 'kenga-labels/image-paragraph';
import CheckBox from 'kenga-buttons/check-box';
import RadioButton from 'kenga-buttons/radio-button';
import HorizontalBox from 'kenga-containers/horizontal-box-pane';
import VerticalBox from 'kenga-containers/vertical-box-pane';
import FlowPane from 'kenga-containers/flow-pane';
import GridPane from 'kenga-containers/grid-pane';
import Anchors from 'kenga-containers/anchors-pane';
import TabbedPane from 'kenga-containers/tabbed-pane';
import HolyGrailPane from 'kenga-containers/holy-grail-pane';
import CardPane from "kenga-containers/card-pane";
import MenuItem from 'kenga-menu/menu-item';
import DataGrid from 'kenga-grid/grid';
import ColumnNode from 'kenga-grid/columns/column-node';
import i18n from '../i18n';
import {mouseDrag, startItemsMove, proceedItemsMove, endItemsMove} from '../location-size';
import {startRectSelection, endRectSelection, proceedRectSelection} from '../rect-selection';

function produce(constr, widgetName, paletteItemName, hgap, vgap) {
    let instance;
    if (constr === GridPane) {
        instance = new constr(hgap, vgap);
    } else if (constr === HorizontalBox) {
        instance = new constr(hgap);
    } else if (constr === VerticalBox) {
        instance = new constr(vgap);
    } else if (constr === FlowPane || constr === HolyGrailPane) {
        instance = new constr(hgap, vgap);
    } else if (constr === CardPane) {
        instance = new constr();
        instance.hgap = hgap;
        instance.vgap = vgap;
    } else {
        instance = new constr();
    }
    if (instance instanceof ImageParagraph ||
        instance instanceof MenuItem ||
        instance instanceof CheckBox ||
        instance instanceof RadioButton) {
        instance.text = widgetName.length > 1 ? (widgetName.substring(0, 1).toUpperCase() + widgetName.substring(1)) : widgetName;
    }
    if (instance instanceof ColumnNode && !instance.title) {
        instance.title = widgetName.length > 1 ? (widgetName.substring(0, 1).toUpperCase() + widgetName.substring(1)) : widgetName;
    }
    return instance;
}

function produced(model, instance) {
    function inRect(element, event) {
        const rect = element.getBoundingClientRect();
        return event.clientX >= rect.left &&
            event.clientY >= rect.top &&
            event.clientX < rect.right &&
            event.clientY < rect.bottom;
    }

    if (instance instanceof Widget) {
        instance.element.classList.add('p-winnie-widget');
        Ui.on(instance.element, Ui.Events.MOUSEOVER, () => {
            instance.element.classList.add('p-winnie-widget-hover');
        });
        Ui.on(instance.element, Ui.Events.MOUSEOUT, () => {
            instance.element.classList.remove('p-winnie-widget-hover');
        });
        Ui.on(instance.element, Ui.Events.MOUSEDOWN, (event) => {
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
            Ui.later(() => {
                model.layout.widgets.element.focus();
            });
            event.stopPropagation();
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
                }
            }
        });
        if (instance instanceof DataGrid) {
            instance.columnsNodesDeferredApply = false
        }
        if (instance instanceof Container || instance instanceof DataGrid) {
            Ui.on(instance.element, Ui.Events.DRAGENTER, event => {
                if (model.paletteDrag && (
                    instance instanceof Container && event.target === instance.element ||
                    instance instanceof HolyGrailPane && event.target.parentElement === instance.element ||
                    instance instanceof TabbedPane && event.target.parentElement === instance.element ||
                    instance instanceof DataGrid && inRect(instance.element, event)
                )) {
                    event.preventDefault();
                    event.stopPropagation();
                    instance.element.classList.add('p-winnie-container-dnd-target');
                }
            });
            Ui.on(instance.element, Ui.Events.DRAGLEAVE, event => {
                if (model.paletteDrag && (
                    instance instanceof Container && event.target === instance.element ||
                    instance instanceof HolyGrailPane && event.target.parentElement === instance.element ||
                    instance instanceof TabbedPane && event.target.parentElement === instance.element ||
                    instance instanceof DataGrid && !inRect(instance.element, event)
                )) {
                    event.preventDefault();
                    event.stopPropagation();
                    instance.element.classList.remove('p-winnie-container-dnd-target');
                }
            });
            Ui.on(instance.element, Ui.Events.DRAGOVER, event => {
                if (model.paletteDrag && (
                    instance instanceof Container && event.target === instance.element ||
                    instance instanceof HolyGrailPane && event.target.parentElement === instance.element ||
                    instance instanceof TabbedPane && event.target.parentElement === instance.element ||
                    instance instanceof DataGrid && inRect(instance.element, event)
                )) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.dropEffect = 'move';
                }
            });
            Ui.on(instance.element, Ui.Events.DROP, event => {
                if (model.paletteDrag && (
                    instance instanceof Container && event.target === instance.element ||
                    instance instanceof HolyGrailPane && event.target.parentElement === instance.element ||
                    instance instanceof TabbedPane && event.target.parentElement === instance.element ||
                    instance instanceof DataGrid && inRect(instance.element, event)
                )) {
                    event.preventDefault();
                    event.stopPropagation();
                    instance.element.classList.remove('p-winnie-container-dnd-target');
                    model.layout.explorer.goTo(instance['winnie.wrapper']);
                    model.lastSelected = instance['winnie.wrapper'];
                    const wX = Ui.absoluteLeft(instance.element);
                    const wY = Ui.absoluteTop(instance.element);
                    const left = event.clientX - wX;
                    const top = event.clientY - wY;
                    const applyPosition = instance instanceof Anchors && model.paletteDrag.item.defaultInstance instanceof Widget
                    model.addWidget(model.paletteDrag.item, applyPosition ? Math.max(0, left) : null, applyPosition ? Math.max(0, top) : null);
                    model.stickDecors();
                }
            });
        }
    }
    return instance;
}

function rename(model, created, newName) {
    if (model.widgets.has(newName)) {
        model.alert(i18n['winnie.name.used']);
        model.layout.explorer.abortEditing();
        return created.name;
    } else if (newName !== null && newName.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
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
        model.alert(i18n['winnie.bad.name']);
        model.layout.explorer.abortEditing();
        return created.name;
    }
}

export {produce, produced, rename};
