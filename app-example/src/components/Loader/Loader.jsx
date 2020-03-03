import React from 'react'
import Spinner from 'react-spinner-material';
import styles from './Loader.module.scss'


export default function Loader(props) {
  // throw new Promise(() => {})
  return (
    <div className={styles.container}>
      <Spinner radius={120} color={["#333", "#f0f"]} stroke={2} visible={true} />
    </div>
  ) 
}

