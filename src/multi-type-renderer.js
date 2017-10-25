class MultiTypeRenderer {
    get value (){
        return this._value;
    }
    set value (newValue){
        this._value = newValue;
    }
    
    get text (){
        if(typeof this._value === 'string'){
            return this._value;
        } else if(typeof this._value === 'number'){
            return `<input type="number" step="0.01">${this._value}</input>`;
        } else if(typeof this._value === 'boolean'){
            return `<input type="checkbox">${this._value}</input>`;
        }
    }
}

export default MultiTypeRenderer;