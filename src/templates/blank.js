import AnchorsPane from 'kenga-containers/anchors-pane';

class KengaWidgets {
    constructor () {
        const anchorsPane = new AnchorsPane();
        {
            anchorsPane.element.style.width = '500px';
            anchorsPane.element.style.height = '500px';
        }
        this.anchorsPane = anchorsPane;

    }
}
export default KengaWidgets;