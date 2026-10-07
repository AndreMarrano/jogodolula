import { describe, expect, it } from "vitest";
import { InputController } from "./input";

function setup() {
  let now = 0;
  const input = new InputController(() => now);
  return { input, advance: (ms: number) => (now += ms) };
}

describe("InputController", () => {
  it("teclado e toque acionam a mesma ação", () => {
    const { input } = setup();
    input.handleKey("KeyA", true);
    expect(input.isDown("left")).toBe(true);
    input.handleKey("KeyA", false);
    input.setTouch("left", 1, true);
    expect(input.isDown("left")).toBe(true);
  });

  it("permite mover e pular ao mesmo tempo com dois dedos", () => {
    const { input } = setup();
    input.setTouch("right", 1, true);
    input.setTouch("jump", 2, true);
    expect(input.isDown("right")).toBe(true);
    expect(input.consumePress("jump")).toBe(true);
    input.setTouch("jump", 2, false);
    expect(input.isDown("right")).toBe(true);
  });

  it("só solta a ação quando todas as fontes soltam", () => {
    const { input } = setup();
    input.handleKey("ArrowLeft", true);
    input.handleKey("KeyA", true);
    input.handleKey("ArrowLeft", false);
    expect(input.isDown("left")).toBe(true);
    input.handleKey("KeyA", false);
    expect(input.isDown("left")).toBe(false);
  });

  it("guarda o aperto de pulo por uma janela curta (buffer) e consome uma vez", () => {
    const { input, advance } = setup();
    input.handleKey("Space", true);
    advance(100);
    expect(input.consumePress("jump", 130)).toBe(true);
    expect(input.consumePress("jump", 130)).toBe(false);
  });

  it("esquece o aperto fora da janela", () => {
    const { input, advance } = setup();
    input.handleKey("Space", true);
    advance(200);
    expect(input.consumePress("jump", 130)).toBe(false);
  });

  it("segurar a tecla não gera novos apertos (auto-repeat)", () => {
    const { input } = setup();
    input.handleKey("Space", true);
    expect(input.consumePress("jump")).toBe(true);
    input.handleKey("Space", true, true);
    expect(input.consumePress("jump")).toBe(false);
  });

  it("desligado (pausa) ignora entrada e não bloqueia teclas dos menus", () => {
    const { input } = setup();
    input.enabled = false;
    expect(input.handleKey("Space", true)).toBe(false);
    expect(input.isDown("jump")).toBe(false);
    input.setTouch("left", 1, true);
    input.enabled = true;
    expect(input.isDown("left")).toBe(false);
  });

  it("ignora teclas que não são do jogo", () => {
    const { input } = setup();
    expect(input.handleKey("KeyZ", true)).toBe(false);
  });
});
