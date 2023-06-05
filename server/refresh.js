import { db } from '../src/firebase.js';
import axios from 'axios';
import {
    updateDoc,
    doc,
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";

export const refresh = async () => {
    try {
        const q = query(collection(db, "accounts"), where("expiresIn", "<=", 1000));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnapshot) => {
            const user = docSnapshot.data();

            // Get the refresh token from the user document
            const refreshToken = user.refreshToken;
            let accessToken = '';

            axios.post("http://localhost:3001/refresh", {
                refreshToken,
            })
                .then(async res => {
                    accessToken = res.data.accessToken;
                    await updateDoc(doc(db, "accounts", user.uid), {
                        spotifyToken: accessToken,
                    });
                })
                .catch(() => {
                    // Handle error if necessary
                });
        });
    } catch (err) {
        console.log(err);
    }
};

export default refresh;
