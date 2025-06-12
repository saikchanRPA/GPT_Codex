import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DictionaryItem({ entry }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.word}>{entry.word}</Text>
      <Text style={styles.pos}>{entry.pos}</Text>
      <Text style={styles.definition} numberOfLines={1}>{entry.definition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" },
  word: { fontWeight: "bold", fontSize: 18 },
  pos: { fontSize: 14, color: "#555" },
  definition: { fontSize: 15, color: "#222" },
});
