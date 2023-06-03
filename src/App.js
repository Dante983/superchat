import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCNQ2ARorrqY7Fkjcxmi7yVjzvj5wXiVNo",
  authDomain: "superchat-d5408.firebaseapp.com",
  projectId: "superchat-d5408",
  storageBucket: "superchat-d5408.appspot.com",
  messagingSenderId: "758727382930",
  appId: "1:758727382930:web:909092d66bd92ce93d134b",
  measurementId: "G-645XQYLMN1"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>{user && <SignOut />}</header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idFIled: 'id'});
  const [formValue, setFormValue] = useState('') ;

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behaviour: 'smooth' });
  }

  return (
   <>

    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>
     <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

     <button type="submit">Send Message</button> 
    </form>


   </> 
  )

}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="img"/>
      <p>{ text }</p>
    </div>
  )
}

export default App;
