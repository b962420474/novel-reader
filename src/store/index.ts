import { createStore } from 'vuex'

export default createStore({
  state: {
    fontSize: 19
  },
  mutations: {
    setFontSize: (state, payload) => {
      state.fontSize = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
