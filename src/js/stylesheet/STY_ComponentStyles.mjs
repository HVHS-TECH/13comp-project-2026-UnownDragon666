import Colors from "./STY_ColorReference.mjs";

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
            background-color: ${Colors.buttonColor};
            border-radius: 8px;
            border-color: ${Colors.buttonBorderColor};
        }

        button:hover {
            background-color: ${Colors.buttonHoverColor};
            color: ${Colors.textHoverColor};
            transition: background-color 0.25s, color 0.5s;
        }
        `;
        document.body.appendChild(COMPONENT_LAYER_BUTTON_STYLE);

        const COMPONENT_LAYER_NAV_STYLE = document.createElement("style");
        COMPONENT_LAYER_NAV_STYLE.id = "componentLayerNavStyle";
        COMPONENT_LAYER_NAV_STYLE.classList.add("componentLayerStyles");
        COMPONENT_LAYER_NAV_STYLE.innerHTML = `
        #n_navBar {
            position: sticky;
            top: 0;
        }

        #i_pfpImage {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border-style: solid;
            border-color: ${Colors.pfpBorderColor};
        }

        .navButtons {
            padding: 1.25rem 4rem;
            width: auto;
            height: 100%;
            border: none;
            font-size: 2rem;
            font-weight: bold;
        }

        #ul_nav {
            display: flex;
            align-items: center;
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            border-bottom: solid;
            border-color: ${Colors.navBorderColor};
        }

        #ul_nav li {
            margin: 1rem 3rem;
            padding: auto;
            float: left;
            text-align: center;
            text-decoration: none;
        }
        `;
        document.body.appendChild(COMPONENT_LAYER_NAV_STYLE);
    }
}
