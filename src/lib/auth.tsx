import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut 
  } from 'firebase/auth'
  import { auth } from './firebase'
  
  export const loginApi = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log(userCredential);
      return userCredential.user
    } catch (error) {
      console.log('Login error', error)
      throw error
    }
  }
  
  export const signupApi = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      return userCredential.user
    } catch (error) {
      console.log('Signup error', error)
      throw error
    }
  }
  
  export const logoutApi = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.log('Logout error', error)
      throw error
    }
  }