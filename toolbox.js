// @ts-check

import { wrapForTeba } from "./teba.js";

/**
 * @typedef {Object} ToolBoxReturn
 * @property {HTMLElement} element
 */

/**
 * @param {HTMLElement} cloned
 * @param {Object} params - Params for Modal
 * @param {Function} [params.onNew] - Callback for new sprite
 * @param {Function} [params.onExport] - Callback for export
 * @param {Function} [params.onImport] - Callback for import
 * 
 * @param {Map<string, HTMLElement>} domElements - Dom Elements of the cloned element
 *
 * @returns {ToolBoxReturn}
 */
function _ToolBox(cloned, params, domElements) {
    domElements.get("new")?.addEventListener("click", params.onNew)
    domElements.get("export")?.addEventListener("click", params.onExport)
    domElements.get("import")?.addEventListener("click", params.onImport)

    return {
        element: cloned
    }
}

export const ToolBox = wrapForTeba(_ToolBox, "tool-box")