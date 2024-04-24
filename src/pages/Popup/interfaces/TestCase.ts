import {TestStep} from "./TestStep";

export interface TestCase {
    id: string;
    title: string;
    commands: TestStep[];
}