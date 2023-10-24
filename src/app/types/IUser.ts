export default interface IUser {
    uid: string;
    name: string;
    email: string;
    phone: string;
    created: Date;
    chats: IChat[];
}

interface IChat {
    chatId: string;
    uid: string;
    name?: string;
}