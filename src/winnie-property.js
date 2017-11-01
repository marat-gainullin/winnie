export default class WinnieProperty {

    constructor(target, name, onChange, defaultValue) {
        this.target = target;
        this.name = name;
        this.onChange = onChange;
        this.defaultValue = defaultValue;
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
    
    get edited(){
        return this.value !== this.defaultValue;
    }
}