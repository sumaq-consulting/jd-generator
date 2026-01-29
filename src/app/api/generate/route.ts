import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle, companyName, industry, keyPoints, location, seniority } = body;

    if (!jobTitle || !companyName) {
      return NextResponse.json(
        { error: "Job title and company name are required" },
        { status: 400 }
      );
    }

    const prompt = `Generate a professional job description for the following role. Return the response as a JSON object with these exact fields:

- title: The full job title
- company_intro: A 2-3 sentence company introduction (professional tone)
- about_role: A 2-3 sentence overview of the role
- responsibilities: An array of 5-7 key responsibilities
- requirements: An array of 5-6 must-have requirements
- nice_to_have: An array of 3-4 nice-to-have qualifications
- benefits: An array of 5-6 typical benefits for this type of role
- salary_range: A suggested salary range based on the role and seniority (UK market)

Job Details:
- Title: ${jobTitle}
- Company: ${companyName}
- Industry: ${industry || "Not specified"}
- Location: ${location}
- Seniority: ${seniority}
${keyPoints ? `- Additional context: ${keyPoints}` : ""}

Important:
- Use inclusive, gender-neutral language
- Avoid jargon like "rockstar", "ninja", "guru"
- Be specific about requirements (avoid vague terms)
- Keep responsibilities action-oriented
- Make benefits realistic and competitive

Return ONLY the JSON object, no markdown formatting.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert HR professional who writes clear, inclusive, and compelling job descriptions. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }

    const jd = JSON.parse(jsonMatch[0]);

    return NextResponse.json(jd);
  } catch (error) {
    console.error("Error generating JD:", error);
    return NextResponse.json(
      { error: "Failed to generate job description" },
      { status: 500 }
    );
  }
}
