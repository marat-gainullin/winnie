import Ui from 'kenga/utils';
import KeyCodes from 'kenga/key-codes';

const NULL_COLOR = '#e9ebee';
const colorProps = new Set([
    'background',
    'foreground',
    'oddRowsColor',
    'evenRowsColor',
    'linesColor'
]);

function onRender(item, viewCell) {
    if (colorProps.has(item.name)) {
        viewCell.innerHTML = '';
        const input = document.createElement('input');
        input.type = 'color';
        input.classList.add('p-winnie-cell-editor');
        if (item.value) {
            input.value = item.value + '';
        } else {
            input.value = NULL_COLOR;
        }
        const colorChanged = event => {
            item.silent = true;
            item.value = input.value;
        };
        let changeReg = Ui.on(input, Ui.Events.CHANGE, colorChanged);
        let inputReg = Ui.on(input, Ui.Events.INPUT, colorChanged);
        Ui.on(input, Ui.Events.KEYDOWN, event => {
            if (event.keyCode === KeyCodes.KEY_BACKSPACE ||
                event.keyCode === KeyCodes.KEY_DELETE) {
                item.silent = true;
                item.value = null;
                changeReg.removeHandler();
                inputReg.removeHandler();
                try {
                    input.value = NULL_COLOR;
                } finally {
                    changeReg = Ui.on(input, Ui.Events.CHANGE, colorChanged);
                    inputReg = Ui.on(input, Ui.Events.INPUT, colorChanged);
                }
            }
        });
        Ui.on(input, Ui.Events.CLICK, event => {
            event.stopPropagation();
        });
        viewCell.appendChild(input);
    } else if (item.name === 'icon' || item.name === 'tab.icon') {
        if (item.value && item.value.src && item.value.getAttribute) {
            /**
             * Warning! Don't change as `item.value.src` because of auto normalization of URI with access to .src property.
             * Some environments do it as their local path + the value of `src` attribute and this ends up with something meaningless for runtime.
             * For example: file:///C:/Users/<user>/AppData/Local/atom/app-1.58.0/resources/app.asar/static/assets/icons/some-icon.svg instead of assets/icons/some-icon.svg .
             * @see ../text-number-field.js
             */
            viewCell.innerHTML = item.value.getAttribute('src');
        }
    } else if (Array.isArray(item.options)) {
        viewCell.innerHTML = '';
        const input = document.createElement(item.options.length > 1 ? 'select' : 'input');
        if (item.options.length > 1) {
            input.innerHTML = item.options.map(option => `<option>${option}</option>`).join('');
            if (item.value) {
                input.value = item.value
            }
        } else {
            input.setAttribute('readonly', 'true');
            input.setAttribute('style', 'background: transparent');
            if (item.value) {
                input.value = `${item.value} - fixed`
            }
        }
        input.classList.add('p-winnie-cell-editor');
        if (item.options.length > 1) {
            const valueChanged = event => {
                item.silent = true;
                item.value = input.value;
            };
            Ui.on(input, Ui.Events.CHANGE, valueChanged);
            Ui.on(input, Ui.Events.INPUT, valueChanged);
        }
        Ui.on(input, Ui.Events.CLICK, event => {
            event.stopPropagation();
        });
        Ui.on(input, Ui.Events.DBLCLICK, event => {
            event.stopPropagation();
        });
        viewCell.appendChild(input);
    } else if (typeof item.value === 'object') {
        viewCell.innerHTML = item.value && item.value['winnie.wrapper'] && item.value['winnie.wrapper'].name ? item.value['winnie.wrapper'].name : '';
    }
}

export default onRender;
