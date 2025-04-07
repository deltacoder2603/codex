// app/api/execute-code/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { language_id, source_code, stdin } = await req.json();
    const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

    if (!rapidApiKey) {
      return NextResponse.json(
        { error: "API key not configured on server" },
        { status: 500 }
      );
    }

    // Submit the code
    const submitResponse = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": rapidApiKey,
        },
        body: JSON.stringify({
          language_id,
          source_code,
          stdin,
          wait: true
        }),
      }
    );

    if (!submitResponse.ok) {
      return NextResponse.json(
        { error: `API error: ${await submitResponse.text()}` },
        { status: submitResponse.status }
      );
    }

    const submission = await submitResponse.json();
    
    if (!submission.token) {
      return NextResponse.json(
        { error: "No token received from Judge0 API" },
        { status: 500 }
      );
    }

    // Get the result
    const resultResponse = await fetch(
      `https://judge0-ce.p.rapidapi.com/submissions/${submission.token}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": rapidApiKey,
        },
      }
    );

    if (!resultResponse.ok) {
      return NextResponse.json(
        { error: `Result fetch error: ${await resultResponse.text()}` },
        { status: resultResponse.status }
      );
    }

    const result = await resultResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}