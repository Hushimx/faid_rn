import Reactotron from 'reactotron-react-native';

Reactotron.configure({
  name: 'Faid', // optional app name
  // host: 'YOUR_LOCAL_IP', // ⚠️ Important for Android physical device
})
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate/, // ignore RN internal network logs
    },
  })
  .connect();

console.tron = Reactotron; // 👈 allows console.tron.log()
Reactotron.clear(); // clear logs on every refresh

export default Reactotron;
