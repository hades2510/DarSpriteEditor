// @ts-check

import { wrapForTeba } from "./teba.js";

/**
 * @typedef {Object} PixelReturn
 * @property {HTMLElement} element
 * @property {Function} getState
 * @property {Function} setState
 * @property {Function} toggleState
 */

/**
 * 
 * @param {HTMLElement} cloned 
 * @param {Object} params - Params for CanvasPixel
 * @param {boolean} [params.state = false] - State of the pixel, false is off, true is on
 * 
 * @returns {PixelReturn}
 */
export function _CanvasPixel (cloned, params = {}) {
    const render = () => {
        const onClass = "pixel-on"

        if (params.state) {
            cloned.classList.add(onClass)
        } else {
            cloned.classList?.remove(onClass)
        }
    }

    cloned.addEventListener("click", () => {
        params.state = !params.state
        render()
    })

    render()
    
    return {
        element: cloned,
        getState: () => Boolean(params.state),
        setState: (val) => (params.state = val, render()),
        toggleState: () => (params.state = !params.state, render())
    }
}

export const CanvasPixel = wrapForTeba(_CanvasPixel, "canvas-pixel")
