class WidgetWrapper {
    constructor(w, name) {
        this.delegate = w;
        this.name = name;
        w['winnie.wrapper'] = this;
    }
    get parent() {
        return this.delegate.parent ? this.delegate.parent['winnie.wrapper'] : null;
    }
    get children() {
        return this.delegate.children ? this.delegate.children().map((child) => child['winnie.wrapper']) : [];
    }
    
    indexOf(subject){
        return this.delegate.indexOf(subject.delegate);
    }
    
    add(subject, index){
        this.delegate.add(subject.delegate, index);
    }
    
    remove(index){
        const removed = this.delegate.remove(index);
        return removed['winnie.wrapper'];
    }
}

export default WidgetWrapper;