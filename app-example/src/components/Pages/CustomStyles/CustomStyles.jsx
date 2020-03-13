import React from 'react'
import { Styler } from '../../CustomStyleContext/CustomStyleContext'

export default function CustomStyles(props) {

  return (
    <>
      <h1>Afprøv custom styling på siden</h1>
      <Styler cols={100} rows={20}/>
    </>
  )
}