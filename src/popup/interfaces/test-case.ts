import {TestStep} from "./test-step";

export interface TestCase {
    id: string;
    title: string;
    commands: TestStep[];
}