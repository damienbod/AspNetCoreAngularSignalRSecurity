import { OnlineUser } from "./online-user";


export class ReceivedDirectMessageForUserDto {
  public onlineUser: OnlineUser = { connectionId: '', userName: '' };
  public message = '';
}
