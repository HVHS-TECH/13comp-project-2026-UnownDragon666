/**
 * @family STY: Stylesheet
 * @description Static class - Reference for stylesheet colours (and fonts)
 *
 * Written in Term One 2026 for programming/database project
 * By: Idrees Munshi
 */
export default class Colors {
    /* **************************************** Base *****************************************/
    static backgroundColor = "#fef6ff";
    static textColor = "#2b2d42";
    static textHoverColor = "#ffffff";
    static pfpBorderColor = "#ffffff";
    static navBorderColor = "#ffe5ec";
    static fontURL = "./src/asssets/fonts/FunnelSans-VariableFont_wght.ttf";

    /* **************************************** Buttons *****************************************/
    static buttonColor = "#a0c4ff";
    static buttonBorderColor = "#c7dbff";
    static buttonHoverColor = "#89b4fa";
    static buttonTextColor = "#1a1025";
    static buttonTextHoverColor = "#ffffff";

    /* **************************************** Cards *****************************************/
    static cardBackgroundColor = "#fff0f6";
    static cardBorderColor = "#ffd6e7";

    /* **************************************** Modal *****************************************/
    static modalOutsideColor = "rgba(40, 30, 70, 0.45)";
    static modalBackgroundColor = "#f3e8ff";
    static modalButtonColor = "#cdb4db";
    static modalButtonHoverColor = "#b8a0d9";
    static modalCloseColor = "#5a4b81";
    static modalTextColor = "#2b2d42";

    /* **************************************** Player list ****************************************/
    static playerListHoverBackgroundColor = "#d8f3dc";
    static playerListActiveBackgroundColor = "#bde0fe";

    /* **************************************** Danger *****************************************/
    static dangerColor = "#ffadad";

    /* **************************************** Registration *****************************************/
    static registrationFormBackgroundColor = "#fff7e6";
    static registrationFormBorderColor = "#ffe0b2";
    static registrationInputBackgroundColor = "#ffffff";
    static registrationInputFocusBorderColor = "#ffd6a5";
    static registrationInputFocusBoxShadowColor = "rgba(255, 214, 165, 0.35)";
}

/**
 * @class
 * Colors for tabs
 */
Colors.Tabs = class {
    static backgroundColor = "#e7c6ff";
    static textColor = "#3a2e4d";
    static borderColor = "#cdb4db";
    static hoverBackgroundColor = "#bde0fe";
    static hoverTextColor = "#1a1025";
};

Colors.Cards = class {
    static backgroundColor = "#231F20";
    static fontColor = "#FFFFFF";
};

Colors.GameScreen = class {
    /* Layout */
    static sidebarBackground = "#f3e8ff";

    /* Tabs */
    static tabBackground = "#e7c6ff";
    static tabActiveBackground = "#cdb4db";
    static tabText = "#3a2e4d";
    static tabHoverText = "#1a1025";
    static tabActiveText = "#ffffff";

    /* Chat */
    static chatBubbleBackground = "#fff0f6";

    /* Card Theme */
    static blackCardBackground = "#231F20";
    static blackCardText = "#FFFFFF";
    static whiteCardBackground = "#FFFDFD";
    static whiteCardText = "#2b2d42";
    static promptPickColor = "#ffd166";

    /* Selection */
    static accentBlue = "#a0c4ff";
    static selectedBackground = "#eef7ff";

    /* Player List */
    static playerRowHover = "#f5ecff";
    static scoreBadgeText = "#1a1025";

    /* Shadows */
    static shadowSmall = "0 4px 10px rgba(205,180,219,.20)";
    static shadowMedium = "0 8px 20px rgba(205,180,219,.28)";
    static shadowLarge = "0 12px 30px rgba(205,180,219,.35)";
    static shadowSelected = "0 12px 28px rgba(160,196,255,.35)";

    /* Borders */
    static darkBorder = "#d8c6ea";
    static inputBorder = "#cdb4db";

    /* Winner */
    static winnerColor = "#89b4fa";
    static winnerGlow = "0 0 16px rgba(160,196,255,.45)";

    /* Game End */
    static gameEndBackground = "#fff7fc";
    static gameEndTitle = "#3a2e4d";
    static gameEndWinner = "#a0c4ff";

    static leaderboardBackground = "#ffffff";
    static leaderboardRowHover = "#f5ecff";
    static leaderboardBorder = "#cdb4db";

    static gameEndScore = "#3a2e4d";
    static gameEndButtonBackground = "#a0c4ff";
    static gameEndButtonText = "#ffffff";
    static gameEndButtonHover = "#89b4fa";
};

Colors.Profile = class {
    static asideBackgroundColor = "#fff";
    static asideBorderColor = "#ddd";
    static pfpBorderColor = "#eee";
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
