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

    get parent() {
        return this.delegate.parent ? this.delegate.parent['winnie.wrapper'] : null;
    }

    get children() {
        return this.delegate.children ? this.delegate.children().map((child) => child['winnie.wrapper']) : [];
    }

    get count(){
        return this.delegate.count;
    }

    indexOf(subject) {
        return this.delegate.indexOf(subject.delegate);
    }

    add(subject, index) {
        this.delegate.add(subject.delegate, index);
    }

    remove(index) {
        const removed = this.delegate.remove(index);
        return removed['winnie.wrapper'];
    }
}

export default WidgetWrapper;