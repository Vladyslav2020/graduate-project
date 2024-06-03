import OpenAI from 'openai';
import {TestCase} from "../interfaces/TestCase";
import {ChatCompletionMessageParam} from 'openai/resources';

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY, dangerouslyAllowBrowser: true});

class AIGenerationService {
    private readonly systemMessage: ChatCompletionMessageParam = {
        role: 'system',
        content: 'User will give you steps for UI test case containing consequent steps like open url, click element by xpath and so on. Your task is to automate this test case with JavaScript (Selenium) code including test method for testing in Chrome browser environment. The result should only include code without additional instructions.'
    };

    async getCodeForTestCase(testCase: TestCase, callback): Promise<string> {
        try {
            return this.streamChatGPTResponse(JSON.stringify({
                title: testCase.title,
                steps: testCase.steps
            }), callback);
        } catch (error) {
            console.error('Error fetching ChatGPT response:', error);
            return '';
        }
    }

    private async streamChatGPTResponse(userPrompt: string, callback): Promise<string> {
        const stream: any = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [this.systemMessage, {role: 'user', content: userPrompt}],
            stream: true,
        });

        let partialResponse = '';
        for await (const chunk of stream) {
            partialResponse += chunk.choices[0]?.delta?.content || '';
            callback(partialResponse);
        }

        return partialResponse;
    }
}

export const aiGenerationService = new AIGenerationService();