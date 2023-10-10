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

    return (params) => {
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

        const elem = f(cloned, params)

        return {
            element: elem
        }
    }
}
