import Invoke from 'septima-utils/invoke';
import Label from 'kenga-labels/label';
import CheckBox from 'kenga-buttons/check-box';
import Button from 'kenga-buttons/button';
import RadioButton from 'kenga-buttons/radio-button';
import ToggleButton from 'kenga-buttons/toggle-button';
import DropDownButton from 'kenga-buttons/drop-down-button';
import ButtonGroup from 'kenga-containers/button-group';
import AbsolutePane from 'kenga-containers/absolute-pane';
import AnchorsPane from 'kenga-containers/anchors-pane';
import BoxPane from 'kenga-containers/box-pane';
import CardPane from 'kenga-containers/card-pane';
import DesktopPane from 'kenga-containers/desktop-pane';
import FlowPane from 'kenga-containers/flow-pane';
import GridPane from 'kenga-containers/grid-pane';
import HolyGrailPane from 'kenga-containers/holy-grail-pane';
import ScrollPane from 'kenga-containers/scroll-pane';
import TabbedPane from 'kenga-containers/tabbed-pane';
import Toolbar from 'kenga-containers/tool-bar';
import Model from './model';

const model = new Model();
model.palette.add([
    {
        widget: Label,
        from: 'kenga-labels/label',
        name: 'Label',
        description: 'Image with text paragraph',
        //iconStyle: 'kenga-check-box-icon',
        category: 'Buttons'
    },
    {
        widget: CheckBox,
        from: 'kenga-buttons/check-box',
        name: 'Check box',
        description: 'Check box with button group capability',
        iconStyle: 'icon-check',
        category: 'Buttons'
    },
    {
        widget: RadioButton,
        from: 'kenga-buttons/radio-button',
        name: 'Radio button',
        description: 'Radio button with button group capability',
        iconStyle: 'icon-dot-circled',
        category: 'Buttons'
    },
    {
        widget: Button,
        from: 'kenga-buttons/button',
        name: 'Push button',
        description: 'Push button',
        //iconStyle: 'kenga-check-box-icon',
        category: 'Buttons'
    },
    {
        widget: ToggleButton,
        from: 'kenga-buttons/toggle-button',
        name: 'Toggle button',
        description: 'Toggle button with button group capability',
        //iconStyle: 'kenga-check-box-icon',
        category: 'Buttons'
    },
    {
        widget: DropDownButton,
        from: 'kenga-buttons/drop-down-button',
        name: 'Menu button',
        description: 'Button with drop down menu',
        //iconStyle: 'kenga-check-box-icon',
        category: 'Buttons'
    },
    {
        widget: AbsolutePane, from: 'kenga-containers/absolute-pane',
        name: 'Absolute',
        description: 'Container with absolutely positioned children',
        category: 'Containers'
    },
    {
        widget: AnchorsPane, from: 'kenga-containers/anchors-pane',
        category: 'Containers',
        name: 'Anchors',
        description: 'Container with children positioned according to anchors definitions'
    },
    {
        widget: BoxPane, from: 'kenga-containers/box-pane',
        category: 'Box containers',
        name: 'Box',
        description: 'Container with children arranged as a row of as a column'
    },
    {
        widget: Toolbar, from: 'kenga-containers/tool-bar',
        category: 'Box containers',
        name: 'Toolbar',
        description: 'Horizontal box container with left and right chevrons'
    },
    {
        widget: CardPane, from: 'kenga-containers/card-pane',
        category: 'Select containers',
        name: 'Cards',
        description: 'Container of children arranged as a stack of cards'
    },
    {
        widget: TabbedPane, from: 'kenga-containers/tabbed-pane',
        category: 'Select containers',
        name: 'Tabs',
        description: 'Container with every child labeled on the top'
    },
    {
        widget: FlowPane, from: 'kenga-containers/flow-pane',
        name: 'Flow',
        description: 'Container with children in multiple rows and rows wraps',
        category: 'Containers'
    },
    {
        widget: GridPane, from: 'kenga-containers/grid-pane',
        category: 'Containers',
        name: 'Grid',
        description: 'Containers with prefefined grid of children'
    },
    {
        widget: HolyGrailPane, from: 'kenga-containers/holy-grail-pane',
        category: 'Containers',
        name: 'Holy grail',
        description: 'Container with five children used as header, content, footer, left and right sides'
    },
    {
        widget: ScrollPane, from: 'kenga-containers/scroll-pane',
        category: 'Containers',
        name: 'Scroll',
        description: 'Container of a single child and scroll bars'
    },
    {
        widget: DesktopPane, from: 'kenga-containers/desktop-pane',
        category: 'Special containers',
        name: 'Desktop',
        description: 'Container of internal windows. Multi document UI hos.'
    },
    {
        widget: ButtonGroup, from: 'kenga-containers/button-group',
        name: 'Group',
        description: 'Group of radio buttons, menu items and toggle buttons',
        category: 'Special containers'
    }
]);
model.layout.ground.element.style.width = '100%';
model.layout.ground.element.style.height = '100%';
document.body.appendChild(model.layout.ground.element);
Invoke.later(() => {
    model.layout.view.element.scrollLeft = (model.layout.widgets.element.offsetWidth - model.layout.view.element.clientWidth) / 2;
    model.layout.view.element.scrollTop = (model.layout.widgets.element.offsetHeight - model.layout.view.element.clientHeight) / 2;
    model.layout.paletteExplorerSplit.dividerLocation = (model.layout.paletteExplorerSplit.height - model.layout.paletteExplorerSplit.dividerSize) / 2;
});
