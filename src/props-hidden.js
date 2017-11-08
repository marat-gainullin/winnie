const generalHiddenProps = new Set([
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
    'contextMenu', // TODO: Remove this line when widget selector will be implemented
    'buttonGroup', // TODO: Remove this line when widget selector will be implemented
    'title',
    'visibleDisplay',
    'winnie.wrapper'
]);
const datagridColumnsHiddenProps = new Set([
    'children',
    'childrenNodes',
    'depthRemainder',
    'leavesCount',
    'leaf',
    'column',
    'view',
    'renderer',
    'editor'
]);
const datagridHiddenProps = new Set([
    'headerLeft',
    'headerRight',
    'frozenLeft',
    'frozenRight',
    'bodyLeft',
    'bodyRight',
    'footerLeft',
    'footerRight',
    'onRender',
    'selected',
    'dynamicCellClassName',
    'activeEditor',
    'rows',
    'columns',
    'viewRows',
    'header',
    'treeIndicatorColumn',
    'columnNodesCount',
    'columnsCount',
    'focusedRow',
    'focusedColumn'
]);

const tabbedPaneHiddenProps = new Set([
    'selected',
    'selectedIndex'
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
export { generalHiddenProps, datagridColumnsHiddenProps, datagridHiddenProps, tabbedPaneHiddenProps, pathProps };
