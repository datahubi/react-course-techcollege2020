import React, { useState, createContext, useContext } from 'react'

const context = {
  styles: null,
  setStyles: x => x,
}

const StyleContext = createContext(context)

export const Styler = props => {
  const { styles, setStyles } = useContext(StyleContext)

  const newStyles = e => {
    setStyles(e.target.value)
  }

  return (
    <>
     <textarea onChange={newStyles} {...props} />
      <pre>{styles}</pre>
    </>
  )
}

export default function StyleProvider(props) {
  const [styles, setStyles] = useState(null);

  return (
    <StyleContext.Provider value={{styles, setStyles}}>
      {styles && <style>{styles}</style>}
      {props.children}
    </StyleContext.Provider>
  )
}