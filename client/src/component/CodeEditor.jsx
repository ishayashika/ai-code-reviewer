import Editor from "@monaco-editor/react";

function CodeEditor({
    code,
    setCode,
    language,
    setLanguage,
}) {
    return (
        <div className="editor-panel">
            <select
                className="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="python">Python</option>
            </select>

            <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
            />
        </div>
    );
}

export default CodeEditor;