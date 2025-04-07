"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FiPlay, FiCode, FiTerminal } from 'react-icons/fi';
import { motion } from "framer-motion";

const languageDefaults: Record<string, string> = {
  python: `# Python code
a = int(input())
b = int(input())
print(a + b)`,
  cpp: `// C++ code
#include <iostream>
using namespace std;

int main() {
  int a, b;
  cin >> a >> b;
  cout << a + b << endl;
  return 0;
}`,
  java: `// Java code
import java.util.Scanner;

class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int a = sc.nextInt();
    int b = sc.nextInt();
    System.out.println(a + b);
  }
}`,
};

// Judge0 language IDs
const languageIds: Record<string, number> = {
  python: 71, // Python 3
  cpp: 54,    // C++ (GCC 9.2.0)
  java: 62,   // Java (OpenJDK 13.0.1)
};

export default function Home() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(languageDefaults["python"]);
  const [input, setInput] = useState("3\n4");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setOutput("Running...");
    
    try {
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language_id: languageIds[language],
          source_code: code,
          stdin: input
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput(`Error: ${result.stderr}`);
      } else if (result.compile_output) {
        setOutput(`Compilation error: ${result.compile_output}`);
      } else if (result.message) {
        setOutput(`Message: ${result.message}`);
      } else {
        setOutput("Execution completed but no output was generated.");
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    setLoading(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(languageDefaults[lang]);
  };

  return (
    <div className="min-h-screen text-gray-200 p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e1e] to-[#2d2d2d] -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 font-mono">CodeX <span className="text-gray-400 text-xl">Online IDE</span></h1>
          <p className="text-gray-400 mt-2">Write, compile and run code in multiple languages</p>
        </header>

        <div className="bg-[#252526] rounded-lg shadow-xl overflow-hidden border border-[#3e3e42]">
          <div className="flex items-center justify-between p-4 border-b border-[#3e3e42] bg-[#2d2d2d]">
            <div className="flex items-center space-x-4">
              <FiCode className="text-blue-400" size={20} />
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-[#3c3c3c] text-gray-200 border border-[#3e3e42] rounded-md px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 font-mono"
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRun}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:bg-blue-800 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <FiPlay size={16} />
                  <span>Run Code</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            <div className="lg:col-span-3 border-r border-[#3e3e42]">
              <div className="p-4 bg-[#1e1e1e] h-full">
                <div className="flex items-center mb-2 text-blue-400">
                  <FiCode className="mr-2" />
                  <h3 className="font-semibold">Code Editor</h3>
                </div>
                <div className="border border-[#3e3e42] rounded-md overflow-hidden">
                  <Editor
                    height="500px"
                    language={language === "cpp" ? "cpp" : language}
                    value={code}
                    theme="vs-dark"
                    onChange={(value) => setCode(value || "")}
                    options={{
                      minimap: { enabled: true },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      fontFamily: "'Fira Code', monospace",
                      lineNumbers: "on",
                      renderLineHighlight: "all",
                      cursorBlinking: "smooth",
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 flex flex-col">
              <div className="p-4 bg-[#1e1e1e] border-b border-[#3e3e42]">
                <div className="flex items-center mb-2 text-blue-400">
                  <FiTerminal className="mr-2" />
                  <h3 className="font-semibold">Input</h3>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full p-3 bg-[#2d2d2d] text-gray-200 border border-[#3e3e42] rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                  placeholder="Enter input values here..."
                  rows={6}
                />
              </div>
              
              <div className="p-4 bg-[#1e1e1e] flex-1">
                <div className="flex items-center mb-2 text-blue-400">
                  <FiTerminal className="mr-2" />
                  <h3 className="font-semibold">Output</h3>
                </div>
                <pre className="w-full p-3 bg-[#2d2d2d] text-gray-200 border border-[#3e3e42] rounded-md font-mono text-sm overflow-auto h-[250px]">
                  {output || "Output will appear here..."}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
