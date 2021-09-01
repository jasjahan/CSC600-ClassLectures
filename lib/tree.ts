import * as util from "util";
import { List, Nil, Cons, append } from "./list";


/* ************************************************************************** */
/* Data-Type */
/* ************************************************************************** */

export enum _Tree { LEAF, NODE };
export type Tree<T> = {tag: _Tree.LEAF} | {tag: _Tree.NODE, contents: T, left: Tree<T>, right: Tree<T>};


export function Leaf<T>(): Tree<T> {
    return {tag: _Tree.LEAF};
}


export function Node<T>(x: T, left: Tree<T>, right: Tree<T>): Tree<T> {
    return {tag: _Tree.NODE, contents: x, left: left, right: right};
}


export function LeafNode<T>(x: T): Tree<T> {
    return Node(x, Leaf(), Leaf());
}



/* ************************************************************************** */
/* Tree Functions */
/* ************************************************************************** */

export function height<T>(t: Tree<T>): number {
    switch (t.tag) {
        case _Tree.LEAF: {
            return 0;
        }
        case _Tree.NODE: {
            return 1 + Math.max(height(t.left), height(t.right));
        }
    }
}


export function sexprify<T>(t: Tree<T>): string {
    switch (t.tag) {
        case _Tree.LEAF: {
            return "()";
        }
        case _Tree.NODE: {
            return "(" + t.contents + " " + sexprify(t.left) + " " + sexprify(t.right) + ")";
        }
            
    }
}


export function emit<T>(t: Tree<T>): string {
    switch (t.tag) {
        case _Tree.LEAF: {
            return "Leaf()";
        }
        case _Tree.NODE: {
            return `Node(${t.contents}, ${emit(t.left)}, ${emit(t.right)})`
        }
    }
}


export function appendRightMost<T>(t1: Tree<T>, t2: Tree<T>): Tree<T> {
    /* NOTE: for comparison with list append. */
    switch (t1.tag) {
        case _Tree.LEAF: {
            return t2;
        }
        case _Tree.NODE: {
            return Node(t1.contents, t1.left, appendRightMost(t1.right, t2));
        }
    }
}


export function map<T, U>(f: (elem: T) => U, t: Tree<T>): Tree<U> {
    switch (t.tag) {
        case _Tree.LEAF: {
            return Leaf();
        }
        case _Tree.NODE: {
            return Node(f(t.contents), map(f, t.left), map(f, t.right));
        }
    }
}


export function strangeFilter<T>(predicate: (elem: T) => boolean, t: Tree<T>): Tree<T> {
    /* NOTE: for comparison with list filter. */
    switch (t.tag) {
        case _Tree.LEAF: {
            return Leaf();
        }
        case _Tree.NODE: {
            if (predicate(t.contents)) {
                return Node(t.contents, strangeFilter(predicate, t.left), strangeFilter(predicate, t.right));
            } else {
                /* Non-unique choices. */
                const left = strangeFilter(predicate, t.left);
                switch (left.tag) {
                    case _Tree.LEAF: {
                        return strangeFilter(predicate, t.right);
                    }
                    case _Tree.NODE: {
                        return appendRightMost(left, strangeFilter(predicate, t.right));
                    }
                }
            }
        }
    }
}


export function filter<T>(predicate: (elem: T) => boolean, t: Tree<T>): List<T> {
    switch (t.tag) {
        case _Tree.LEAF: {
            return Nil();
        }
        case _Tree.NODE: {
            if (predicate(t.contents)) {
                return append(Cons(t.contents, filter(predicate, t.left)), filter(predicate, t.right));
            } else {
                return append(filter(predicate, t.left), filter(predicate, t.right));
            }
        }
    }
}


export function reduce<T, U>(f: (elem: T, acc: U) => U, initial: U, t: Tree<T>): U {
    switch (t.tag) {
        case _Tree.LEAF: {
            return initial;
        }
        case _Tree.NODE: {
            // Question: Is this the only way to write this function?
            // Question: What is the effect of order-of-evaluation?
            return reduce(f, f(t.contents, reduce(f, initial, t.left)), t.right);
        }
    }
}


/* ************************************************************************** */
/* Utility */
/* ************************************************************************** */

export function cytoscapify<T>(t: Tree<T>): string {
    let count = 0;
    function fresh(prefix: string): string {
        count += 1;
        return prefix + count;
    }

    function go<T>(t: Tree<T>): any {
        switch (t.tag) {
            case _Tree.LEAF: {
                return [{ data: {id: fresh("leaf")}}];
            }
            case _Tree.NODE: {
                const left = go(t.left);
                const right = go(t.right);
                const nodeId = fresh("node");
                const leftEdgeId = fresh("edge");
                const leftEdge = { data: { id: leftEdgeId, source: nodeId, target: left[0].data.id } };
                const rightEdgeId = fresh("edge");
                const rightEdge = { data: { id: rightEdgeId, source: nodeId, target: right[0].data.id } };
                
                return [{ data: {id: nodeId, label: t.contents } }, leftEdge, rightEdge].concat(left).concat(right);
            }
        }
    };
    
    return util.inspect(go(t));
};


export const t0 = Leaf();
export const t1 = LeafNode(1);
export const t2 = Node(2, t1, Leaf());
export const t3 = Node(3, t1, LeafNode(2));
export const t4 = Node(4, t3, t2);
