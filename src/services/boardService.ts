import EventEmitter from "events";

export type BoardCall = {
    ticket: string;
    counter: string | number;
    service: string;
    at: string;
}

class BoardBus extends EventEmitter {
    private recentCalls: BoardCall[] =[];

    push(call: BoardCall) {
        this.recentCalls.unshift(call);
        if (this.recentCalls.length > 10) this.recentCalls.pop();
        this.emit("update", call);
    }

    getRecent(): BoardCall[] {
        return [...this.recentCalls];
    }
}

export const boardBus = new BoardBus();