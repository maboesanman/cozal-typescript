import PriorityQueue from "./utilities/priority-queue";

// new MyScreen({});

interface item {
    sort1: number;
    sort2?: number;
    name: string;
    sort3?: number;
}

let queue = new PriorityQueue<item>("sort1", ["sort2", "descending"], "sort3");
queue = queue.insert({ name: "hi1", sort1: 8, sort2: 10 });
queue = queue.insert({ name: "hi2", sort1: 10, sort2: -1 });
queue = queue.insert({ name: "hi3", sort1: 10, sort3: -1 });
queue = queue.insert({ name: "hi4", sort1: 10 });
queue = queue.insert({ name: "hi5", sort1: 10, sort2: 1 });
queue = queue.insert({ name: "hi6", sort1: 15 });
queue = queue.insert({ name: "6", sort1: 6});
queue = queue.insert({ name: "5", sort1: 5});
queue = queue.insert({ name: "2", sort1: 2});
queue = queue.insert({ name: "1", sort1: 1});
queue = queue.insert({ name: "3", sort1: 3});
queue = queue.insert({ name: "4", sort1: 4});
while(queue.count != 0) {
    console.log(queue.peek());
    // queue.printHeap();
    queue = queue.dequeue();
}