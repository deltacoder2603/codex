# CodeX - Online Code Execution Platform

A modern web application that allows users to write, execute, and share code snippets in multiple programming languages, with an integrated AI coding assistant.

## Features

- **Multi-language Support**: Run code in Python, C++, Java, and more
- **Real-time Execution**: Execute code and see results instantly
- **Input Support**: Test your code with custom inputs
- **Error Handling**: Clear error messages for debugging
- **Responsive Design**: Works on desktop and mobile devices
- **AI Coding Assistant**: Get help with your code using our Gemini-powered assistant

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Next.js API Routes
- **Code Execution**: Piston API
- **AI Assistant**: Gemini API
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/codex.git
   cd codex
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a **.env.local** file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open **http://localhost:3000** in your browser

## Usage

1. Select a programming language from the dropdown
2. Write your code in the editor
3. Add any input required by your program
4. Click "Run" to execute the code
5. View the output in the results panel

### Using the AI Coding Assistant

1. Click on the "AI Assistant" button while working on your code
2. Ask questions or request help with specific coding problems
3. The Gemini-powered assistant will provide suggestions, explain concepts, or help debug your code
4. Apply the suggested changes directly to your code editor

## API Integration

- **Piston API**: Used through RapidAPI for secure code execution in isolated environments
- **Gemini API**: Powers the intelligent coding assistant for code generation, debugging, and explanation

## Deployment

The application can be deployed to platforms like Vercel or Netlify:

```bash
npm run build
# or
yarn build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Piston API** for code execution
- **Gemini API** for AI-powered coding assistance
- **Next.js** for the React framework
- **Tailwind CSS** for styling

---

Made with ❤️ by [Your Name]
