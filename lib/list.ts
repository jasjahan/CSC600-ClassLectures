import * as util from "util";

/* ************************************************************************** */
/* Data-Type */
/* ************************************************************************** */

export enum _List { NIL, CONS };
export type List<T> = {tag: _List.NIL} | {tag: _List.CONS, contents: T, rest: List<T>};


export function Nil<T>(): List<T> {
    return {tag: _List.NIL};
}


export function Cons<T>(x: T, ls: List<T>): List<T> {
    return {tag: _List.CONS, contents: x, rest: ls};
}


/* ************************************************************************** */
/* List Functions */
/* ************************************************************************** */

export function head<T>(ls: List<T>): T {
    switch (ls.tag) {
        case _List.NIL: {
            throw Error("Empty list ...");
        }
        case _List.CONS: {
            return ls.contents;
        }
    }
}


export function tail<T>(ls: List<T>): List<T> {
    switch (ls.tag) {
        case _List.NIL: {
            throw Error("Empty list ...");
        }
        case _List.CONS: {
            return ls.rest;
        }
    }
}


export function length<T>(ls: List<T>): number {
    switch (ls.tag) {
        case _List.NIL: {
            return 0;
        }
        case _List.CONS: {
            return 1 + length(ls.rest);
        }
    }
}


export function sexprify<T>(ls: List<T>): string {
    switch (ls.tag) {
        case _List.NIL: {
            return "()";
        }
        case _List.CONS: {
            return "(" + ls.contents + " " + sexprify(ls.rest) + ")";
        }
    }
}


export function emit<T>(ls: List<T>): string {
    switch (ls.tag) {
        case _List.NIL: {
            return "Nil()";
        }
        case _List.CONS: {
            return `Cons(${ls.contents}, ${emit(ls.rest)})`;
        }
    }
}


export function append<T>(ls1: List<T>, ls2: List<T>): List<T> {
    switch (ls1.tag) {
        case _List.NIL: {
            return ls2;
        }
        case _List.CONS: {
            return Cons(ls1.contents, append(ls1.rest, ls2));
        }
    }
}


export function map<T, U>(f: (elem: T) => U, ls: List<T>): List<U> {
    switch(ls.tag) {
        case _List.NIL: {
            return Nil();
        }
        case _List.CONS: {
            return Cons(f(ls.contents), map(f, ls.rest));
        }
    }
}


export function filter<T>(f: (elem: T) => boolean, ls: List<T>): List<T> {
    switch(ls.tag) {
        case _List.NIL: {
            return Nil();
        }
        case _List.CONS: {
            if (f(ls.contents)) {
                return Cons(ls.contents, filter(f, ls.rest));
            } else {
                return filter(f, ls.rest);
            }   
        }
    }
}


export function reduce<T, U>(f: (elem: T, acc: U) => U, initial: U, ls: List<T>): U {
    switch (ls.tag) {
        case _List.NIL: {
            return initial;
        }
        case _List.CONS: {
            return f(ls.contents, reduce(f, initial, ls.rest));
        }
    }
}


export function reverse<T>(ls: List<T>): List<T> {
    function go<T>(orig: List<T>, acc: List<T>): List<T> {
        switch (orig.tag) {
            case _List.NIL: {
                return acc;
            }
            case _List.CONS: {
                return go(orig.rest, Cons(orig.contents, acc));
            }
        }
    }

    return go(ls, Nil());
}


export function foldl<T, U>(f: (elem: T, acc: U) => U, acc: U, ls: List<T>): U {
    switch (ls.tag) {
        case _List.NIL: {
            return acc;
        }
        case _List.CONS: {
            return f(ls.contents, reduce(f, acc, ls.rest));
        }
    }
}


export function foldr<T, U>(f: (elem: T, acc: U) => U, acc: U, ls: List<T>): U {
    switch (ls.tag) {
        case _List.NIL: {
            return acc;
        }
        case _List.CONS: {
            return f(ls.contents, foldr(f, acc, ls.rest));
        }
    }
}



/* ************************************************************************** */
/* Utility */
/* ************************************************************************** */

export function cytoscapify<T>(ls: List<T>): string {
    let count = 0;
    function fresh(prefix: string): string {
        count += 1;
        return prefix + count;
    }

    function go<T>(ls: List<T>): any {
        switch (ls.tag) {
            case _List.NIL: {
                return [{ data: {id: fresh("nil")}}];
            }
            case _List.CONS: {
                const rest = go(ls.rest);
                const nodeId = fresh("cons");
                const edgeId = fresh("edge");
                const edge = { data: { id: edgeId, source: nodeId, target: rest[0].data.id } };
                return [{ data: {id: nodeId, label: ls.contents } }, edge].concat(rest);
            }
        }
    };
    
    return util.inspect(go(ls));
};


export const ls0 = Nil();
export const ls1 = Cons(1, Nil());
export const ls2 = Cons(2, ls1);
export const ls3 = Cons(3, ls2);
export const ls4 = Cons(4, ls3);
export const ls5 = Cons(5, ls4);
