import { getExtensionContext } from "./extensionContext";

export function getDataFromGlobalState<T>(key: string): T | undefined {
  const extensionContext = getExtensionContext();

  return extensionContext.globalState.get(key);
}

export async function storeDataToGlobalState(key: string, data: any) {
  const extensionContext = getExtensionContext();

  return extensionContext.globalState.update(key, data);
}
