import React, { useRef, useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "~/constants";
import Output from "./Output";
const languages = Object.entries(LANGUAGE_VERSIONS);
const CodeEditor = () => {
  const editorRef = useRef();
  const [language, setLanguage] = useState("javascript");
  const [value, setValue] = useState("");
  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };
  const [age, setAge] = React.useState("");
  const onSelect = (event) => {
    setAge(event.target.value);
    setLanguage(event.target.value);
    setValue(CODE_SNIPPETS[event.target.value]);
  };
  return (
    <div className="row">
      <div className="col-md-6">
        <LanguageSelector
          languages={languages}
          language={language}
          onSelect={onSelect}
        />
        <Editor
          theme="vs-dark"
          height="50vh"
          language={language}
          defaultValue={CODE_SNIPPETS[language]}
          defaultLanguage="javascript"
          onMount={onMount}
          value={value}
          onChange={(value) => setValue(value)}
        />
      </div>
      <div className="col-md-6">
        <Output editorRef={editorRef} language={language} />
      </div>
    </div>
  );
};

export default CodeEditor;
