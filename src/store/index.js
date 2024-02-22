import { createStore } from 'vuex'

export default createStore({
  state: {
    // начальное состояние
    wordsArr: [],
    countAllWords: 0,
  },
  getters: {
    // методы для чтения состояния
  },
  mutations: {
    // методы для изменения состояния
    SET_ALL_WORDS_COUNT(state, count){
      state.countAllWords = count;
    },
    SET_WORDS_LIST(state, wordsList){
      state.wordsArr = wordsList;
    }
  },
  actions: {
    // методы для асинхронных операций
  },
  modules: {
    // модули VueX для разделения хранилища на под-хранилища
  }
})
