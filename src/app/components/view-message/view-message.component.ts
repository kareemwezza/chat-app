import { Component, Input } from '@angular/core';
import { IMessage } from "../../types/IChat";

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.component.html',
  styleUrls: ['./view-message.component.scss']
})
export class ViewMessageComponent {
  @Input() message!: IMessage;
  @Input() uid!: string;
}
