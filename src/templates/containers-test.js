import Button from 'kenga-buttons/button';
import CheckBox from 'kenga-buttons/check-box';
import DropDownButton from 'kenga-buttons/drop-down-button';
import RadioButton from 'kenga-buttons/radio-button';
import ToggleButton from 'kenga-buttons/toggle-button';
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
import ToolBar from 'kenga-containers/tool-bar';
import DateField from 'kenga-fields/date-field';
import DateTimeField from 'kenga-fields/date-time-field';
import EmailField from 'kenga-fields/email-field';
import NumberField from 'kenga-fields/number-field';
import Label from 'kenga-labels/label';
import Menu from 'kenga-menu/menu';
import MenuItem from 'kenga-menu/menu-item';
import MenuSeparator from 'kenga-menu/menu-separator';
import ModelCheckBox from 'kenga-model-buttons/model-check-box';
import ModelRadioButton from 'kenga-model-buttons/model-radio-button';
import ModelToggleButton from 'kenga-model-buttons/model-toggle-button';

class KengaWidgets {
    constructor () {
        const anchorsPane = new AnchorsPane();
        this.anchorsPane = anchorsPane;
        const container = new Menu();
        this.container = container;
        const menuItem = new MenuItem();
        this.menuItem = menuItem;
        const menuItem1 = new MenuItem();
        this.menuItem1 = menuItem1;
        const widget = new MenuSeparator();
        this.widget = widget;
        const menuItem11 = new MenuItem();
        this.menuItem11 = menuItem11;
        const boxPane = new BoxPane();
        this.boxPane = boxPane;
        const button = new Button();
        this.button = button;
        const button1 = new Button();
        this.button1 = button1;
        const button11 = new Button();
        this.button11 = button11;
        const button12 = new Button();
        this.button12 = button12;
        const boxPane1 = new ToolBar();
        this.boxPane1 = boxPane1;
        const radioButton = new RadioButton();
        this.radioButton = radioButton;
        const button2 = new Button();
        this.button2 = button2;
        const button21 = new Button();
        this.button21 = button21;
        const button22 = new Button();
        this.button22 = button22;
        const button23 = new Button();
        this.button23 = button23;
        const button24 = new Button();
        this.button24 = button24;
        const cardPane = new CardPane();
        this.cardPane = cardPane;
        const radioButton1 = new ModelRadioButton();
        this.radioButton1 = radioButton1;
        const checkBox = new ModelCheckBox();
        this.checkBox = checkBox;
        const button3 = new ModelToggleButton();
        this.button3 = button3;
        const tabbedPane = new TabbedPane();
        this.tabbedPane = tabbedPane;
        const button4 = new Button();
        this.button4 = button4;
        const field = new DateField();
        this.field = field;
        const flowPane = new FlowPane();
        this.flowPane = flowPane;
        const button5 = new ModelToggleButton();
        this.button5 = button5;
        const button51 = new ModelToggleButton();
        this.button51 = button51;
        const button52 = new ModelToggleButton();
        this.button52 = button52;
        const button53 = new ModelToggleButton();
        this.button53 = button53;
        const button54 = new ModelToggleButton();
        this.button54 = button54;
        const button55 = new ModelToggleButton();
        this.button55 = button55;
        const button56 = new ModelToggleButton();
        this.button56 = button56;
        const gridPane = new GridPane(4, 3);
        this.gridPane = gridPane;
        const button6 = new Button();
        this.button6 = button6;
        const button7 = new Button();
        this.button7 = button7;
        const button8 = new DropDownButton();
        this.button8 = button8;
        const button9 = new ToggleButton();
        this.button9 = button9;
        const button13 = new Button();
        this.button13 = button13;
        const button14 = new DropDownButton();
        this.button14 = button14;
        const button16 = new Button();
        this.button16 = button16;
        const button17 = new DropDownButton();
        this.button17 = button17;
        const button18 = new DropDownButton();
        this.button18 = button18;
        const button20 = new DropDownButton();
        this.button20 = button20;
        const container1 = new HolyGrailPane();
        this.container1 = container1;
        const container2 = new HolyGrailPane();
        this.container2 = container2;
        const field1 = new DateField();
        this.field1 = field1;
        const field2 = new DateTimeField();
        this.field2 = field2;
        const field3 = new EmailField();
        this.field3 = field3;
        const button25 = new Button();
        this.button25 = button25;
        const button26 = new DropDownButton();
        this.button26 = button26;
        const scrollPane = new ScrollPane();
        this.scrollPane = scrollPane;
        const button27 = new ModelToggleButton();
        this.button27 = button27;
        const splitPane = new SplitPane();
        this.splitPane = splitPane;
        const button28 = new Button();
        this.button28 = button28;
        const button29 = new DropDownButton();
        this.button29 = button29;
        const anchorsPane1 = new DesktopPane();
        this.anchorsPane1 = anchorsPane1;
        const field4 = new NumberField();
        this.field4 = field4;
        const label = new Label();
        this.label = label;
        const radioButton2 = new RadioButton();
        this.radioButton2 = radioButton2;
        const checkBox1 = new CheckBox();
        this.checkBox1 = checkBox1;
        anchorsPane.add(boxPane);
        anchorsPane.add(boxPane1);
        anchorsPane.add(cardPane);
        anchorsPane.add(tabbedPane);
        anchorsPane.add(flowPane);
        anchorsPane.add(gridPane);
        anchorsPane.add(container2);
        anchorsPane.add(scrollPane);
        anchorsPane.add(splitPane);
        anchorsPane.add(anchorsPane1);
        container.add(menuItem);
        container.add(menuItem1);
        container.add(widget);
        container.add(menuItem11);
        boxPane.add(button);
        boxPane.add(button1);
        boxPane.add(button11);
        boxPane.add(button12);
        boxPane1.add(radioButton);
        boxPane1.add(button2);
        boxPane1.add(button21);
        boxPane1.add(button22);
        boxPane1.add(button23);
        boxPane1.add(button24);
        cardPane.add(checkBox);
        cardPane.add(radioButton1);
        cardPane.add(button3);
        tabbedPane.add(button4);
        tabbedPane.add(field);
        tabbedPane.add(container1);
        flowPane.add(button5);
        flowPane.add(button51);
        flowPane.add(button52);
        flowPane.add(button53);
        flowPane.add(button54);
        flowPane.add(button55);
        flowPane.add(button56);
        gridPane.add(button6);
        gridPane.add(button7);
        gridPane.add(radioButton2);
        gridPane.add(button8);
        gridPane.add(button9);
        gridPane.add(button13);
        gridPane.add(button14);
        gridPane.add(label);
        gridPane.add(button16);
        gridPane.add(button17);
        gridPane.add(checkBox1);
        gridPane.add(button20);
        container2.add(button26);
        scrollPane.add(button27);
        splitPane.add(button28);
        splitPane.add(button29);
        anchorsPane1.add(field4);
        {
            anchorsPane.element.style.width = '500px';
            anchorsPane.element.style.height = '800px';
        }
        {

        }
        {
            menuItem.text = 'menuItem';
        }
        {
            menuItem1.text = 'menuItem1';
        }
        {

        }
        {
            menuItem11.text = 'menuItem1';
        }
        {
            boxPane.hgap = 10;
            boxPane.vgap = 10;
            boxPane.orientation = 'vertical';
            boxPane.element.style.left = '9px';
            boxPane.element.style.width = '100px';
            boxPane.element.style.top = '9px';
            boxPane.element.style.height = '100px';
        }
        {
            button.text = 'button';
        }
        {
            button1.text = 'button';
        }
        {
            button11.text = 'button';
        }
        {
            button12.text = 'button';
        }
        {
            boxPane1.element.style.left = '94px';
            boxPane1.element.style.width = '393px';
            boxPane1.element.style.top = '10px';
            boxPane1.element.style.height = '100px';
        }
        {
            radioButton.text = 'radioButton';
            radioButton.selected = true;
            radioButton.value = true;
        }
        {
            button2.text = 'button2';
        }
        {
            button21.text = 'button2';
        }
        {
            button22.text = 'button2';
        }
        {
            button23.text = 'button2';
        }
        {
            button24.text = 'button2';
        }
        {
            cardPane.element.style.left = '6px';
            cardPane.element.style.width = '100px';
            cardPane.element.style.top = '120px';
            cardPane.element.style.height = '100px';
        }
        {
            radioButton1.text = 'radioButton1';
        }
        {
            checkBox.text = 'checkBox';
        }
        {
            button3.text = 'button3';
        }
        {
            tabbedPane.element.style.left = '173px';
            tabbedPane.element.style.width = '178px';
            tabbedPane.element.style.top = '120px';
            tabbedPane.element.style.height = '99px';
        }
        {
            button4.text = 'button4';
            button4.tab.title = 'Unnamed - 0';
            button4.tab.closable = true;
        }
        {
            field.tab.title = 'Unnamed - 1';
            field.tab.closable = true;
        }
        {
            flowPane.element.style.left = '356px';
            flowPane.element.style.width = '140px';
            flowPane.element.style.top = '120px';
            flowPane.element.style.height = '100px';
        }
        {
            button5.text = 'button5';
            button5.selected = true;
            button5.value = true;
        }
        {
            button51.text = 'button5';
            button51.selected = true;
            button51.value = true;
        }
        {
            button52.text = 'button5';
            button52.selected = true;
            button52.value = true;
        }
        {
            button53.text = 'button5';
            button53.selected = true;
            button53.value = true;
        }
        {
            button54.text = 'button5';
            button54.selected = true;
            button54.value = true;
        }
        {
            button55.text = 'button5';
            button55.selected = true;
            button55.value = true;
        }
        {
            button56.text = 'button5';
            button56.selected = true;
            button56.value = true;
        }
        {
            gridPane.hgap = 10;
            gridPane.vgap = 10;
            gridPane.element.style.left = '5px';
            gridPane.element.style.width = '165px';
            gridPane.element.style.top = '140px';
            gridPane.element.style.height = '177px';
        }
        {
            button6.text = 'button6';
        }
        {
            button7.text = 'button7';
        }
        {
            button8.text = 'button8';
        }
        {
            button9.text = 'button9';
            button9.selected = true;
            button9.value = true;
        }
        {
            button13.text = 'button13';
        }
        {
            button14.text = 'button14';
        }
        {
            button16.text = 'button16';
        }
        {
            button17.text = 'button17';
        }
        {
            button18.text = 'button18';
        }
        {
            button20.text = 'button20';
        }
        {
            container1.tab.title = 'Unnamed - 2';
            container1.tab.closable = true;
        }
        {
            container2.element.style.left = '10px';
            container2.element.style.width = '251px';
            container2.element.style.top = '330px';
            container2.element.style.height = '134px';
        }
        {

        }
        {
            field2.element.style.width = '30px';
        }
        {

        }
        {
            button25.text = 'button25';
        }
        {
            button26.text = 'button26';
        }
        {
            scrollPane.element.style.left = '280px';
            scrollPane.element.style.width = '204px';
            scrollPane.element.style.top = '330px';
            scrollPane.element.style.height = '129px';
        }
        {
            button27.text = 'button27';
            button27.element.style.width = '244px';
            button27.element.style.height = '194px';
        }
        {
            splitPane.element.style.left = '10px';
            splitPane.element.style.width = '132px';
            splitPane.element.style.top = '470px';
            splitPane.element.style.height = '116px';
        }
        {
            button28.text = 'button28';
        }
        {
            button29.text = 'button29';
        }
        {
            anchorsPane1.element.style.left = '190px';
            anchorsPane1.element.style.width = '275px';
            anchorsPane1.element.style.top = '480px';
            anchorsPane1.element.style.height = '127px';
        }
        {
            field4.element.style.left = '26px';
            field4.element.style.top = '51px';
        }
        {
            label.text = 'label';
        }
        {
            radioButton2.text = 'radioButton2';
        }
        {
            checkBox1.text = 'checkBox1';
        }
    }
}
export default KengaWidgets;