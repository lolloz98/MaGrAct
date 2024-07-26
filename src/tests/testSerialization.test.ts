import { fromJson } from "../components/saveAndLoad/load";
import { toJson } from "../components/saveAndLoad/save";
import { initState } from "../components/StoreContext"


describe("Serialization and Deserialization", () => {
    it("Serialize initial object and back", () => {
        const a = initState;
        const stringified = toJson(initState);
        const parsed = fromJson(stringified);
        expect(parsed).toStrictEqual(a);
    });

    it("Serialize object with some values in maps and sets and back", () => {
        const a = initState;
        a.parent.set("a", "b");
        a.titles.add("ciao");
        a.titles.add("ramarro");
        const stringified = toJson(initState);
        const parsed = fromJson(stringified);
        expect(parsed).toStrictEqual(a);
    });
})
