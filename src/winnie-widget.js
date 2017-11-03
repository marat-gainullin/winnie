import Grail from 'kenga-containers/holy-grail-pane';
import Scroll from 'kenga-containers/scroll-pane';
import Split from 'kenga-containers/split-pane';
import Grid from 'kenga-containers/grid-pane';

class WidgetWrapper {
    constructor(w, name, defaultInstance, onRename) {
        this.delegate = w;
        this._name = name;
        this.onRename = onRename;
        this.defaultInstance = defaultInstance;
        w['winnie.wrapper'] = this;
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
        if (this.delegate instanceof Grail) {
            return this.count >= 5;
        } else if (this.delegate instanceof Scroll) {
            return this.count >= 1;
        } else if (this.delegate instanceof Split) {
            return this.count >= 2;
        } else if (this.delegate instanceof Grid) {
            return this.count >= this.delegate.rows * this.delegate.columns;
        } else {
            return false;
        }
    }

    get parent() {
        return this.delegate.parent ? this.delegate.parent['winnie.wrapper'] : null;
    }

    get children() {
        const self = this;
        return (() => {
            if (self.delegate instanceof Grail) {
                return [self.delegate.header, self.delegate.leftSide, self.delegate.content, self.delegate.rightSide, self.delegate.footer];
            } else if (self.delegate instanceof Scroll) {
                return [self.delegate.view];
            } else if (self.delegate instanceof Split) {
                return [self.delegate.first, self.delegate.second];
            } else if (self.delegate instanceof Grid) {
                const children = [];
                for (let row = 0; row < this.delegate.rows; row++) {
                    for (let column = 0; column < this.delegate.columns; column++) {
                        children.push(this.delegate.child(row, column));
                    }
                }
                return children;
            } else {
                return self.delegate.children ? self.delegate.children() : [];
            }
        })()
                .filter(item => !!item)
                .map((child) => child['winnie.wrapper']);
    }

    get count() {
        return this.delegate.count;
    }

    indexOf(subject) {
        if (this.delegate instanceof Grail) {
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
        } else if (this.delegate instanceof Scroll) {
            if (subject.delegate === this.delegate.view) {
                return 0;
            } else {
                return -1;
            }
        } else if (this.delegate instanceof Split) {
            if (subject.delegate === this.delegate.first) {
                return 0;
            } else if (subject.delegate === this.delegate.second) {
                return 1;
            } else {
                return -1;
            }
        } else if (this.delegate instanceof Grid) {
            return this.children.indexOf(subject);
        } else {
            return this.delegate.indexOf(subject.delegate);
        }
    }

    add(subject, index) {
        if (this.delegate instanceof Grail) {
            const children = this.children;
            children.splice(index, 0, subject);
            this.delegate.clear();

            this.delegate.header = children.length > 0 ? children[0].delegate : null;
            this.delegate.leftSide = children.length > 1 ? children[1].delegate : null;
            this.delegate.content = children.length > 2 ? children[2].delegate : null;
            this.delegate.rightSide = children.length > 3 ? children[3].delegate : null;
            this.delegate.footer = children.length > 4 ? children[4].delegate : null;
        } else if (this.delegate instanceof Scroll) {
            this.delegate.view = subject.delegate;
        } else if (this.delegate instanceof Split) {
            const children = this.children;
            children.splice(index, 0, subject);
            this.delegate.clear();
            this.delegate.first = children.length > 0 ? children[0].delegate : null;
            this.delegate.second = children.length > 1 ? children[1].delegate : null;
        } else if (this.delegate instanceof Grid) {
            const children = this.children;
            children.splice(index, 0, subject);
            this.delegate.clear();
            for (let row = 0; row < this.delegate.rows; row++) {
                for (let column = 0; column < this.delegate.columns; column++) {
                    const gIndex = row * this.delegate.columns + column;
                    if (gIndex < children.length) {
                        this.delegate.add(children[gIndex].delegate, row, column);
                    }
                }
            }
        } else {
            this.delegate.add(subject.delegate, index);
        }
    }

    remove(index) {
        if (this.delegate instanceof Grail) {
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
        } else if (this.delegate instanceof Scroll) {
            this.delegate.view = null;
        } else if (this.delegate instanceof Split) {
            const children = this.children;
            children.splice(index, 1);
            this.delegate.first =
                    this.delegate.second = null;
            this.delegate.first = children.length > 0 ? children[0].delegate : null;
            this.delegate.second = children.length > 1 ? children[1].delegate : null;
        } else if (this.delegate instanceof Grid) {
            const children = this.children;
            children.splice(index, 1);
            this.delegate.clear();
            for (let row = 0; row < this.delegate.rows; row++) {
                for (let column = 0; column < this.delegate.columns; column++) {
                    const gIndex = row * this.delegate.columns + column;
                    if (gIndex < children.length) {
                        this.delegate.add(children[gIndex].delegate, row, column);
                    }
                }
            }
        } else {
            this.delegate.remove(index);
        }
    }
}

export default WidgetWrapper;