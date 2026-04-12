/**
 * @family STY: Stylesheet
 * @description Static class - Reference for stylesheet colours (and fonts)
 *
 * Written in Term One 2026 for programming/database project
 * By: Idrees Munshi
 */
export default class Colors {
    /* **************************************** Stylesheet Colours *****************************************/

    // Base fields
    static backgroundColor = "#fdf0f5";
    static textColor = "#000000";
    static textHoverColor = "#ffffff";
    static pfpBorderColor = "#ffffff";
    static navBorderColor = "#f5c4d8";
    static fontURL = "./src/asssets/fonts/FunnelSans-VariableFont_wght.ttf";

    // Component colors
    static buttonColor = "#f9a8c4";
    static buttonBorderColor = "#fce4ee";
    static buttonHoverColor = "#f472a8";
    static buttonTextColor = "#ffffff";
    static buttonTextHoverColor = "#ffffff";

    // Card colors
    static cardBackgroundColor = "#fde8dc";
    static cardBorderColor = "#f9c4a8";
    static modalOutsideColor = "rgba(30, 58, 95, 0.55)";
    static modalBackgroundColor = "#dbeeff";
    static modalButtonColor = "#3b82c4";
    static modalButtonHoverColor = "#60a5e0";
    static modalCloseColor = "#1e3a5f";
    static modalTextColor = "#1e3a5f";

    // Lobby Colors
    static exitButtonColor = "";
    static exitButtonHoverColor = "";
    static exitButtonTextColor = "";
    static exitButtonHoverTextColor = "";

    // Admin player list colors
    static playerListHoverBackgroundColor = "#f3e8ff";
    static playerListActiveBackgroundColor = "#a78bfa";

    // Danger
    static dangerColor = "#dc2626";

    // Registration colors
    static registrationFormBackgroundColor = "#fde8dc";
    static registrationFormBorderColor = "#f9c4a8";
    static registrationInputBackgroundColor = "#fdf0f5";
    static registrationInputFocusBorderColor = "#7c6de0";
    static registrationInputFocusBoxShadowColor = "rgba(124, 109, 224, 0.2)";
}

/**
 * @class
 * Colors for tabs
 */
Colors.Tabs = class {
    static backgroundColor = "#4c3d99";
    static textColor = "#ede9fe";
    static borderColor = "#7c6de0";

    static hoverBackgroundColor = "#ede9fe";
    static hoverTextColor = "#4c3d99";
};

/**
 * It's just an archive of the old colors (for... i dont really know, just in case)
 */
Colors.Archive = class {
    // Base fields
    static backgroundColor = "#ffe9ef";
    static textColor = "#000000";
    static textHoverColor = "#ffffff";
    static pfpBorderColor = "#ffffff";
    static navBorderColor = "#fc809f";
    static fontURL = "./src/asssets/fonts/FunnelSans-VariableFont_wght.ttf";

    // Component colors
    static buttonColor = "#ff9cb5";
    static buttonBorderColor = "#ffbccd";
    static buttonHoverColor = "#ffc9d7";
    static buttonTextColor = "#ffffff";
    static buttonTextHoverColor = "#000000";

    // Card colors (Game selection page)
    static cardBackgroundColor = "#ffc9d7";
    static modalOutsideColor = "#9666728a";
    static modalBackgroundColor = "#8cd5a0";
    static modalButtonColor = "#3a9e6c";
    static modalButtonHoverColor = "#5cbf8a";
    static modalCloseColor = "#153d3a";
    static modalTextColor = "#153d3a";

    // Tabs colors
    static tabBorderColor = "#ff4d6d";
    static tabBackgroundColor = "#ff8fa3";
    static tabButtonHover = "#c9184a";
    static tabButtonFontColorHover = "#ffccd5";

    // Admin player list colors
    static playerListHoverBackgroundColor = "#f7aef8";
    static playerListActiveBackgroundColor = "#b388eb";
    static dangerColor = "crimson";

    // Registration colors
    static registrationFormBackgroundColor = "#ffc9d7";
    static registrationFormBorderColor = "#ffbccd";
    static registrationInputBackgroundColor = "#ffe9ef";
    static registrationInputFocusBorderColor = "#ff4d6d";
    static registrationInputFocusBoxShadowColor = "rgba(252, 128, 159, 0.25)";
};
