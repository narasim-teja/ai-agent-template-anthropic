import { Request, Response, route } from './httpSupport'

async function GET(req: Request): Promise<Response> {
    let result = { message: '' }
    const secrets = req.secret || {};
    const queries = req.queries;
    const anthropicApiKey = (secrets.anthropicApiKey) ? secrets.anthropicApiKey as string : ''
    const anthropicModel = 'claude-3-5-sonnet-20240620'
    const query = (queries.chatQuery) ? queries.chatQuery[0] as string : 'Who are you?'

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
        result.message = (responseData.content) ? responseData.content[0].text as string : 'Failed to get result'
    } catch (error) {
        console.error('Error fetching chat completion:', error);
        result.message = error as string;
    }

    return new Response(JSON.stringify(result))
}

async function POST(req: Request): Promise<Response> {
    return new Response(JSON.stringify({message: 'Not Implemented'}))
}

export default async function main(request: string) {
    return await route({ GET, POST }, request)
}
