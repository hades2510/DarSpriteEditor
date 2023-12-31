// @ts-check

import { wrapForTeba } from "./teba.js";

import { Modal } from "./modal.js";
import { CanvasPixel } from "./pixel.js";

/**
 * @typedef {Object} CanvasReturn
 * @property {HTMLElement} element
 * @property {Function} export
 */

/**
 * @param {HTMLElement} cloned
 * @param {Object} params - Params for Canvas
 * @param {number} [params.width=128] - The width of the Canvas
 * @param {number} [params.height=64] - The height of the Canvas
 * @param {number} [params.size=10] - The size of a pixel
 * @param {boolean} [params.grid=true] - If grid should be showned
 * @param {Array<Array<boolean>> | undefined} [params.data] - Pixel data
 * @param {Function} [params.onDelete] - Callback to be called in case of a delete
 * @param {Function} [params.onDuplicate] - Callback called in case of a duplication request
 * 
 * @param {Map<string, HTMLElement>} domElements - Dom Elements of the cloned element
 *
 * @returns {CanvasReturn}
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

    const _export = () => {
        const ret = {
           name: domElements.get("name")?.innerText,
           width: params.width,
           height: params.height,
           size: domElements.get("pixel-size")?.value
        }

        const data = []

        for(let i = 0; i < pixels.length; i++) {
           const row = []
           data.push(row)

           for(let j = 0; j < pixels[i].length; j++) {
               row.push(pixels[i][j].getState())
           }
        }

        ret.data = data
        
        return ret
       }

    /** @type Array<Array<any>> */
    let pixels = []

    const genPixels = (data) => {
        pixels = []

        for(let y = 0; y < params.height; y++) {
            const row = []
            pixels.push(row)

            for (let x = 0; x < params.width; x++) {
                let state = false

                if (data) {
                    state = data[y][x]
                }

                const pixel = CanvasPixel({
                    state
                });

                row.push(pixel)
            }
        }
    }

    const render = () => {
        container.innerHTML = "";

        for(let y = 0; y < params.height; y++) {
            container.appendChild(document.createElement("br"))

            for (let x = 0; x < params.width; x++) {
                container.appendChild(pixels[y][x].element);
            }
        }
    }

    /** @type {HTMLInputElement} */
    // @ts-ignore
    const pixelSize = domElements.get("pixel-size")
    pixelSize.value = params.size.toString()
    pixelSize.addEventListener("input", (event) => {
        cloned.style.setProperty("--pixel-size", `${event.target.value}px`)
    });

    cloned.style.setProperty("--pixel-size", `${params.size}px`)

    /** @type {HTMLInputElement} */
    // @ts-ignore
    const canvasWidth = domElements.get("width")
    canvasWidth.value = params.width.toString()
    canvasWidth.addEventListener("input", (event) => {
        params.width = event.target.value
        genPixels()
        render()
    });

    /** @type {HTMLInputElement} */
    // @ts-ignore
    const canvasHeight = domElements.get("height")
    canvasHeight.value = params.height.toString()
    canvasHeight.addEventListener("input", (event) => {
        params.height = event.target.value
        genPixels()
        render()
    });

    /** @type {HTMLInputElement} */
    // @ts-ignore
    const grid = domElements.get("grid")
    grid.checked = params.grid
    grid.addEventListener("input", (event) => {
        const gridIcon = domElements.get("grid-icon")
        if (grid.checked) {
            cloned.style.setProperty("--pixel-border", "var(--initial-pixelborder)" )
            gridIcon?.classList.remove("mdi-grid-off")
            gridIcon?.classList.add("mdi-grid")
        } else {
            cloned.style.setProperty("--pixel-border", "none")
            gridIcon?.classList.add("mdi-grid-off")
            gridIcon?.classList.remove("mdi-grid")
        }
    })

    /** @type {HTMLInputElement} */
    // @ts-ignore
    const deleteButton = domElements.get("delete")
    deleteButton.addEventListener("click", (event) => {
        const modal = Modal({
            title: "Delete sprite",
            content: "Are you sure you want to delete this sprite?",
            confirm: "Delete sprite",
            cancel: "Cancel",
            onConfirm: () => {
                modal.close()
                cloned.parentElement?.removeChild(cloned)

                params.onDelete?.()
            }
        });
        modal.activate();

        document.body.appendChild(modal.element)
    });

    domElements.get("duplicate")?.addEventListener("click", () => {
        params.onDuplicate?.(_export())
    })

    const swapDimensions = () => {
        const width = canvasWidth.value

        canvasWidth.value = canvasHeight.value
        canvasHeight.value = width

        return {
            width: parseInt(canvasWidth.value),
            height: parseInt(width)
        }
    }

    domElements.get("rotate-left")?.addEventListener("click", () => {
        const {width, height} = swapDimensions()

        const newPixels = new Array(height).fill(0).map(u => new Array(width).fill(0))

        for (let i = 0; i<pixels.length; i++) {
            for(let j = 0; j<pixels[i].length; j++) {
                newPixels[height - 1 - j][i] = pixels[i][j]
            }
        }

        pixels = newPixels;
        params.width = width;
        params.height = height;

        render();
    })
    domElements.get("rotate-right")?.addEventListener("click", () => {
        const {width, height} = swapDimensions()

        const newPixels = new Array(height).fill(0).map(u => new Array(width).fill(0))

        for (let i = 0; i<pixels.length; i++) {
            for(let j = 0; j<pixels[i].length; j++) {
                newPixels[j][width - 1 - i] = pixels[i][j]
            }
        }

        pixels = newPixels;
        params.width = width;
        params.height = height;

        render();
    })
    domElements.get("invert")?.addEventListener("click", () => {
        for (let i = 0; i<pixels.length; i++) {
            for(let j = 0; j<pixels[i].length; j++) {
                pixels[i][j].toggleState()
            }
        }

        render();
    })

    genPixels(params.data)
    render();

    return {
        element: cloned,
        export: _export
    }
}

export const Canvas = wrapForTeba(_Canvas, "canvas")
