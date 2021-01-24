import { OnlineUser } from "./online-user";


export class ReceivedUserMessageDto {
  public onlineUser: OnlineUser = { connectionId: '', userName: '' };
  public message = '';
}
