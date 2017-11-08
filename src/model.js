import Invoke from 'septima-utils/invoke';
import Logger from 'septima-utils/logger';
import Ui from 'kenga/utils';
import Bound from 'kenga/bound';
import Widget from 'kenga/widget';
import Container from 'kenga/container';
import KeyCodes from 'kenga/key-codes';
import Label from 'kenga-labels/label';
import CheckBox from 'kenga-buttons/check-box';
import RadioButton from 'kenga-buttons/radio-button';
import ImageParagraph from 'kenga-labels/image-paragraph';
import Box from 'kenga-containers/box-pane';
import Flow from 'kenga-containers/flow-pane';
import Grid from 'kenga-containers/grid-pane';
import Anchors from 'kenga-containers/anchors-pane';
import TabbedPane from 'kenga-containers/tabbed-pane';
import CardPane from 'kenga-containers/card-pane';
import Menu from 'kenga-menu/menu';
import MenuItem from 'kenga-menu/menu-item';
import DataGrid from 'kenga-grid/grid';
import ColumnNode from 'kenga-grid/columns/column-node';
import TextNumberField from './text-number-field';
import ground from './ground';
import i18n from './i18n';
import Wrapper from './winnie-widget';
import WinnieProperty from './winnie-property';
import reWidth from './rewidth';
import propValueOnRender from './props-render';
import { resizeDecor, mouseDrag, sizeLocationSnapshot } from './location-size';
import { generalHiddenProps, datagridColumnsHiddenProps, datagridHiddenProps, tabbedPaneHiddenProps, pathProps } from './props-hidden';

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
        this.decors = [];
        this.layout.leftSizer.element.classList.add('p-winnie-left-sizer');
        this.layout.rightSizer.element.classList.add('p-winnie-right-sizer');
        this.layout.propertiesHeader.element.classList.add('p-winnie-properties-header');
        this.layout.palette.element.classList.add('p-winnie-palette');
        this.layout.explorer.element.classList.add('p-winnie-explorer');
        this.layout.ground.element.classList.add('p-winnie-ground');
        this.layout.view.element.classList.add('p-winnie-view');
        this.layout.widgets.element.classList.add('p-winnie-widgets');
        Ui.on(this.layout.widgets.element, Ui.Events.CLICK, (event) => {
            if (event.target === self.layout.widgets.element) {
                self.layout.explorer.unselectAll();
            }
        });
        this.layout.explorer.data = this.forest;
        this.layout.explorer.parentField = 'parent';
        this.layout.explorer.childrenField = 'children';
        this.layout.explorer.onSelect = (evt) => {
            self.lastSelected = evt.item;
            checkEnabled();
        };
        function isParent(parent, child) {
            while (child.parent && child.parent !== parent) {
                child = child.parent;
            }
            return !!child.parent;
        }

        function move(w, dest, addAt) {
            if (!dest ||
                    dest.delegate instanceof Container && w.delegate instanceof Widget ||
                    dest.delegate instanceof DataGrid && w.delegate instanceof ColumnNode ||
                    dest.delegate instanceof ColumnNode && w.delegate instanceof ColumnNode) {
                if (w !== dest) {
                    if (!dest || !isParent(w, dest)) {
                        const source = w.parent;
                        if (!dest || !dest.full || dest === source) {
                            const removeAt = source ? source.indexOf(w) : self.forest.indexOf(w);
                            if (source === dest && addAt > removeAt) {
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
                                        };
                                    }
                                };
                                self.edit(ur);
                                return true;
                            } else {
                                Logger.info(`Widget '${w.name}' is a child of '${dest ? dest.name : '[forest]'}' already at the same position.`);
                            }
                        } else {
                            Logger.info(`Can't add widget '${w.name}' to widget '${dest ? dest.name : '[forest]'}'. ${dest ? dest.name : '[forest]'}' is full and can't accept more children.`);
                        }
                    } else {
                        Logger.info(`Can't add widget '${w.name}' to widget '${dest ? dest.name : '[forest]'}'. Widget '${w.name}' is parent of '${dest ? dest.name : '[forest]'}'.`);
                    }
                } else {
                    Logger.info(`Can't add widget '${w.name}' to itself.'`);
                }
            } else {
                Logger.info(`Can't add '${w.name}' to '${dest.name}'. Widget '${dest.name}' should be a container and '${w.name}' should be a widget.`);
            }
            return false;
        }
        this.move = move;

        this.layout.explorer.onDropInto = (w, dest) => {
            (self.layout.explorer.isSelected(w) ?
                    self.layout.explorer.selected :
                    [w])
                    .forEach(m => move(m, dest, dest.count));
        };

        this.layout.explorer.onDropBefore = (w, before) => {
            const dest = before.parent;
            const addAt = dest ? dest.indexOf(before) : self.forest.indexOf(before);
            (self.layout.explorer.isSelected(w) ?
                    self.layout.explorer.selected :
                    [w])
                    .reverse()
                    .forEach(m => move(m, dest, addAt));
        };

        this.layout.explorer.onDropAfter = (w, after) => {
            const dest = after.parent;
            const addAt = dest ? dest.indexOf(after) : self.forest.indexOf(after);
            (self.layout.explorer.isSelected(w) ?
                    self.layout.explorer.selected :
                    [w])
                    .reverse()
                    .forEach(m => move(m, dest, addAt + 1));
        };


        reWidth(this.layout.paletteExplorerSplit, self.layout.leftSizer, this.layout.view, 1, widgetColumnRewidth);
        reWidth(this.layout.propertiesBox, self.layout.rightSizer, this.layout.view, -1, () => {
            self.layout.propNameColumn.width = (self.layout.propertiesBox.width - 30) / 2;
            self.layout.propValueColumn.width = (self.layout.propertiesBox.width - 30) / 2;
        });

        this.layout.propNameColumn.field = 'name';
        this.layout.propValueColumn.editor = new TextNumberField();
        this.layout.propValueColumn.field = 'value';
        this.layout.propNameColumn.onRender = (item, viewCell) => {
            viewCell.title = item.name;
            if (item.edited) {
                viewCell.classList.add('p-winnie-property-edited');
            }
        };
        this.layout.propValueColumn.onRender = propValueOnRender;
        enabled.push(() => {
            self.layout.miToSurface.enabled = self._lastSelected &&
                    !self._lastSelected.delegate.parent &&
                    self._lastSelected.delegate instanceof Container;
        });
        this.layout.miToSurface.onAction = () => {
            checkEnabled();
            self.toSurface(self._lastSelected);
            self.centerSurface();
        };
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
        const wasSelected = this._lastSelected;
        const widgetNameBase = item.widget.name.substring(0, 1).toLowerCase() + item.widget.name.substring(1);
        let widgetName = widgetNameBase;
        let nameAttempt = 1;
        while (this.widgets.has(widgetName)) {
            widgetName = `${widgetNameBase}${nameAttempt++}`;
        }
        function produce(constr) {
            let instance;
            if (constr === Grid) {
                const input = prompt(i18n['winnie.grid.dimensions']);
                const matched = input.match(/(\d+),\s*(\d+)/);
                if (matched) {
                    instance = new Grid(+matched[1], +matched[2], 10, 10);
                } else {
                    throw `Provided text: '${input}' is not useful.`;
                }
            } else if (constr === Box) {
                instance = new constr(Ui.Orientation.HORIZONTAL, 10, 10);
            } else {
                instance = new constr();
                if (instance instanceof ImageParagraph ||
                        instance instanceof MenuItem ||
                        instance instanceof CheckBox ||
                        instance instanceof RadioButton) {
                    instance.text = widgetName;
                } else if (instance instanceof Anchors) {
                    instance.width = instance.height = 300;
                }
            }
            instance.onMouseEnter = () => {
                instance.element.classList.add('p-winnie-widget-hover');
            };
            instance.onMouseExit = () => {
                instance.element.classList.remove('p-winnie-widget-hover');
            };
            mouseDrag(instance.element, () => {
                const pickedItem = instance['winnie.wrapper'];
                return (() => {
                    return self.layout.explorer.isSelected(pickedItem) ?
                            self.layout.explorer.selected :
                            [pickedItem];
                })()
                        .filter((item) => item.delegate.attached && item.delegate.parent instanceof Anchors)
                        .map((item) => {
                            return {
                                item,
                                startSnapshot: sizeLocationSnapshot(item.delegate)
                            };
                        });
            }, (items, diff) => {
                items.forEach((moved) => {
                    moved.item.delegate.left = moved.startSnapshot.left + diff.x;
                    moved.item.delegate.top = moved.startSnapshot.top + diff.y;
                    self.decors.forEach((d) => {
                        d.stick();
                    });
                });
            }, (items, diff, event) => {
                if (diff.x !== 0 || diff.y !== 0) {
                    if (items.length > 0) {
                        items.forEach((moved) => {
                            moved.endSnapshot = sizeLocationSnapshot(moved.item.delegate);
                        });
                        self.edit({
                            name: (items.length === 1 ? `Widget '${items[0].item.name}' moved` : `Move of (${items.length}) widgets`),
                            redo: () => {
                                items.forEach((moved) => {
                                    const subjectElement = moved.item.delegate.element;
                                    subjectElement.style.left = moved.endSnapshot.anchors.left;
                                    subjectElement.style.width = moved.endSnapshot.anchors.width;
                                    subjectElement.style.right = moved.endSnapshot.anchors.right;
                                    subjectElement.style.top = moved.endSnapshot.anchors.top;
                                    subjectElement.style.height = moved.endSnapshot.anchors.height;
                                    subjectElement.style.bottom = moved.endSnapshot.anchors.bottom;
                                });
                            },
                            undo: () => {
                                items.forEach((moved) => {
                                    const subjectElement = moved.item.delegate.element;
                                    subjectElement.style.left = moved.startSnapshot.anchors.left;
                                    subjectElement.style.width = moved.startSnapshot.anchors.width;
                                    subjectElement.style.right = moved.startSnapshot.anchors.right;
                                    subjectElement.style.top = moved.startSnapshot.anchors.top;
                                    subjectElement.style.height = moved.startSnapshot.anchors.height;
                                    subjectElement.style.bottom = moved.startSnapshot.anchors.bottom;
                                });
                            },
                        });
                    }
                } else {
                    const subject = instance['winnie.wrapper'];
                    self.layout.explorer.goTo(subject);
                    if (!event.ctrlKey) {
                        self.layout.explorer.unselectAll();
                    }
                    self.layout.explorer.select(subject);
                }
            });
            return instance;
        }

        const created = new Wrapper(produce(item.widget), widgetName, defaultInstance, (newName) => {
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
        if (created.delegate instanceof Container &&
                !created.parent &&
                !this.isSurface()) {
            this.toSurface(created);
            this.centerSurface();
        }
        if (wasSelected) {
            if (wasSelected.delegate instanceof Container) {
                this.move(created, wasSelected, wasSelected.count);
            } else if (wasSelected.parent && wasSelected.parent.delegate instanceof Container) {
                this.move(created, wasSelected.parent, wasSelected.parent.count);
            }
        }
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
            self.checkSurface(item);
        }
        const toRemove = this.layout.explorer.selected;
        const actions = toRemove.map((item) => {
            const itemParent = item.parent;
            const ur = {};
            ur.redo = () => {
                const removedAt = itemParent ? itemParent.indexOf(item) : self.forest.indexOf(item);
                if (itemParent) {
                    itemParent.remove(removedAt);
                } else {
                    self.forest.splice(removedAt, 1);
                }
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
            };
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
            header.element.classList.add('p-widget-category-header');
            const content = new Flow(5, 5);
            content.element.classList.add('p-widget-category-content');
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
            itemLabel.element.classList.add('p-widget-palette-item');
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
        this.widgets.forEach((item, name) => {
            item.delegate.element.classList.remove('p-winnie-widget-selected');
        });

        this.layout.explorer.selected.forEach((selectedItem) => {
            selectedItem.delegate.element.classList.add('p-winnie-widget-selected');
        });

        self.undecorate();
        if (this._lastSelected !== item) {
            if (this._lastSelected) {
                this.layout.properties.data = [];
                self.checkEnabled();
            }
            this._lastSelected = item;
            if (this._lastSelected) {
                let sheet;
                if (item.sheet) {
                    sheet = item.sheet;
                } else {
                    const propNames = Object.getOwnPropertyNames(item.delegate);
                    propNames.push(...pathProps);
                    sheet = item.sheet = propNames
                            .filter(key =>
                                typeof item.delegate[key] !== 'function' &&
                                        !generalHiddenProps.has(key) &&
                                        (!(item.delegate instanceof DataGrid) || !datagridHiddenProps.has(key)) &&
                                        (!(item.delegate instanceof ColumnNode) || !datagridColumnsHiddenProps.has(key)) &&
                                        (!(item.delegate instanceof TabbedPane) || !tabbedPaneHiddenProps.has(key)) &&
                                        (!(item.delegate instanceof CardPane) || !tabbedPaneHiddenProps.has(key)) &&
                                        !generalHiddenProps.has(key) &&
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
                                                self.layout.properties.changed(prop);
                                                self.layout.properties.goTo(prop, true);
                                            }
                                            prop.silent = false;
                                            editBody.undo = () => {
                                                if (key.includes('.')) {
                                                    Bound.setPathData(item.delegate, key, oldValue);
                                                } else {
                                                    item.delegate[key] = oldValue;
                                                }
                                                self.layout.properties.changed(prop);
                                                self.layout.properties.goTo(prop, true);
                                            };
                                        }
                                    };
                                    self.edit(editBody);
                                    self.checkEnabled();
                                }, key.includes('.') ? Bound.getPathData(item.defaultInstance, key) : item.defaultInstance[key]);
                                return prop;
                            });
                }
                this.layout.properties.data = sheet
                        .filter(p => !p.name.startsWith('tab.') || item.delegate.parent instanceof TabbedPane);
                self.checkEnabled();
            }
        }
        self.decorate();
    }

    decorate() {
        if (this._lastSelected && this.layout.explorer.selected.length === 1) {
            const self = this;
            const subject = self._lastSelected;
            self.decors = (() => {
                if (subject.delegate.attached) {
                    const decors = resizeDecor(self.layout.widgets, subject.delegate, (prevState, diff) => {
                        const subjectElement = subject.delegate.element;
                        if (diff.x !== 0 || diff.y !== 0) {
                            const newState = {anchors: {
                                    left: subjectElement.style.left,
                                    width: subjectElement.style.width,
                                    right: subjectElement.style.right,
                                    top: subjectElement.style.top,
                                    height: subjectElement.style.height,
                                    bottom: subjectElement.style.bottom
                                }};
                            self.edit({
                                name: `Widget '${subject.name}' resize`,
                                redo: () => {
                                    subjectElement.style.left = newState.anchors.left;
                                    subjectElement.style.width = newState.anchors.width;
                                    subjectElement.style.right = newState.anchors.right;
                                    subjectElement.style.top = newState.anchors.top;
                                    subjectElement.style.height = newState.anchors.height;
                                    subjectElement.style.bottom = newState.anchors.bottom;
                                    self.layout.explorer.goTo(subject, true);
                                },
                                undo: () => {
                                    subjectElement.style.left = prevState.anchors.left;
                                    subjectElement.style.width = prevState.anchors.width;
                                    subjectElement.style.right = prevState.anchors.right;
                                    subjectElement.style.top = prevState.anchors.top;
                                    subjectElement.style.height = prevState.anchors.height;
                                    subjectElement.style.bottom = prevState.anchors.bottom;
                                    self.layout.explorer.goTo(subject, true);
                                },
                            });
                        }
                    });
                    if (subject.delegate.parent instanceof Anchors) {
                        return [decors.lt, decors.lm, decors.lb, decors.mt, decors.mb, decors.rt, decors.rm, decors.rb];
                    } else if (subject.delegate.parent instanceof Box && subject.delegate.parent.orientation === Ui.Orientation.HORIZONTAL) {
                        return [decors.rm];
                    } else if (subject.delegate.parent instanceof Box && subject.delegate.parent.orientation === Ui.Orientation.VERTICAL) {
                        return [decors.mb];
                    } else {
                        return [];
                    }
                } else {
                    return [];
                }
            })()
                    .map((d, i, source) => {
                        self.layout.widgets.element.appendChild(d);
                        d.neightbours = source;
                        d.stick();
                        return d;
                    });
        }
    }

    undecorate() {
        const self = this;
        self.decors.forEach(d => {
            if (d.parentElement) {
                d.parentElement.removeChild(d);
            }
        });
    }

    isSurface() {
        return this.layout.widgets.element.firstElementChild !== this.layout.widgets.element.lastElementChild;
    }

    toSurface(w) {
        this.layout.widgets.element.appendChild(w.delegate.element);
    }

    checkSurface(w) {
        if (w.delegate.element.parentElement === this.layout.widgets.element) {
            this.layout.widgets.element.removeChild(w.delegate.element);
        }
    }

    centerSurface() {
        this.layout.view.element.scrollLeft = (this.layout.widgets.element.offsetWidth - this.layout.view.element.clientWidth) / 2;
        this.layout.view.element.scrollTop = (this.layout.widgets.element.offsetHeight - this.layout.view.element.clientHeight) / 2;
    }
}
