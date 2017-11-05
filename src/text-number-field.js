import BoxField from 'kenga/box-field';

class TextNumberField extends BoxField {
    constructor(text, box, shell) {
        if (arguments.length < 1)
            text = '';
        if (!box) {
            box = document.createElement('input');
            box.type = 'text';
        }
        if (!shell) {
            shell = box;
        }
        box.value = text;
        super(box, shell);

        const self = this;
        let value = null;

        function textChanged() {
            const oldValue = value;
            value = box.value === '' ? null : box.value;
            self.fireValueChanged(oldValue);
        }

        Object.defineProperty(this, 'textChanged', {
            enumerable: false,
            get: function () {
                return textChanged;
            }
        });

        Object.defineProperty(this, 'text', {
            get: function () {
                return box.value;
            },
            set: function (aValue) {
                if (box.value !== aValue) {
                    box.value = aValue;
                    textChanged();
                }
            }
        });

        Object.defineProperty(this, 'value', {
            get: function () {
                return value;
            },
            set: function (aValue) {
                const oldValue = value;
                value = aValue !== undefined ? aValue : null;
                box.type = typeof value === 'number' ? 'number' : 'text';
                box.value = value;
                self.fireValueChanged(oldValue);
            }
        });
    }
}

export default TextNumberField;
