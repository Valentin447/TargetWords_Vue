import { createStore } from 'vuex'

export default createStore({
  state: {
    // начальное состояние
    wordsArr: [],
  },
  getters: {
    // методы для чтения состояния
  },
  mutations: {
    // методы для изменения состояния
  },
  actions: {
    // методы для асинхронных операций
  },
  modules: {
    // модули VueX для разделения хранилища на под-хранилища
  }
})
