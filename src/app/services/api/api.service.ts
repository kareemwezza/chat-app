import { inject, Injectable } from '@angular/core';
import {
  addDoc, arrayUnion,
  collection,
  collectionData,
  doc, docSnapshots,
  Firestore,
  getDoc,
  serverTimestamp,
  setDoc, updateDoc,
} from "@angular/fire/firestore";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../auth/auth.service";
import { Observable } from "rxjs";
import IUser from "../../types/IUser";
import { IMessage } from "../../types/IChat";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private afs: Firestore = inject(Firestore);

  constructor(private _snackBar: MatSnackBar, private auth: AuthService) {
  }

  // register a new user
  createUser(name: string, email: string, phone: string, uid: string) {
    const doc$ = doc(this.afs, `users/${uid}`);
    return setDoc(doc$, {
      uid,
      name,
      email,
      phone,
      chats: [],
      created: serverTimestamp(),
    });
  }

  // get all users registered
  getUsers() {
    return collectionData(collection(this.afs, 'users')) as Observable<IUser[]>;
  }

  // get latest updated current user data
  userSnapshot() {
    const uid = this.auth.userId;
    return docSnapshots(doc(this.afs, `users/${uid}`));
  }

  // get current user document
  async currentUser(): Promise<IUser> {
    const uid = this.auth.userId;
    const doc$ = doc(this.afs, `users/${uid}`);
    const user = await getDoc(doc$);
    return user.data() as IUser;
  }

  // get chat snapshot by id
  getChat(chatId: string) {
    const doc$ = doc(this.afs, `chats/${chatId}`);
    return docSnapshots(doc$);
  }

  // create new chat between two users and return chat id
  addNewChat() {
    const doc$ = collection(this.afs, 'chats')
    return addDoc(doc$, {
      messages: []
    }).then((doc) => {
      return doc.id;
    });
  }

  // add users to each others in contacts to make available for chat
  async connectUsers(remoteUser: IUser, chatId: string) {
    const currentUser = await this.currentUser();

    const currentDoc$ = doc(this.afs, `users/${this.auth.userId}`);
    const remoteDoc$ = doc(this.afs, `users/${remoteUser.uid}`);

    getDoc(currentDoc$).then(doc => {
      const data = doc.data() as IUser;
      data.chats.push({
        chatId: chatId,
        uid: remoteUser.uid,
        name: remoteUser.name,
      })
      return updateDoc(currentDoc$, { chats: data.chats });
    });

    getDoc(remoteDoc$).then(doc => {
      const data = doc.data() as IUser;
      data.chats.push({
        chatId: chatId,
        uid: currentUser.uid,
        name: currentUser.name,
      })
      return updateDoc(remoteDoc$, { chats: data.chats });
    });
  }

  // add new message to the chat between two users
  pushMessage(chatId: string, message: IMessage) {
    const doc$ = doc(this.afs, `chats/${chatId}`);
    return updateDoc(doc$, {
      messages: arrayUnion(message),
    });
  }

  // show message in snackbar
  openSnackBar(message: string) {
    return this._snackBar.open(message, 'Close', { duration: 2000 });
  }
}
