export interface StructPrint {
    export(): any;
}

export abstract class Builder<T> implements StructPrint {
    protected conf!: T

    constructor() {
        this.conf = this.init()
    }

    abstract getName(): string;

    abstract init(): T;

    public export(): any {
        return this.conf;
    }
}