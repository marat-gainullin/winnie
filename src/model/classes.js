import BoxField from 'kenga/box-field';
import Container from 'kenga/container';
import Label from 'kenga-labels/label';
import Button from 'kenga-buttons/button';
import CheckBox from 'kenga-buttons/check-box';
import RadioButton from 'kenga-buttons/radio-button';
import Box from 'kenga-containers/box-pane';
import Split from 'kenga-containers/split-pane';
import CardPane from 'kenga-containers/card-pane';
import FlowPane from 'kenga-containers/flow-pane';
import GridPane from 'kenga-containers/grid-pane';
import HolyGrailPane from 'kenga-containers/holy-grail-pane';
import Scroll from 'kenga-containers/scroll-pane';
import Anchors from 'kenga-containers/anchors-pane';
import TabbedPane from 'kenga-containers/tabbed-pane';
import ToolBar from 'kenga-containers/tool-bar';
import Menu from 'kenga-menu/menu';
import MenuBar from 'kenga-menu/menu-bar';
import MenuItem from 'kenga-menu/menu-item';
import DataGrid from 'kenga-grid/grid';
import ColumnNode from 'kenga-grid/columns/column-node';

/**
 * This transformation is necessary due to obfuscation of constructors names.
 * @param {Widget} instance
 * @returns {String}
 */
function constructorName(instance) {
    if (instance instanceof ToolBar) {
        return 'ToolBar';
    } else if (instance instanceof HolyGrailPane) {
        return 'HolyGrailPane';
    } else if (instance instanceof Box) {
        return 'BoxPane';
    } else if (instance instanceof Anchors) {
        return 'AnchorsPane';
    } else if (instance instanceof FlowPane) {
        return 'FlowPane';
    } else if (instance instanceof Scroll) {
        return 'ScrollPane';
    } else if (instance instanceof Split) {
        return 'SplitPane';
    } else if (instance instanceof TabbedPane) {
        return 'TabbedPane';
    } else if (instance instanceof CardPane) {
        return 'CardPane';
    } else if (instance instanceof GridPane) {
        return 'GridPane';
    } else if (instance instanceof Container) {
        return 'Container';
    } else if (instance instanceof BoxField) {
        return 'Field';
    } else if (instance instanceof Label) {
        return 'Label';
    } else if (instance instanceof Button) {
        return 'Button';
    } else if (instance instanceof CheckBox) {
        return 'CheckBox';
    } else if (instance instanceof RadioButton) {
        return 'RadioButton';
    } else if (instance instanceof Menu) {
        return 'Menu';
    } else if (instance instanceof MenuBar) {
        return 'MenuBar';
    } else if (instance instanceof MenuItem) {
        return 'MenuItem';
    } else if (instance instanceof DataGrid) {
        return 'DataGrid';
    } else if (instance instanceof ColumnNode) {
        return 'ColumnNode';
    } else {
        return 'Widget';
    }
}

export default constructorName;