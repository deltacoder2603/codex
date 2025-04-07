import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Map our language codes to Piston's language codes
const languageMap: Record<string, string> = {
  "71": "python", // Python
  "54": "cpp",    // C++
  "62": "java",   // Java
};

// Map languages to specific versions
const versionMap: Record<string, string> = {
  "python": "3.10",
  "cpp": "10.2.0",  // Updated C++ version
  "java": "15.0.2",
};

export async function POST(req: NextRequest) {
  try {
    const { language, code, input } = await req.json();
    
    // Get the appropriate language for Piston API
    let pistonLanguage = languageMap[language] || "python";
    let pistonVersion = versionMap[pistonLanguage] || "3.10";
    
    // Clean up the code - remove language comments at the beginning
    let cleanCode = code || "print('Hello, World!')";
    
    // Check if we need to override the language based on code content
    if (pistonLanguage === "python" && 
        (cleanCode.includes("using namespace std") || 
         cleanCode.startsWith("// C++ code"))) {
      // If Python is trying to run C++ code, force C++ instead
      console.log("Detected C++ code being run as Python, switching to C++");
      pistonLanguage = "cpp";
      pistonVersion = "10.2.0"; // Use the correct version from versionMap
    } else if (pistonLanguage === "python" && 
               (cleanCode.includes("public static void main") || 
                cleanCode.startsWith("// Java code"))) {
      // If Python is trying to run Java code, force Java instead
      console.log("Detected Java code being run as Python, switching to Java");
      pistonLanguage = "java";
      pistonVersion = "15.0.2";
    }
    
    console.log(`Executing ${pistonLanguage} (${pistonVersion}) code`);
    
    // Remove C-style comments for Python
    cleanCode = cleanCode.replace(/^\/\/.*$/m, "").trim();
    
    // Submit code to Piston API
    const response = await axios({
      method: 'POST',
      url: 'https://emkc.org/api/v2/piston/execute',
      data: {
        language: pistonLanguage,
        version: pistonVersion,
        files: [
          {
            content: cleanCode
          }
        ],
        stdin: input || "",
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000
      }
    });

    console.log('Piston API response:', response.data);
    
    // Format the output for the frontend
    let output = '';
    const result = response.data;
    
    if (result.run && result.run.stdout) {
      output = result.run.stdout;
    } else if (result.run && result.run.stderr) {
      output = `Error: ${result.run.stderr}`;
    } else if (result.compile && result.compile.stderr) {
      output = `Compilation error: ${result.compile.stderr}`;
    } else {
      output = "No output generated. Please check your code.";
    }

    return NextResponse.json({ 
      output,
      raw_response: result
    });
  } catch (error) {
    console.error("API route error:", error);
    
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
