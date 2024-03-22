import { shallowMount } from "@vue/test-utils";
import TextReader from "@/components/TextReader.vue";

let wrapper = undefined;
describe("Функция isOneSymbolWodr", () => {
  beforeEach(() => {
    wrapper = shallowMount(TextReader);
  });
  test("h строка из одной буквы не слово", () => {
    const greeting = wrapper.vm.isOneSymbolWodr("h");
    expect(greeting).toBe(false);
  });
  test("i строка из одной буквы слово", () => {
    const greeting = wrapper.vm.isOneSymbolWodr("i");
    expect(greeting).toBe(true);
  });
  test("test строка из нескольких букв", () => {
    const greeting = wrapper.vm.isOneSymbolWodr("test");
    expect(greeting).toBe(false);
  });
});
