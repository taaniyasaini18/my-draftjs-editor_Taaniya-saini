import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  // Custom styles for inline formatting
  const styleMap = {
    RED: { color: "red" },
  };

  useEffect(() => {
    const savedData = localStorage.getItem("editorContent");
    if (savedData) {
      const contentState = convertFromRaw(JSON.parse(savedData));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (input) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const block = currentContent.getBlockForKey(blockKey);
    const text = block.getText();

    if (text === "#" && input === " ") {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection,
        ""
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      const headingState = RichUtils.toggleBlockType(
        newEditorState,
        "header-one"
      );
      setEditorState(headingState);
      return "handled";
    } else if (text === "*" && input === " ") {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection,
        ""
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      const boldState = RichUtils.toggleInlineStyle(newEditorState, "BOLD");
      setEditorState(boldState);
      return "handled";
    } else if (text === "**" && input === " ") {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection,
        ""
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      const redState = RichUtils.toggleInlineStyle(newEditorState, "RED");
      setEditorState(redState);
      return "handled";
    } else if (text === "***" && input === " ") {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection,
        ""
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "remove-range"
      );
      const underlineState = RichUtils.toggleInlineStyle(
        newEditorState,
        "UNDERLINE"
      );
      setEditorState(underlineState);
      return "handled";
    }

    return "not-handled";
  };

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
    alert("Content saved!");
  };

  return (
    <div>
      <h1>Title</h1>
      <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        handleBeforeInput={handleBeforeInput}
        onChange={setEditorState}
        customStyleMap={styleMap} // <--- Add the custom style here
      />
      <button onClick={saveContent}>Save</button>
    </div>
  );
};

export default MyEditor;
