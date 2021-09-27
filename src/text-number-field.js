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
            // @see set value
            value = box.value === '' ? null : (box.type === 'number' ? +box.value : box.value);
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
                // @see textChanged
                box.type = typeof value === 'number' ? 'number' : 'text';
                /**
                 * Warning! Don't change as `item.value.src` because of auto normalization of URI with access to .src property.
                 * Some environments do it as their local path + the value of `src` attribute and this ends up with something meaningless for runtime.
                 * For example: file:///C:/Users/<user>/AppData/Local/atom/app-1.58.0/resources/app.asar/static/assets/icons/some-icon.svg instead of assets/icons/some-icon.svg .
                 * @see render.js
                 */
                box.value = value && value.src && value.getAttribute ? value.getAttribute('src') : value;
                self.fireValueChanged(oldValue);
            }
        });
    }
}

export default TextNumberField;
