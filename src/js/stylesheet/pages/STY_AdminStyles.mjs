import Colors from "../STY_ColorReference.mjs";

/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This STY file is for CNT_Admin.mjs
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class AdminStyles {
    /**
     * Apply the given style to the content layer style in index.html
     * Styles are separated into base, component, and content layers to
     * make the entire project cleaner than a massive CSS file with
     * all of them in the same file.
     */
    static applyStyle() {
        document.getElementById("contentLayerStyle").innerHTML = `
            body {
                overflow: hidden;
            }

            #m_content {
                display: grid;
                grid-template-columns: 1fr 5fr;
                height: 100vh;
            }

            /* Player List */
            #d_playerList {
                display: flex;
                flex-direction: column;
                 padding: 1rem;
                border-right: 1px solid #ccc;
                overflow-y: auto;
            }

            #u_playerList {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            #u_playerList li {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: larger;
            }
            
            .l_playerListElements:hover {
                background-color: ${Colors.playerListHoverBackgroundColor};
                transition: background-color 0.15s;
            }

            .l_playerListElements:active {
                background-color: ${Colors.playerListActiveBackgroundColor}
            }

            .playerListPFPImages {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
                flex-shrink: 0;
            }

            .playerListNameText {
                margin: 0;
                flex: 1;
            }

            #s_playerListSection {
                padding: 0.5vh;
                border-right: solid 3px ${Colors.navBorderColor};
            }

            /* Controls Section */
            #s_controlsSection {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 5% 10%;
                gap: 2rem;
            }

            #d_infoDiv {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 2rem;
            }

            #i_playerPFPImage {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                object-fit: cover;
                transform: scale(1.25);
            }

            #p_playerNameTitle {
                margin: 0;
                text-align: center;
                padding-bottom: 1rem;
                font-size: xxx-large;
            }

            #d_nameEditDiv {
                gap: 0.5rem;
            }

            #d_removeAccountContainer {
                display: flex;
                flex-direction: row;
                gap: inherit;  
            }

            #i_newUsername {
                margin-left: 1rem;
            }

            #d_newUsernameInputDiv {
                transform: scale(1.4);
            }

            .accountManagementOptions {
                background-color: ${Colors.dangerColor};
                color: white;
                border: none;
                padding: 1rem;
                border-radius: 6px;
                font-size: large;
                cursor: pointer;
            }

            .accountManagementOptions:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }

            /* Modal styling */
            #d_modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                overflow: auto;
                justify-content: center;
                align-items: center;
                background-color: ${Colors.modalOutsideColor};
            }
    
            #d_modalContent {
                background-color: ${Colors.modalBackgroundColor};
                padding: 4rem;
                margin-top: 15%;
                margin-bottom: 15%;
                border-radius: 10px;
                max-width: 40%;
                min-width: 33%;
                width: 90%;
                text-align: center;
                position: relative;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                color: ${Colors.modalTextColor};
            }
    
            #d_modalContent button {
                background-color: ${Colors.modalButtonColor};
                border: none;
                color: ${Colors.textHoverColor};
            }
    
                #d_modalContent button:hover {
                background-color: ${Colors.modalButtonHoverColor};
                color: ${Colors.modalTextColor};
                }
    
                #h_modalTitle {
                font-weight: bold;
                font-size: 3.5rem;
                margin-bottom: 1.5rem;
            }
    
            #p_modalDescription {
                font-size: 1.25rem;
                margin-bottom: 2rem;
                text-align: center;
            }
    
            #s_modalClose {
                position: absolute;
                top: 0rem;
                right: 1rem;
                font-size: 4rem;
                cursor: pointer;
                color: ${Colors.modalCloseColor};
            }

        `;
    }
}
