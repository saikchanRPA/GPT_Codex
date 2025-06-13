import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

const DB_NAME = "monDic.db";
let db: SQLite.SQLiteDatabase | null = null;

export async function openDatabase(): Promise<any> {
  if (db) return db;

  // If using a bundled database, copy from assets on first run
  const dbUri = `${FileSystem.documentDirectory}${DB_NAME}`;
  const dbExists = await FileSystem.getInfoAsync(dbUri);
  if (!dbExists.exists) {
    const asset = Asset.fromModule(require("../../assets/monDic.db"));
    await FileSystem.downloadAsync(asset.uri, dbUri);
  }
  db = SQLite.openDatabaseSync(DB_NAME) as any; // Cast to any to allow transaction
  return db;
}

export default openDatabase;
