import { it, expect, describe } from "vitest";
import React from "../core/React";

describe("createElement",() => {
    it("", () => {
        const el = React.createElement("div",null, "hi")
        expect(el).toEqual({
            type: "div",
            props: {
                children:[
                    {
                        type: "TEXT_ELEMENT",
                        props: {
                            nodeValue: "hi",
                            children: []
                        }
                    }
                ]
            }
        })
    })
})

