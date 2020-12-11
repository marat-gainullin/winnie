import Invoke from 'septima-utils/invoke';
import Logger from 'septima-utils/logger';
import Ui from 'kenga/utils';
import Bound from 'kenga/bound';
import Widget from 'kenga/widget';
import Container from 'kenga/container';
import Label from 'kenga-labels/label';
import Box from 'kenga-containers/box-pane';
import Toolbar from 'kenga-containers/tool-bar';
import FlowPane from 'kenga-containers/flow-pane';
import Scroll from 'kenga-containers/scroll-pane';
import GridPane from 'kenga-containers/grid-pane';
import Anchors from 'kenga-containers/anchors-pane';
import TabbedPane from 'kenga-containers/tabbed-pane';
import HolyGrailPane from 'kenga-containers/holy-grail-pane';
import CardsPane from 'kenga-containers/card-pane';
import Menu from 'kenga-menu/menu';
import MenuItem from 'kenga-menu/menu-item';
import DataGrid from 'kenga-grid/grid';
import ColumnNode from 'kenga-grid/columns/column-node';
import TextNumberField from './text-number-field';
import ground from './ground';
import i18n from './i18n';
import Wrapper from './winnie-widget';
import reWidth from './rewidth';
import propValueOnRender from './properties/render';
import Shortcuts from './shortcuts';
import {startRectSelection, proceedRectSelection, endRectSelection} from './rect-selection';
import {resizeDecor, mouseDrag, sizeLocationSnapshot, applySizeLocationSnapshot} from './location-size';
import modelToEs6 from './serial/model-to-code';
import modelToJson from './serial/model-to-json';
import Clipboard from './clipboard';
import {produce, produced, rename} from './model/widgets';
import constructorName from './model/classes';
import createProps from './model/properties';

function decapitalize(name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
}

export default class Winnie {
    constructor() {
        function explorerColumnRewidth() {
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
            explorerColumnRewidth();
        }

        this.checkEnabled = checkEnabled;
        const self = this;
        this.settings = {
            grid: {x: 10, y: 10, snap: true},
            undoDepth: 1024 * 1024
        };
        this.paletteDrag = null;
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
        this.layout.paletteExplorerSplit.element.classList.add('p-winnie-palette-explorer');
        this.layout.ground.element.classList.add('p-winnie-ground');
        this.layout.view.element.classList.add('p-winnie-view');
        this.layout.widgets.element.classList.add('p-winnie-widgets');
        this.hints = document.createElement('div');
        this.hints.className = 'p-winnie-hints';
        this.hints.innerHTML = '' +
            '<ul>' +
            `<li class="p-winnie-hint p-winnie-add-hint">${i18n['winnie.add.hint']}</li>` +
            // `<li class="p-winnie-hint p-winnie-edit-hint">${i18n['winnie.edit.hint']}</li>` +
            '</ul>';
        this.layout.widgets.element.appendChild(this.hints);

        Ui.on(this.layout.ground.element, Ui.Events.KEYDOWN, (event) => {
            Shortcuts.winnieKeyDown(self, event);
        });
        Ui.on(this.layout.ground.element, 'paste', event => {
            if (
                !self.layout.explorer.activeEditor &&
                !self.layout.properties.activeEditor
            ) {
                event.stopPropagation();
                event.preventDefault();
                let firstContainer = null;
                const addLog = self.paste(event.clipboardData.getData('text/plain'));
                addLog.forEach((item) => {
                    if (!firstContainer && item.subject.delegate instanceof Container && !item.subject.delegate.parent) {
                        firstContainer = item.subject;
                    }
                });
                if (!self.visualRootPresent() && firstContainer) {
                    self.acceptVisualRoot(firstContainer);
                    self.layout.explorer.goTo(firstContainer, true);
                    self.centerSurface();
                }
            }
        });
        Ui.on(this.layout.widgets.element, Ui.Events.KEYDOWN, (event) => {
            Shortcuts.surfaceKeyDown(self, event);
        });
        Ui.on(this.layout.widgets.element, Ui.Events.CLICK, (event) => {
            if (event.target.className.includes('p-tab-caption-close-tool') || event.target.parentElement.className.includes('p-tab-caption-close-tool')) {
                event.stopPropagation();
            }
        }, true);
        mouseDrag(this.layout.view.element, (event) => {
            return startRectSelection(self.layout.view.element, event);
        }, proceedRectSelection, (start, diff, event) => {
            endRectSelection(self, start, diff, event);
        });
        this.layout.explorer.data = this.forest;
        this.layout.explorer.parentField = 'parent';
        this.layout.explorer.childrenField = 'children';
        this.layout.explorer.onSelect = (evt) => {
            self.lastSelected = evt.item;
            checkEnabled();
        };
        this.layout.widgetColumn.onRender = (item, viewCell) => {
            viewCell.innerHTML = `${item.name} [${item.source.name}]`;
            viewCell.title = `'${item.source.name}' from '${item.source.from}'`;
            if (item.delegate.element === self.visualRootElement()) {
                viewCell.classList.add('p-winnie-visual-root');
            }
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
                                const oldLocationSize = w.delegate instanceof ColumnNode ? {} : sizeLocationSnapshot(w.delegate);
                                if (dest) {
                                    if (source !== dest) {
                                        if (dest.delegate instanceof TabbedPane ||
                                            dest.delegate instanceof CardsPane ||
                                            dest.delegate instanceof GridPane ||
                                            dest.delegate instanceof HolyGrailPane && addAt === 2) {
                                            w.delegate.element.style.left = '';
                                            w.delegate.element.style.width = '';
                                            w.delegate.element.style.right = '';
                                            w.delegate.element.style.top = '';
                                            w.delegate.element.style.height = '';
                                            w.delegate.element.style.bottom = '';
                                        } else if (dest.delegate instanceof Box && dest.delegate.orientation === Ui.Orientation.VERTICAL) {
                                            w.delegate.element.style.left = '';
                                            w.delegate.element.style.width = '';
                                            w.delegate.element.style.right = '';
                                            w.delegate.element.style.top = '';
                                            w.delegate.element.style.bottom = '';
                                        } else if (dest.delegate instanceof Box && dest.delegate.orientation === Ui.Orientation.HORIZONTAL) {
                                            w.delegate.element.style.left = '';
                                            w.delegate.element.style.right = '';
                                            w.delegate.element.style.top = '';
                                            w.delegate.element.style.height = '';
                                            w.delegate.element.style.bottom = '';
                                        }
                                    } else if (dest.delegate instanceof HolyGrailPane) {
                                    }
                                }
                                const newLocationSize = w.delegate instanceof ColumnNode ? {} : sizeLocationSnapshot(w.delegate);
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

                                        if (!(w.delegate instanceof ColumnNode)) {
                                            applySizeLocationSnapshot(newLocationSize, w.delegate);
                                        }
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

                                            if (!(w.delegate instanceof ColumnNode)) {
                                                applySizeLocationSnapshot(oldLocationSize, w.delegate);
                                            }
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
        reWidth(this.layout.paletteExplorerSplit, self.layout.leftSizer, this.layout.view, 1, explorerColumnRewidth);
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
            self.acceptVisualRoot(self._lastSelected);
            self.centerSurface();
            self.layout.explorer.changed(self._lastSelected);
        };
        this.layout.tOpen.onAction = () => {
            checkEnabled();
            self.openJSON();
        };
        this.layout.tTemplates.onAction = () => {
            checkEnabled();
            self.layout.templatesMenu.popupRelativeTo(self.layout.tTemplates.element, false);
        };
        this.layout.tSave.element.onclick = () => {
            checkEnabled();
            self.save();
        };
        this.layout.tExport.element.onclick = () => {
            checkEnabled();
            self.export();
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
            Ui.on(w.element, Ui.Events.CLICK, () => {
                checkEnabled();
                alert(i18n['winnie.paste.via.shortcut']);
            });
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
                self.removeSelected();
            };
        });
        this.layout.tSettings.onAction = () => {
            checkEnabled();
            self.openSettings();
        };
        checkEnabled();
        this._palette = {};
        this._adopts = [];
        this.save = function save() {
            if (this.widgets.size > 0) {
                const generatedJson = modelToJson(this.forest);
                Clipboard.write(generatedJson);
                this.layout.widgets.element.focus();
                Logger.info(i18n['winnie.generated.json.copied']);
                alert(i18n['winnie.generated.json.copied']);
            } else {
                Logger.info(`Can't generate JSON for an empty [forest].`);
            }
        };
    }

    clear() {
        this.clearVisualRoot();
        this.editsCursor = 0;
        this.edits = [];
        this.widgets.clear();
        const removed = this.forest.splice(0, this.forest.length);
        this.layout.explorer.unselectAll();
        this.layout.explorer.removed(removed);
        this.layout.properties.data = [];
    }

    acceptJson(source, initialParent, undoable = false) {
        const self = this;
        const indexed = {};
        Object.keys(self._palette).forEach(c => {
            const category = self._palette[c];
            category.items.forEach((item) => {
                indexed[item.from] = item;
            });
        });
        const addLog = [];

        function adopt(plain, parent) {
            Object.keys(plain).forEach(plainName => {
                const item = plain[plainName];
                const widgetName = self.generateName(plainName);
                const source = indexed[item.from];
                if (source) {
                    const created = new Wrapper(
                        produced(self,
                            source.widget === GridPane ?
                                new GridPane(
                                    'rows' in item.body ? item.body.rows : source.defaultInstance.rows,
                                    'columns' in item.body ? item.body.columns : source.defaultInstance.columns
                                )
                                : new source.widget()
                        ),
                        widgetName,
                        source.defaultInstance,
                        (newName) => {
                            rename(self, created, newName);
                        }
                    );
                    created.source = source;
                    self.widgets.set(widgetName, created);
                    if (parent) {
                        addLog.push({subject: created, parent, at: parent.count});
                        parent.add(created, parent.count);
                    } else {
                        addLog.push({subject: created, parent: null, at: self.forest.length});
                        self.forest.push(created);
                    }
                    for (let p in item.body) {
                        if (!(created.delegate instanceof GridPane) || (p !== 'columns' && p !== 'rows')) {
                            if (p.includes('.')) {
                                Bound.setPathData(created.delegate, p, item.body[p]);
                            } else {
                                created.delegate[p] = item.body[p];
                            }
                        }
                    }
                    created.sheet = createProps(self, created);
                    adopt(item.children, created);
                } else {
                    Logger.info(`Can't read widget '${widgetName}' from unknown module '${item.from}'.`);
                }
            });
        }

        self.layout.explorer.unselectAll();
        adopt(JSON.parse(source), initialParent);
        if (undoable) {
            const editBody = {
                name: `Paste ${addLog.length === 1 ? `'${addLog[0].subject.name}' widget` : `${addLog.length} widgets`} from clipboard`,
                redo: () => {
                },
                undo: () => {
                    self.layout.explorer.unselectAll();
                    addLog
                        .slice(0, addLog.length)
                        .reverse()
                        .forEach((item) => {
                            self.widgets.delete(item.subject.name);
                            if (item.parent) {
                                item.parent.remove(item.at);
                            } else {
                                self.forest.splice(item.at, 1);
                            }
                        });
                    self.layout.explorer.removed(addLog.map(item => item.subject));
                },
            };
            this.edit(editBody);
            editBody.redo = () => {
                self.layout.explorer.unselectAll();
                addLog.forEach((item) => {
                    self.widgets.set(item.subject.name, item.subject);
                    if (item.parent) {
                        item.parent.add(item.subject, item.at);
                    } else {
                        self.forest.splice(item.at, 0, item.subject);
                    }
                });
                self.layout.explorer.added(addLog.map(item => item.subject));
            };
        }
        self.layout.explorer.added(addLog.map(item => item.subject));
        return addLog;
    }

    acceptNatives(natives) {
        const self = this;
        const indexed = {};
        Object.keys(self._palette).forEach(c => {
            const category = self._palette[c];
            category.items.forEach((item) => {
                indexed[item.widget] = item;
            });
        });

        function adopt(natives) {
            return Object.keys(natives)
                .map(widgetName => {
                    const native = natives[widgetName];
                    const source = indexed[native.constructor];
                    if (source) {
                        const created = new Wrapper(produced(self, native), widgetName, source.defaultInstance, (newName) => {
                            rename(self, created, newName);
                        });
                        created.source = source;
                        self.widgets.set(widgetName, created);
                        if (native instanceof ColumnNode) {
                            if (!native.column || !native.column.grid) {
                                self.forest.push(created);
                            }
                        } else if (!native.parent) {
                            self.forest.push(created);
                        }
                        created.sheet = createProps(self, created);
                        return created;
                    } else {
                        Logger.info(`Can't read widget '${widgetName}' because its constructor is not registered.`);
                        return null;
                    }
                })
                .filter(item => !!item);
        }

        const created = adopt(natives);
        this.layout.explorer.added(this.forest);
        return created;
    }

    generateName(base) {
        let widgetName = base;
        let nameAttempt = 1;
        while (this.widgets.has(widgetName)) {
            widgetName = `${base}${nameAttempt++}`;
        }
        return widgetName;
    }

    addWidget(item) {
        const self = this;
        const wasSelected = this._lastSelected;
        const widgetName = this.generateName(decapitalize(constructorName(item.defaultInstance)));
        const created = new Wrapper(produced(self, produce(item.widget, widgetName, self.settings.grid.x, self.settings.grid.y)), widgetName, item.defaultInstance, (newName) => {
            rename(self, created, newName);
        });
        created.source = item;
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
                self.revokeVisualRoot(created);
            }
        });
        if (created.delegate instanceof Container &&
            !created.parent &&
            !this.visualRootPresent()) {
            this.acceptVisualRoot(created);
            if (created.delegate instanceof Container) {
                created.delegate.width = created.delegate.height = 300;
            }
            this.centerSurface();
        }
        if (wasSelected) {
            if (wasSelected.delegate instanceof Container || wasSelected.delegate instanceof DataGrid) {
                this.move(created, wasSelected, wasSelected.count);
                if (created.delegate instanceof Container || created.delegate instanceof DataGrid) {
                    created.delegate.width = created.delegate.height = 100;
                }
            } else if (wasSelected.parent && (wasSelected.parent.delegate instanceof Container || wasSelected.parent.delegate instanceof DataGrid)) {
                this.move(created, wasSelected.parent, wasSelected.parent.count);
                if (created.delegate instanceof Container || created.delegate instanceof DataGrid) {
                    created.delegate.width = created.delegate.height = 100;
                }
            }
        }
        this.checkEnabled();
        return created;
    }

    removeSelected() {
        const self = this;

        function added(item, wasVisualRoot) {
            self.layout.explorer.unselectAll();
            self.layout.explorer.select(item);
            self.layout.explorer.added(item);
            if (wasVisualRoot) {
                self.acceptVisualRoot(item);
            }
        }

        function removed(item) {
            self.layout.explorer.unselect(item);
            self.layout.explorer.removed(item);
            return self.revokeVisualRoot(item);
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
                const wasVisualRoot = removed(item);
                ur.undo = () => {
                    self.widgets.set(item.name, item);
                    if (itemParent) {
                        itemParent.add(item, removedAt);
                        added(item);
                    } else {
                        self.forest.splice(removedAt, 0, item);
                        added(item, wasVisualRoot);
                    }
                };
            };
            return ur;
        });
        this.edit({
            name: `Delete ${toRemove.length > 1 ? `selected (${toRemove.length}) widgets` : `'${toRemove[0].name}' widget`}`,
            redo: () => {
                actions
                    .forEach((item) => {
                        item.redo();
                    });
            },
            undo: () => {
                actions
                    .slice(0, actions.length)
                    .reverse()
                    .forEach((item) => {
                        item.undo();
                    });
            }
        });
        this.checkEnabled();
    }

    copy() {
        if (this.layout.explorer.selected.length > 0) {
            const selected = new Set(this.layout.explorer.selected);
            const toCopy = Array.from(selected)
                .filter(s => {
                    let w = s;
                    while (w.parent) {
                        w = w.parent;
                        if (selected.has(w)) {
                            return false;
                        }
                    }
                    return true;
                });
            const generatedJson = modelToJson(toCopy);
            Clipboard.write(generatedJson);
            this.layout.widgets.element.focus();
            Logger.info(`Copied ${toCopy.length === 1 ? `'${toCopy[0].name}' widget` : `${toCopy.length} widgets`} to clipboard.`);
        }
    }

    paste(source) {
        const self = this;
        if (source) {
            const initialParent = this.lastSelected ? this.lastSelected.delegate instanceof Container ? this.lastSelected : this.lastSelected.parent : null;
            const created = this.acceptJson(source, initialParent, true);
            created.forEach(item => {
                if (item.subject.delegate.parent instanceof Anchors) {
                    item.subject.delegate.left += self.settings.grid.x;
                    item.subject.delegate.top += self.settings.grid.y;
                }
                self.layout.explorer.select(item.subject);
            });
            return created;
        } else {
            return [];
        }
    }

    cut() {
        if (this.layout.explorer.selected.length > 0) {
            this.copy();
            this.removeSelected();
        }
    }

    openJSON() {
        const self = this;
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = false;
        input.accept = '.json';
        input.style.width = input.style.height = '2em';
        input.style.top = input.style.left = '-1000px';
        document.body.appendChild(input);
        Ui.on(input, Ui.Events.CHANGE, () => {
            if (input.value) {
                const reader = new FileReader();
                reader.onload = () => {
                    let firstContainer = null;
                    self.clear();
                    const addLog = self.acceptJson(reader.result);
                    addLog.forEach((item) => {
                        if (!firstContainer && item.subject.delegate instanceof Container && !item.subject.delegate.parent) {
                            firstContainer = item.subject;
                        }
                    });
                    if (firstContainer) {
                        this.acceptVisualRoot(firstContainer);
                        this.layout.explorer.goTo(firstContainer, true);
                        this.centerSurface();
                    }
                };
                reader.readAsText(input.files[0]);
            }
            document.body.removeChild(input);
        });
        Invoke.delayed(60000, () => {
            if (input.parentElement) {
                document.body.removeChild(input);
            }
        });
        input.click();
    }

    openNatives(Natives) {
        let firstContainer = null;
        this.clear();
        this.acceptNatives(new Natives())
            .forEach((item) => {
                if (!firstContainer && item.delegate instanceof Container && !item.delegate.parent) {
                    firstContainer = item;
                }
            });
        if (firstContainer) {
            this.acceptVisualRoot(firstContainer);
            this.layout.explorer.goTo(firstContainer, true);
            this.centerSurface();
        }
        this.layout.widgets.element.focus();
    }

    export() {
        if (this.widgets.size > 0) {
            const generatedCode = modelToEs6(this);
            Clipboard.write(generatedCode);
            this.layout.widgets.element.focus();
            Logger.info(i18n['winnie.generated.es6.copied']);
            alert(i18n['winnie.generated.es6.copied']);
        } else {
            Logger.info(`Can't generate code for an empty [forest].`);
        }
    }

    openSettings() {
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
            Logger.info(`Dropped ${dropped.length} tail edits.`);
        }
        this.editsCursor++;
        while (this.edits.length > this.settings.undoDepth) {
            const shifted = this.edits.shift();
            this.editsCursor--;
            Logger.info(`Dropped head edit: '${shifted.name}'.`);
        }
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
            const content = new FlowPane(5, 5);
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
            if ('description' in item) {
                itemLabel.toolTipText = item.description;
            }
            itemLabel.element.draggable = true;
            Ui.on(itemLabel.element, Ui.Events.DRAGSTART, event => {
                event.stopPropagation();
                self.paletteDrag = {
                    item
                };
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', 'p-winnie-palette-item');
            });
            Ui.on(itemLabel.element, Ui.Events.DRAGEND, event => {
                event.stopPropagation();
                if (self.paletteDrag) {
                    self.paletteDrag = null;
                }
            });
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
                })
                    .map((item) => {
                        return {
                            widget: item.widget,
                            from: item.from,
                            name: item.name,
                            description: item.description,
                            iconStyle: item.iconStyle,
                            category: item.category,
                            hidden: new Set(Array.isArray(item.hidden) ? item.hidden : [])
                        };
                    })
                    .forEach((item) => {
                        try {
                            item.defaultInstance = new item.widget();
                            const itemPaletteItem = paletteItemOf(item);
                            const itemMenuItem = menuItemOf(item);
                            itemMenuItem.onAction = () => {
                                self.addWidget(item);
                            };
                            const category = categoryOf(item);
                            category.palette.content.add(itemPaletteItem);
                            category.menu.add(itemMenuItem);
                            category.items.push(item);
                        } catch (ex) {
                            Logger.info(`Can't add palette item '${item.name}' from '${item.from}' due to exception:`);
                            Logger.severe(ex);
                            Logger.info(`Palette item '${item.name}' from '${item.from}' skipped.`);
                        }
                    });
            }
        };
    }

    get adopts() {
        const self = this;
        return {
            add: (items) => {
                if (!Array.isArray(items))
                    items = [items];
                items.filter((item) => {
                    if (!item.name) {
                        Logger.info(`Can't add anonymous module. Skipping...`);
                        return false;
                    } else if (!item.widgets) {
                        Logger.info(`Can't add module '${item.name}' without 'widgets' field. Skipping...`);
                        return false;
                    } else {
                        return true;
                    }
                })
                    .sort((item1, item2) => {
                        if (item1.name > item2.name) {
                            return 1;
                        } else if (item1.name < item2.name) {
                            return -1;
                        } else {
                            return 0;
                        }
                    })
                    .forEach((item) => {
                        const mi = new MenuItem(item.name);
                        mi.onAction = () => {
                            self.openNatives(item.widgets);
                        };
                        self.layout.templatesMenu.add(mi);
                    });
            }
        };
    }

    get lastSelected() {
        return this._lastSelected;
    }

    set lastSelected(item) {
        const self = this;
        this.widgets
            .forEach((item, name) => {
                if (item.delegate instanceof Widget) {
                    item.delegate.element.classList.remove('p-winnie-widget-selected');
                }
            });
        this.layout.explorer.selected
            .filter(item => item.delegate instanceof Widget)
            .forEach((selectedItem) => {
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
                    item.sheet = sheet = createProps(self, item);
                }
                this.layout.properties.data = sheet
                    .filter(p => !p.name.startsWith('tab.') || item.delegate.parent instanceof TabbedPane);
                self.checkEnabled();
            }
        }
        self.decorate();
    }

    decorate() {
        this.undecorate();
        if (this._lastSelected && this.layout.explorer.selected.length === 1) {
            const self = this;
            const subject = self._lastSelected;
            self.decors = (() => {
                if (subject.delegate.attached) {
                    const decors = resizeDecor(self.layout.widgets, subject.delegate, (prevState, diff) => {
                        const subjectElement = subject.delegate.element;
                        if (diff.x !== 0 || diff.y !== 0) {
                            const newState = {
                                anchors: {
                                    left: subjectElement.style.left,
                                    width: subjectElement.style.width,
                                    right: subjectElement.style.right,
                                    top: subjectElement.style.top,
                                    height: subjectElement.style.height,
                                    bottom: subjectElement.style.bottom
                                }
                            };
                            self.edit({
                                name: `Widget '${subject.name}' resize`,
                                redo: () => {
                                    subjectElement.style.left = newState.anchors.left;
                                    subjectElement.style.width = newState.anchors.width;
                                    subjectElement.style.right = newState.anchors.right;
                                    subjectElement.style.top = newState.anchors.top;
                                    subjectElement.style.height = newState.anchors.height;
                                    subjectElement.style.bottom = newState.anchors.bottom;
                                    self.stickDecors();
                                    self.layout.explorer.goTo(subject, true);
                                },
                                undo: () => {
                                    subjectElement.style.left = prevState.anchors.left;
                                    subjectElement.style.width = prevState.anchors.width;
                                    subjectElement.style.right = prevState.anchors.right;
                                    subjectElement.style.top = prevState.anchors.top;
                                    subjectElement.style.height = prevState.anchors.height;
                                    subjectElement.style.bottom = prevState.anchors.bottom;
                                    self.stickDecors();
                                    self.layout.explorer.goTo(subject, true);
                                },
                            });
                        }
                    });
                    if (subject.delegate.parent instanceof Anchors) {
                        return [decors.lt, decors.lm, decors.lb, decors.mt, decors.mb, decors.rt, decors.rm, decors.rb];
                    } else if (subject.delegate.parent instanceof FlowPane || subject.delegate.parent instanceof Scroll) {
                        return [decors.mb, decors.rm, decors.rb];
                    } else if (subject.delegate.parent instanceof Box && subject.delegate.parent.orientation === Ui.Orientation.VERTICAL) {
                        return [decors.mb];
                    } else if (subject.delegate.parent instanceof Box && subject.delegate.parent.orientation === Ui.Orientation.HORIZONTAL ||
                        subject.delegate.parent instanceof Toolbar) {
                        return [decors.rm];
                    } else if (subject.delegate.parent instanceof HolyGrailPane && subject.delegate.parent.header === subject.delegate) {
                        return [decors.mb];
                    } else if (subject.delegate.parent instanceof HolyGrailPane && subject.delegate.parent.leftSide === subject.delegate) {
                        return [decors.rm];
                    } else if (subject.delegate.parent instanceof HolyGrailPane && subject.delegate.parent.rightSide === subject.delegate) {
                        return [decors.lm];
                    } else if (subject.delegate.parent instanceof HolyGrailPane && subject.delegate.parent.footer === subject.delegate) {
                        return [decors.mt];
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
        this.decors.forEach(d => {
            if (d.parentElement) {
                d.parentElement.removeChild(d);
            }
        });
        this.decors = [];
    }

    visualRootElement() {
        let child = this.layout.widgets.element.firstElementChild;
        while (child) {
            if (child.tagName.toLowerCase() !== 'style' &&
                !child.className.includes('p-winnie-decoration') &&
                !child.className.includes('p-winnie-hint')) {
                return child;
            }
            child = child.nextElementSibling;
        }
        return null;
    }

    visualRootPresent() {
        return !!this.visualRootElement();
    }

    acceptVisualRoot(w) {
        if (!w.delegate.parent) { // Only roots of widgets heirarchy can be accepted as visual root of designer
            const oldVRE = this.visualRootElement();
            if (oldVRE !== w.delegate.element) {
                this.clearVisualRoot();
                this.layout.widgets.element.appendChild(w.delegate.element);
            }
        }
    }

    clearVisualRoot() {
        const vre = this.visualRootElement();
        if (vre) {
            vre.parentElement.removeChild(vre);
        }
    }

    revokeVisualRoot(w) {
        if (w.delegate instanceof Container && w.delegate.element.parentElement === this.layout.widgets.element) {
            this.layout.widgets.element.removeChild(w.delegate.element);
            return true;
        } else {
            return false;
        }
    }

    centerSurface() {
        this.layout.view.element.scrollLeft = (this.layout.widgets.element.offsetWidth - this.layout.view.element.clientWidth) / 2;
        this.layout.view.element.scrollTop = (this.layout.widgets.element.offsetHeight - this.layout.view.element.clientHeight) / 2;
        this.layout.widgets.element.focus();
    }

    stickDecors() {
        this.decors.forEach((d) => {
            d.stick();
        });
    }
}
