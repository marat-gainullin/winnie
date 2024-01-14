import GrailPane from 'kenga-containers/holy-grail-pane';
import ScrollPane from 'kenga-containers/scroll-pane';
import SplitPane from 'kenga-containers/split-pane';
import DataGrid from 'kenga-grid/grid';
import ColumnNode from 'kenga-grid/columns/column-node';
import RadioButton from 'kenga-buttons/radio-button';

class WidgetWrapper {
    constructor(w, name, defaultInstance, onRename) {
        this.delegate = w;
        this._name = name;
        this.onRename = onRename;
        this.defaultInstance = defaultInstance;
        w['winnie.wrapper'] = this;
        // CheckBox instanceof RadioButton, ModelRadioButon instanceof RadioButon, CheckBox instanceof ModelCheckBox
        // So, the following condition is enough for all 4 cases
        if (w instanceof RadioButton && w.box.firstElementChild && w.box.firstElementChild.tagName.toLowerCase() == 'input') {
            w.box.firstElementChild.onclick = () => false
        }
    }

    get name() {
        return this._name;
    }

    set name(v) {
        if (this._name !== v) {
            this.onRename(v);
        }
    }

    get full() {
        if (this.delegate instanceof GrailPane) {
            return this.count >= 5;
        } else if (this.delegate instanceof ScrollPane) {
            return this.count >= 1;
        } else if (this.delegate instanceof SplitPane) {
            return this.count >= 2;
        } else {
            return false;
        }
    }

    get parent() {
        const delegateParent = (() => {
            if (this.delegate instanceof ColumnNode) {
                if (this.delegate.parent == null) {
                    return this.delegate.column.grid;
                } else {
                    return this.delegate.parent;
                }
            } else {
                return this.delegate.parent;
            }
        })();
        return delegateParent ? delegateParent['winnie.wrapper'] : null;
    }

    get children() {
        const self = this;
        return (() => {
            if (self.delegate instanceof GrailPane) {
                return [self.delegate.header, self.delegate.leftSide, self.delegate.content, self.delegate.rightSide, self.delegate.footer];
            } else if (self.delegate instanceof ScrollPane) {
                return [self.delegate.view];
            } else if (self.delegate instanceof SplitPane) {
                return [self.delegate.first, self.delegate.second];
            } else if (self.delegate instanceof DataGrid) {
                return self.delegate.header;
            } else if (self.delegate instanceof ColumnNode) {
                return self.delegate.children;
            } else {
                return self.delegate.children ? self.delegate.children() : [];
            }
        })()
                .filter(item => !!item)
                .map((child) => child['winnie.wrapper']);
    }

    get count() {
        if (this.delegate instanceof DataGrid || this.delegate instanceof ColumnNode) {
            return this.children.length;
        } else {
            return this.delegate.count;
        }
    }

    indexOf(subject) {
        if (this.delegate instanceof DataGrid || this.delegate instanceof ColumnNode) {
            return this.children.indexOf(subject);
        } else {
            if (this.delegate instanceof GrailPane) {
                if (subject.delegate === this.delegate.header) {
                    return 0;
                } else if (subject.delegate === this.delegate.leftSide) {
                    return 1;
                } else if (subject.delegate === this.delegate.content) {
                    return 2;
                } else if (subject.delegate === this.delegate.rightSide) {
                    return 3;
                } else if (subject.delegate === this.delegate.footer) {
                    return 4;
                } else {
                    return -1;
                }
            } else if (this.delegate instanceof ScrollPane) {
                if (subject.delegate === this.delegate.view) {
                    return 0;
                } else {
                    return -1;
                }
            } else if (this.delegate instanceof SplitPane) {
                if (subject.delegate === this.delegate.first) {
                    return 0;
                } else if (subject.delegate === this.delegate.second) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                return this.delegate.indexOf(subject.delegate);
            }
        }
    }

    add(subject, index) {
        if (this.delegate instanceof DataGrid || this.delegate instanceof ColumnNode) {
            this.delegate.insertColumnNode(index, subject.delegate);
        } else if (this.delegate instanceof GrailPane) {
            const children = this.children;
            children.splice(index, 0, subject);
            this.delegate.clear();

            this.delegate.header = children.length > 0 ? children[0].delegate : null;
            this.delegate.leftSide = children.length > 1 ? children[1].delegate : null;
            this.delegate.content = children.length > 2 ? children[2].delegate : null;
            this.delegate.rightSide = children.length > 3 ? children[3].delegate : null;
            this.delegate.footer = children.length > 4 ? children[4].delegate : null;
        } else if (this.delegate instanceof ScrollPane) {
            this.delegate.view = subject.delegate;
        } else if (this.delegate instanceof SplitPane) {
            const children = this.children;
            children.splice(index, 0, subject);
            this.delegate.clear();
            this.delegate.first = children.length > 0 ? children[0].delegate : null;
            this.delegate.second = children.length > 1 ? children[1].delegate : null;
        } else {
            this.delegate.add(subject.delegate, index);
        }
    }

    remove(index) {
        if (this.delegate instanceof DataGrid || this.delegate instanceof ColumnNode) {
            this.delegate.removeColumnNodeAt(index);
        } else if (this.delegate instanceof GrailPane) {
            const children = this.children;
            children.splice(index, 1);
            this.delegate.header =
                    this.delegate.leftSide =
                    this.delegate.content =
                    this.delegate.rightSide =
                    this.delegate.footer = null;
            this.delegate.header = children.length > 0 ? children[0].delegate : null;
            this.delegate.leftSide = children.length > 1 ? children[1].delegate : null;
            this.delegate.content = children.length > 2 ? children[2].delegate : null;
            this.delegate.rightSide = children.length > 3 ? children[3].delegate : null;
            this.delegate.footer = children.length > 4 ? children[4].delegate : null;
        } else if (this.delegate instanceof ScrollPane) {
            this.delegate.view = null;
        } else if (this.delegate instanceof SplitPane) {
            const children = this.children;
            children.splice(index, 1);
            this.delegate.first =
                    this.delegate.second = null;
            this.delegate.first = children.length > 0 ? children[0].delegate : null;
            this.delegate.second = children.length > 1 ? children[1].delegate : null;
        } else {
            this.delegate.remove(index);
        }
    }
}

export default WidgetWrapper;
