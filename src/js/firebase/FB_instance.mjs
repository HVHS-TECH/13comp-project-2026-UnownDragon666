import FirebaseIO from "./FB_IO.mjs";
/**
 * @family FB: Firebase
 * @description This FB instamce is a common point for all classes in the
 * project to get accesss to common FB methods they may need.
 *
 * Written in Term One 2026 for programming/database project
 * By: Idrees Munshi
 */

let firebaseIO = null;

export async function initializeFirebase() {
    const FBCONFIG = {
        apiKey: "AIzaSyCMMs5kHbSUMnPyf2UWcKSy19HvB-PcV1U",
        authDomain: "comp-idrees-munshi.firebaseapp.com",
        databaseURL: "https://comp-idrees-munshi-default-rtdb.firebaseio.com",
        projectId: "comp-idrees-munshi",
        storageBucket: "comp-idrees-munshi.firebasestorage.app",
        messagingSenderId: "619179593445",
        appId: "1:619179593445:web:1dfc6163eeb080e8da8e0c",
        measurementId: "G-PSEYN1X511",
    };

    return (firebaseIO = new FirebaseIO(FBCONFIG));
}
export { firebaseIO };
