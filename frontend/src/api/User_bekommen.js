import { getAuth } from "firebase/auth";
import { create } from "./PersonBO";

const auth = getAuth();
const person = person.currentUser;
if (person !== null) {

  const displayName = person.displayName;
  const email = person.email;
  const photoURL = person.photoURL;
  const emailVerified = person.emailVerified;


  const uid = person.uid;
}
auth_get_person_profile.js
