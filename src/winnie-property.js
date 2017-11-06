import Bound from 'kenga/bound';

export default class WinnieProperty {

    constructor(target, name, onChange, defaultValue) {
        this.target = target;
        this.name = name;
        this.onChange = onChange;
        this.defaultValue = defaultValue;
    }

    get value() {
        return this.name.includes('.') ? Bound.getPathData(this.target, this.name) : this.target[this.name];
    }

    set value(newValue) {
        const oldValue = this.value;
        if (oldValue != newValue) { // Warning! Don't edit as !== .
            this.onChange(newValue);
        }
    }

    get edited() {
        return this.value != this.defaultValue; // Warning! Don't edit as !== .
    }
}