declare module 'bootstrap' {
  export class Tooltip {
    constructor(...args: any[]);
    dispose(): void;
    // ...
  }

  export class Popover {
    constructor(...args: any[]);
    dispose(): void;
    // ...
  }

  export class Modal {
    constructor(...args: any[]);
    show(): void;
    hide(): void;
    // ...
  }

  // Add more as needed
}
