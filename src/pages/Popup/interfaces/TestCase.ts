import {TestStep} from "./TestStep";
import {TestRun} from "./TestRun";

export interface TestCase {
    id: string;
    title: string;
    steps: TestStep[];
    runs: TestRun[];
}