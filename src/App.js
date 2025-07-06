<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SQL Practice Terminal</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide-react@0.263.1/dist/umd/lucide-react.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState, useRef, useEffect } = React;
        const { Terminal, Database, RotateCcw } = lucideReact;

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
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    <Database className="relative w-24 h-24 mx-auto text-blue-400 animate-bounce" />
                  </div>
                  
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-white">SQL Practice Terminal</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                      Learn SQL by practicing with a real terminal interface. Create databases, tables, 
                      insert data, and run queries in a safe sandbox environment.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsTerminalOpen(true)}
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Terminal className="w-6 h-6 inline mr-2" />
                      Open SQL Terminal
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                    
                    <div className="text-sm text-slate-400 space-y-2">
                      <p>✨ Start with: <code className="bg-slate-700 px-2 py-1 rounded">CREATE DATABASE mystore;</code></p>
                      <p>📚 Type <code className="bg-slate-700 px-2 py-1 rounded">HELP</code> for all available commands</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="min-h-screen bg-slate-900 text-white p-2 sm:p-4 overflow-x-hidden">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
                    <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    <h1 className="text-lg sm:text-2xl font-bold">SQL Practice Terminal</h1>
                    {currentDB && (
                      <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600 rounded-full text-xs sm:text-sm">
                        DB: {currentDB}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <button
                      onClick={resetTerminal}
                      className="flex items-center space-x-1 sm:space-x-2 px-2 py-2 sm:px-4 sm:py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                    <button
                      onClick={() => setIsTerminalOpen(false)}
                      className="px-2 py-2 sm:px-4 sm:py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
                    >
                      Exit Terminal
                    </button>
                  </div>
                </div>

                <div className="bg-black rounded-lg p-2 sm:p-4 font-mono text-xs sm:text-sm h-64 sm:h-96 overflow-y-auto overflow-x-hidden" ref={terminalRef}>
                  {history.length === 0 && (
                    <div className="text-green-400 mb-4">
                      <p>SQL Practice Terminal v1.0</p>
                      <p>Type 'HELP' for available commands</p>
                      <p>Ready to execute SQL commands...</p>
                      <br />
                    </div>
                  )}
                  
                  {history.map((entry, index) => (
                    <div key={index} className="mb-2">
                      {entry.type === 'input' ? (
                        <div className="flex items-start">
                          <span className="text-blue-400 mr-1 sm:mr-2 flex-shrink-0">
                            sql{entry.database ? `(${entry.database})` : ''}{'>'} 
                          </span>
                          <span className="text-white break-words min-w-0 flex-1">{entry.content}</span>
                        </div>
                      ) : (
                        <div className={`ml-2 sm:ml-4 whitespace-pre-wrap break-words ${entry.error ? 'text-red-400' : 'text-green-400'}`}>
                          {entry.content}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex items-center">
                    <span className="text-blue-400 mr-1 sm:mr-2 flex-shrink-0">
                      sql{currentDB ? `(${currentDB})` : ''}{'>'} 
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1 bg-transparent text-white outline-none min-w-0"
                      placeholder="Enter SQL command..."
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-lg p-3 sm:p-4 overflow-hidden">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Quick Commands</h3>
                    <div className="space-y-1 text-xs sm:text-sm overflow-x-auto">
                      <div><code className="text-green-400 break-all">CREATE DATABASE mystore;</code></div>
                      <div><code className="text-green-400 break-all">USE mystore;</code></div>
                      <div><code className="text-green-400 break-all">CREATE TABLE products (id INT, name VARCHAR(50));</code></div>
                      <div><code className="text-green-400 break-all">INSERT INTO products VALUES (1, 'Laptop');</code></div>
                      <div><code className="text-green-400 break-all">SELECT * FROM products;</code></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">Current State</h3>
                    <div className="text-xs sm:text-sm space-y-1">
                      <div>Databases: {Object.keys(databases).length}</div>
                      <div>Current DB: {currentDB || 'None'}</div>
                      <div>Tables: {currentDB ? Object.keys(databases[currentDB]?.tables || {}).length : 0}</div>
                      <div className="text-slate-400 text-xs mt-2">
                        Use arrow keys to navigate command history
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        };

        ReactDOM.render(<SQLPracticeTerminal />, document.getElementById('root'));
    </script>
</body>
</html>
