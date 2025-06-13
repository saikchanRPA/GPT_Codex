import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

type DicEntry = {
  word: string;
  pos: string;
  definition: string;
  example: string;
};

export default function ResultScreen() {
  const route = useRoute<RouteProp<{ params: { entry: DicEntry } }, "params">>();
  const { entry } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.word}>{entry.word}</Text>
      <Text style={styles.pos}>{entry.pos}</Text>
      <Text style={styles.definition}>{entry.definition}</Text>
      <Text style={styles.example}>ตัวอย่าง: {entry.example}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  word: { fontSize: 28, fontWeight: "bold", marginBottom: 4 },
  pos: { fontSize: 18, fontStyle: "italic", marginBottom: 8 },
  definition: { fontSize: 18, marginBottom: 12 },
  example: { fontSize: 16, color: "#4a4a4a" },
});
