import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Database, RotateCcw } from 'lucide-react';

const SQLPracticeTerminal = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState([]);
  const [databases, setDatabases] = useState({});
  const [currentDB, setCurrentDB] = useState(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Inline styles
  const styles = {
    landingContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    landingContent: {
      textAlign: 'center',
      color: 'white',
      maxWidth: '800px'
    },
    landingIcon: {
      width: '96px',
      height: '96px',
      margin: '0 auto 2rem',
      color: '#60a5fa',
      animation: 'bounce 2s infinite'
    },
    landingTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: 'white'
    },
    landingSubtitle: {
      fontSize: '1.25rem',
      color: '#cbd5e1',
      marginBottom: '2rem',
      lineHeight: '1.6'
    },
    landingButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem 2rem',
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '1rem'
    },
    landingHints: {
      marginTop: '2rem',
      fontSize: '0.875rem',
      color: '#94a3b8'
    },
    landingHint: {
      margin: '0.5rem 0'
    },
    codeHint: {
      backgroundColor: '#374151',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontFamily: 'monospace'
    },
    terminalContainer: {
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflowX: 'hidden'
    },
    terminalContent: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    terminalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    terminalHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    terminalTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white'
    },
    dbBadge: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '1rem',
      fontSize: '0.875rem'
    },
    terminalHeaderRight: {
      display: 'flex',
      gap: '0.5rem'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'background-color 0.2s ease'
    },
    resetButton: {
      backgroundColor: '#ea580c',
      color: 'white'
    },
    exitButton: {
      backgroundColor: '#475569',
      color: 'white'
    },
    terminal: {
      backgroundColor: '#000000',
      borderRadius: '0.5rem',
      padding: '1rem',
      fontFamily: 'monospace',
      fontSize: '0.875rem',
      height: '400px',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    terminalEntry: {
      marginBottom: '0.5rem'
    },
    inputLine: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem'
    },
    prompt: {
      color: '#60a5fa',
      flexShrink: 0
    },
    inputText: {
      color: 'white',
      wordBreak: 'break-words',
      flex: 1
    },
    output: {
      marginLeft: '1rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-words'
    },
    outputSuccess: {
      color: '#22c55e'
    },
    outputError: {
      color: '#ef4444'
    },
    terminalInput: {
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'white',
      fontSize: '0.875rem',
      fontFamily: 'monospace',
      width: '100%',
      minWidth: 0
    },
    infoCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    },
    infoCard: {
      backgroundColor: '#1e293b',
      borderRadius: '0.5rem',
      padding: '1rem'
    },
    cardTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#60a5fa',
      marginBottom: '0.5rem'
    },
    cardContent: {
      fontSize: '0.875rem'
    },
    codeExample: {
      color: '#22c55e',
      fontFamily: 'monospace',
      display: 'block',
      margin: '0.25rem 0',
      wordBreak: 'break-all'
    },
    welcomeText: {
      color: '#22c55e',
      marginBottom: '1rem'
    }
  };

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
          transform: translateY(0);
        }
        40%, 43% {
          transform: translateY(-30px);
        }
        70% {
          transform: translateY(-15px);
        }
        90% {
          transform: translateY(-4px);
        }
      }
      
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      @media (max-width: 768px) {
        .terminal-header {
          flex-direction: column;
          align-items: stretch;
        }
        
        .terminal {
          height: 300px;
        }
        
        .landing-title {
          font-size: 2rem;
        }
        
        .landing-subtitle {
          font-size: 1rem;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (isTerminalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTerminalOpen]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeSQL = (command) => {
    const cmd = command.trim().toLowerCase();
    const originalCmd = command.trim();
    
    if (!cmd) return { output: '', error: false };

    // CREATE DATABASE
    if (cmd.startsWith('create database ')) {
      const dbName = cmd.split('create database ')[1].replace(';', '').trim();
      if (databases[dbName]) {
        return { output: `Database '${dbName}' already exists`, error: true };
      }
      setDatabases(prev => ({ ...prev, [dbName]: { tables: {} } }));
      return { output: `Database '${dbName}' created successfully`, error: false };
    }

    // USE DATABASE
    if (cmd.startsWith('use ')) {
      const dbName = cmd.split('use ')[1].replace(';', '').trim();
      if (!databases[dbName]) {
        return { output: `Database '${dbName}' does not exist`, error: true };
      }
      setCurrentDB(dbName);
      return { output: `Database changed to '${dbName}'`, error: false };
    }

    // SHOW DATABASES
    if (cmd === 'show databases;' || cmd === 'show databases') {
      const dbList = Object.keys(databases);
      if (dbList.length === 0) {
        return { output: 'No databases found', error: false };
      }
      return { output: `Databases:\n${dbList.map(db => `  - ${db}`).join('\n')}`, error: false };
    }

    // Commands that need a database selected
    if (!currentDB) {
      return { output: 'No database selected. Use "USE database_name;" first', error: true };
    }

    // CREATE TABLE
    if (cmd.startsWith('create table ')) {
      const match = originalCmd.match(/create table (\w+)\s*\((.*)\)/i);
      if (!match) {
        return { output: 'Invalid CREATE TABLE syntax. Use: CREATE TABLE table_name (column1 datatype, column2 datatype, ...);', error: true };
      }
      const tableName = match[1];
      const columns = match[2];
      
      setDatabases(prev => ({
        ...prev,
        [currentDB]: {
          ...prev[currentDB],
          tables: {
            ...prev[currentDB].tables,
            [tableName]: { columns: columns, rows: [] }
          }
        }
      }));
      return { output: `Table '${tableName}' created successfully`, error: false };
    }

    // SHOW TABLES
    if (cmd === 'show tables;' || cmd === 'show tables') {
      const tables = Object.keys(databases[currentDB].tables);
      if (tables.length === 0) {
        return { output: 'No tables found in current database', error: false };
      }
      return { output: `Tables in ${currentDB}:\n${tables.map(table => `  - ${table}`).join('\n')}`, error: false };
    }

    // INSERT INTO
    if (cmd.startsWith('insert into ')) {
      const match = originalCmd.match(/insert into (\w+)\s*(?:\((.*?)\))?\s*values\s*\((.*?)\)/i);
      if (!match) {
        return { output: 'Invalid INSERT syntax. Use: INSERT INTO table_name (columns) VALUES (values);', error: true };
      }
      const tableName = match[1];
      const values = match[3];
      
      if (!databases[currentDB].tables[tableName]) {
        return { output: `Table '${tableName}' does not exist`, error: true };
      }
      
      setDatabases(prev => ({
        ...prev,
        [currentDB]: {
          ...prev[currentDB],
          tables: {
            ...prev[currentDB].tables,
            [tableName]: {
              ...prev[currentDB].tables[tableName],
              rows: [...prev[currentDB].tables[tableName].rows, values]
            }
          }
        }
      }));
      return { output: `1 row inserted into '${tableName}'`, error: false };
    }

    // SELECT
    if (cmd.startsWith('select ')) {
      const match = originalCmd.match(/select\s+(.*?)\s+from\s+(\w+)/i);
      if (!match) {
        return { output: 'Invalid SELECT syntax. Use: SELECT columns FROM table_name;', error: true };
      }
      const columns = match[1];
      const tableName = match[2];
      
      if (!databases[currentDB].tables[tableName]) {
        return { output: `Table '${tableName}' does not exist`, error: true };
      }
      
      const table = databases[currentDB].tables[tableName];
      let result = `Table: ${tableName}\nColumns: ${table.columns}\n`;
      
      if (table.rows.length === 0) {
        result += 'No rows found';
      } else {
        result += `Rows:\n${table.rows.map((row, i) => `  ${i + 1}: (${row})`).join('\n')}`;
      }
      
      return { output: result, error: false };
    }

    // DROP TABLE
    if (cmd.startsWith('drop table ')) {
      const tableName = cmd.split('drop table ')[1].replace(';', '').trim();
      if (!databases[currentDB].tables[tableName]) {
        return { output: `Table '${tableName}' does not exist`, error: true };
      }
      
      setDatabases(prev => {
        const newTables = { ...prev[currentDB].tables };
        delete newTables[tableName];
        return {
          ...prev,
          [currentDB]: {
            ...prev[currentDB],
            tables: newTables
          }
        };
      });
      return { output: `Table '${tableName}' dropped successfully`, error: false };
    }

    // DROP DATABASE
    if (cmd.startsWith('drop database ')) {
      const dbName = cmd.split('drop database ')[1].replace(';', '').trim();
      if (!databases[dbName]) {
        return { output: `Database '${dbName}' does not exist`, error: true };
      }
      
      setDatabases(prev => {
        const newDatabases = { ...prev };
        delete newDatabases[dbName];
        return newDatabases;
      });
      
      if (currentDB === dbName) {
        setCurrentDB(null);
      }
      
      return { output: `Database '${dbName}' dropped successfully`, error: false };
    }

    // HELP
    if (cmd === 'help' || cmd === 'help;') {
      return { 
        output: `Available SQL Commands:
  CREATE DATABASE database_name;
  USE database_name;
  SHOW DATABASES;
  CREATE TABLE table_name (column1 datatype, column2 datatype, ...);
  SHOW TABLES;
  INSERT INTO table_name (columns) VALUES (values);
  SELECT * FROM table_name;
  DROP TABLE table_name;
  DROP DATABASE database_name;
  HELP;
  CLEAR;
  
Example:
  CREATE DATABASE mystore;
  USE mystore;
  CREATE TABLE products (id INT, name VARCHAR(50), price DECIMAL);
  INSERT INTO products (id, name, price) VALUES (1, 'Laptop', 999.99);
  SELECT * FROM products;`, 
        error: false 
      };
    }

    // CLEAR
    if (cmd === 'clear' || cmd === 'clear;') {
      setHistory([]);
      return { output: '', error: false, clear: true };
    }

    return { output: `Unknown command: ${originalCmd}. Type 'HELP' for available commands.`, error: true };
  };

  const handleCommand = (command) => {
    if (command.trim() === '') return;

    const result = executeSQL(command);
    
    if (result.clear) {
      return;
    }

    setHistory(prev => [
      ...prev,
      { type: 'input', content: command, database: currentDB },
      { type: 'output', content: result.output, error: result.error }
    ]);

    setCommandHistory(prev => [command, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  const resetTerminal = () => {
    setHistory([]);
    setDatabases({});
    setCurrentDB(null);
    setCurrentInput('');
    setCommandHistory([]);
    setHistoryIndex(-1);
  };

  if (!isTerminalOpen) {
    return (
      <div style={styles.landingContainer}>
        <div style={styles.landingContent}>
          <div style={styles.landingIcon}>
            <Database size={96} />
          </div>
          
          <h1 style={styles.landingTitle}>SQL Practice Terminal</h1>
          <p style={styles.landingSubtitle}>
            Learn SQL by practicing with a real terminal interface. Create databases, tables, 
            insert data, and run queries in a safe sandbox environment.
          </p>
          
          <button
            onClick={() => setIsTerminalOpen(true)}
            style={styles.landingButton}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <Terminal size={24} />
            Open SQL Terminal
          </button>
          
          <div style={styles.landingHints}>
            <div style={styles.landingHint}>
              ✨ Start with: <span style={styles.codeHint}>CREATE DATABASE mystore;</span>
            </div>
            <div style={styles.landingHint}>
              📚 Type <span style={styles.codeHint}>HELP</span> for all available commands
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.terminalContainer}>
      <div style={styles.terminalContent}>
        <div style={{...styles.terminalHeader}} className="terminal-header">
          <div style={styles.terminalHeaderLeft}>
            <Terminal size={32} color="#60a5fa" />
            <h1 style={styles.terminalTitle}>SQL Practice Terminal</h1>
            {currentDB && (
              <span style={styles.dbBadge}>
                DB: {currentDB}
              </span>
            )}
          </div>
          <div style={styles.terminalHeaderRight}>
            <button
              onClick={resetTerminal}
              style={{...styles.button, ...styles.resetButton}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ea580c'}
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={() => setIsTerminalOpen(false)}
              style={{...styles.button, ...styles.exitButton}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#475569'}
            >
              Exit Terminal
            </button>
          </div>
        </div>

        <div style={styles.terminal} ref={terminalRef} className="terminal">
          {history.length === 0 && (
            <div style={styles.welcomeText}>
              <p>SQL Practice Terminal v1.0</p>
              <p>Type 'HELP' for available commands</p>
              <p>Ready to execute SQL commands...</p>
              <br />
            </div>
          )}
          
          {history.map((entry, index) => (
            <div key={index} style={styles.terminalEntry}>
              {entry.type === 'input' ? (
                <div style={styles.inputLine}>
                  <span style={styles.prompt}>
                    sql{entry.database ? `(${entry.database})` : ''}{'>'} 
                  </span>
                  <span style={styles.inputText}>{entry.content}</span>
                </div>
              ) : (
                <div style={{
                  ...styles.output,
                  ...(entry.error ? styles.outputError : styles.outputSuccess)
                }}>
                  {entry.content}
                </div>
              )}
            </div>
          ))}
          
          <div style={styles.inputLine}>
            <span style={styles.prompt}>
              sql{currentDB ? `(${currentDB})` : ''}{'>'} 
            </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyPress}
              style={styles.terminalInput}
              placeholder="Enter SQL command..."
            />
          </div>
        </div>

        <div style={styles.infoCards}>
          
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>Current State</h3>
            <div style={styles.cardContent}>
              <div>Databases: {Object.keys(databases).length}</div>
              <div>Current DB: {currentDB || 'None'}</div>
              <div>Tables: {currentDB ? Object.keys(databases[currentDB]?.tables || {}).length : 0}</div>
              <div style={{color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem'}}>
                Use arrow keys to navigate command history
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQLPracticeTerminal;
