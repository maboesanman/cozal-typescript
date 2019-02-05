interface HeapNodeValue<T> {
    readonly key: number;
    readonly value: T;
    readonly count: number;
    readonly left?: HeapNode<T>;
    readonly right?: HeapNode<T>;
}

type HeapNode<T> = HeapNodeValue<T> | undefined;

function heapInsert<T>(node: HeapNode<T>, key: number, value: T) : HeapNode<T> {
    if(node === undefined)
        return { count: 1, key, value };
    
    // convert the count + 1 to binary, and the digits after the first 1 represent
    // the position the new element should be inserted
    const direction = (node.count + 1).toString(2)[1];
    if(direction === '0') {
        if(key < node.key) {
            return {
                key,
                value,
                count: node.count + 1,
                left: heapInsert(node.left, node.key, node.value),
                right: node.right,
            }
        } else {
            return {
                key: node.key,
                value: node.value,
                count: node.count + 1,
                left: heapInsert(node.left, key, value),
                right: node.right,
            }
        }
    } else {
        if(key < node.key) {
            return {
                key,
                value,
                count: node.count + 1,
                left: node.left,
                right: heapInsert(node.right, node.key, node.value),
            }
        } else {
            return {
                key: node.key,
                value: node.value,
                count: node.count + 1,
                left: node.left,
                right: heapInsert(node.right, key, value),
            }
        }
    }
}

function heapExtract<T>(node: HeapNode<T>): {
    node: HeapNode<T>;
    key?: number;
    value?: T | undefined;
} {
    if(node === undefined)
        return { node: undefined }

    const removeDirection = (node.count).toString(2)[1] == "0" ? "Left" : "Right";
    const bubbleDirection = heapGetBubbleDownDirection(node);

    if(removeDirection === bubbleDirection && removeDirection === "Left") {
        const {node: left, key, value} = heapExtract(node.left);
        return {
            node: {
                ...node,
                count: node.count - 1,
                left,
            },
            key,
            value,
        }
    }
    if(removeDirection === bubbleDirection && removeDirection === "Right") {
        const {node: right, key, value} = heapExtract(node.right);
        return {
            node: {
                ...node,
                count: node.count - 1,
                right,
            },
            key,
            value,
        }
    }

    const {node: lastNode, key, value} = heapRemoveLast(node);
    const newNode = heapBubbleDown(lastNode, { key, value });

    return {
        node: newNode,
        key: node.key,
        value: node.value,
    }
}

function heapRemoveLast<T>(node: HeapNode<T>): {
    node?: HeapNode<T>;
    key: number;
    value: T;
} {
    if(node === undefined)
        throw new Error("something tragic has happened");

    if(node.count === 1) {
        return {
            key: node.key,
            value: node.value
        }
    }
    // convert the count + 1 to binary, and the digits after the first 1 represent
    // the position the new element should be inserted
    const direction = (node.count).toString(2)[1];
    if(direction === '0') { // Left
        const {node: left, key, value } = heapRemoveLast(node.left);
        return {
            node: {
                ...node,
                count: node.count - 1,
                left,
            },
            key,
            value,
        }
    } else { // Right
        const {node: right, key, value } = heapRemoveLast(node.right);
        return {
            node: {
                ...node,
                count: node.count - 1,
                right,
            },
            key,
            value,
        }
    }
}

function heapGetBubbleDownDirection<T>(node: HeapNode<T>, compareKey: number | undefined = undefined): "Left" | "Right" | "Neither" {
    if(node === undefined)
        return "Neither";

        let potentials: {
            left?: number;
            right?: number;
        } = {};
    
        if(node.left !== undefined && (compareKey || node.key) > node.left.key)
            potentials.left = node.left.key;
        
        if(node.right !== undefined && (compareKey || node.key) > node.right.key)
            potentials.right = node.right.key;
        
        if(potentials.left !== undefined && potentials.right !== undefined) {
            if(potentials.left < potentials.right)
                potentials.right = undefined;
            else
                potentials.left = undefined;
        }
        if(potentials.left !== undefined && potentials.right === undefined) {
            return "Left";
        }
        if(potentials.left === undefined && potentials.right !== undefined) {
            return "Right";
        }
        return "Neither";
}

function heapBubbleDown<T>(node: HeapNode<T>, replace: { key: number, value: T } | undefined = undefined): HeapNode<T> {
    if(node === undefined)
        return undefined;
    
    const compareKey = replace === undefined ? node.key : replace.key;
    const direction = heapGetBubbleDownDirection(node, compareKey); 

    switch (direction) {
        case "Left":
            return {
                key: node.left!.key,
                value: node.left!.value,
                count: node.count,
                left: heapBubbleDown(node.left, { key: node.key, value: node.value, ...replace} ),
                right: node.right,
            };
        case "Right":
            return {
                key: node.right!.key,
                value: node.right!.value,
                count: node.count,
                left: node.left,
                right: heapBubbleDown(node.right, { key: node.key, value: node.value, ...replace} ),
            };
        default:
            return { ...node, ...replace };
    }
}

export default class PriorityQueue<T> {
    private readonly Root: HeapNode<T>;

    public constructor();
    public constructor(root: HeapNode<T>);
    public constructor(root: HeapNode<T> = undefined) {
        this.Root = root;
    }

    public insert(key: number, value: T): PriorityQueue<T> {
        return new PriorityQueue(heapInsert(this.Root, key, value));
    }

    public peekKey(): number {
        if(this.Root === undefined)
            return NaN;
        
        return this.Root.key;
    }

    public dequeue(): { queue: PriorityQueue<T>, value?: T } {
        const { node: heap, value } = heapExtract(this.Root);
        return {
            queue: new PriorityQueue(heap),
            value,
        }
    }

    get count(): number {
        if(this.Root === undefined)
            return 0;

        return this.Root.count;
    }

    public printHeap(): void {
        const bfsqueue: HeapNode<T>[] = [];
        bfsqueue.push(this.Root);
        let count = 0;
        let rowLength = 1;
        let currentItems = [];
        while(bfsqueue.length != 0) {
            const currentNode = bfsqueue.shift();
            if(currentNode !== undefined) {
                bfsqueue.push(currentNode.left);
                bfsqueue.push(currentNode.right);
                currentItems.push(currentNode.key);
                count = count + 1;
                if(count == rowLength) {
                    console.log(currentItems);
                    count = 0;
                    rowLength = rowLength * 2;
                    currentItems = []
                }
            }
        }
        if(currentItems.length != 0) {
            console.log(currentItems);
        }
        console.log("------------------------------------------");
    }
}