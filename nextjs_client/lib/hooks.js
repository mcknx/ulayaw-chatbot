import { auth, firestore } from "../lib/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  // console.log(auth);
  const [user] = useAuthState(auth); //current user from firebase

  const [username, setUsername] = useState(null); //state for username

  //listen to any changes to the user object
  useEffect(() => {
    // when user obj change -> fetch new user doc
    // listen to db realtime
    let unsubscribe; // turn off realtime subscription

    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      // ref.onSnapshot -> fbase return function -> when called will unsubscribe to said data
      unsubscribe = ref.onSnapshot((doc) => {
        // onSnapshot (callbck func) -> provide latest doc info
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    // react call unsub -> when user doc -> no longer needed
    return unsubscribe;
  }, [user]);

  return { user, username };
}
