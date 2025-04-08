# CodeX - Online Code Execution Platform

A modern web application that allows users to write, execute, and share code snippets in multiple programming languages.

## Features

- **Multi-language Support**: Run code in Python, C++, Java, and more
- **Real-time Execution**: Execute code and see results instantly
- **Input Support**: Test your code with custom inputs
- **Error Handling**: Clear error messages for debugging
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Next.js API Routes
- **Code Execution**: Piston API
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

## API Integration

CodeX uses the Piston API through RapidAPI for code execution. The API handles compilation and execution of code in various programming languages securely in isolated environments.

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
- **Next.js** for the React framework
- **Tailwind CSS** for styling

---
