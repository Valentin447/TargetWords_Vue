<template>
  <div>
    <button @click="read" id="read">Прочитать</button>
    <input id="fileInput" type="file" />
  </div>
</template>

<script>
export default {
  methods: {
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
      let singl = [];
      for (const key in wordsObj) {
        if (key.at(-1) !== "s") {
          singl.push(key);
        }
      }

      for (const singlWord of singl) {
        for (const key in wordsObj) {
          let newWord = singlWord + "s";
          if (newWord === key) {
            delete wordsObj[key];
          }
        }
      }
    },
    read() {
      const wordsObj = {};
      document.getElementById("read").onclick = async () => {
        let file = document.getElementById("fileInput").files[0];
        let textReader = new TextReader(file);

        let count = 0;
        const reg = new RegExp("[^\\w]+|[0-9]", "g");

        while (!textReader.endOfStream) {
          let line = await textReader.readLine();
          //++++++++++++++++++++++++++++++++++

          let line2 = line.split("\r\n");
          let words = line2[0].split(" ");

          for (const word of words) {
            let word2 = word.replace(reg, "");
            if (word2 !== "") {
              word2 = word2.toLowerCase();
              if (word2 in wordsObj) {
                wordsObj[word2]++;
              } else {
                wordsObj[word2] = 1;
                count++;
              }
            }
          }
        }
        this.deletePlural(wordsObj);
        console.log(this.getSortedArray(wordsObj));
      };
    },
  },
};

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

        let lastIndexOfLineFeedCharacter = this.byteBuffer.lastIndexOf(10); // LINE FEED CHARACTER (\n) IS ONE BYTE LONG IN UTF-8 AND IS 10 IN ITS DECIMAL FORM

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
