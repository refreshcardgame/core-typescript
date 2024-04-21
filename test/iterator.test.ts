import { DoublyLinkedList, SinglyLinkedList } from "data-structure-typed";
import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { toRotated } from "../src/index.ts";

void suite("toRotated", () => {
  void test("rotates a singly linked list so the chosen item becomes the first element", () => {
    const list = new SinglyLinkedList(["a", "b", "c", "d"]);
    const rotated = toRotated(list, "c");

    assert.ok(rotated instanceof SinglyLinkedList);
    assert.deepEqual(rotated.toArray(), ["c", "d", "a", "b"]);
  });

  void test("rotates a doubly linked list so the chosen item becomes the first element", () => {
    const list = new DoublyLinkedList(["a", "b", "c", "d"]);
    const rotated = toRotated(list, "c");

    assert.ok(rotated instanceof DoublyLinkedList);
    assert.deepEqual(rotated.toArray(), ["c", "d", "a", "b"]);
  });
});
