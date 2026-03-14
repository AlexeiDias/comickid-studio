import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { type, context } = await req.json();

  const prompts: Record<string, string> = {
    plot_twist: `You are ComicBot, a friendly assistant for a 10-year-old comic book creator! 
    The comic is called "${context.title}". ${context.lastPage ? `In the last page: ${context.lastPage}` : ''}
    Suggest 3 fun, exciting, age-appropriate plot twists in simple language. 
    Format: numbered list, each under 20 words. Be enthusiastic and encouraging!`,
    
    character_name: `You are ComicBot, a friendly assistant for a 10-year-old comic book creator!
    Suggest 5 fun, creative character names for a comic. 
    Character description: ${context.description || 'a superhero'}
    Format: numbered list. Make them memorable and fun for kids!`,
    
    dialogue: `You are ComicBot, a friendly assistant for a 10-year-old comic book creator!
    Write 3 short dialogue options for a speech bubble. 
    Scene: ${context.scene || 'two characters meeting'}
    Character: ${context.character || 'a hero'}
    Keep each option under 15 words. Make them fun and exciting!`,
    
    story_idea: `You are ComicBot, a friendly assistant for a 10-year-old comic book creator!
    Generate a fun comic story idea with:
    - A title
    - One sentence plot
    - Main character description
    - The problem to solve
    Keep it age-appropriate, exciting, and simple enough for a kid to draw!`,
  };

  const prompt = prompts[type] || prompts.story_idea;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  return NextResponse.json({ result: text });
}
