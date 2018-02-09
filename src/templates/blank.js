import AnchorsPane from 'kenga-containers/anchors-pane';

class KengaWidgets {
    constructor () {
        const anchorsPane = new AnchorsPane();
        this.anchorsPane = anchorsPane;
        {
            anchorsPane.element.style.width = '500px';
            anchorsPane.element.style.height = '500px';
        }
    }
}
export default KengaWidgets;