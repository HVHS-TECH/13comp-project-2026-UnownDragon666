import Content from "./CNT_Content.mjs";
import { firebaseIO } from "../firebase/FB_instance.mjs";
import { initializeUser } from "../accountManager/AM_User.mjs";

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
    // The ID used to identify the stylesheet belonging to this page (ReGister Style Sheet)
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
    async removeContent() {
        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
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
    /**
     * This function is responsible for building the registration form's <form> element and its various inputs/submit button.
     *
     * @returns {object} - The Node HMTL element to be appended to the DOM.
     */
    async buildRegistrationForm() {
        this.section.innerHTML = ``;

        // Build Registration Form
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
            "[0-9]{3} [0-9]{3} [0-9]{4}",
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
        const SUBMIT = super.createButton("Register");
        SUBMIT.type = "submit";
        REG_FORM.appendChild(SUBMIT);

        REG_FORM.addEventListener("submit", (event) => {
            event.preventDefault();
            this.validateForm();
        });
        return document.getElementById(Register.#secID);
    }

    /**
     *  Validate the registration form's input
     *
     *  If the form inputs are valid, write user to database.
     *
     *  @returns {Promise<void>}
     */
    async validateForm() {
        let details = {};
        const textRegexTest = /^[a-zA-Z0-9]+$/; // Regular Expression to check if username is entirely alphanumeric
        const numRegexTest = /^[0-9]+$/; // Regular expression to test if number IS a number

        // Test if name is acceptable (does not contain special characters)
        let name = document.getElementById("i_nameInput").value;
        if (!textRegexTest.test(name)) {
            this.#displayError(
                "Please ensure your name is purely alphanumeric! No spaces or special characters.",
            );
            return; // Return if username NOT alphanumeric (i.e. contains special characters)
        }

        // Test if age between 5 and 125 inclusive
        let age = document.getElementById("i_ageInput").value;
        if (!numRegexTest.test(age)) {
            this.#displayError("Enter an age between 5 and 125!");
            return;
        }
        // If the birthday test function returns false,
        if (this.#testBDay(age)) {
            Object.assign(details, { userBirthday: "Valid" });
        } else {
            Object.assign(details, { userBirthday: "Invalid" });
        }

        // Here I will not be validating phone numbers, as this is a school project,
        // and... well I don't want to make people give me their real phone numbers.
        let telNum = document.getElementById("i_telNumInput").value;
        if (!telNum) {
            this.#displayError("Enter a phone number! (XXX XXX XXXX)");
            return;
        }
        // Get the favorite color
        let favColor = document.getElementById("i_favColorInput").value;
        if (!favColor) {
            this.#displayError(
                "What's your favourite color? How did you... circumvent a color input???",
            );
            return;
        }

        // Get user's pronouns
        let pronouns = document.getElementById("i_pronounInput").value;
        if (!pronouns) {
            this.#displayError(
                "Please share your pronouns! Or... don't. Just... you can't leave this empty, k?",
            );
            return;
        }

        try {
            await firebaseIO.updateRecord(
                `/users/${firebaseIO.auth.currentUser.uid}`,
                {
                    private: {
                        age: age,
                        dateOfBirth:
                            document.getElementById("i_bdayInput").value,
                        extradetails: details,
                        telNum: telNum,
                        favoriteColor: favColor,
                        email: firebaseIO.auth.currentUser.email,
                        providerData: firebaseIO.auth.currentUser.providerData,
                    },
                    public: {
                        username: name,
                        pronouns: pronouns,
                        photoURL: firebaseIO.auth.currentUser.photoURL,
                    },
                    isAdmin: false,
                    deleted: false,
                    uid: firebaseIO.auth.currentUser.uid,
                },
            );
        } catch (error) {
            throw error;
        }

        let record = await firebaseIO.readRecord(
            `/users/${firebaseIO.auth.currentUser.uid}`,
        );

        await initializeUser(record);

        let event = new CustomEvent("navigate", {
            detail: {
                content: "Profile",
            },
        });
        document.dispatchEvent(event);
    }

    /* **************************************** Private Methods *****************************************/

    /**
     * Displays error message for invalid input
     *
     * @param {string} _errorText - Text to display in error message
     */
    #displayError(_errorText) {
        window.alert(_errorText);
    }

    /**
     * Function to validate birthday using user's age
     *
     * @returns {boolean} - whether the entered birthday is valid or not
     */
    #testBDay(_age) {
        _age = Number(_age);

        // Test if BDay corresponds to age
        let bday = document.getElementById("i_bdayInput").value;

        // Split string into [day, month, year]
        bday = bday.split("-");

        const CURRENT_DATE = new Date().getFullYear();
        const BDAY_DATE = new Date(bday[0], bday[1] - 1, bday[2]).getFullYear();

        // Use age to check if bday is correct
        if (
            CURRENT_DATE - BDAY_DATE == _age + 1 ||
            CURRENT_DATE - BDAY_DATE == _age
        ) {
            return true; // Valid
        } else {
            return false; // Not valid
        }
    }
}
