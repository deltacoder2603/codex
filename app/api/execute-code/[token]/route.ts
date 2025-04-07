import { NextRequest, NextResponse } from 'next/server';

type Props = {
  params: {
    token: string;
  };
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

    if (!rapidApiKey) {
      return NextResponse.json(
        { error: "API key not configured on server" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://judge0-ce.p.rapidapi.com/submissions/${params.token}`,
      {
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": rapidApiKey,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${await response.text()}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
