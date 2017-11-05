import Label from 'kenga-labels/label';
import CheckBox from 'kenga-buttons/check-box';
import Button from 'kenga-buttons/button';
import RadioButton from 'kenga-buttons/radio-button';
import ToggleButton from 'kenga-buttons/toggle-button';
import DropDownButton from 'kenga-buttons/drop-down-button';
//
import ModelCheckBox from 'kenga-model-buttons/model-check-box';
import ModelRadioButton from 'kenga-model-buttons/model-radio-button';
import ModelToggleButton from 'kenga-model-buttons/model-toggle-button';
//
import AnchorsPane from 'kenga-containers/anchors-pane';
import BoxPane from 'kenga-containers/box-pane';
import CardPane from 'kenga-containers/card-pane';
import DesktopPane from 'kenga-containers/desktop-pane';
import FlowPane from 'kenga-containers/flow-pane';
import GridPane from 'kenga-containers/grid-pane';
import HolyGrailPane from 'kenga-containers/holy-grail-pane';
import ScrollPane from 'kenga-containers/scroll-pane';
import SplitPane from 'kenga-containers/split-pane';
import TabbedPane from 'kenga-containers/tabbed-pane';
import Toolbar from 'kenga-containers/tool-bar';
//
import ColorField from 'kenga-fields/color-field';
import DateField from 'kenga-fields/date-field';
import DateTimeField from 'kenga-fields/date-time-field';
import DropDownField from 'kenga-fields/drop-down-field';
import EMailField from 'kenga-fields/email-field';
import FormattedField from 'kenga-fields/formatted-field';
import MeterField from 'kenga-fields/meter-field';
import NumberField from 'kenga-fields/number-field';
import PasswordField from 'kenga-fields/password-field';
import PhoneField from 'kenga-fields/phone-field';
import ProgressField from 'kenga-fields/progress-field';
import RichTextArea from 'kenga-fields/rich-text-area';
import Slider from 'kenga-fields/slider';
import TextArea from 'kenga-fields/text-area';
import TextField from 'kenga-fields/text-field';
import TimeField from 'kenga-fields/time-field';
import UrlField from 'kenga-fields/url-field';
//
import ModelColorField from 'kenga-model-fields/model-color-field';
import ModelDateField from 'kenga-model-fields/model-date-field';
import ModelDateTimeField from 'kenga-model-fields/model-date-time-field';
import ModelDropDownField from 'kenga-model-fields/model-drop-down-field';
import ModelEMailField from 'kenga-model-fields/model-email-field';
import ModelFormattedField from 'kenga-model-fields/model-formatted-field';
import ModelMeterField from 'kenga-model-fields/model-meter-field';
import ModelNumberField from 'kenga-model-fields/model-number-field';
import ModelPasswordField from 'kenga-model-fields/model-password-field';
import ModelPhoneField from 'kenga-model-fields/model-phone-field';
import ModelProgressField from 'kenga-model-fields/model-progress-field';
import ModelRichTextArea from 'kenga-model-fields/model-rich-text-area';
import ModelSlider from 'kenga-model-fields/model-slider';
import ModelTextArea from 'kenga-model-fields/model-text-area';
import ModelTextField from 'kenga-model-fields/model-text-field';
import ModelTimeField from 'kenga-model-fields/model-time-field';
import ModelUrlField from 'kenga-model-fields/model-url-field';
//
import Menu from 'kenga-menu/menu';
import MenuBar from 'kenga-menu/menu-bar';
import MenuItem from 'kenga-menu/menu-item';
import MenuSeparator from 'kenga-menu/menu-separator';
import CheckBoxMenuItem from 'kenga-menu/check-box-menu-item';
import RadioButtonMenuItem from 'kenga-menu/radio-button-menu-item';
//
import DataGrid from 'kenga-grid/grid';
import ColumnNode from 'kenga-grid/columns/column-node';
import CheckBoxServiceNode from 'kenga-grid/columns/nodes/check-box-service-node';
import MarkerServiceNode from 'kenga-grid/columns/nodes/marker-service-node';
import OrderNumServiceNode from 'kenga-grid/columns/nodes/order-num-service-node';
import RadioButtonServiceNode from 'kenga-grid/columns/nodes/radio-button-service-node';

export default [
    {
        widget: Label,
        from: 'kenga-labels/label',
        name: 'Label',
        description: 'Image with text paragraph',
        //iconStyle: 'kenga-check-box-icon',
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
        widget: DropDownButton,
        from: 'kenga-buttons/drop-down-button',
        name: 'Split button',
        description: 'Button with drop down menu',
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
        widget: ToggleButton,
        from: 'kenga-buttons/toggle-button',
        name: 'Toggle button',
        description: 'Toggle button with button group capability',
        //iconStyle: 'kenga-check-box-icon',
        category: 'Buttons'
    },
    //
    {
        widget: ModelCheckBox,
        from: 'kenga-buttons/model-check-box',
        name: 'Model check box',
        description: 'Model check box with data bindnig and button group capability',
        iconStyle: 'icon-check',
        category: 'Model buttons'
    },
    {
        widget: ModelRadioButton,
        from: 'kenga-buttons/model-radio-button',
        name: 'Model radio button',
        description: 'Radio button with data bindnig and button group capability',
        iconStyle: 'icon-dot-circled',
        category: 'Model buttons'
    },
    {
        widget: ModelToggleButton,
        from: 'kenga-buttons/model-toggle-button',
        name: 'Model toggle button',
        description: 'Model toggle button with data bindnig and button group capability',
        //iconStyle: 'kenga-check-box-icon',
        category: 'Model buttons'
    },
    //
    {
        widget: AnchorsPane, from: 'kenga-containers/anchors-pane',
        category: 'Containers',
        name: 'Anchors',
        description: 'Container with children positioned according to anchors definitions'
    },
    {
        widget: CardPane, from: 'kenga-containers/card-pane',
        category: 'Stacks',
        name: 'Cards',
        description: 'Container of children arranged as a stack of cards'
    },
    {
        widget: TabbedPane, from: 'kenga-containers/tabbed-pane',
        category: 'Stacks',
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
        description: 'Containers with prefefined grid of children with equal spacing'
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
        widget: SplitPane, from: 'kenga-containers/split-pane',
        category: 'Containers',
        name: 'Split',
        description: 'Container with two widgets and splitter.'
    },
    {
        widget: DesktopPane, from: 'kenga-containers/desktop-pane',
        category: 'Containers',
        name: 'Desktop',
        description: 'Container of internal windows. Multi document UI host.'
    },
    {
        widget: BoxPane, from: 'kenga-containers/box-pane',
        category: 'Boxes',
        name: 'Box',
        description: 'Container with children arranged as a row of as a column'
    },
    {
        widget: Toolbar, from: 'kenga-containers/tool-bar',
        category: 'Boxes',
        name: 'Toolbar',
        description: 'Horizontal box container with left and right chevrons'
    },
    //
    {
        widget: ColorField, from: 'kenga-fields/color-field',
        category: 'Fields',
        name: 'Color field',
        decription: 'Color field'
    },
    {
        widget: DateField, from: 'kenga-fields/date-field',
        category: 'Fields',
        name: 'Date field',
        decription: 'Date field'
    },
    {
        widget: DateTimeField, from: 'kenga-fields/date-time-field',
        category: 'Fields',
        name: 'Date time field',
        decription: 'Date time field'
    },
    {
        widget: DropDownField, from: 'kenga-fields/drop-down-field',
        category: 'Fields',
        name: 'Drop down field',
        decription: 'Drop down field'
    },
    {
        widget: EMailField, from: 'kenga-fields/email-field',
        category: 'Fields',
        name: 'E-mail field',
        decription: 'E-mail field'
    },
    {
        widget: FormattedField, from: 'kenga-fields/formatted-field',
        category: 'Fields',
        name: 'Formatted field',
        decription: 'Formatted field'
    },
    {
        widget: MeterField, from: 'kenga-fields/meter-field',
        category: 'Fields',
        name: 'Meter field',
        decription: 'Meter field'
    },
    {
        widget: NumberField, from: 'kenga-fields/number-field',
        category: 'Fields',
        name: 'Number field',
        decription: 'Number field'
    },
    {
        widget: PasswordField, from: 'kenga-fields/password-field',
        category: 'Fields',
        name: 'Password field',
        decription: 'Password field'
    },
    {
        widget: PhoneField, from: 'kenga-fields/phone-field',
        category: 'Fields',
        name: 'Phone field',
        decription: 'Phone field'
    },
    {
        widget: ProgressField, from: 'kenga-fields/progress-field',
        category: 'Fields',
        name: 'Progress field',
        decription: 'Progress field'
    },
    {
        widget: RichTextArea, from: 'kenga-fields/rich-text-area',
        category: 'Fields',
        name: 'Rich text area',
        decription: 'Multi line rich text area'
    },
    {
        widget: Slider, from: 'kenga-fields/slider',
        category: 'Fields',
        name: 'Slider',
        decription: 'Slider'
    },
    {
        widget: TextArea, from: 'kenga-fields/text-area',
        category: 'Fields',
        name: 'Text area',
        decription: 'Multiline text area'
    },
    {
        widget: TextField, from: 'kenga-fields/text-field',
        category: 'Fields',
        name: 'Text field',
        decription: 'Single line text field'
    },
    {
        widget: TimeField, from: 'kenga-fields/time-field',
        category: 'Fields',
        name: 'Time field',
        decription: 'Time field'
    },
    {
        widget: UrlField, from: 'kenga-fields/url-field',
        category: 'Fields',
        name: 'Url field',
        decription: 'Url field'
    },
    //
    {
        widget: ModelColorField, from: 'kenga-fields/model-color-field',
        category: 'Model fields',
        name: 'Model color field',
        decription: 'Color field with data binding'
    },
    {
        widget: ModelDateField, from: 'kenga-fields/model-date-field',
        category: 'Model fields',
        name: 'Model date field',
        decription: 'Date field with data binding'
    },
    {
        widget: ModelDateTimeField, from: 'kenga-fields/model-date-time-field',
        category: 'Model fields',
        name: 'Model date time field',
        decription: 'Date time field with data binding'
    },
    {
        widget: ModelDropDownField, from: 'kenga-fields/model-drop-down-field',
        category: 'Model fields',
        name: 'Model drop down field',
        decription: 'Drop down field with data binding of value and of datalist as well'
    },
    {
        widget: ModelEMailField, from: 'kenga-fields/model-email-field',
        category: 'Model fields',
        name: 'Model e-mail field',
        decription: 'EMail field with data binding'
    },
    {
        widget: ModelFormattedField, from: 'kenga-fields/model-formatted-field',
        category: 'Model fields',
        name: 'Model formatted field',
        decription: 'Formatted field with data binding'
    },
    {
        widget: ModelMeterField, from: 'kenga-fields/model-meter-field',
        category: 'Model fields',
        name: 'Model meter field',
        decription: 'Meter field with data binding'
    },
    {
        widget: ModelNumberField, from: 'kenga-fields/model-number-field',
        category: 'Model fields',
        name: 'Model number field',
        decription: 'Number field with data binding'
    },
    {
        widget: ModelPasswordField, from: 'kenga-fields/model-password-field',
        category: 'Model fields',
        name: 'Model password field',
        decription: 'Password field with data binding'
    },
    {
        widget: ModelPhoneField, from: 'kenga-fields/model-phone-field',
        category: 'Model fields',
        name: 'Model phone field',
        decription: 'Phone field with data binding'
    },
    {
        widget: ModelProgressField, from: 'kenga-fields/model-progress-field',
        category: 'Model fields',
        name: 'Model progress field',
        decription: 'Progress field with data binding'
    },
    {
        widget: ModelRichTextArea, from: 'kenga-fields/model-rich-text-area',
        category: 'Model fields',
        name: 'Model rich text area',
        decription: 'Rich text area with data binding'
    },
    {
        widget: ModelSlider, from: 'kenga-fields/model-slider',
        category: 'Model fields',
        name: 'Model slider',
        decription: 'Slider with data binding'
    },
    {
        widget: ModelTextArea, from: 'kenga-fields/model-text-area',
        category: 'Model fields',
        name: 'Model text area',
        decription: 'Text area with data binding'
    },
    {
        widget: ModelTextField, from: 'kenga-fields/model-text-field',
        category: 'Model fields',
        name: 'Model text field',
        decription: 'Text field with data binding'
    },
    {
        widget: ModelTimeField, from: 'kenga-fields/model-time-field',
        category: 'Model fields',
        name: 'Model Time field',
        decription: 'Time field with data binding'
    },
    {
        widget: ModelUrlField, from: 'kenga-fields/model-url-field',
        category: 'Model fields',
        name: 'Model URL field',
        decription: 'URL field field with data binding'
    },
    {
        widget: Menu, from: 'kenga-menu/menu',
        category: 'Menu',
        name: 'Menu',
        decription: 'Menu items container'
    },
    {
        widget: MenuBar, from: 'kenga-menu/menu-bar',
        category: 'Menu',
        name: 'Menu bar',
        decription: 'Horizontal menu items container'
    },
    {
        widget: MenuItem, from: 'kenga-menu/menu-item',
        category: 'Menu',
        name: 'Menu item',
        decription: 'Menu item with text and optional icon'
    },
    {
        widget: MenuSeparator, from: 'kenga-menu/menu-separator',
        category: 'Menu',
        name: 'Menu separator',
        decription: 'Separator of menu items'
    },
    {
        widget: CheckBoxMenuItem, from: 'kenga-menu/check-box-menu-item',
        category: 'Menu',
        name: 'Chec box menu item',
        decription: 'Menu item with check box instead of icon'
    },
    {
        widget: RadioButtonMenuItem, from: 'kenga-menu/radio-button-menu-item',
        category: 'Menu',
        name: 'Radio button menu item',
        decription: 'Menu item with radio button instead of icon'
    },
//
    {
        widget: DataGrid, from: 'kenga-grid/grid',
        category: 'Model grid & columns',
        name: 'Grid',
        decription: 'Data grid with binding, multi level header, tree grid capability, sorting, rows DnD, etc.'
    },
    {
        widget: ColumnNode, from: 'kenga-grid/columns/column-node',
        category: 'Model grid & columns',
        name: 'Column',
        decription: 'Column node of data grid header'
    },
    {
        widget: CheckBoxServiceNode, from: 'kenga-grid/columns/nodes/check-box-service-node',
        category: 'Model grid & columns',
        name: 'Check column',
        decription: 'Column node of data grid header with check box. Governs selection of rows'
    },
    {
        widget: MarkerServiceNode, from: 'kenga-grid/columns/nodes/marker-service-node',
        category: 'Model grid & columns',
        name: 'Marker column',
        decription: 'Service column node of data grid header. Presents current state of a row'
    },
    {
        widget: OrderNumServiceNode, from: 'kenga-grid/columns/nodes/order-num-service-node',
        category: 'Model grid & columns',
        name: 'Ordinal column',
        decription: "Service column node of data grid header. Presents row's ordinal number"
    },
    {
        widget: RadioButtonServiceNode, from: 'kenga-grid/columns/nodes/radio-button-service-node',
        category: 'Model grid & columns',
        name: 'Radio column',
        decription: 'Column node of data grid header with radio button. Governs selection of rows'
    }
];