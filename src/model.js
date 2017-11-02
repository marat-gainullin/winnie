import Invoke from 'septima-utils/invoke';
import Logger from 'septima-utils/logger';
import Ui from 'kenga/utils';
import Container from 'kenga/container';
import KeyCodes from 'kenga/key-codes';
import Box from 'kenga-containers/box-pane';
import Flow from 'kenga-containers/flow-pane';
import Menu from 'kenga-menu/menu';
import MenuItem from 'kenga-menu/menu-item';
import Label from 'kenga-labels/label';
import ground from './ground';
import i18n from './i18n';
import Wrapper from './winnie-widget';
import WinnieProperty from './winnie-property';
import reWidth from './rewidth';
import propValueOnRender from './props-render';

export default class Winnie {
    constructor() {
        function widgetColumnRewidth() {
            // TODO: Ensure proper work with expanded explorer tree
            self.layout.widgetColumn.width = self.layout.explorer.width - self.layout.widgetColumn.column.padding;
        }
        const enabled = [];
        function checkEnabled() {
            Invoke.later(() => {
                enabled.forEach((item) => {
                    item();
                });
            });
            widgetColumnRewidth();
        }
        this.checkEnabled = checkEnabled;
        const self = this;
        this.widgets = new Map(); // name -> widget
        this.forest = []; // root widgets
        this.layout = ground();
        this.edits = [];
        this.editsCursor = 0;
        this.layout.leftSizer.element.classList.add('p-winnie-left-sizer');
        this.layout.rightSizer.element.classList.add('p-winnie-right-sizer');
        this.layout.propertiesHeader.element.classList.add('p-winnie-properties-header');
        this.layout.palette.element.classList.add('p-winnie-palette');
        this.layout.explorer.element.classList.add('p-winnie-explorer');
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
        function isParent(parent, child) {
            while (child.parent && child.parent !== parent) {
                child = child.parent;
            }
            return !!child.parent;
        }

        function move(w, dest, addAt) {
            if (!dest || dest.delegate instanceof Container) {
                if (w !== dest) {
                    if (!dest || !isParent(w, dest)) {
                        const source = w.parent;
                        const removeAt = source ? source.indexOf(w) : self.forest.indexOf(w);
                        if(source === dest && addAt > removeAt){
                            addAt--;
                        }
                        if (source !== dest || removeAt !== addAt) {
                            const ur = {
                                name: `Move widget '${w.name}' to container '${dest ? dest.name : '[forest]'}' at position ${addAt}`,
                                redo: () => {
                                    if (source) {
                                        source.remove(removeAt);
                                    } else {
                                        self.forest.splice(removeAt, 1);
                                    }
                                    if (dest) {
                                        dest.add(w, addAt);
                                    } else {
                                        self.forest.splice(addAt, 0, w);
                                    }
                                    self.layout.explorer.removed(w);
                                    self.layout.explorer.added(w);
                                    self.layout.explorer.goTo(w, true);
                                    ur.undo = () => {
                                        if (dest) {
                                            dest.remove(addAt);
                                        } else {
                                            self.forest.splice(addAt, 1);
                                        }
                                        if (source) {
                                            source.add(w, removeAt);
                                        } else {
                                            self.forest.splice(removeAt, 0, w);
                                        }
                                        self.layout.explorer.removed(w);
                                        self.layout.explorer.added(w);
                                        self.layout.explorer.goTo(w, true);
                                    }
                                }
                            };
                            self.edit(ur);
                        } else {
                            Logger.info(`Widget '${w.name}' is a child of '${dest ? dest.name : '[forest]'}' already at the same position.`);
                        }
                    } else {
                        Logger.info(`Can't add widget '${w.name}' to widget '${dest ? dest.name : '[forest]'}'. Widget '${w.name}' is parent of '${dest ? dest.name : '[forest]'}'.`);
                    }
                } else {
                    Logger.info(`Can't add widget '${w.name}' to itself.'`);
                }
            } else {
                Logger.info(`Can't add widget '${w.name}' to widget '${dest.name}'. Widget '${dest.name}' should be a container.`);
            }
        }

        this.layout.explorer.onDropInto = (w, dest) => {
            move(w, dest, dest.count);
        };

        this.layout.explorer.onDropBefore = (w, before) => {
            const dest = before.parent;
            const addAt = dest ? dest.indexOf(before) : self.forest.indexOf(before);
            move(w, dest, addAt);
        };

        this.layout.explorer.onDropAfter = (w, after) => {
            const dest = after.parent;
            const addAt = dest ? dest.indexOf(after) : self.forest.indexOf(after);
            move(w, dest, addAt + 1);
        };


        reWidth(this.layout.paletteExplorerSplit, self.layout.leftSizer, this.layout.view, 1, widgetColumnRewidth);
        reWidth(this.layout.propertiesBox, self.layout.rightSizer, this.layout.view, -1, () => {
            self.layout.propNameColumn.width = (self.layout.propertiesBox.width - 30) / 2;
            self.layout.propValueColumn.width = (self.layout.propertiesBox.width - 30) / 2;
        });

        this.layout.propNameColumn.field = 'name';
        this.layout.propValueColumn.field = 'value';
        this.layout.propNameColumn.onRender = (item, viewCell) => {
            if (item.edited) {
                viewCell.classList.add('p-winnie-property-edited');
            }
        };
        this.layout.propValueColumn.onRender = propValueOnRender;
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

    addWidget(item, defaultInstance) {
        const self = this;
        const widgetNameBase = item.widget.name.substring(0, 1).toLowerCase() + item.widget.name.substring(1);
        let widgetName = widgetNameBase;
        let nameAppempt = 1;
        while (this.widgets.has(widgetName)) {
            widgetName = `${widgetNameBase}${nameAppempt++}`;
        }
        const created = new Wrapper(new item.widget(), widgetName, defaultInstance, (newName) => {
            if (self.widgets.has(newName)) {
                alert(i18n['winnie.name.used']);
                self.layout.explorer.abortEditing();
                return created.name;
            } else if (newName.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
                const oldName = created.name;
                self.edit({
                    name: `Rename widget '${oldName}' as '${newName}'`,
                    redo: () => {
                        self.widgets.delete(oldName);
                        created._name = newName;
                        self.widgets.set(newName, created);
                        self.layout.explorer.changed(created);
                        self.layout.explorer.goTo(created, true);
                    },
                    undo: () => {
                        self.widgets.delete(newName);
                        created._name = oldName;
                        self.widgets.set(oldName, created);
                        self.layout.explorer.changed(created);
                        self.layout.explorer.goTo(created, true);
                    }
                });
                self.checkEnabled();
                return newName;
            } else {
                alert(i18n['winnie.bad.name']);
                self.layout.explorer.abortEditing();
                return created.name;
            }
        });
        this.edit({
            name: `Add '${item.name}' widget from '${item.from}'`,
            redo: () => {
                self.widgets.set(widgetName, created);
                self.forest.push(created);
                self.layout.explorer.added(created);
                self.layout.explorer.goTo(created, true);
            },
            undo: () => {
                self.widgets.delete(widgetName);
                const createdIndex = self.forest.indexOf(created);
                const removed = self.forest.splice(createdIndex, 1);
                self.layout.explorer.unselect(created);
                self.layout.explorer.removed(created);
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
            Logger.info(`Redone edit: ${item.name}.`);
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
            Logger.info(`Undone edit: ${item.name}.`);
            this.checkEnabled();
        }
    }

    edit(body) {
        body.redo();
        const dropped = this.edits.splice(this.editsCursor, this.edits.length - this.editsCursor, body);
        Logger.info(`Recorded edit: ${body.name}.`);
        if (dropped.length > 0) {
            Logger.info(`Dropped ${dropped.length} edits.`);
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
                itemLabel.toolTipText = item.description;
            }
            return itemLabel;
        }
        function menuItemOf(item) {
            const itemMi = new MenuItem(item.name);
            const div = document.createElement('div');
            div.className = item.iconStyle ? item.iconStyle : 'icon-wrench';
            itemMi.icon = div;
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
                        const itemMi = menuItemOf(item, paletteItem.instance);
                        const defaultInstance = new item.widget();
                        itemMi.onAction = () => {
                            self.addWidget(item, defaultInstance);
                        };
                        const category = categoryOf(item);
                        category.items.push({
                            palette: paletteItem,
                            mi: itemMi,
                            widget: item.widget,
                            from: item.from,
                            name: item.name,
                            defaultInstance,
                            description: item.description,
                            style: item.style,
                            category,
                        });
                        category.palette.content.add(paletteItem);
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
            if (item) {
                if (item.sheet) {
                    this.layout.properties.data = item.sheet;
                } else {
                    this.layout.properties.data = item.sheet = Object.getOwnPropertyNames(item.delegate)
                            .filter(key =>
                                typeof item.delegate[key] !== 'function' &&
                                        key !== 'name' &&
                                        key !== 'parent' &&
                                        key !== 'element' &&
                                        key !== 'font' &&
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
                                            if (!prop.silent) {
                                                self.layout.properties.changed(prop);
                                                self.layout.properties.goTo(prop, true);
                                            }
                                            prop.silent = false;
                                            editBody.undo = () => {
                                                item.delegate[key] = oldValue;
                                                self.layout.properties.changed(prop);
                                                self.layout.properties.goTo(prop, true);
                                            }
                                        }
                                    };
                                    self.edit(editBody);
                                    self.checkEnabled();
                                }, item.defaultInstance[key]);
                                return prop;
                            });
                }
            } else {
                this.layout.properties.data = [];
            }
        }
    }
}
