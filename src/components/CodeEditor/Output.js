import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "../Button";
import { executeCode } from "~/utils/execute";
import { toast } from "react-toastify";
const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isError, setIsError] = useState(false);
  const runCode = async () => {
    const source = editorRef.current.getValue();
    if (!source) return;
    try {
      const { run: result } = await executeCode(language, source);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  return (
    <Box sx={{ minWidth: 120 }}>
      <Button className=" m-0" onClick={runCode}>
        Run Code
      </Button>
      <Box p={2} width="100%" height="50vh" sx={{ border: "2px solid grey" }}>
        {output
          ? output.map((line, i) => <span key={i}>{line}</span>)
          : 'Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
};

export default Output;
