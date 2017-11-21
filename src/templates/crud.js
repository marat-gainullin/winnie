import Button from 'kenga-buttons/button';
import AnchorsPane from 'kenga-containers/anchors-pane';
import ToolBar from 'kenga-containers/tool-bar';
import Grid from 'kenga-grid/grid';

class KengaWidgets {
    constructor () {
        const anchorsPane = new AnchorsPane();
        {
            anchorsPane.element.style.width = '500px';
            anchorsPane.element.style.height = '500px';
        }
        this.anchorsPane = anchorsPane;
        const button = new Button();
        {
            button.text = 'Close';
            button.element.style.left = '400px';
            button.element.style.width = '91px';
            button.element.style.top = '460px';
            button.element.style.height = '32px';
        }
        this.button = button;
        const button1 = new Button();
        {
            button1.text = 'Save';
            button1.element.style.left = '290px';
            button1.element.style.width = '91px';
            button1.element.style.top = '460px';
            button1.element.style.height = '32px';
        }
        this.button1 = button1;
        const boxPane = new ToolBar();
        {
            boxPane.element.style.left = '0px';
            boxPane.element.style.right = '0px';
            boxPane.element.style.top = '0px';
            boxPane.element.style.height = '38px';
        }
        this.boxPane = boxPane;
        const dataGrid = new Grid();
        {
            dataGrid.evenRowsColor = '#f1f1f1';
            dataGrid.element.style.left = '63px';
            dataGrid.element.style.width = '374px';
            dataGrid.element.style.top = '127px';
            dataGrid.element.style.height = '224px';
        }
        this.dataGrid = dataGrid;
        anchorsPane.add(button);
        anchorsPane.add(button1);
        anchorsPane.add(boxPane);
        anchorsPane.add(dataGrid);
    }
}
export default KengaWidgets;