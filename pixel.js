// @ts-check

import { wrapForTeba } from "./teba.js";

/**
 * @typedef {Object} PixelReturn
 * @property {HTMLElement} element
 * @property {Function} getState
 * @property {Function} setState
 * @property {Function} toggleState
 * @property {Function} goPrevState
 * @property {Function} removeUndetermined
 */

/**
 * 
 * @param {HTMLElement} cloned 
 * @param {Object} params - Params for CanvasPixel
 * @param {string} [params.prevState = "off"] - Previous state of the pixel, "off", "on", or "undetermined"
 * @param {string} [params.state = "off"] - State of the pixel, "off", "on", or "undetermined"
 * 
 * @returns {PixelReturn}
 */
export function _CanvasPixel (cloned, params = {}) {
    const render = () => {
        const onClass = "pixel-on"
        const undeterminedClass = "pixel-undetermined"

        switch (params.state) {
            case "on":
                cloned.classList.add(onClass)
                cloned.classList.remove(undeterminedClass)
                break;
            case "undetermined":
                cloned.classList.add(undeterminedClass)
                cloned.classList.remove(onClass)
                break;
            default:
                cloned.classList.remove(onClass, undeterminedClass)
        }
    }

    const updateState = (state) => {
        params.prevState = params.state
        params.state = state
        render()
    }

    render()
    
    return {
        element: cloned,
        getState: () => params.state,
        setState: updateState,
        toggleState: () => {
            switch (params.state) {
                case "on":
                    updateState("off")
                    break;
                case "off":
                    updateState("on")
                    break;
                default:
                    updateState("on")
            }
        },
        goPrevState: () => {
            params.state = params.prevState
            render()
        },
        removeUndetermined: () => {
            if(params.state === "undetermined") {
                params.state = params.prevState
                render()
            }
        }
    }
}

export const CanvasPixel = wrapForTeba(_CanvasPixel, "canvas-pixel")
