import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import openDatabase from "../utils/db";
import DictionaryItem from "../components/DictionaryItem";
import { useNavigation } from "@react-navigation/native";

interface DicEntry {
  id: number;
  word: string;
  pos: string;
  definition: string;
  example: string;
}

const SearchScreen = () => {
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
    const db = await openDatabase();
    
    db.execAsync(
        `SELECT * FROM WordDefinition WHERE word LIKE ? OR definition LIKE ? LIMIT 100`,
        [`%${searchText}%`, `%${searchText}%`]
        )
        .then((rows) => {
            if (rows.length > 0) {
            setResults(rows[0].rows._array as DicEntry[]);
            } else {
            setResults([]);
            setError("ไม่พบคำที่ค้นหา");
            }
        })
        .catch((err) => {
            console.error(err);
            setError("เกิดข้อผิดพลาดในการค้นหา");
        }
    )
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
        keyExtractor={(item) => item.id.toString()}
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
