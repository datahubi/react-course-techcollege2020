import React from 'react'
import { action, createStore, StoreProvider } from 'easy-peasy';

const formStore = {
  step1: {
    data: {},
    setData: action((state, payload) => {
      state.data = payload
    })
  },
  step2: {
    data: {},
    setData: action((state, payload) => {
      state.data = payload
    })
  },
  resetStore: action(state => {
    state.step1.data = {}
    state.step2.data = {}
  })
}

const store = createStore(formStore);

export default function FormStore(props) {
  return <StoreProvider store={store} {...props} />
}

