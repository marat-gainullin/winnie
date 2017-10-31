import Ui from 'kenga/utils';
import Grail from 'kenga-containers/holy-grail-pane';
import Box from 'kenga-containers/box-pane';
import Split from 'kenga-containers/split-pane';
import Flow from 'kenga-containers/flow-pane';
import Toolbar from 'kenga-containers/tool-bar';
import Scroll from 'kenga-containers/scroll-pane';
import Button from 'kenga-buttons/button';
import Grid from 'kenga-grid/grid';
import ColumnNode from 'kenga-grid/columns/column-node';
import Menu from 'kenga-menu/menu';
import MenuItem from 'kenga-menu/menu-item';
import MenuSeparator from 'kenga-menu/menu-separator';
import i18n from './i18n';

export default function Layout() {
    const ground = new Grail(0, 0);
    const tools = new Toolbar();
    const palette = new Box(Ui.Orientation.VERTICAL);
    const explorer = new Grid();
    const widgetColumn = new ColumnNode();
    const paletteExplorerSplit = new Split();
    const explorerMenu = new Menu();
    const properties = new Grid();
    const widgets = new Flow();
    {
        // TODO: remove as soon as possible
        const killMe = new Flow();
        killMe.background = '#fff';
        killMe.width = killMe.height = 300;
        widgets.add(killMe);
        //
    }
    {
        widgetColumn.width = 300;
        widgetColumn.field = 'name';
        paletteExplorerSplit.dividerSize /= 2;
        paletteExplorerSplit.width = 340;
        paletteExplorerSplit.orientation = Ui.Orientation.VERTICAL;
        paletteExplorerSplit.firstWidget = palette;
        paletteExplorerSplit.secondWidget = explorer;
    }
    {
        widgetColumn.title = 'widget.name'
        explorer.addColumnNode(widgetColumn);
        explorer.headerVisible = false;
        explorer.insertable = explorer.deletable = false;
        explorer.draggableRows = true;
        explorer.showHorizontalLines = 
        explorer.showVerticalLines = 
        explorer.showOddRowsInOtherColor = false;
        properties.insertable = properties.deletable = false;
    }

    const view = new Scroll(widgets);
    {
        ground.header = tools;
        ground.leftSide = paletteExplorerSplit;
        ground.content = view;
        ground.rightSide = properties;
    }

    const tSave = new Button();
    const tCut = new Button();
    const tCopy = new Button();
    const tPaste = new Button();
    const tRemove = new Button();
    const tUndo = new Button();
    const tRedo = new Button();
    function withStyle(name) {
        const div = document.createElement('div');
        div.className = name;
        return div;
    }
    function widgetWithStyle(name) {
        const w = new Flow();
        w.element.classList.add(name);
        return w;
    }
    {
        tSave.icon = withStyle('icon-floppy');
        tSave.toolTipText = i18n['winnie.save.tooltip'];
        tCut.icon = withStyle('icon-scissors');
        tCut.toolTipText = i18n['winnie.cut.tooltip'];
        tCopy.icon = withStyle('icon-docs');
        tCopy.toolTipText = i18n['winnie.copy.tooltip'];
        tPaste.icon = withStyle('icon-clipboard');
        tPaste.toolTipText = i18n['winnie.paste.tooltip'];
        tRemove.icon = withStyle('icon-trash');
        tRemove.toolTipText = i18n['winnie.remove.tooltip'];

        tUndo.icon = withStyle('icon-reply-1');
        tUndo.toolTipText = i18n['winnie.undo.tooltip'];
        tRedo.icon = withStyle('icon-forward-1');
        tRedo.toolTipText = i18n['winnie.redo.tooltip'];

        tools.add(tSave);
        tools.add(tCut);
        tools.add(tCopy);
        tools.add(tPaste);
        tools.add(tUndo);
        tools.add(tRedo);
        tools.add(tRemove);
    }
    const propNameColumn = new ColumnNode();
    propNameColumn.title = i18n['winnie.prop.name'];
    propNameColumn.field = 'name';
    const propValueColumn = new ColumnNode();
    propValueColumn.title = i18n['winnie.prop.value'];
    propValueColumn.field = 'value';
    {
        propNameColumn.readonly = true;
        properties.width = 200;
        properties.addColumnNode(propNameColumn);
        properties.addColumnNode(propValueColumn);
        explorer.contextMenu = explorerMenu;
        view.contextMenu = explorerMenu;
    }

    const miAdd = new MenuItem(i18n['winnie.add.name']);
    miAdd.subMenu = new Menu();
    const miCut = new MenuItem(i18n['winnie.cut.name']);
    const miCopy = new MenuItem(i18n['winnie.copy.name']);
    const miPaste = new MenuItem(i18n['winnie.paste.name']);
    const miUndo = new MenuItem(i18n['winnie.undo.name']);
    const miRedo = new MenuItem(i18n['winnie.redo.name']);
    const miRemove = new MenuItem(i18n['winnie.remove.name']);
    {
        miAdd.icon = withStyle('icon-space');
        miCut.icon = withStyle('icon-scissors');
        miCopy.icon = withStyle('icon-docs');
        miPaste.icon = withStyle('icon-clipboard');
        miUndo.icon = withStyle('icon-reply-1');
        miRedo.icon = withStyle('icon-forward-1');
        miRemove.icon = withStyle('icon-trash');
        
        [
            miAdd,
            miCut,
            miCopy,
            miPaste,
            miUndo,
            miRedo,
            miRemove
        ].forEach((mi) => {
            mi.iconTextGap = null;
        });

        explorerMenu.add(miAdd);
        explorerMenu.add(new MenuSeparator());
        explorerMenu.add(miCut);
        explorerMenu.add(miCopy);
        explorerMenu.add(miPaste);
        explorerMenu.add(new MenuSeparator());
        explorerMenu.add(miUndo);
        explorerMenu.add(miRedo);
        explorerMenu.add(new MenuSeparator());
        explorerMenu.add(miRemove);
    }
    return {
        ground,
        tools,
        palette,
        widgetColumn,
        explorer,
        paletteExplorerSplit,
        explorerMenu,
        properties,
        widgets,
        view,
        miAdd,
        miCut,
        miCopy,
        miPaste,
        miUndo,
        miRedo,
        miRemove,
        propNameColumn,
        propValueColumn,
        tSave,
        tCut,
        tCopy,
        tPaste,
        tUndo,
        tRedo,
        tRemove
    };
}