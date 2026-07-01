import Colors from "../STY_ColorReference.mjs";

/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This STY file is for CACS_Lobbies.mjs
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class LobbySelectStyles {
    /**
     * Apply the given style to the content layer style in index.html
     * Styles are separated into base, component, and content layers to
     * make the entire project cleaner than a massive CSS file with
     * all of them in the same file.
     */
    static applyStyle() {
        document.getElementById("contentLayerStyle").innerHTML = `
        #s_lobbies {
            padding: 2rem;
            display: grid;
            gap: 1.5rem;
        }
        
        #s_lobbies > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        #s_lobbies > div button {
            padding: 0.7rem 1.5rem;
            font-size: 1rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.2s;
        }
        
        #s_lobbies > div button:hover {
            transform: translateY(-2px);
        }

        #s_serverListSubSec {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,.08);
        }
        
        #t_serverList {
            width: 100%;
            border-collapse: collapse;
        }
        
        #t_serverList thead {
            background: #f5f5f5;
        }
        
        #t_serverList th {
            padding: 1rem;
            text-align: left;
            font-size: 1rem;
            font-weight: 600;
            border-bottom: 2px solid #ddd;
        }
        
        #t_serverList td {
            padding: 1rem;
            border-bottom: 1px solid #eee;
            vertical-align: middle;
        }
        
        #t_serverList tbody tr:last-child td {
            border-bottom: none;
        }

        .joinServerButtons {
            padding: .5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: .2s;
        }
        
        .joinServerButtons:hover {
            transform: scale(1.05);
        }
        
        #th_lobbyName { 
            width: 35%; 
        }
        
        #th_host { 
            width: 20%;
        }
        
        #th_players { 
            width: 15%; 
            text-align: center;
        }
        
        #th_pfpDisplay { 
            width: 15%; 
            text-align: center; 
        }
        
        #th_join {
            width: 15%; 
            text-align: center;
        }
        
        .numberOfPlayers,
        .joinServerButtons {
            text-align: center;
        }
        
        #tb_data td[colspan] {
            text-align: center;
            padding: 3rem;
            color: #777;
            font-style: italic;
        }
        `;
    }
}
