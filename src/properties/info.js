const widgetHidden = new Set([
    'name',
    'top',
    'left',
    'width',
    'height',
    'tab',
    'data',
    'parent',
    'element',
    'count',
    'attached',
    'font', // TODO: Remove this line when font selector will be implemented
    'contextMenu',
    'dropDownMenu',
    'buttonGroup',
    'title',
    'visibleDisplay',
    'winnie.wrapper'
]);
const dataGridColumnsHidden = new Set([
    'children',
    'childrenNodes',
    'depthRemainder',
    'leavesCount',
    'leaf',
    'column',
    'view',
    'renderer',
    'editor',
    'parent',
    'font',
    'winnie.wrapper'
]);
const fieldsHidden = new Set([
    'value',
    'selector'
]);
const pathProps = [
    'element.style.left',
    'element.style.width',
    'element.style.right',
    'element.style.top',
    'element.style.height',
    'element.style.bottom',
    'tab.title',
    'tab.icon',
    'tab.toolTipText',
    'tab.closable'
];

export { widgetHidden, dataGridColumnsHidden, fieldsHidden, pathProps };
