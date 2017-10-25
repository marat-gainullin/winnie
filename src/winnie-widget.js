class Widget {
    constructor(w) {
        this.delegate = w;
        w['winnie.wrapper'] = this;
    }
    get parent() {
        return this.delegate.parent['winnie.wrapper'];
    }
    get children() {
        return this.delegate.children().map((child) => child['winnie.wrapper']);
    }
}

export default Widget;