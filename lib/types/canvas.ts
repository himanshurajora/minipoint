export type CanvasOptions = {
  /**
   *  The element to append the canvas on @default body
   */
  parentElement: HTMLElement;
  /**
   *  Width of the canvas on @default 800px
   */
  width: number;
  /**
   *  Height of the canvas on @default 600px
   */
  height: number;
};

export type EngineOptions = {
  contextOptions?: CanvasRenderingContext2DSettings;
  // TODO: not yet decided
  engineOptions?: {
    clearEachFrame?: boolean;
    border?: string;
    bg?: string;
    width?: number;
    height?: number;
  };
};
