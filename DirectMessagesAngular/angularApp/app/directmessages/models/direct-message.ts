import { OnlineUser } from "./online-user";

export class DirectMessage {
    public fromOnlineUser: OnlineUser | null = {connectionId: '', userName: ''};
    public message = '';
}
