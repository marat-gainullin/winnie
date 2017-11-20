import CheckBox from 'kenga-buttons/check-box';
import DropDownButton from 'kenga-buttons/drop-down-button';
import RadioButton from 'kenga-buttons/radio-button';
import AnchorsPane from 'kenga-containers/anchors-pane';
import FlowPane from 'kenga-containers/flow-pane';
import GridPane from 'kenga-containers/grid-pane';
import HolyGrailPane from 'kenga-containers/holy-grail-pane';
import TabbedPane from 'kenga-containers/tabbed-pane';
import ModelRadioButton from 'kenga-model-buttons/model-radio-button';

class KengaWidgets {
    constructor () {
        const anchorsPane = new AnchorsPane();
        {
            anchorsPane.background = '#6c96d5';
            anchorsPane.element.style.width = '300px';
            anchorsPane.element.style.height = '300px';
        }
        this.anchorsPane = anchorsPane;
        const container = new HolyGrailPane();
        {
            container.element.style.width = '100px';
            container.element.style.height = '100px';
        }
        this.container = container;
        const container1 = new FlowPane();
        {
            container1.background = '#ca73ad';
            container1.element.style.left = '124px';
            container1.element.style.width = '104px';
            container1.element.style.top = '2px';
            container1.element.style.height = '100px';
        }
        this.container1 = container1;
        const container2 = new FlowPane();
        {
            container2.element.style.left = '189px';
            container2.element.style.width = '100px';
            container2.element.style.top = '99px';
            container2.element.style.height = '100px';
        }
        this.container2 = container2;
        const button = new DropDownButton();
        {
            button.text = 'button';
            button.element.style.left = '18.5px';
            button.element.style.top = '178.5px';
        }
        this.button = button;
        const radioButton = new RadioButton();
        {
            radioButton.text = 'radioButton';
            radioButton.element.style.left = '10px';
            radioButton.element.style.top = '204px';
        }
        this.radioButton = radioButton;
        const button1 = new DropDownButton();
        {
            button1.text = 'button1';
            button1.element.style.left = '10px';
            button1.element.style.top = '223.5px';
        }
        this.button1 = button1;
        const checkBox = new CheckBox();
        {
            checkBox.text = 'checkBox';
            checkBox.element.style.left = '10px';
            checkBox.element.style.top = '247.5px';
        }
        this.checkBox = checkBox;
        const radioButton1 = new ModelRadioButton();
        {
            radioButton1.text = 'radioButton1';
            radioButton1.element.style.left = '83.5px';
            radioButton1.element.style.top = '229px';
        }
        this.radioButton1 = radioButton1;
        const tabbedPane = new TabbedPane();
        {
            tabbedPane.element.style.left = '171px';
            tabbedPane.element.style.width = '100px';
            tabbedPane.element.style.top = '170px';
            tabbedPane.element.style.height = '100px';
        }
        this.tabbedPane = tabbedPane;
        const gridPane = new GridPane(4, 7);
        {
            gridPane.hgap = 10;
            gridPane.vgap = 10;
            gridPane.element.style.left = '77px';
            gridPane.element.style.width = '100px';
            gridPane.element.style.top = '92px';
            gridPane.element.style.height = '100px';
        }
        this.gridPane = gridPane;
        anchorsPane.add(container);
        anchorsPane.add(container1);
        anchorsPane.add(container2);
        anchorsPane.add(button);
        anchorsPane.add(radioButton);
        anchorsPane.add(button1);
        anchorsPane.add(checkBox);
        anchorsPane.add(radioButton1);
        anchorsPane.add(tabbedPane);
        anchorsPane.add(gridPane);
    }
}
export default KengaWidgets;