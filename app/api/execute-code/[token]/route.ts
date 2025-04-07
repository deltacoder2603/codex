import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  context: { params: { token: string } }
) {
  try {
    const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
    console.log("Fetching submission with token:", context.params.token);

    if (!rapidApiKey) {
      return NextResponse.json(
        { error: "API key not configured on server" },
        { status: 500 }
      );
    }

    // Use axios instead of fetch
    const response = await axios({
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${context.params.token}`,
      headers: {
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": rapidApiKey,
        "Accept": "application/json",
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API route error:", error);
    
    // Improved error handling for axios errors
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data || error.message;
      
      return NextResponse.json(
        { error: `API error: ${JSON.stringify(errorMessage)}` },
        { status }
      );
    }
    
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
