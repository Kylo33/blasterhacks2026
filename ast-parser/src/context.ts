import "./types.ts"

class Context {
    #table!: Map<string, Varia>
    #existingContext!: Context

    constructor(existingContext: Context) {
        this.#existingContext = existingContext;
    }

    put(id: string, v: Varia) {
        this.#table.set(id, v)
    }

    get(id: string): Varia | undefined {
        let cur: Context = this;
        while (cur != undefined) {
            let val = cur.#table.get(id);
            if (val != undefined) {
                return val
            }
            cur = this.#existingContext;
        }
        return undefined;
    }
}
