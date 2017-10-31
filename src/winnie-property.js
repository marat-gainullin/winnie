export default class WinnieProperty {

    constructor(target, name, onChange) {
        this.target = target;
        this.name = name;
        this.onChange = onChange;
    }

    get value() {
        return this.target[this.name];
    }

    set value(newValue) {
        const oldValue = this.target[this.name];
        if (oldValue !== newValue) {
            this.onChange(newValue);
        }
    }
}