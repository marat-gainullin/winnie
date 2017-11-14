import DropDownButton from 'kenga-buttons/drop-down-button';
import Anchors from 'kenga-containers/anchors-pane';
import Flow from 'kenga-containers/flow-pane';
import GridPane from 'kenga-containers/grid-pane';
import Label from 'kenga-labels/label';
import ModelCheckBox from 'kenga-model-buttons/model-check-box';
import ModelRadioButton from 'kenga-model-buttons/model-radio-button';

class SavedWidgetsRenameMe {
    constructor () {

        const anchors = new Anchors();
        {

            anchors.element.style.width = '300px';
            anchors.element.style.height = '300px';
        }
        this.anchors = anchors;
        const dropDownButton = new DropDownButton();
        {

            dropDownButton.text = 'dropDownButton';
        }
        this.dropDownButton = dropDownButton;
        const flow = new Flow();
        {

            flow.element.style.left = '16px';
            flow.element.style.width = '268px';
            flow.element.style.top = '64px';
            flow.element.style.height = '214px';
        }
        this.flow = flow;
        const label = new Label();
        {

            label.icon = 'https://userstyles.org/style_screenshots/139780_after.jpeg';
            label.text = 'label';
        }
        this.label = label;
        const gridPane = new GridPane(1, 2);
        {

            gridPane.hgap = 10;
            gridPane.vgap = 10;
            gridPane.element.style.width = '100px';
            gridPane.element.style.height = '100px';
        }
        this.gridPane = gridPane;
        const modelRadioButton = new ModelRadioButton();
        {

        }
        this.modelRadioButton = modelRadioButton;
        const modelCheckBox = new ModelCheckBox();
        {

        }
        this.modelCheckBox = modelCheckBox;

        anchors.add(dropDownButton);
        anchors.add(flow);
        flow.add(label);
        flow.add(gridPane);
        gridPane.add(modelCheckBox);
        gridPane.add(modelRadioButton);
    }
}
export default SavedWidgetsRenameMe;