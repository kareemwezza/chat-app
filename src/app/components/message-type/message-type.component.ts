import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-message-type',
  templateUrl: './message-type.component.html',
  styleUrls: ['./message-type.component.scss']
})
export class MessageTypeComponent {
  message = '';
  @Output() onMessageSent: EventEmitter<string> = new EventEmitter<string>();

  sendMessage() {
    if (this.message == '') {
      alert('Enter a message');
      return
    }

    // reset message
    this.onMessageSent.emit(this.message);
    this.message = '';
  }

}
