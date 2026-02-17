import { workspace } from "vscode";

const SECTION = "svgFold";

export function get<T>(key: string): T | undefined {
  return workspace.getConfiguration(SECTION).get<T>(key);
}

export function set(key: string, value: unknown): void {
  workspace.getConfiguration(SECTION).update(key, value);
}
