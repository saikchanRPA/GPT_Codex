import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import openDatabase from "../utils/db";
import DictionaryItem from "../components/DictionaryItem";
import { useNavigation } from "@react-navigation/native";

interface DicEntry {
  word: string;
  pos: string;
  definition: string;
  example: string;
}

const SearchScreen: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<DicEntry[]>([]);
  const [error, setError] = useState("");
  const navigation = useNavigation<any>();

  const handleSearch = async () => {
    setError("");
    if (!searchText.trim()) {
      setResults([]);
      setError("กรุณากรอกคำที่ต้องการค้นหา");
      return;
    }
    try {
      const db = await openDatabase();
      db.transaction((tx: any) => {
        tx.executeSql(
          `SELECT * FROM WordDefinition WHERE word LIKE ? OR definition LIKE ? LIMIT 100`,
          [`%${searchText}%`, `%${searchText}%`],
          (_: any, result: any) => {
            if (result.rows.length > 0) {
              setResults(result.rows._array as DicEntry[]);
              setError("");
            } else {
              setResults([]);
              setError("ไม่พบคำที่ค้นหา");
            }
          },
          (_: any, error: any) => {
            console.error(error);
            setError("เกิดข้อผิดพลาดในการค้นหา");
            return true;
          }
        );
      });
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="ค้นหาคำศัพท์..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
        onSubmitEditing={handleSearch}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button title="ค้นหา" onPress={handleSearch} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={results}
        keyExtractor={(item) => item.word.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("Result", { entry: item })}>
            <DictionaryItem entry={item} />
          </TouchableOpacity>
        )}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 8 },
  error: { color: "red", marginVertical: 8 },
});

export default SearchScreen;
