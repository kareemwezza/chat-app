import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ApiService } from "../../services/api/api.service";
import { Subject, takeUntil } from "rxjs";

import IChat, { IMessage } from "../../types/IChat";
import IUser from "../../types/IUser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  message = '';
  showMessages = false;
  messages!: IMessage[];
  chatId!: string;
  users!: IUser[];
  authUser!: IUser;
  dialogRef!: MatDialogRef<any>;
  unsubscribe$: Subject<any> = new Subject();

  constructor(private api: ApiService, private dialog: MatDialog) {}

  @ViewChild('chatHistory') private chatContainer!: ElementRef;

  ngOnInit() {
    this.api.userSnapshot()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
      this.authUser = user.data() as IUser;
    });
  }

  openDialog(userList: any) {
    this.getAllUsers().then(() => {
      this.dialogRef = this.dialog.open(userList, {
        width: '400px',
        maxHeight: '400px',
      });
    });
  }

  // get All users available to chat with
  async getAllUsers() {
    this.authUser = await this.api.currentUser();
    this.api.getUsers().pipe(takeUntil(this.unsubscribe$))
      .subscribe((users) => {
      this.users = users.filter(user => {
        const found = this.authUser?.chats.find((el: any) => el.uid === user.uid);
        if (!found && user.uid !== this.authUser.uid) {
          return user;
        }
        return;
      });
    })
  }

  selectUser(remoteUser: IUser) {
    this.dialogRef.close();

    // chatting for the first time
    this.api.addNewChat().then(async (chatId) => {
      // connect users to each other
      await this.api.connectUsers(remoteUser, chatId);
      this.selectChat(chatId);
    }).catch(err => {
      console.log('error occurred while adding a new user to your list', err);
    })
  }

  // select chat to view and get its data
  selectChat(chatId: string) {
    this.api.getChat(chatId).subscribe((doc) => {
      const chat = doc.data() as IChat;
      this.chatId = chatId;
      this.messages = chat.messages;
      this.showMessages = true;
      this.scrollToChatEnd();
    });
  }

  async handleSendMessage($event: string) {
    const message: IMessage = {
      senderId: this.authUser.uid,
      timestamp: Date().toString(),
      content: $event,
    }

    // this.messages.push(message);
    await this.api.pushMessage(this.chatId, message);
    this.scrollToChatEnd();
  }

  // scroll down to the end of the chat
  scrollToChatEnd() {
    if (this.showMessages && this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
