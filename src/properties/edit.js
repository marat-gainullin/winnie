import Ui from 'kenga/utils';
import KeyCodes from 'kenga/key-codes';

const CURSOR_OPTIONS = [
    'alias',
    'all-scroll',
    'auto',
    'cell',
    'context-menu',
    'col-resize',
    'copy',
    'crosshair',
    'default',
    'e-resize',
    'ew-resize',
    'grab',
    'grabbing',
    'help',
    'move',
    'n-resize',
    'ne-resize',
    'nesw-resize',
    'ns-resize',
    'nw-resize',
    'nwse-resize',
    'no-drop',
    'none',
    'not-allowed',
    'pointer',
    'progress',
    'row-resize',
    's-resize',
    'se-resize',
    'sw-resize',
    'text',
    'w-resize',
    'wait',
    'zoom-in',
    'zoom-out'
];

const dataLists = new Set()

function dataListOf(propertyName, options) {
    const id = `p-d-winnie-${propertyName}`
    if (!dataLists.has(id)) {
        const list = document.createElement('datalist');
        list.setAttribute('id', id)
        list.innerHTML = options.map((item) => `<option>${item}</option>`).join('');
        document.body.appendChild(list)
        dataLists.add(id)
    }
    return id;
}

function onEdit(item, viewCell) {
    if (item.name === 'cursor') {
        viewCell.innerHTML = '';
        const listId = dataListOf(item.name, CURSOR_OPTIONS)
        const input = document.createElement('input');
        input.setAttribute('id', `p-${listId}`)
        input.setAttribute('list', listId)
        if (item.value) {
            input.value = item.value
        }
        input.classList.add('p-winnie-cell-editor');
        const valueChanged = event => {
            item.silent = true;
            item.value = input.value;
        };
        Ui.on(input, Ui.Events.CHANGE, valueChanged);
        Ui.on(input, Ui.Events.INPUT, valueChanged);
        Ui.on(input, Ui.Events.CLICK, event => {
            event.stopPropagation();
        });
        Ui.on(input, Ui.Events.KEYDOWN, event => {
            event.stopPropagation();
        });
        viewCell.appendChild(input);
    }
}

export default onEdit;
