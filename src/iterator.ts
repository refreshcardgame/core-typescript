import { DoublyLinkedList, SinglyLinkedList } from "data-structure-typed";

export function takeRight<E, R>(list: DoublyLinkedList<E, R>, n = 1): E[] {
  const result: E[] = [];
  let node = list.tail;

  while (node && n > 0) {
    result.push(node.value);
    node = node.prev;
    n--;
  }

  return result.reverse();
}

export function toRotated<TList extends DoublyLinkedList | SinglyLinkedList>(
  list: TList,
  first: TList extends DoublyLinkedList<infer E> | SinglyLinkedList<infer E> ? E : never,
): TList {
  const result = new (list instanceof SinglyLinkedList
    ? SinglyLinkedList
    : DoublyLinkedList)() as TList;
  const firstNode = list.getNode(first);
  let node = firstNode;

  while (node) {
    result.push(node.value);
    node = node.next;
  }

  node = list.head;

  while (node && node !== firstNode) {
    result.push(node.value);
    node = node.next;
  }

  return result;
}
