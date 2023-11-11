import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export default class Operations {
  getUser = () => {
    return this.User;
  };

  setUser = () => {
    const {currentUser} = auth();
    firestore()
      .collection('demoUsers')
      .doc(currentUser.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          this.User = documentSnapshot.data();

          // console.log('read', this.User);
          // console.log('User data: ', documentSnapshot.data());
        }
      });
  };
}
