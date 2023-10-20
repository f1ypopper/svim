export function modeInsert(ev) {
    let currentElem = getCurrentCell();
    let cellInput = currentElem.children[0];
    if (ev.key === 'Escape') {
        mode = 'NORMAL';
        cellInput.setAttribute('disabled', '');
    } else {
        cellInput.removeAttribute('disabled');
        cellInput.focus();
    }
}