/**
 * Armazenamento da store persistida em IndexedDB.
 * Se o IndexedDB falhar, cai para o localStorage para não perder a cache.
 */

import {
  createStore as createIdbStore,
  del as deleteIdb,
  get as readIdb,
  set as writeIdb,
} from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

const DATABASE_NAME = "fmdata";
const STORE_NAME = "estado";

/** O idb-keyval só abre a base de dados no primeiro pedido, por isso é seguro criar aqui. */
const idbStore = createIdbStore(DATABASE_NAME, STORE_NAME);

let indexedDbAvailable = typeof indexedDB !== "undefined";

function readLocalStorage(name: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(name);
  } catch {
    return null;
  }
}

function writeLocalStorage(name: string, value: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(name, value);
  } catch {
    // Sem espaço ou sem permissão: não há mais onde guardar.
  }
}

function removeLocalStorage(name: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(name);
  } catch {
    // Nada a fazer.
  }
}

export const storage: StateStorage = {
  async getItem(name) {
    if (indexedDbAvailable) {
      try {
        const value = await readIdb<string>(name, idbStore);
        return typeof value === "string" ? value : readLocalStorage(name);
      } catch {
        indexedDbAvailable = false;
      }
    }

    return readLocalStorage(name);
  },

  async setItem(name, value) {
    if (indexedDbAvailable) {
      try {
        await writeIdb(name, value, idbStore);
        return;
      } catch {
        indexedDbAvailable = false;
      }
    }

    writeLocalStorage(name, value);
  },

  async removeItem(name) {
    if (indexedDbAvailable) {
      try {
        await deleteIdb(name, idbStore);
      } catch {
        indexedDbAvailable = false;
      }
    }

    removeLocalStorage(name);
  },
};
