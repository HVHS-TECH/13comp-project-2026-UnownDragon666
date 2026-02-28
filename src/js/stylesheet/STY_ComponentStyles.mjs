/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This is essentially a static class for styling compoments of the page.
 * Apply the given styles to the "component" layer of my pages.
 * This is essentially where the CSS for common components, i.e.
 * the navbar, buttons, and what have you, will be located for
 * the Content Manager to call in the setup.
 * Styles are separated into base, component, and content layers to
 * make the entire thing cleaner than a massive CSS file with
 * all of them in the same thing.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class ComponentStyles {
    /* **************************************** Public Fields *****************************************/
    static buttonColour = "#edbfc5";
    static buttonBorderColour = "#fc559a";

    /* **************************************** Public Methods *****************************************/
    /**
     * Add styles to buttons.
     */
    static applyButtonStyles() {
        const COMPONENT_LAYER_BUTTON_STYLE = document.createElement("style");
        COMPONENT_LAYER_BUTTON_STYLE.id = "componentLayerButtonStyle";
        COMPONENT_LAYER_BUTTON_STYLE.classList.add("componentLayerStyles");
        COMPONENT_LAYER_BUTTON_STYLE.innerHTML = `    
        button {
            padding: 0.6rem 1.5rem;
            background-color: ${ComponentStyles.buttonColour};
            border-radius: 8px;
            border-color: ${ComponentStyles.buttonBorderColour};
        }
        `;
        document.body.appendChild(COMPONENT_LAYER_BUTTON_STYLE);
    }
}
