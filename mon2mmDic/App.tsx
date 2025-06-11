import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

export default function App() {
  useEffect(() => {
    const db = SQLite.openDatabase('dictionary.db');

    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT);'
      );

      tx.executeSql('INSERT INTO words (word) VALUES (?);', ['hello']);

      tx.executeSql('SELECT * FROM words;', [], (_, { rows }) => {
        console.log('Words in DB:', rows._array);
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
