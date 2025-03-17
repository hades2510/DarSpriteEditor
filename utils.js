/**
 * @param {string} name
 * 
 * @returns {string} - Unique canvas name, appending a number to the name if it already exists
 */
function generateUniqueCanvasName(name) {
    const matches = name.match(/^([^0-9]*)([0-9]*)$/);
    const number = matches[2] ? parseInt(matches[2]) : 0;

    return `${matches[1]}${number + 1}`;
}

export { generateUniqueCanvasName }