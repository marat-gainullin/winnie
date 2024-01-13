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
                        return { x: 0, y: event.ctrlKey ? -1 : -model.settings.grid.y };
                    } else if (event.keyCode === KeyCodes.KEY_DOWN) {
                        return { x: 0, y: event.ctrlKey ? 1 : model.settings.grid.y };
                    } else if (event.keyCode === KeyCodes.KEY_LEFT) {
                        return { x: event.ctrlKey ? -1 : -model.settings.grid.x, y: 0 };
                    } else if (event.keyCode === KeyCodes.KEY_RIGHT) {
                        return { x: event.ctrlKey ? 1 : model.settings.grid.x, y: 0 };
                    } else {
                        throw 'Unknown key for selected widgets movement.';
                    }
                })(), event.ctrlKey ? false : model.settings.grid.snap);
                endItemsMove(model, moved);
            }
        }
    }
}

function winnieKeyDown(model, event) {
    if (event.ctrlKey && event.keyCode === KeyCodes.KEY_Z) {
        if (event.shiftKey) {
            if (model.layout.tRedo.visible) {
                event.stopPropagation();
                event.preventDefault();
                model.checkEnabled();
                model.redo();
            }
        } else {
            if (model.layout.tUndo.visible) {
                event.stopPropagation();
                event.preventDefault();
                model.checkEnabled();
                model.undo();
            }
        }
    } else if (event.ctrlKey && event.keyCode === KeyCodes.KEY_Y && model.layout.tRedo.visible) {
        event.stopPropagation();
        event.preventDefault();
        model.checkEnabled();
        model.redo();
    } else if (event.ctrlKey && event.keyCode === KeyCodes.KEY_O) {
        event.stopPropagation();
        event.preventDefault();
        model.openJSON();
    } else if (event.ctrlKey && event.keyCode === KeyCodes.KEY_S && model.layout.tSave.visible) {
        event.stopPropagation();
        event.preventDefault();
        model.save();
    } else if (event.ctrlKey && event.keyCode === KeyCodes.KEY_E) {
        event.stopPropagation();
        event.preventDefault();
        model.export();
    } else if (event.ctrlKey && (event.keyCode === KeyCodes.KEY_C || event.keyCode === KeyCodes.KEY_INSERT) && model.layout.tCopy.visible) {
        if (model.layout.explorer.selected.length > 0 &&
            !model.layout.explorer.activeEditor &&
            !model.layout.properties.activeEditor
        ) {
            event.stopPropagation();
            event.preventDefault();
            model.checkEnabled();
            model.copyToClipboard();
        }
    } else if (((event.ctrlKey && event.keyCode === KeyCodes.KEY_X) || (event.shiftKey && event.keyCode === KeyCodes.KEY_DELETE)) && model.layout.tCut.visible) {
        if (model.layout.explorer.selected.length > 0 &&
            !model.layout.explorer.activeEditor &&
            !model.layout.properties.activeEditor
        ) {
            event.stopPropagation();
            event.preventDefault();
            model.checkEnabled();
            model.cutToClipboard();
        }
    } else if (((event.ctrlKey && event.keyCode === KeyCodes.KEY_V) || (event.shiftKey && event.keyCode === KeyCodes.KEY_INSERT)) && model.layout.tPaste.visible) {
        if (model.layout.explorer.selected.length > 0 &&
            !model.layout.explorer.activeEditor &&
            !model.layout.properties.activeEditor
        ) {
            event.stopPropagation();
            event.preventDefault();
            model.checkEnabled();
            model.pasteFromClipboard();
        }
    } else if (event.keyCode === KeyCodes.KEY_DELETE && model.layout.tRemove.visible) {
        if (model.layout.explorer.selected.length > 0 &&
            !model.layout.explorer.activeEditor &&
            !model.layout.properties.activeEditor
        ) {
            event.stopPropagation();
            event.preventDefault();
            model.checkEnabled();
            model.removeSelected();
        }
    }
}

export default { winnieKeyDown, surfaceKeyDown };