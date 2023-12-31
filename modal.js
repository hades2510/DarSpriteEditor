// @ts-check

import { wrapForTeba } from "./teba.js";

/**
 * @typedef {Object} ModalReturn
 * @property {HTMLElement} element
 * @property {Function} activate
 * @property {Function} close
 */

/**
 * @param {HTMLElement} cloned
 * @param {Object} params - Params for Modal
 * @param {string} [params.title=""] - The title for the modal
 * @param {string} [params.content=""] - The content for the modal
 * @param {string} [params.cancel=""] - The cancel button text
 * @param {string} [params.confirm=""] - The confirm button text
 * @param {Function} [params.onConfirm] - Confirmation callback
 * 
 * @param {Map<string, HTMLElement>} domElements - Dom Elements of the cloned element
 *
 * @returns {ModalReturn}
 */
function _Modal(cloned, params, domElements) {
    const cancel = () => cloned.parentElement?.removeChild(cloned)
    const confirm = () => params.onConfirm?.()

    domElements.get("close-x")?.addEventListener("click", cancel)
    domElements.get("close-button")?.addEventListener("click", cancel)

    domElements.get("confirm")?.addEventListener("click", confirm)

    domElements.get("title").textContent = params.title
    domElements.get("content").textContent = params.content
    domElements.get("confirm").textContent = params.confirm
    domElements.get("close-button").textContent = params.cancel

    return {
        element: cloned,
        activate: () => cloned.classList.add("is-active"),
        close: cancel
    }
}

export const Modal = wrapForTeba(_Modal, "modal")
