// @ts-check

/**
 * 
 * @param {string} templateId 
 * @param {Object} params - Params for Canvas
 * @param {number} [params.width=128] - The width of the Canvas
 * @param {number} [params.height=64] - The height of the Canvas
 * @param {number} [params.size=10] - The size of a pixel
 * 
 * @returns {HTMLElement}
 */
export function Canvas(templateId, params = {}) {
    /** @type {HTMLTemplateElement} */
    // @ts-ignore
    const template = document.getElementById(templateId);

    if (!template) {
        throw new Error(`Template with id: ${templateId} not found`)
    }

    if (!params.height) {
        params.height = 64
    }

    if (!params.width) {
        params.width = 128
    }

    if (!params.size) {
        params.size = 10
    }

    /** @type {HTMLElement} */
    //  @ts-ignore 
    const cloned = template.content.cloneNode(true)
    const containerId = 'container'
    const container = cloned.querySelectorAll(`[data-teba-id='${containerId}']`)[0]

    if (!container) {
        throw new Error(`Template missing slot ${containerId}`)
    }

    document.documentElement.style.setProperty("--pixel-size", `${params.size}px`)

    for(let y = 0; y < params.height; y++) {
        for (let x = 0; x < params.width; x++) {
            const pixel = CanvasPixel('canvas-pixel', {
                x,
                y
            });

            container.appendChild(pixel);
        }
    }

    return cloned
}

/**
 * 
 * @param {string} templateId 
 * @param {Object} params - Params for CanvasPixel
 * @param {number} [params.x = 0] - Position on the x axis
 * @param {number} [params.y = 0] - Position on the y axis
 * 
 * @returns {HTMLElement}
 */
export function CanvasPixel (templateId, params = {}) {
    const template = document.getElementById(templateId);

    if (!template) {
        throw new Error(`Template with id: ${templateId} not found`)
    }

    if (!params.x) {
        params.x = 0
    }

    if (!params.y) {
        params.y = 0
    }

    /** @type {HTMLElement} */
    //  @ts-ignore 
    const cloned = template.content.cloneNode(true)
    
    return cloned
}
