import Logger from 'septima-utils/logger';

function fakeInput() {
    const input = document.createElement('textarea');
    input.style.left = input.style.top = '0px';
    input.style.width = input.style.height = '2em';
    input.style.background = 'transparent';
    input.style.padding = 0;
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.boxShadow = 'none';
    return input;
}

function write(value) {
    try {
        const input = fakeInput();
        input.value = value;
        document.body.appendChild(input);
        try {
            input.focus();
            input.select();
            document.execCommand('copy');
        } finally {
            document.body.removeChild(input);
        }
    } catch (e) {
        Logger.severe(`Failed to write to clipboard due to an error:`);
        Logger.severe(e);
        Logger.info(`The data is:\n${value}`);
    }
}

function read() {
    try {
        const input = fakeInput();
        document.body.appendChild(input);
        try {
            input.focus();
            input.select();
            document.execCommand('paste');
            return input.value;
        } finally {
            document.body.removeChild(input);
        }
    } catch (e) {
        Logger.severe(`Failed to read from clipboard due to an error:`);
        Logger.severe(e);
    }
}

export default {read, write};