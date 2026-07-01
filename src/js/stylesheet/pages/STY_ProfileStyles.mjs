import Colors from "../STY_ColorReference.mjs";

/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This STY file is for CNT_Profile.mjs
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class ProfileStyles {
    /**
     * Apply the given style to the content layer style in index.html
     * Styles are separated into base, component, and content layers to
     * make the entire thing cleaner than a massive CSS file with
     * all of them in the same thing.
     */
    static applyStyle() {
        document.getElementById("contentLayerStyle").innerHTML = `
            #s_profileContent {
                display: grid;
                grid-template-columns: 300px 1fr;
                gap: 2rem;
                padding: 2rem;
            }

            #s_profile aside {
                display: grid;
                gap: 2rem;
                padding: 2rem 1.5rem;
                background: ${Colors.Profile.asideBackgroundColor};
                border: 1px solid ${Colors.Profile.asideBorderColor};
                border-radius: 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }

            #d_pfp {
                display: grid;
                justify-items: center;
                gap: 1rem;
            }

            #img_pfp {
                width: 140px;
                height: 140px;
                border-radius: 50%;
                object-fit: cover;
                border: 4px solid ${Colors.Profile.pfpBorderColor};
            }

            #h_username {
                width: 100%;
                margin: 0;
                text-align: center;
                font-size: 1.6rem;
                font-weight: 700;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            #d_update {
                display: grid;
                gap: 1rem;
            }

            #d_update button {
                width: 100%;
            }

            #s_profile > section > section {
                background: ${Colors.Profile.asideBackgroundColor};
                border: 1px solid ${Colors.Profile.asideBorderColor};
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }

            #s_profileContent ul {
                list-style: none;
                margin: 0;
                padding: 0;
                display: grid;
                gap: 1rem;
            }

            #s_profileContent li {
                padding: 1rem 1.25rem;
                border: 1px solid #e5e5e5;
                border-radius: 10px;
                background: #fafafa;
                font-size: 1.05rem;
            }
        `;
    }
}
