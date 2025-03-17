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

    // Drawing state
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let currentTool = "pixel"; // Default tool is pixel

    const _export = () => {
        const ret = {
            name: domElements.get("name")?.innerText || "Sprite",
            width: params.width,
            height: params.height,
            size: parseInt(domElements.get("pixel-size")?.value || "10")
        }

        const data = []

        for(let i = 0; i < pixels.length; i++) {
            const row = []
            data.push(row)

            for(let j = 0; j < pixels[i].length; j++) {
                const state = pixels[i][j].getState();
                // Convert string state to boolean for export
                row.push(state === "on");
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
                let state = "off";

                if (data) {
                    // Convert boolean to string state
                    state = data[y][x] ? "on" : "off";
                }

                const pixel = CanvasPixel({
                    state
                });

                // Add data attributes for coordinates
                pixel.element.dataset.x = x.toString();
                pixel.element.dataset.y = y.toString();

                // Add mouse events for drawing
                pixel.element.addEventListener("mousedown", (e) => {
                    e.preventDefault(); // Prevent text selection
                    if (currentTool === "pixel") {
                        pixel.toggleState();
                        return;
                    }
                    isDrawing = true;
                    startX = x;
                    startY = y;
                });

                pixel.element.addEventListener("click", () => {
                    
                });

                pixel.element.addEventListener("mouseover", () => {
                    // Update coordinates display
                    const coordX = domElements.get("coord-x");
                    const coordY = domElements.get("coord-y");

                    if (coordX) coordX.textContent = x.toString();
                    if (coordY) coordY.textContent = y.toString();

                    if (isDrawing && currentTool === "line") {
                        removeUndetermined()
                        drawLine(startX, startY, x, y, "undetermined")
                        render()
                    }
                });

                pixel.element.addEventListener("mouseup", () => {
                    if (isDrawing && currentTool === "line") {
                        drawLine(startX, startY, x, y);
                        render();
                    }
                    isDrawing = false;
                });

                row.push(pixel)
            }
        }

        // Add mouseup event to the container to handle cases where the user releases outside a pixel
        container?.addEventListener("mouseup", () => {
            isDrawing = false;
        });

        // Add mouseout event to the container to handle cases where the user moves outside the canvas
        container?.addEventListener("mouseleave", () => {
            isDrawing = false;
        });
    }

    const render = () => {
        if (!container) return;
        
        container.innerHTML = "";

        for(let y = 0; y < params.height; y++) {
            container.appendChild(document.createElement("br"))

            for (let x = 0; x < params.width; x++) {
                container.appendChild(pixels[y][x].element);
            }
        }

        renderRulers();
    }

    const renderRulers = () => {
        const hRuler = domElements.get("h-ruler");
        const vRuler = domElements.get("v-ruler");

        if (!hRuler || !vRuler) return;

        hRuler.innerHTML = "";
        vRuler.innerHTML = "";

        // Horizontal ruler
        for (let x = 0; x < params.width; x++) {
            const mark = document.createElement("div");
            mark.className = "ruler-mark";
            if (x % 4 === 0) {
                mark.className += " step";
                mark.textContent = x.toString();
            }
            hRuler.appendChild(mark);
        }

        // Vertical ruler
        for (let y = 0; y < params.height; y++) {
            const mark = document.createElement("div");
            mark.className = "ruler-mark";
            if (y % 4 === 0) {
                mark.className += " step";
                mark.textContent = y.toString();
            }
            vRuler.appendChild(mark);
        }
    }

    const removeUndetermined = () => {
        for(let y = 0; y < params.height; y++) {
            for (let x = 0; x < params.width; x++) {
                pixels[y][x].removeUndetermined()
            }
        }
    }

    const drawLine = (startX, startY, endX, endY, state = "on") => {
        const dx = Math.abs(endX - startX);
        const dy = Math.abs(endY - startY);
        const sx = (startX < endX) ? 1 : -1;
        const sy = (startY < endY) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            if (startY >= 0 && startY < pixels.length && 
                startX >= 0 && startX < pixels[startY].length) {
                pixels[startY][startX].setState(state);
            }

            if (startX === endX && startY === endY) break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                startX += sx;
            }
            if (e2 < dx) {
                err += dx;
                startY += sy;
            }
        }
    }

    // Set up tool selector
    const toolSelector = domElements.get("drawing-tool");
    if (toolSelector) {
        // @ts-ignore - We know this is a select element
        toolSelector.addEventListener("change", (event) => {
            // @ts-ignore - We know this has a value property
            currentTool = event.target.value;
        });
    }

    const pixelSize = domElements.get("pixel-size")
    if (pixelSize) {
        // @ts-ignore - We know this is an input element
        pixelSize.value = params.size.toString()
        pixelSize.addEventListener("input", (event) => {
            if (event.target) {
                // @ts-ignore - We know this has a value property
                const size = event.target.value;
                cloned.style.setProperty("--pixel-size", `${size}px`);
                renderRulers(); // Update rulers when pixel size changes
            }
        });
    }

    cloned.style.setProperty("--pixel-size", `${params.size}px`)

    if (params.width >= 64) {
        cloned.classList.add("canvas-container-full")
    }

    /** @type {HTMLInputElement} */
    const canvasWidth = domElements.get("width")
    if (canvasWidth) {
        // @ts-ignore - We know this is an input element
        canvasWidth.value = params.width.toString()
        canvasWidth.addEventListener("input", (event) => {
            if (event.target) {
                // @ts-ignore - We know this has a value property
                params.width = parseInt(event.target.value);
                //  take full width if width is greater than 128
                if (params.width >= 64) {
                    cloned.classList.add("canvas-container-full")
                } else {
                    cloned.classList.remove("canvas-container-full")
                }
                genPixels()
                render()
                renderRulers()
            }
        });
    }

    /** @type {HTMLInputElement} */
    const canvasHeight = domElements.get("height")
    if (canvasHeight) {
        // @ts-ignore - We know this is an input element
        canvasHeight.value = params.height.toString()
        canvasHeight.addEventListener("input", (event) => {
            if (event.target) {
                // @ts-ignore - We know this has a value property
                params.height = parseInt(event.target.value);
                genPixels()
                render()
                renderRulers()
            }
        });
    }

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
        renderRulers();
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
        renderRulers();
    })
    domElements.get("invert")?.addEventListener("click", () => {
        for (let i = 0; i<pixels.length; i++) {
            for(let j = 0; j<pixels[i].length; j++) {
                pixels[i][j].toggleState()
            }
        }

        render();
        renderRulers();
    })

    genPixels(params.data)
    render();
    renderRulers();

    return {
        element: cloned,
        export: _export
    }
}

export const Canvas = wrapForTeba(_Canvas, "canvas")
