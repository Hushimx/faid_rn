// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   SignInResponse,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
// import { GOOGLE_IOS_CLIENT_ID } from 'common';
// import { supabase } from 'config';
// const useGoogleProvider = () => {
//   GoogleSignin.configure({
//     iosClientId: GOOGLE_IOS_CLIENT_ID,
//   });
//   const loginWithGoogle = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo: SignInResponse = await GoogleSignin.signIn();
//       if (userInfo?.data?.idToken) {
//         const { data, error } = await supabase.auth.signInWithIdToken({
//           provider: 'google',
//           token: userInfo.data.idToken,
//         });
//         console.log(error, data);
//       } else {
//         throw new Error('no ID token present!');
//       }
//     } catch (error: any) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (e.g. sign in) is in progress already
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // play services not available or outdated
//       } else {
//         // some other error happened
//       }
//     }
//   };

//   return { loginWithGoogle, GoogleSigninButton };
// };

// export default useGoogleProvider;
