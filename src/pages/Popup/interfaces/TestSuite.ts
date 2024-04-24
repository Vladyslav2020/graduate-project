import {TestCase} from "./TestCase";

export interface TestSuite {
    id: string;
    title: string;
    testCases: TestCase[];
}