// auth/AuthController.js
import { auth } from "../controllers/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

export const onUserStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Sends a password reset email to the given user email.
 * @param {string} email - The email of the user who forgot their password.
 * @returns {Promise<void>} - Resolves if successful, rejects with error otherwise.
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Reset Password Error:", error);
    throw new Error(
      error.code === "auth/user-not-found"
        ? "No account found with that email."
        : "Could not send reset email. Please try again."
    );
  }
};