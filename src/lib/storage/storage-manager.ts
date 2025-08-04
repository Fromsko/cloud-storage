import { StorageStrategy } from './types';
import { LocalStorageStrategy } from './local-storage';
import { SupabaseStorageStrategy } from './supabase-storage';
import { PocketBaseStorageStrategy } from './pocketbase-storage';

export class StorageManager {
  private strategy: StorageStrategy;

  constructor() {
    const storageType = process.env.STORAGE_TYPE || 'local';
    
    switch (storageType) {
      case 'supabase':
        this.strategy = new SupabaseStorageStrategy();
        break;
      case 'pocketbase':
        this.strategy = new PocketBaseStorageStrategy();
        break;
      case 'local':
      default:
        this.strategy = new LocalStorageStrategy();
        break;
    }
  }

  getStrategy(): StorageStrategy {
    return this.strategy;
  }
}

export const storageManager = new StorageManager();