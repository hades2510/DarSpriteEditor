// @ts-check

import { wrapForTeba } from "./teba.js";

/**
 * @typedef {Object} ModalReturn
 * @property {HTMLElement} element
 * @property {Function} activate
 */

/**
 * @param {HTMLElement} cloned
 * @param {Object} params - Params for Canvas
 * @param {number} [params.width=128] - The width of the Canvas
 * @param {number} [params.height=64] - The height of the Canvas
 * @param {number} [params.size=10] - The size of a pixel
 * @param {boolean} [params.grid=true] - If grid should be showned
 * 
 * @param {Map<string, HTMLElement>} domElements - Dom Elements of the cloned element
 *
 * @returns {ModalReturn}
 */
function _Modal(cloned, params, domElements) {
    const cancel = () => cloned.parentElement?.removeChild(cloned)

    domElements.get("close-x")?.addEventListener("click", cancel)
    domElements.get("close-button")?.addEventListener("click", cancel)

    return {
        element: cloned,
        activate: () => cloned.classList.add("is-active")
    }
}

export const Modal = wrapForTeba(_Modal, "modal")
