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

  const parseColumns = (columnString) => {
    // Parse column definitions like "id INT PRIMARY KEY, name VARCHAR(100), age INT"
    const columns = [];
    const parts = columnString.split(',').map(part => part.trim());
    
    for (const part of parts) {
      const tokens = part.split(/\s+/);
      if (tokens.length >= 2) {
        columns.push({
          name: tokens[0],
          type: tokens[1],
          constraints: tokens.slice(2).join(' ')
        });
      }
    }
    
    return columns;
  };

  const formatTableData = (table) => {
    if (!table.columns || table.columns.length === 0) {
      return 'No columns defined';
    }
    
    const columnNames = table.columns.map(col => col.name);
    let result = `┌${'─'.repeat(columnNames.join(' | ').length + 4)}┐\n`;
    result += `│ ${columnNames.join(' | ')} │\n`;
    result += `├${'─'.repeat(columnNames.join(' | ').length + 4)}┤\n`;
    
    if (table.rows.length === 0) {
      result += `│ ${'(empty)'.padEnd(columnNames.join(' | ').length)} │\n`;
    } else {
      table.rows.forEach(row => {
        const values = row.split(',').map(val => val.trim().replace(/^['"]|['"]$/g, ''));
        result += `│ ${values.join(' | ')} │\n`;
      });
    }
    
    result += `└${'─'.repeat(columnNames.join(' | ').length + 4)}┘`;
    return result;
  };

  const executeSQL = (command) => {
    const cmd = command.trim().toLowerCase();
    const originalCmd = command.trim();
    
    if (!cmd) return { output: '', error: false };

    // Handle multiple commands separated by semicolons
    if (cmd.includes(';') && !cmd.endsWith(';')) {
      const commands = originalCmd.split(';').filter(c => c.trim());
      let results = [];
      
      for (const singleCmd of commands) {
        const result = executeSQL(singleCmd.trim() + ';');
        results.push(result);
        if (result.error) break;
      }
      
      return {
        output: results.map(r => r.output).filter(o => o).join('\n'),
        error: results.some(r => r.error)
      };
    }



    // CREATE DATABASE
    if (cmd.startsWith('create database ')) {
      const match = cmd.match(/create database\s+(\w+)/);
      if (!match) {
        return { output: 'Invalid CREATE DATABASE syntax. Use: CREATE DATABASE name;', error: true };
      }
      const dbName = match[1];
      
      if (databases[dbName]) {
        return { output: `Database '${dbName}' already exists`, error: true };
      }
      
      setDatabases(prev => ({ 
        ...prev, 
        [dbName]: { 
          tables: {},
          created: new Date().toISOString()
        } 
      }));
      
      return { output: `Database '${dbName}' created successfully`, error: false };
    }

    // USE DATABASE
    if (cmd.startsWith('use ')) {
      const match = cmd.match(/use\s+(\w+)/);
      if (!match) {
        return { output: 'Invalid USE syntax. Use: USE database_name;', error: true };
      }
      const dbName = match[1];
      
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
      
      let result = 'Databases:\n';
      result += '┌─────────────────────┐\n';
      result += '│ Database            │\n';
      result += '├─────────────────────┤\n';
      dbList.forEach(db => {
        result += `│ ${db.padEnd(19)} │\n`;
      });
      result += '└─────────────────────┘';
      
      return { output: result, error: false };
    }

    // Commands that need a database selected
    if (!currentDB) {
      return { output: 'No database selected. Use "USE database_name;" first', error: true };
    }

    // CREATE TABLE
    if (cmd.startsWith('create table ')) {
      const match = originalCmd.match(/create table\s+(\w+)\s*\((.*?)\)/i);
      if (!match) {
        return { output: 'Invalid CREATE TABLE syntax. Use: CREATE TABLE table_name (column1 datatype, column2 datatype, ...);', error: true };
      }
      
      const tableName = match[1];
      const columnString = match[2];
      const columns = parseColumns(columnString);
      
      if (databases[currentDB].tables[tableName]) {
        return { output: `Table '${tableName}' already exists`, error: true };
      }
      
      setDatabases(prev => ({
        ...prev,
        [currentDB]: {
          ...prev[currentDB],
          tables: {
            ...prev[currentDB].tables,
            [tableName]: { 
              columns: columns,
              rows: [],
              created: new Date().toISOString()
            }
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
      
      let result = `Tables in ${currentDB}:\n`;
      result += '┌─────────────────────┐\n';
      result += '│ Table               │\n';
      result += '├─────────────────────┤\n';
      tables.forEach(table => {
        result += `│ ${table.padEnd(19)} │\n`;
      });
      result += '└─────────────────────┘';
      
      return { output: result, error: false };
    }

    // DESCRIBE TABLE
    if (cmd.startsWith('describe ') || cmd.startsWith('desc ')) {
      const match = originalCmd.match(/desc(?:ribe)?\s+(\w+)/i);
      if (!match) {
        return { output: 'Invalid DESCRIBE syntax. Use: DESCRIBE table_name;', error: true };
      }
      
      const tableName = match[1];
      if (!databases[currentDB].tables[tableName]) {
        return { output: `Table '${tableName}' does not exist`, error: true };
      }
      
      const table = databases[currentDB].tables[tableName];
      if (!table.columns || table.columns.length === 0) {
        return { output: `Table '${tableName}' has no columns defined`, error: false };
      }
      
      let result = `Table: ${tableName}\n`;
      result += '┌─────────────────┬─────────────────┬─────────────────┐\n';
      result += '│ Column          │ Type            │ Constraints     │\n';
      result += '├─────────────────┼─────────────────┼─────────────────┤\n';
      
      table.columns.forEach(col => {
        result += `│ ${col.name.padEnd(15)} │ ${col.type.padEnd(15)} │ ${(col.constraints || '').padEnd(15)} │\n`;
      });
      
      result += '└─────────────────┴─────────────────┴─────────────────┘';
      
      return { output: result, error: false };
    }

    // INSERT INTO
    if (cmd.startsWith('insert into ')) {
      const match = originalCmd.match(/insert into\s+(\w+)\s*(?:\((.*?)\))?\s*values\s*\((.*?)\)/i);
      if (!match) {
        return { output: 'Invalid INSERT syntax. Use: INSERT INTO table_name (columns) VALUES (values);', error: true };
      }
      
      const tableName = match[1];
      const specifiedColumns = match[2] ? match[2].split(',').map(c => c.trim()) : null;
      const values = match[3];
      
      if (!databases[currentDB].tables[tableName]) {
        return { output: `Table '${tableName}' does not exist`, error: true };
      }
      
      const table = databases[currentDB].tables[tableName];
      
      // Validate column count if columns are specified
      if (specifiedColumns && specifiedColumns.length !== values.split(',').length) {
        return { output: 'Column count does not match value count', error: true };
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
      const match = originalCmd.match(/select\s+(.*?)\s+from\s+(\w+)(?:\s+where\s+(.*))?/i);
      if (!match) {
        return { output: 'Invalid SELECT syntax. Use: SELECT columns FROM table_name [WHERE condition];', error: true };
      }
      
      const columns = match[1].trim();
      const tableName = match[2];
      const whereClause = match[3];
      
      if (!databases[currentDB].tables[tableName]) {
        return { output: `Table '${tableName}' does not exist`, error: true };
      }
      
      const table = databases[currentDB].tables[tableName];
      
      let result = formatTableData(table);
      
      if (whereClause) {
        result += `\n(WHERE clause: ${whereClause} - filtering not fully implemented in this demo)`;
      }
      
      return { output: result, error: false };
    }

    // UPDATE
    if (cmd.startsWith('update ')) {
      const match = originalCmd.match(/update\s+(\w+)\s+set\s+(.*?)(?:\s+where\s+(.*))?/i);
      if (!match) {
        return { output: 'Invalid UPDATE syntax. Use: UPDATE table_name SET column=value [WHERE condition];', error: true };
      }
      
      const tableName = match[1];
      const setClause = match[2];
      const whereClause = match[3];
      
      if (!databases[currentDB].tables[tableName]) {
        return { output: `Table '${tableName}' does not exist`, error: true };
      }
      
      // In a real implementation, you'd parse and execute the SET and WHERE clauses
      return { output: `UPDATE command recognized for table '${tableName}' (full implementation would modify rows)`, error: false };
    }

    // DELETE
    if (cmd.startsWith('delete from ')) {
      const match = originalCmd.match(/delete from\s+(\w+)(?:\s+where\s+(.*))?/i);
      if (!match) {
        return { output: 'Invalid DELETE syntax. Use: DELETE FROM table_name [WHERE condition];', error: true };
      }
      
      const tableName = match[1];
      const whereClause = match[2];
      
      if (!databases[currentDB].tables[tableName]) {
        return { output: `Table '${tableName}' does not exist`, error: true };
      }
      
      if (!whereClause) {
        // Delete all rows
        setDatabases(prev => ({
          ...prev,
          [currentDB]: {
            ...prev[currentDB],
            tables: {
              ...prev[currentDB].tables,
              [tableName]: {
                ...prev[currentDB].tables[tableName],
                rows: []
              }
            }
          }
        }));
        
        return { output: `All rows deleted from '${tableName}'`, error: false };
      }
      
      return { output: `DELETE command recognized for table '${tableName}' (WHERE clause parsing not fully implemented)`, error: false };
    }

    // DROP TABLE
    if (cmd.startsWith('drop table ')) {
      const match = cmd.match(/drop table\s+(\w+)/);
      if (!match) {
        return { output: 'Invalid DROP TABLE syntax. Use: DROP TABLE table_name;', error: true };
      }
      
      const tableName = match[1];
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
      const match = cmd.match(/drop database\s+(\w+)/);
      if (!match) {
        return { output: 'Invalid DROP DATABASE syntax. Use: DROP DATABASE name;', error: true };
      }
      
      const dbName = match[1];
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

    // CLEAR
    if (cmd === 'clear' || cmd === 'clear;') {
      setHistory([]);
      return { output: '', error: false, clear: true };
    }

    return { output: `Unknown command: ${originalCmd}. Check available SQL commands.`, error: true };
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
              <p>SQL Practice Terminal v2.0</p>
              <p>Enhanced with improved command parsing and table formatting</p>
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
