import Colors from "../STY_ColorReference.mjs";

/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This STY file is for CNT_Register.mjs
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class RegisterStyles {
    /**
     * Apply the given style to the content layer style in index.html
     * Styles are separated into base, component, and content layers to
     * make the entire thing cleaner than a massive CSS file with
     * all of them in the same thing.
     */
    static applyStyle() {
        document.getElementById("contentLayerStyle").innerHTML = `
        /* Section Wrapper */
        #s_register {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem 1rem;
            box-sizing: border-box;
            overflowY: hidden;
        }

        /* Registration Title */
        #s_register > h1 { 
            font-size: clamp(2rem, 5vw, 4rem);
            margin: 0 0 2.5rem;
        }

        #s_register > button {
            font-size: 1.5rem;
        }

        /* Registration Form */
        #f_regForm {
            width: 100%;
            max-width: 480px;
            background: ${Colors.registrationFormBackgroundColor};
            border: 1.5px solid ${Colors.registrationFormBorderColor};
            border-radius: 20px;
            padding: 2.5rem 2rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        #f_regForm > h1 {
            font-size: 1.6rem;
            margin: 0 0 0.25rem;
        }

        /* Inputs */
        #f_regForm > div[id^="d_"] {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
        }

        #f_regForm label {
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.07em;
        }

        #f_regForm input[type="text"], #f_regForm input[type="number"], #f_regForm input[type="tel"], #f_regForm input[type="date"] {
            padding: 0.65rem 0.9rem;
            border: none;
            border-radius: 10px;
            font-family: sans-serif;
            font-size: 0.95rem;
            box-sizing: border-box;
            background: ${Colors.registrationInputBackgroundColor};
            transition: border-color 0.2s, box-shadow 0.2s;
            outline: none;
        }

        #f_regForm input[type="text"]:focus, #f_regForm input[type="number"]:focus, #f_regForm input[type="tel"]:focus, #f_regForm input[type="date"]:focus {
            border-color: ${Colors.registrationInputFocusBorderColor};
            box-shadow: 0 0 0 3px ${Colors.registrationInputFocusBoxShadowColor};
            background: white;
        }

        #f_regForm input::placeholder {
            opacity: 0.8;
        }

        /* Color Picker */
        i_favColor {
            align-self: center;
            height: 44px;
            border: none;
            cursor: pointer;
            background:none;
        }

        /* Submit Button */
        #f_regForm button {
            margin-top: 0.5rem;
            padding: 0.8rem;
            font-size: 1rem;
            font-weight: 700;
            border-radius: 12px;
        }
        `;
    }
}
