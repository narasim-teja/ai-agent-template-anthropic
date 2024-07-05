import { Request, Response, route } from './httpSupport'
import { renderHtml } from './uiSupport'

async function GET(req: Request): Promise<Response> {
    const secret = req.queries?.key ?? '';
    const anthropicApiKey = req.secret?.anthropicApiKey as string;
    const anthropicModel = 'claude-3-5-sonnet-20240620';
    const query = req.queries.chatQuery[0] as string;
    let result = '';

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${anthropicApiKey}`,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: `${query}` }],
                model: `${anthropicModel}`,
                max_tokens: 1024
            })
        });
        const responseData = await response.json();
        result = responseData.content[0].text as string;
    } catch (error) {
        console.error('Error fetching chat completion:', error);
        result = error;
    }

    return new Response(renderHtml(result));
}

async function POST(req: Request): Promise<Response> {
    return new Response('Not Implemented')
}

export default async function main(request: string) {
    return await route({ GET, POST }, request)
}
