<template>
  <div class="reader">
    <DragAndDrop @dropFile="chengeFile" />
    <InputFile @inputFile="chengeFile" />
    <p class="reader__file-name">{{ file.name }}</p>
    <button
      @click="read"
      id="read"
      :class="readButtonClass"
      class="reader__button-read reader__button-read-hidden"
    >
      Прочитать
    </button>
  </div>
  <router-view />
</template>

<script>
import DragAndDrop from "./DragAndDrop.vue";
import InputFile from "./InputFile.vue";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      file: {},
      wordsArr: [],
      readButtonClass: "",
    };
  },
  methods: {
    ...mapMutations(['SET_WORDS_LIST', 'SET_ALL_WORDS_COUNT']),
    chengeFile(file) {
      this.file = file;
      this.readButtonClass = "reader__button-read reader__button-read-showe";
    },
    getSortedArray(wordsObj) {
      const arrayObjWords = [];
      let currentWord = {
        word: "",
        count: 0,
      };
      while (Object.keys(wordsObj).length > 0) {
        for (const key in wordsObj) {
          if (wordsObj[key] > currentWord.count) {
            currentWord.word = key;
            currentWord.count = wordsObj[key];
          }
        }

        arrayObjWords.push(structuredClone(currentWord));
        delete wordsObj[currentWord.word];
        currentWord.word = "";
        currentWord.count = 0;
      }
      return arrayObjWords;
    },
    deletePlural(wordsObj) {
      const singl = [];
      for (const key in wordsObj) {
        if (key.at(-1) !== "s") {
          singl.push(key);
        }
      }
      for (const singlWord of singl) {
        for (const key in wordsObj) {
          const newWord = singlWord + "s";
          if (newWord === key) {
            delete wordsObj[key];
          }
        }
      }
    },
    isOneSymbolWord(word){
      const regexp = /[a-z]/;
      if(regexp.test(word) && word !== 'a' && word !== 'i'){
        return false;
      }
      return true;
    },
    async read() {
      const textReader = new TextReader(this.file);
      const reg = new RegExp("[^\\w]+|[0-9]", "g");
      this.wordsArr.splice(0, this.wordsArr.length);
      const arr = [];
      let countAllWords = 0;
      while (!textReader.endOfStream) {
        const line = await textReader.readLine();
        const lineFix = line.split("\r\n");
        const lineNoHEX = lineFix[0].replace(/0[xX][A-Fa-f0-9]+/g, "");
        const lineClean = lineNoHEX.replace(reg, " ");
        const lineNoCamelCase = lineClean.replace(/([A-Z])/g, " $1");
        const words = lineNoCamelCase.split(" ");
        for (let word of words) {
          if (word !== "" && !(word.length === 1 && !(word === 'a' || word === 'i'))) {
            countAllWords++;
            word = word.toLowerCase();
            let wordInArr = false;
            for (const wordObj of arr) {
              if (word === wordObj.word) {
                wordObj.count++;
                wordInArr = true;
                break;
              }
            }
            if (!wordInArr) {
              arr.push(createNewWordObj(word));
            }
          }
        }
      }
      this.SET_ALL_WORDS_COUNT(countAllWords);
      this.wordsArr = arr;
      deletePlural(this.wordsArr);
      this.wordsArr.sort((a, b) => b.count - a.count);
      this.SET_WORDS_LIST(this.wordsArr);
      this.$router.push({ path: '/list' });
    },
  },
  components: {
    DragAndDrop,
    InputFile,
  },
};

function createNewWordObj(word) {
  const newWordObj = {
    word: word,
    count: 1,
  };
  return newWordObj;
}

function deletePlural(wordsArr) {
  const singl = [];
  for (const wordObj of wordsArr) {
    if (wordObj.word.at(-1) !== "s") {
      singl.push(wordObj);
    }
  }

  for (const singlWord of singl) {
    for (let i = 0; i < wordsArr.length; i++) {
      if (singlWord.word + "s" === wordsArr[i].word) {
        singlWord.count += wordsArr[i].count;
        wordsArr.splice(i, 1);
        break;
      }
    }
  }
}

class TextReader {
  CHUNK_SIZE = 8192000;
  position = 0;
  length = 0;

  byteBuffer = new Uint8Array(0);

  lines = [];
  lineCount = 0;
  lineIndexTracker = 0;

  fileReader = new FileReader();
  textDecoder = new TextDecoder(`utf-8`);

  get allCachedLinesAreDispatched() {
    return !(this.lineIndexTracker < this.lineCount);
  }

  get blobIsReadInFull() {
    return !(this.position < this.length);
  }

  get bufferIsEmpty() {
    return this.byteBuffer.length === 0;
  }

  get endOfStream() {
    return (
      this.blobIsReadInFull &&
      this.allCachedLinesAreDispatched &&
      this.bufferIsEmpty
    );
  }

  constructor(blob) {
    this.blob = blob;
    this.length = blob.size;
  }

  blob2arrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      this.fileReader.onerror = reject;
      this.fileReader.onload = () => {
        resolve(this.fileReader.result);
      };

      this.fileReader.readAsArrayBuffer(blob);
    });
  }

  read(offset, count) {
    return new Promise(async (resolve, reject) => {
      if (
        !Number.isInteger(offset) ||
        !Number.isInteger(count) ||
        count < 1 ||
        offset < 0 ||
        offset > this.length - 1
      ) {
        resolve(new ArrayBuffer(0));
        return;
      }

      let endIndex = offset + count;

      if (endIndex > this.length) endIndex = this.length;

      let blobSlice = this.blob.slice(offset, endIndex);

      resolve(await this.blob2arrayBuffer(blobSlice));
    });
  }

  readLine() {
    return new Promise(async (resolve, reject) => {
      if (!this.allCachedLinesAreDispatched) {
        resolve(this.lines[this.lineIndexTracker++] + `\n`);
        return;
      }

      while (!this.blobIsReadInFull) {
        let arrayBuffer = await this.read(this.position, this.CHUNK_SIZE);
        this.position += arrayBuffer.byteLength;

        let tempByteBuffer = new Uint8Array(
          this.byteBuffer.length + arrayBuffer.byteLength
        );
        tempByteBuffer.set(this.byteBuffer);
        tempByteBuffer.set(new Uint8Array(arrayBuffer), this.byteBuffer.length);

        this.byteBuffer = tempByteBuffer;

        let lastIndexOfLineFeedCharacter = this.byteBuffer.lastIndexOf(10);
        if (lastIndexOfLineFeedCharacter > -1) {
          let lines = this.textDecoder.decode(this.byteBuffer).split(`\n`);
          this.byteBuffer = this.byteBuffer.slice(
            lastIndexOfLineFeedCharacter + 1
          );

          let firstLine = lines[0];

          this.lines = lines.slice(1, lines.length - 1);
          this.lineCount = this.lines.length;
          this.lineIndexTracker = 0;

          resolve(firstLine + `\n`);
          return;
        }
      }

      if (!this.bufferIsEmpty) {
        let line = this.textDecoder.decode(this.byteBuffer);
        this.byteBuffer = new Uint8Array(0);
        resolve(line);
        return;
      }

      resolve(null);
    });
  }
}
</script>

<style scoped lang="scss">
.reader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Rubik";
  &__file-name{
    font-size: 1.5rem;
    font-weight: 600;
  }
  &__button-read {
    width: max-content;
    font-size: 1.5rem;
    background-color: #08a652;
    color: #fff;
    font-weight: 600;
    padding: 15px 30px;
    border: none;
    cursor: pointer;
    border-radius: 15px;
    &:hover{
      background-color: #1fbe69;
    }
    &-hidden {
      display: none;
    }
    &-showe {
      display: block;
    }
  }
}
</style>
