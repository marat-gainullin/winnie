import Invoke from 'septima-utils/invoke';
import Logger from 'septima-utils/logger';
import Ui from 'kenga/utils';
import Box from 'kenga-containers/box-pane';
import Flow from 'kenga-containers/flow-pane';
import Menu from 'kenga-menu/menu';
import MenuItem from 'kenga-menu/menu-item';
import Label from 'kenga-labels/label';
import ground from './ground-widget';
import i18n from './i18n';
import Wrapper from './winnie-widget';
import WinnieProperty from './winnie-property';
import MultiTypeRenderer from './multi-type-renderer';

const defaultObjectInstance = {};
const defaultArrayInstance = {};

export default class Winnie {
    constructor() {
        const enabled = [];
        function checkEnabled() {
            Invoke.later(() => {
                enabled.forEach((item) => {
                    item();
                });
            });
        }
        this.checkEnabled = checkEnabled;
        const self = this;
        this.widgets = new Map(); // name -> widget
        this.forest = []; // root widgets
        this.layout = ground();
        this.edits = [];
        this.editsCursor = 0;
        this.layout.ground.element.classList.add('p-winnie-ground');
        this.layout.view.element.classList.add('p-winnie-view');
        this.layout.widgets.element.classList.add('p-winnie-widgets');
        this.layout.explorer.data = this.forest;
        this.layout.explorer.parentField = 'parent';
        this.layout.explorer.childrenField = 'children';
        this.layout.explorer.onSelect = (evt) => {
            self.lastSelected = evt.item;
            checkEnabled();
        }
        this.layout.explorer.onDragBefore = (w, before) => {
        };
        this.layout.explorer.onDragInto = (w, into) => {
        };
        this.layout.explorer.onDragAfter = (w, after) => {
        };
        this.layout.explorer.onDropBefore = (w, before) => {
        };
        this.layout.explorer.onDropInto = (w, into) => {
        };
        this.layout.explorer.onDropAfter = (w, after) => {
        };
        const properties = [];
        this.layout.properties.data = properties;
        this.layout.propNameColumn.field = 'name';
        this.layout.propValueColumn.field = 'value';
        this.layout.propValueColumn.renderer = new MultiTypeRenderer();
        [this.layout.tCut, this.layout.miCut].forEach((w) => {
            enabled.push(() => {
                w.enabled = self.layout.explorer.selected.length > 0;
            });
            w.onAction = () => {
                checkEnabled();
                self.cut();
            };
        });
        [this.layout.tCopy, this.layout.miCopy].forEach((w) => {
            enabled.push(() => {
                w.enabled = self.layout.explorer.selected.length > 0;
            });
            w.onAction = () => {
                checkEnabled();
                self.copy();
            };
        });
        [this.layout.tPaste, this.layout.miPaste].forEach((w) => {
            w.onAction = () => {
                checkEnabled();
                self.paste();
            };
        });
        [this.layout.tUndo, this.layout.miUndo].forEach((w) => {
            enabled.push(() => {
                w.enabled = self.canUndo;
            });
            w.onAction = () => {
                checkEnabled();
                self.undo();
            };
        });
        [this.layout.tRedo, this.layout.miRedo].forEach((w) => {
            enabled.push(() => {
                w.enabled = self.canRedo;
            });
            w.onAction = () => {
                checkEnabled();
                self.redo();
            };
        });
        [this.layout.tRemove, this.layout.miRemove].forEach((w) => {
            enabled.push(() => {
                w.enabled = self.layout.explorer.selected.length > 0;
            });
            w.onAction = () => {
                checkEnabled();
                self.removeSelectedWidgets();
            };
        });
        checkEnabled();
        this._palette = {};
    }

    clear() {
        this.editsCursor = 0;
        this.edits = [];
        this.layout.widgets.clear();
        this.widgets.clear();
        const removed = this.forest.splice(0, this.forest.length);
        this.layout.explorer.removed(removed);
        this.layout.properties.data = [];
    }

    addWidget(item) {
        const widgetNameBase = item.widget.name.substring(0, 1).toLowerCase() + item.widget.name.substring(1);
        let widgetName = widgetNameBase;
        let nameAppempt = 1;
        while (this.widgets.has(widgetName)) {
            widgetName = `${widgetNameBase}${nameAppempt++}`;
        }
        const created = new Wrapper(new item.widget(), widgetName);
        this.edit({
            name: `Add '${item.name}' widget from '${item.from}'`,
            redo: () => {
                this.widgets.set(widgetName, created);
                this.forest.push(created);
                this.layout.explorer.added(created);
                this.layout.explorer.goTo(created, true);
            },
            undo: () => {
                this.widgets.delete(widgetName);
                const createdIndex = this.forest.indexOf(created);
                const removed = this.forest.splice(createdIndex, 1);
                this.layout.explorer.unselect(created);
                this.layout.explorer.removed(created);
            }
        });
        this.checkEnabled();
    }

    removeSelectedWidgets() {
        const self = this;
        function added(item) {
            self.layout.explorer.unselectAll();
            self.layout.explorer.select(item);
            self.layout.explorer.added(item);
        }
        function removed(item) {
            self.layout.explorer.unselect(item);
            self.layout.explorer.removed(item);
        }
        const toRemove = this.layout.explorer.selected;
        const actions = toRemove.map((item) => {
            const itemParent = item.parent;
            const ur = {};
            ur.redo = () => {
                const removedAt = itemParent ? itemParent.indexOf(item) : self.forest.indexOf(item);
                (itemParent ? itemParent.remove(removedAt) : self.forest.splice(removedAt, 1));
                self.widgets.delete(item.name);
                removed(item);
                ur.undo = () => {
                    self.widgets.set(item.name, item);
                    if (itemParent) {
                        itemParent.add(item, removedAt);
                        added(item);
                    } else {
                        self.forest.splice(removedAt, 0, item);
                        added(item);
                    }
                };
            }
            return ur;
        });
        this.edit({
            name: `Delete selected (${toRemove.length}) widgets`,
            redo: () => {
                actions.forEach((item) => {
                    item.redo();
                });
            },
            undo: () => {
                actions.reverse().forEach((item) => {
                    item.undo();
                });
            }
        });
        this.checkEnabled();
    }

    get canRedo() {
        return this.editsCursor >= 0 && this.editsCursor < this.edits.length;
    }

    redo() {
        if (this.canRedo) {
            const item = this.edits[this.editsCursor];
            item.redo();
            this.editsCursor++;
            Logger.info(`Redone undoable edit: ${item.name}.`);
            this.checkEnabled();
        }
    }

    get canUndo() {
        return this.editsCursor > 0 && this.editsCursor <= this.edits.length;
    }

    undo() {
        if (this.canUndo) {
            --this.editsCursor;
            const item = this.edits[this.editsCursor];
            item.undo();
            Logger.info(`Undone undoable edit: ${item.name}.`);
            this.checkEnabled();
        }
    }

    edit(body) {
        body.redo();
        const dropped = this.edits.splice(this.editsCursor, this.edits.length - this.editsCursor, body);
        Logger.info(`Added undoable edit: ${body.name}.`);
        if (dropped.length > 0) {
            Logger.info(`Dropped ${dropped.length} undoable edits.`);
        }
        this.editsCursor++;
    }

    get palette() {
        const self = this;
        function category(name) {
            const box = new Box(Ui.Orientation.VERTICAL);
            const header = new Label(name);
            const headerIcon = document.createElement('div');
            headerIcon.className = 'icon-down-open';
            header.icon = headerIcon;
            header.element.classList.add('widget-category-header');
            const content = new Flow(5, 5);
            content.element.classList.add('widget-category-content');
            box.add(header);
            box.add(content);
            self.layout.palette.add(box);
            header.onMouseClick = (evt) => {
                if (headerIcon.classList.contains('icon-down-open')) {
                    headerIcon.classList.remove('icon-down-open');
                    headerIcon.classList.add('icon-right-open');
                    content.height = 0;
                } else {
                    headerIcon.classList.remove('icon-right-open');
                    headerIcon.classList.add('icon-down-open');
                    content.height = null;
                }
            };
            const menuItem = new MenuItem(name);
            const menuIcon = document.createElement('div');
            menuIcon.className = 'icon-space';
            menuItem.icon = menuIcon;
            menuItem.subMenu = new Menu();
            self.layout.miAdd.subMenu.add(menuItem);
            return {
                name,
                palette: {box, header, content},
                menu: menuItem.subMenu,
                items: []
            };
        }
        function categoryOf(item) {
            let categoryName;
            if (item.category) {
                categoryName = item.category;
            } else {
                categoryName = i18n['winnie.category.default'];
                Logger.info(`Palette item from '${item.from}' hs no category, so it goers to default one.`);
            }
            return categoryName in self._palette ? self._palette[categoryName] : self._palette[categoryName] = category(categoryName);
        }
        function paletteItemOf(item) {
            const itemInstance = new item.widget();
            const itemLabel = new Label(item.name);
            itemLabel.horizontalTextPosition = Ui.HorizontalPosition.CENTER;
            itemLabel.verticalTextPosition = Ui.VerticalPosition.BOTTOM;
            const div = document.createElement('div');
            div.className = item.iconStyle ? item.iconStyle : 'icon-wrench';
            itemLabel.icon = div;
            itemLabel.opaque = true;
            itemLabel.element.classList.add('widget-palette-item');
            itemLabel.element.draggable = true;
            // TODO: remove after kenga update
            itemLabel.background = '#e9ebee';
            //
            if ('description' in item) {
                [itemInstance, itemLabel].forEach((w) => {
                    w.toolTipText = item.description;
                });
            }
            return {label: itemLabel, instance: itemInstance};
        }
        function menuItemOf(item) {
            const itemMi = new MenuItem(item.name);
            const div = document.createElement('div');
            div.className = item.iconStyle ? item.iconStyle : 'icon-wrench';
            itemMi.icon = div;
            itemMi.onAction = () => {
                self.addWidget(item);
            };
            return itemMi;
        }
        return {
            add: (items) => {
                if (!Array.isArray(items))
                    items = [items];
                items.filter((item) => {
                    if (!item.name) {
                        Logger.info(`Can't add anonymous palette item from '${item.from}'. Skipping...`);
                        return false;
                    } else if (!item.from) {
                        Logger.info(`Can't add palette item '${item.name}' without 'from' field. Skipping...`);
                        return false;
                    } else if (!item.widget) {
                        Logger.info(`Can't add palette item '${item.name}' without 'widget' field. Skipping...`);
                        return false;
                    } else {
                        return true;
                    }
                }).forEach((item) => {
                    try {
                        const paletteItem = paletteItemOf(item);
                        const itemMi = menuItemOf(item);
                        const category = categoryOf(item);
                        category.items.push({
                            palette: paletteItem,
                            mi: itemMi,
                            from: item.from,
                            name: item.name,
                            description: item.description,
                            style: item.style,
                            category,
                        });
                        category.palette.content.add(paletteItem.label);
                        category.menu.add(itemMi);
                    } catch (ex) {
                        Logger.info(`Can't add palette item '${item.name}' from '${item.from}' due to exception:`);
                        Logger.severe(ex);
                        Logger.info(`Palette item '${item.name}' from '${item.from}' skipped.`);
                    }
                });
            }
        };
    }

    get lastSelected() {
        return this._lastSelected;
    }

    set lastSelected(item) {
        const self = this;
        if (this._lastSelected !== item) {
            this._lastSelected = item;
            this.layout.properties.data = item ? Object.getOwnPropertyNames(item.delegate)
                    .filter(key =>
                        typeof item.delegate[key] !== 'function' &&
                                key !== 'name' &&
                                key !== 'parent' &&
                                key !== 'element' &&
                                key !== 'visibleDisplay' &&
                                key !== 'winnie.wrapper' &&
                                !key.startsWith('on')
                    )
                    .map((key) => {
                        const prop = new WinnieProperty(item.delegate, key, newValue => {
                            const editBody = {
                                name: `Property '${key}' of widget '${item.name}' change`,
                                redo: () => {
                                    const oldValue = item.delegate[key];
                                    item.delegate[key] = newValue;
                                    self.layout.properties.changed(prop);
                                    editBody.undo = () => {
                                        item.delegate[key] = oldValue;
                                        self.layout.properties.changed(prop);
                                    }
                                }
                            };
                            self.edit(editBody);
                            self.checkEnabled();
                        });
                        return prop;
                    }) : [];
        }
    }
}
