import { OnlineUser } from "./online-user";

export class DirectMessage {
    public message: string;
    public fromOnlineUser: OnlineUser | null;
}
