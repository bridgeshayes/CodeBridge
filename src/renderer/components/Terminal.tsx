import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (terminalRef.current) {
      const term = new XTerm({
        cursorBlink: true,
        fontSize: 13,
        fontFamily: 'JetBrains Mono, Consolas, monospace',
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
          cursor: '#d4d4d4',
          black: '#1e1e1e',
          red: '#f44747',
          green: '#6a9955',
          yellow: '#d7ba7d',
          blue: '#569cd6',
          magenta: '#c586c0',
          cyan: '#4ec9b0',
          white: '#d4d4d4',
          brightBlack: '#808080',
          brightRed: '#f44747',
          brightGreen: '#6a9955',
          brightYellow: '#d7ba7d',
          brightBlue: '#569cd6',
          brightMagenta: '#c586c0',
          brightCyan: '#4ec9b0',
          brightWhite: '#d4d4d4',
          selectionBackground: '#264f78',
          selectionForeground: '#ffffff'
        },
        allowTransparency: true,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      // Welcome message
      term.writeln('\x1b[1;36mWelcome to CodeBridge Terminal\x1b[0m');
      term.writeln('\x1b[90mType "help" for available commands\x1b[0m');
      term.write('\r\n\x1b[32m$\x1b[0m ');

      let currentLine = '';
      term.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        if (domEvent.keyCode === 13) { // Enter
          term.write('\r\n');
          handleCommand(term, currentLine);
          currentLine = '';
          term.write('\x1b[32m$\x1b[0m ');
        } else if (domEvent.keyCode === 8) { // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write('\b \b');
          }
        } else if (printable) {
          currentLine += key;
          term.write(key);
        }
      });

      xtermRef.current = term;

      const handleResize = () => {
        fitAddon.fit();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        term.dispose();
      };
    }
  }, []);

  const handleCommand = (term: XTerm, command: string) => {
    const cmd = command.trim().toLowerCase();

    switch (cmd) {
      case 'help':
        term.writeln('\r\n\x1b[1;36mAvailable commands:\x1b[0m');
        term.writeln('  \x1b[1mhelp\x1b[0m     - Show this help message');
        term.writeln('  \x1b[1mclear\x1b[0m    - Clear the terminal');
        term.writeln('  \x1b[1mecho\x1b[0m     - Echo a message');
        term.writeln('  \x1b[1mdate\x1b[0m     - Show current date and time');
        term.writeln('  \x1b[1mexit\x1b[0m     - Exit the terminal');
        break;
      case 'clear':
        term.clear();
        break;
      case 'date':
        term.writeln(`\r\n${new Date().toLocaleString()}`);
        break;
      case 'exit':
        term.writeln('\r\n\x1b[1;31mGoodbye!\x1b[0m');
        break;
      case '':
        break;
      default:
        if (cmd.startsWith('echo ')) {
          term.writeln(`\r\n${command.slice(5)}`);
        } else {
          term.writeln(`\r\n\x1b[31mCommand not found: ${command}\x1b[0m`);
        }
    }
  };

  return (
    <div className="h-full bg-[#1e1e1e] p-1">
      <div ref={terminalRef} className="h-full" />
    </div>
  );
};

export default Terminal; 