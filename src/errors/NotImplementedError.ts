import { HttpError } from "./HttpError";

export class NotImplementedError extends HttpError {
    constructor(message: string) {
        super(message, 501);
        this.name = "NotImplementedError";
    }
}
