import PriorityQueue from "./priority-queue";

var queue = new PriorityQueue<number>();
queue = queue.insert(3,3);
queue.printHeap();
queue = queue.insert(0,0);
queue.printHeap();
queue = queue.insert(15,15);
queue.printHeap();
queue = queue.insert(-10,-10);
queue.printHeap();
while(queue.count > 2) {
    const { queue: newQueue, value} = queue.dequeue();
    queue = newQueue;
    queue.printHeap();
}

queue = queue.insert(4,4);
queue.printHeap();
queue = queue.insert(5,5);
queue.printHeap();
queue = queue.insert(1,1);
queue.printHeap();
queue = queue.insert(-1,-1);
queue.printHeap();

while(queue.count > 0) {
    const { queue: newQueue, value} = queue.dequeue();
    queue = newQueue;
    queue.printHeap();
}