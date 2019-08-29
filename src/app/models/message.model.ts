export class Message {
    nickName: string;
    firstName: string;
    text: string;
    type: string;
    notification: boolean;
    initial: string;
    isTyping: boolean;
    isPushUrl: boolean;

    constructor(obj?: any) {
        this.nickName = obj.nickName;
        this.firstName = obj.firstName;
        this.text = obj.text;
        this.type = obj.type;
        this.notification = obj.notification;
        this.isTyping = obj.isTyping || false;
        this.isPushUrl = obj.isPushUrl || false;
    }
}
