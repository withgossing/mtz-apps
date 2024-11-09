export interface BatchJob {
  name: string;
  schedule: string;
  execute: () => Promise<void>;
}
