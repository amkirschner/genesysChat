export class Chat {
    chatId: any;
    userId: string;
    alias: string;
    secureKey: string;
    chatEnded: boolean;
    transcriptPosition: number;
    
    constructor(obj?: any) {
        this.chatId = obj.chatId;
        this.userId = obj.userId;
        this.alias = obj.alias;
        this.secureKey = obj.secureKey;
        this.chatEnded = obj.chatEnded;
        this.transcriptPosition = obj.transcriptPosition || 1;
    }
}