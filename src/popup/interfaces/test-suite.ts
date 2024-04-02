import {TestCase} from "./test-case";

export interface TestSuite {
    id: string;
    title: string;
    testCases: TestCase[];
}