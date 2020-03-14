import React, { useState, createContext, useContext } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import styled from "styled-components";
import "prismjs/components/prism-css";
import "prismjs/components/prism-css-extras";

const EditorContainer = styled.div`
  background: #333;
  color: white;
  .token {
    &.selector {
      color: rgb(207, 142, 56);
    }    
    &.atrule {
      color: rgb(207, 142, 56);
    }
    &.property {
      color: rgb(56, 177, 207);
    }
    &.unit {
      color: rgb(48, 167, 87);
    }
    &.number {
      color: rgb(48, 167, 87);
    }
    &.hexcode {
      color: rgb(158, 108, 42);
    }
    &.comment {
      color: rgb(22, 104, 42);
    }
  }
`;

const context = {
  styles: "",
  setStyles: x => x
};

const StyleContext = createContext(context);

export const Styler = props => {
  const { styles, setStyles } = useContext(StyleContext);

  // const setNewStyles = e => {
  //   let value = e.target.value;
  //   if (e.key === "Tab" && e.type === "keydown") {
  //     e.target.value += "  ";
  //     value += "  ";
  //     e.preventDefault();
  //   }
  //   setStyles(value);
  // };

  return (
    <>
      <EditorContainer>
        <Editor
          highlight={code => highlight(code, languages.css)}
          value={styles}
          onValueChange={code => setStyles(code)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            border: "1px solid black"
          }}
        />
      </EditorContainer>
      <p>
        OBS: Da der bruges CSS modules kan det være svært at ramme andet end
        tags
      </p>
    </>
    // <div className={"editor"}>
    //   {/* <textarea {...props} onKeyDown={setNewStyles} onChange={setNewStyles} /> */}
    // </div>
  );
};

const exampleStyles = `/* 
@keyframes test {
  from {
    color: red;
    font-size: 1rem;
  }
  to {
    color: blue;
    font-size: 1.1rem;
  }
}

body {
  animation: test 3s ease infinite alternate;
}
*/`;

export default function StyleProvider(props) {
  const [styles, setStyles] = useState(exampleStyles);

  return (
    <StyleContext.Provider value={{ styles, setStyles }}>
      {styles && <style>{styles}</style>}
      {props.children}
    </StyleContext.Provider>
  );
}
