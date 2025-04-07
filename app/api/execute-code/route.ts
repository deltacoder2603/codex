// app/api/execute-code/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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

    // Submit the code using axios
    const submitResponse = await axios({
      method: 'POST',
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": rapidApiKey,
      },
      data: {
        language_id,
        source_code,
        stdin,
        wait: true
      },
      timeout: 10000, // 10 second timeout
      timeoutErrorMessage: 'Request to Judge0 API timed out'
    });
    
    const submission = submitResponse.data;
    
    if (!submission.token) {
      return NextResponse.json(
        { error: "No token received from Judge0 API" },
        { status: 500 }
      );
    }

    // Get the result using axios
    const resultResponse = await axios({
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${submission.token}`,
      headers: {
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": rapidApiKey,
      },
      timeout: 10000, // 10 second timeout
      timeoutErrorMessage: 'Request to Judge0 API timed out'
    });

    return NextResponse.json(resultResponse.data);
  } catch (error) {
    console.error("API route error:", error);
    
    // Improved error handling for axios errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        return NextResponse.json(
          { error: 'Connection to Judge0 API timed out. Please try again later.' },
          { status: 504 }
        );
      }
      
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
