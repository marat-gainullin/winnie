import Ui from 'kenga/utils';

function reWidth(subject, resizer, view, direction = 1, onChange = null) {
    let mouseDownAt = null;
    let mouseDownSplitWidth = null;
    let onMouseUp = null;
    let onMouseMove = null;
    let onViewScroll = null;
    Ui.on(resizer.element, Ui.Events.DRAGSTART, event => {
        if (event.button === 0) {
            event.preventDefault();
            event.stopPropagation();
        }
    });
    Ui.on(resizer.element, Ui.Events.MOUSEDOWN, event => {
        if (event.button === 0) {
            event.stopPropagation();
            mouseDownAt = event.clientX;
            mouseDownSplitWidth = subject.width;
            if (!onMouseUp) {
                onMouseUp = Ui.on(document, Ui.Events.MOUSEUP, event => {
                    event.stopPropagation();
                    if (onMouseUp) {
                        onMouseUp.removeHandler();
                        onMouseUp = null;
                    }
                    if (onMouseMove) {
                        onMouseMove.removeHandler();
                        onMouseMove = null;
                    }
                    if (onViewScroll) {
                        onViewScroll.removeHandler();
                        onViewScroll = null;
                    }
                });
            }
            if (!onMouseMove) {
                onMouseMove = Ui.on(document, Ui.Events.MOUSEMOVE, event => {
                    event.stopPropagation();
                    event.preventDefault();
                    const mouseDiff = (event.clientX - mouseDownAt) * direction;
                    subject.width = mouseDownSplitWidth + mouseDiff;
                    if(onChange){
                        onChange();
                    }
                });
            }
            if (!onViewScroll) {
                const oldScrollLeft = view.element.scrollLeft;
                onViewScroll = Ui.on(view.element, Ui.Events.SCROLL, event => {
                    view.element.scrollLeft = oldScrollLeft;
                });
            }
        }
    });
}
export default reWidth;