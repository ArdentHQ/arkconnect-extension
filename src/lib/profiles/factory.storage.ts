import { Storage } from "./environment.models.js";
import { LocalStorage } from "./local.storage";

export class StorageFactory {
	public static make(driver: string): Storage {
		return {
			indexeddb: () => new LocalStorage("indexeddb"),
			localstorage: () => new LocalStorage("localstorage"),
			websql: () => new LocalStorage("websql"),
		}[driver]!();
	}
}
