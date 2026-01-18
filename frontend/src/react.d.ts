declare module 'react' {
  export interface FC<P = {}> {
    (props: P): JSX.Element | null;
  }
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prevState: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export interface FormEvent<T = Element> {
    preventDefault(): void;
  }
  export interface ChangeEvent<T = Element> {
    target: T & { value: string; checked?: boolean };
  }
  export namespace React {
    interface FC<P = {}> {
      (props: P): JSX.Element | null;
    }
    interface FormEvent<T = Element> {
      preventDefault(): void;
    }
    interface ChangeEvent<T = Element> {
      target: T & { value: string; checked?: boolean };
    }
  }
}

declare global {
  namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
      div: any;
      form: any;
      input: any;
      textarea: any;
      select: any;
      option: any;
      label: any;
      button: any;
      span: any;
    }
  }
}