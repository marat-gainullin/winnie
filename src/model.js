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
import MultiTypeRenderer from './multi-type-renderer';

export default class Winnie {
    constructor() {
        const enabled = [];
        function check() {
            Invoke.later(() => {
                enabled.forEach((check) => {
                    check();
                });
            });
        }

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
        this.layout.explorer.draggableRows = true;
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
                check();
                self.cut();
            };
        });
        [this.layout.tCopy, this.layout.miCopy].forEach((w) => {
            enabled.push(() => {
                w.enabled = self.layout.explorer.selected.length > 0;
            });
            w.onAction = () => {
                check();
                self.copy();
            };
        });
        [this.layout.tPaste, this.layout.miPaste].forEach((w) => {
            w.onAction = () => {
                check();
                self.paste();
            };
        });
        [this.layout.tUndo, this.layout.miUndo].forEach((w) => {
            enabled.push(() => {
                w.enabled = self.layout.explorer.selected.length > 0;
            });
            w.onAction = () => {
                check();
                self.undo();
            };
        });
        [this.layout.tRedo, this.layout.miRedo].forEach((w) => {
            enabled.push(() => {
                w.enabled = self.layout.explorer.selected.length > 0;
            });
            w.onAction = () => {
                check();
                self.redo();
            };
        });
        [this.layout.tRemove, this.layout.miRemove].forEach((w) => {
            enabled.push(() => {
                w.enabled = self.layout.explorer.selected.length > 0;
            });
            w.onAction = () => {
                check();
                self.remove(self.layout.explorer.selected);
            };
        });
        check();
        this._palette = {};
    }

    start(w) {
        this.editsCursor = 0;
        this.edits = [];
        edit(w);
    }

    end() {
        this.editsCursor = 0;
        this.edits = [];
        clear();
    }

    edit(w) {
        this.clear();
        this.layout.widgets.add(w);
    }

    clear() {
        this.layout.widgets.clear();
    }

    get canRedo() {
        return this.editsCursor >= 0 && this.editsCursor < this.edits.length;
    }

    redo() {
        if (this.canRedo) {
            this.edits[this.editsCursor++].redo();
        }
    }

    get canUndo() {
        return this.editsCursor > 0 && this.editsCursor <= this.edits.length;
    }

    undo() {
        if (this.canUndo) {
            this.edits[--this.editsCursor].undo();
        }
    }

    action(body) {
        const dropped = this.edits.splice(this.editsCursor, this.edits.length - this.editsCursor, body);
        Logger.info(`Dropped ${dropped.length} editing actions.`);
        this.editsCursor++;
        body.redo();
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
                if(headerIcon.classList.contains('icon-down-open')){
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
}
