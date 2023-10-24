export default interface IChat {
  messages: IMessage[]
}

export interface IMessage {
  senderId: string;
  content: string;
  timestamp: string;
}