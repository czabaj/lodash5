import __ from "./__";

type Params<F extends (...args: any[]) => any> = F extends (
  ...args: infer A
) => any
  ? A
  : never;

type Head<T extends any[]> = T extends [any, ...any[]] ? T[0] : never;

type Tail<T extends any[]> = ((...t: T) => any) extends (
  _: any,
  ...tail: infer TT
) => any
  ? TT
  : never;

type HasTail<T extends any[]> = T extends [] | [any] ? false : true;

type Last<T extends any[]> = {
  0: Last<Tail<T>>;
  1: Head<T>;
}[HasTail<T> extends true ? 0 : 1];

type Length<T extends any[]> = T["length"];

type Prepend<E, T extends any[]> = ((head: E, ...args: T) => any) extends (
  ...args: infer U
) => any
  ? U
  : T;

type Drop<N extends number, T extends any[], I extends any[] = []> = {
  0: Drop<N, Tail<T>, Prepend<any, I>>;
  1: T;
}[Length<I> extends N ? 1 : 0];

type Cast<X, Y> = X extends Y ? X : Y;

type CurryV5<P extends any[], R> = <T extends any[]>(
  ...args: Cast<T, Partial<P>>
) => Drop<Length<T>, P> extends [any, ...any[]]
  ? CurryV5<Cast<Drop<Length<T>, P>, any[]>, R>
  : R;

type placeholder = typeof __;

type Pos<I extends any[]> = Length<I>;
type Next<I extends any[]> = Prepend<any, I>;
type Prev<I extends any[]> = Tail<I>;
type Iterator<
  Index extends number = 0,
  From extends any[] = [],
  I extends any[] = []
> = {
  0: Iterator<Index, Next<From>, Next<I>>;
  1: From;
}[Pos<I> extends Index ? 1 : 0];
type Reverse<T extends any[], R extends any[] = [], I extends any[] = []> = {
  0: Reverse<T, Prepend<T[Pos<I>], R>, Next<I>>;
  1: R;
}[Pos<I> extends Length<T> ? 1 : 0];
// @ts-ignore
type Concat<T1 extends any[], T2 extends any[]> = Reverse<
  Cast<Reverse<T1>, any[]>,
  T2
>;
type Append<E, T extends any[]> = Concat<T, [E]>;
// https://www.freecodecamp.org/news/typescript-curry-ramda-types-f747e99744ab/

function curry<P extends any[], R>(
  func: (...args: P) => R,
  arity = func.length
): CurryV5<P, R> {
  return function collectArgs(...args) {
    return args.length >= arity
      ? func.apply(this, args)
      : function (...moreArgs) {
          return collectArgs.apply(this, args.concat(moreArgs));
        };
  };
}

export default curry;
