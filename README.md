# CodeBridge

<div align="center">
  <img src="docs/logo.png" alt="CodeBridge Logo" width="200"/>
  <h3>A Modern, Collaborative Code Editor</h3>
  <p>Built with Electron, React, and TypeScript</p>
</div>

## ✨ Features

- 🎨 **Modern Interface** - Clean, intuitive design inspired by modern IDEs
- 🔍 **Powerful Editor** - Based on Monaco Editor (VSCode's editor)
- 🤝 **Real-time Collaboration** - Code together with your team in real-time
- 🖥️ **Integrated Terminal** - Full-featured terminal with custom commands
- 📦 **Git Integration** - Visual diff viewer and git status tracking
- 🌙 **Dark Theme** - Easy on the eyes with a professional dark theme
- ⚡ **Fast & Lightweight** - Built for performance and efficiency

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/codebridge.git
cd codebridge
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🛠️ Development

### Project Structure

```
codebridge/
├── src/
│   ├── main.ts           # Electron main process
│   ├── renderer/         # React application
│   │   ├── components/   # React components
│   │   ├── App.tsx      # Main React component
│   │   └── index.tsx    # React entry point
│   └── index.html       # HTML template
├── dist/                # Compiled files
└── package.json        # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application
- `npm run make` - Create distributables
- `npm start` - Run the application

## 🔧 Configuration

### Editor Settings

The Monaco Editor can be configured in `src/renderer/App.tsx`:

```typescript
options={{
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Consolas, monospace',
  minimap: {
    enabled: true,
    scale: 10,
    renderCharacters: false
  },
  // ... more options
}}
```

### Terminal Configuration

Terminal settings can be modified in `src/renderer/components/Terminal.tsx`:

```typescript
const term = new XTerm({
  cursorBlink: true,
  fontSize: 13,
  fontFamily: 'JetBrains Mono, Consolas, monospace',
  theme: {
    // ... color scheme
  }
});
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [xterm.js](https://xtermjs.org/)
- [simple-git](https://github.com/steveukx/git-js)

## 📸 Screenshots

<div align="center">
  <img src="docs/screenshot1.png" alt="CodeBridge Editor" width="800"/>
  <p><em>CodeBridge Editor with Git Integration</em></p>
</div>

## 🔮 Future Plans

- [ ] AI Code Completion
- [ ] Custom Extensions Support
- [ ] Multiple Theme Options
- [ ] Remote Development
- [ ] Integrated Debugger
- [ ] Project Templates
- [ ] Command Palette
- [ ] Search Across Files

## 💬 Support

For support, please open an issue in the GitHub repository or contact the maintainers.