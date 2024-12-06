import { NextResponse } from 'next/server';
import { generatePrompt } from '../../utils/openai';

export async function POST(req: Request): Promise<NextResponse> {
  const { input } = await req.json();

  if (!input) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  try {
    const result = await generatePrompt(input);
    return NextResponse.json({ response: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
