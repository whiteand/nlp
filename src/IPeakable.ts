export interface IPeakable<T> {
  peek(n?: number): IteratorResult<T, any>;
}
