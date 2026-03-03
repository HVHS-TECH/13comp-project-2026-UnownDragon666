import Content from "./CNT_Content.mjs";

/**
 * @family CNT: Content
 * @description Register is a class for the content of the registration page
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class Register extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_register";

    /* **************************************** Public Fields *****************************************/
    styleID = "RGSS";

    /* **************************************** Constructor *****************************************/
    /**
     * constructor passes the secID (section ID) private field as a parameter
     * to its parent constuctor (using super())
     */
    constructor() {
        super(Register.#secID);
    }

    /* ******************************** Parent Class Method Overrides *********************************/

    removeContent() {
        document.getElementById(Register.#secID).innerHTML = ``;
    }

    buildContent() {
        // Page Title
        const TITLE = document.createElement("h1");
        TITLE.textContent = "Registration";

        const SIGNUP_BUTTON = super.createButton(
            "Sign up with Google",
            "googleAuth",
        );

        this.section.append(TITLE, SIGNUP_BUTTON);
    }

    /* **************************************** Public Methods *****************************************/
    async buildRegistrationForm() {
        // Build Registration Form
        console.log("REG FORM");
        let REG_FORM = document.createElement("form");
        REG_FORM.id = "f_regForm";

        const TITLE = super.createTitle("Registration Form");
        REG_FORM.appendChild(TITLE);
        this.section.appendChild(REG_FORM);

        const DISPLAY_NAME = super.createInput(
            "Choose a display name!",
            "Username",
            "text",
            "i_nameInput",
            "i_nameInput",
            "d_nameInput",
        );
        REG_FORM.appendChild(DISPLAY_NAME);

        const AGE = super.createInput(
            "Please enter your age",
            "Age",
            "number",
            "i_ageInput",
            "i_ageInput",
            "d_ageInput",
        );
        AGE.querySelector("input").min = 5;
        AGE.querySelector("input").max = 125;
        REG_FORM.appendChild(AGE);

        const BIRTHDAY = super.createInput(
            "Please enter your birthday",
            "1/1/2000",
            "date",
            "i_bdayInput",
            "i_bdayInput",
            "d_bdayInput",
        );
        REG_FORM.appendChild(BIRTHDAY);

        const PHONENUMBER = super.createInput(
            "Please enter your phone number",
            "022 000 0000",
            "tel",
            "i_telNumInput",
            "i_telNumInput",
            "d_telNumInput",
        );
        PHONENUMBER.querySelector("input").setAttribute(
            "pattern",
            "[0-9]{3}-[0-9]{3}-[0-9]{4}",
        );
        REG_FORM.appendChild(PHONENUMBER);

        const FAV_COLOR = super.createInput(
            "What is your favourite color?",
            "Red",
            "color",
            "i_favColorInput",
            "i_favColorInput",
            "d_favColorInput",
        );
        REG_FORM.appendChild(FAV_COLOR);

        const PRONOUNS = super.createInput(
            "Please enter your preferred pronouns!",
            "they/them, she/them, whatever you identify with!",
            "text",
            "i_pronounInput",
            "i_pronounInput",
            "d_pronounInput",
        );
        REG_FORM.appendChild(PRONOUNS);

        // Submit button
        const SUBMIT = super.createButton("Register", "submitForm");
        SUBMIT.type = "submit";
        REG_FORM.appendChild(SUBMIT);

        REG_FORM.addEventListener("submitForm", (e) => {
            e.preventDefault();
            this.validateForm();
        });

        return document.getElementById(Register.#secID);
    }

    validateForm() {
        let name = document.getElementById("i_nameInput");
        console.log(name);
    }
}
