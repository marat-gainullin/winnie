import KeyCodes from 'kenga/key-codes';
import Anchors from 'kenga-containers/anchors-pane';
import { sizeLocationSnapshot, proceedItemsMove, endItemsMove } from './location-size';

function surfaceKeyDown(model, event) {
    if (event.keyCode === KeyCodes.KEY_UP ||
            event.keyCode === KeyCodes.KEY_DOWN ||
            event.keyCode === KeyCodes.KEY_LEFT ||
            event.keyCode === KeyCodes.KEY_RIGHT) {
        if (model.layout.explorer.selected.length > 0) {
            event.stopPropagation();
            event.preventDefault();
            model.checkEnabled();

            const moved = model.layout.explorer.selected
                    .filter((item) => item.delegate.attached && item.delegate.parent instanceof Anchors)
                    .map((item) => {
                        return {
                            item,
                            startSnapshot: sizeLocationSnapshot(item.delegate)
                        };
                    });
            if (moved.length > 0) {
                proceedItemsMove(model, moved, (() => {
                    if (event.keyCode === KeyCodes.KEY_UP) {
                        return {x: 0, y: event.ctrlKey ? -1 : -model.settings.grid.y};
                    } else if (event.keyCode === KeyCodes.KEY_DOWN) {
                        return {x: 0, y: event.ctrlKey ? 1 : model.settings.grid.y};
                    } else if (event.keyCode === KeyCodes.KEY_LEFT) {
                        return {x: event.ctrlKey ? -1 : -model.settings.grid.x, y: 0};
                    } else if (event.keyCode === KeyCodes.KEY_RIGHT) {
                        return {x: event.ctrlKey ? 1 : model.settings.grid.x, y: 0};
                    } else {
                        throw 'Unknown key for selected widgets movement.';
                    }
                })());
                endItemsMove(model, moved);
            }
        }
    }
}

function winnieKeyDown(model, event) {
    if (event.ctrlKey && event.keyCode === KeyCodes.KEY_Z) {
        model.checkEnabled();
        if (event.shiftKey) {
            model.redo();
        } else {
            model.undo();
        }
    } else if (event.ctrlKey && event.keyCode === KeyCodes.KEY_Y) {
        model.checkEnabled();
        model.redo();
    } else if (event.keyCode === KeyCodes.KEY_DELETE) {
        if (model.layout.explorer.selected.length > 0) {
            model.checkEnabled();
            model.removeSelected();
        }
    } else if (event.ctrlKey && (event.keyCode === KeyCodes.KEY_C || event.keyCode === KeyCodes.KEY_INSERT)) {
        model.copy();
    } else if (event.ctrlKey && event.keyCode === KeyCodes.KEY_X) {
        if (model.layout.explorer.selected.length > 0) {
            model.checkEnabled();
            model.cut();
        }
    } else if (event.ctrlKey && event.shiftKey && event.keyCode === KeyCodes.KEY_S) {
        model.save();
    }
}

export default { winnieKeyDown, surfaceKeyDown };