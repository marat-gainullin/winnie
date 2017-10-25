import Ui from 'kenga/utils';
import Grail from 'kenga-containers/holy-grail-pane';
import Box from 'kenga-containers/box-pane';
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
    const ground = new Grail(0, 2);
    const tools = new Toolbar();
    const explorer = new Grid();
    const explorerMenu = new Menu();
    const properties = new Grid();
    const palette = new Box(Ui.Orientation.VERTICAL);
    const widgets = new Flow();
    {
        explorer.insertable = false;
        properties.insertable = properties.deletable = false;
    }


    const view = new Scroll(widgets);
    {
        ground.header = tools;
        ground.leftSide = explorer;
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
    {
        tSave.icon = withStyle('flaticon-save');
        tSave.toolTipText = i18n['winnie.save.tooltip'];
        tCut.icon = withStyle('flaticon-cut');
        tCut.toolTipText = i18n['winnie.cut.tooltip'];
        tCopy.icon = withStyle('flaticon-copy');
        tCopy.toolTipText = i18n['winnie.copy.tooltip'];
        tPaste.icon = withStyle('flaticon-paste');
        tPaste.toolTipText = i18n['winnie.paste.tooltip'];
        tRemove.icon = withStyle('flaticon-delete');
        tRemove.toolTipText = i18n['winnie.remove.tooltip'];

        tUndo.icon = withStyle('flaticon-undo-arrow');
        tUndo.toolTipText = i18n['winnie.undo.tooltip'];
        tRedo.icon = withStyle('flaticon-redo-arrow');
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
    const propValueColumn = new ColumnNode();
    {
        propNameColumn.readonly = true;
        properties.width = 150;
        properties.addColumnNode(propNameColumn);
        properties.addColumnNode(propValueColumn);
        explorer.width = 150;
        explorer.contextMenu = explorerMenu;
    }

    const miAdd = new MenuItem(i18n['winnie.add.name']);
    const miCut = new MenuItem(i18n['winnie.cut.name']);
    const miCopy = new MenuItem(i18n['winnie.copy.name']);
    const miPaste = new MenuItem(i18n['winnie.paste.name']);
    const miUndo = new MenuItem(i18n['winnie.undo.name']);
    const miRedo = new MenuItem(i18n['winnie.redo.name']);
    const miRemove = new MenuItem(i18n['winnie.remove.name']);
    {
        miCut.icon = withStyle('flaticon-cut');
        miCopy.icon = withStyle('flaticon-copy');
        miPaste.icon = withStyle('flaticon-pate');
        miUndo.icon = withStyle('flaticon-undo-arrow');
        miRedo.icon = withStyle('flaticon-redo-arrow');
        miRemove.icon = withStyle('flaticon-delete');
        
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
        explorer,
        explorerMenu,
        properties,
        palette,
        widgets,
        view,
        miAdd,
        miCut,
        miCopy,
        miPaste,
        miRemove,
        propNameColumn,
        propValueColumn,
        tSave,
        tCut,
        tCopy,
        tPaste,
        tRemove
    };
}