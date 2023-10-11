// @ts-check

import { wrapForTeba } from "./teba.js";

/**
 * @param {HTMLElement} cloned
 * @param {Object} params - Params for Canvas
 * @param {number} [params.width=128] - The width of the Canvas
 * @param {number} [params.height=64] - The height of the Canvas
 * @param {number} [params.size=10] - The size of a pixel
 * 
 * @returns {HTMLElement}
 */
function _Canvas(cloned, params = {}) {
    if (!params.height) {
        params.height = 64
    }

    if (!params.width) {
        params.width = 128
    }

    if (!params.size) {
        params.size = 10
    }

    const containerId = 'container'
    const container = cloned.querySelectorAll(`[data-teba-id='${containerId}']`)[0]

    if (!container) {
        throw new Error(`Template missing slot ${containerId}`)
    }

    /** @type {HTMLInputElement} */
    // @ts-ignore
    const pixelSize = cloned.querySelectorAll(`[data-teba-id='pixel-size']`)[0]
    if (!pixelSize) {
        throw new Error(`Missing `)
    }
    pixelSize.value = params.size.toString()
    pixelSize.addEventListener("input", (event) => {
        document.documentElement.style.setProperty("--pixel-size", `${event.target.value}px`)    
    });

    document.documentElement.style.setProperty("--pixel-size", `${params.size}px`)

    for(let y = 0; y < params.height; y++) {
        container.appendChild(document.createElement("br"))

        for (let x = 0; x < params.width; x++) {
            const pixel = CanvasPixel({
                x,
                y
            });

            container.appendChild(pixel.element);
        }
    }

    return cloned
}

export const Canvas = wrapForTeba(_Canvas, "canvas")

/**
 * 
 * @param {HTMLElement} cloned 
 * @param {Object} params - Params for CanvasPixel
 * @param {number} [params.x = 0] - Position on the x axis
 * @param {number} [params.y = 0] - Position on the y axis
 * @param {boolean} [params.state = false] - State of the pixel, false is off, true is on
 * 
 * @returns {HTMLElement}
 */
export function _CanvasPixel (cloned, params = {}) {
    if (!params.x) {
        params.x = 0
    }

    if (!params.y) {
        params.y = 0
    }

    if (params.state) {
        cloned.classList.add("pixel-on")
    }
    
    return cloned
}

export const CanvasPixel = wrapForTeba(_CanvasPixel, "canvas-pixel")
