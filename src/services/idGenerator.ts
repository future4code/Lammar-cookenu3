import { v4 } from "uuid";

export class IdGenerator {
    public generateId = () => {  
        return v4();
    }
}
