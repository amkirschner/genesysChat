export class User {
        firstName: string;
        lastName: string;
        subject: string;
        emailAddress: string;
        nickName: string;
        userData: any;
        type: string;

    constructor(obj?: any) {
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.subject = obj.subject;
        this.emailAddress = obj.emailAddress;
        this.nickName = obj.nickName;
        this.userData = obj.userData;
        this.type = obj.type;
    }

}
