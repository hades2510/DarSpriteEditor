// @ts-check

import { wrapForTeba } from "./teba.js";

import { Modal } from "./modal.js";

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
 * @returns {HTMLElement}
 */
function _Canvas(cloned, params = {}, domElements) {
    if (!params.height) {
        params.height = 64
    }

    if (!params.width) {
        params.width = 128
    }

    if (!params.size) {
        params.size = 10
    }

    if (params.grid === undefined) {
        params.grid = true
    }

    const container = domElements.get("container")

    const render = () => {
        container.innerHTML = "";

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
    }

    /** @type {HTMLInputElement} */
    // @ts-ignore
    const pixelSize = domElements.get("pixel-size")
    pixelSize.value = params.size.toString()
    pixelSize.addEventListener("input", (event) => {
        document.documentElement.style.setProperty("--pixel-size", `${event.target.value}px`)
    });

    document.documentElement.style.setProperty("--pixel-size", `${params.size}px`)

    /** @type {HTMLInputElement} */
    // @ts-ignore
    const canvasWidth = domElements.get("width")
    canvasWidth.value = params.width.toString()
    canvasWidth.addEventListener("input", (event) => {
        params.width = event.target.value
        render()
    });

    /** @type {HTMLInputElement} */
    // @ts-ignore
    const canvasHeight = domElements.get("height")
    canvasHeight.value = params.height.toString()
    canvasHeight.addEventListener("input", (event) => {
        params.height = event.target.value
        render()
    });

    /** @type {HTMLInputElement} */
    // @ts-ignore
    const grid = domElements.get("grid")
    grid.checked = params.grid
    grid.addEventListener("input", (event) => {
        const gridIcon = domElements.get("grid-icon")
        if (grid.checked) {
            document.documentElement.style.setProperty("--pixel-border", "var(--initial-pixelborder)" )
            gridIcon?.classList.remove("mdi-grid-off")
            gridIcon?.classList.add("mdi-grid")
        } else {
            document.documentElement.style.setProperty("--pixel-border", "none")
            gridIcon?.classList.add("mdi-grid-off")
            gridIcon?.classList.remove("mdi-grid")
        }
    })

    const deleteModal = domElements.get("delete-modal")

    /** @type {HTMLInputElement} */
    // @ts-ignore
    const deleteButton = domElements.get("delete")
    deleteButton.addEventListener("click", (event) => {
        const modal = Modal({
            title: "Delete sprite",
            content: "Are you sure you want to delete this sprite?",
            confirm: "Delete sprite",
            cancel: "Cancel"
        });
        modal.activate();

        document.body.appendChild(modal.element)
    });

    render();

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
    
    return cloned
}

export const CanvasPixel = wrapForTeba(_CanvasPixel, "canvas-pixel")
