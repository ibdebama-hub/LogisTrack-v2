declare module '@playwright/test' {
  export interface Page {
    goto(url: string, options?: any): Promise<any>;
    setViewportSize(size: { width: number; height: number }): Promise<void>;
    locator(selector: string): any;
    fill(selector: string, value: string): Promise<void>;
    click(selector: string, options?: any): Promise<void>;
  }

  export interface TestArgs {
    page: Page;
  }

  export interface TestFunction {
    (name: string, fn: (args: TestArgs) => Promise<void>): void;
    beforeEach(fn: (args: TestArgs) => Promise<void>): void;
    describe(name: string, fn: () => void): void;
  }

  export const test: TestFunction;
  export const expect: (actual: any) => any;
}
