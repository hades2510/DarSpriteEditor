// @ts-check

const registry = new Map();

/**
 * 
 * @param {Function} f 
 * @param {string} defaultTemplateId
 * @returns 
 */
export function wrapForTeba(f, defaultTemplateId) {
    // register new template
    if (!registry.has(f)) {
        registry.set(f, defaultTemplateId)
    }

    return (params = {}) => {
        const templateId = params.templateId || defaultTemplateId;

        /** @type {HTMLTemplateElement} */
        // @ts-ignore
        const template = document.getElementById(templateId);

        if (!template) {
            throw new Error(`Template with id: ${templateId} not found`)
        }

        /** @type {HTMLElement} */
        //  @ts-ignore 
        const cloned = template.content.cloneNode(true)
        const slots = new Map()

        //  get slots and pass them to function
        const tebaSlots = cloned.querySelectorAll('[data-teba-id]')

        for(let slot of tebaSlots) {
            slots.set(slot.getAttribute('data-teba-id'), slot)
        }

        const firstElement = cloned.children[0]

        const elem = f(firstElement, params, slots)

        return {
            element: elem
        }
    }
}
