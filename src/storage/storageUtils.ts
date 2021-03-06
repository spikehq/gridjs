import { UserConfig } from '../config';
import MemoryStorage from './memory';
import Storage from './storage';
import StorageError from '../error/storage';
import ServerStorage from './server';

class StorageUtils {
  /**
   * Accepts the config dict and tries to guess and return a Storage type
   *
   * @param config
   */
  public static createFromUserConfig(config: UserConfig): Storage | null {
    let storage = null;
    // `data` array is provided
    if (config.data) {
      storage = new MemoryStorage(config.data);
    }

    if (config.from) {
      storage = new MemoryStorage(this.tableElementToArray(config.from));
      // remove the source table element from the DOM
      config.from.style.display = 'none';
    }

    if (config.server) {
      storage = new ServerStorage(
        config.server.url,
        config.server.then,
        config.server.opts,
      );
    }

    if (!storage) {
      throw new StorageError('Could not determine the storage type');
    }

    return storage;
  }

  /**
   * Accepts a HTML table element and converts it into a 2D array of data
   *
   * TODO: This function can be a step in the pipeline: Convert Table -> Load into a memory storage -> ...
   *
   * @param element
   */
  static tableElementToArray(element: HTMLElement): any[][] {
    const arr = [];
    const tbody = element.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');

    for (const row of rows as any) {
      const cells = row.querySelectorAll('td');
      const parsedRow = [];

      for (const cell of cells) {
        parsedRow.push(cell.innerHTML);
      }

      arr.push(parsedRow);
    }

    return arr;
  }
}

export default StorageUtils;
