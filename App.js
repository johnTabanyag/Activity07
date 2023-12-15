import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  View,
  Text,
  Alert,
  FlatList,
  ToastAndroid,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { DataTable } from "react-native-paper";
export default function App() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("none");
  const [modalVisibles, setModalVisibles] = useState(false);
  const [userData, setUserData] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const handleTextChange1 = (text) => {
    setFirstname(text);
  };
  const handleTextChange2 = (text) => {
    setLastname(text);
  };
  const handleTextChange3 = (text) => {
    setUsername(text);
  };
  const handleTextChange4 = (text) => {
    setPassword(text);
  };
  const finddata = async () => {
    const result = await AsyncStorage.getItem("user");
    if (result !== null) setUserData(JSON.parse(result));
  };
  const newId =
    userData.length > 0 ? Math.max(...userData.map((item) => item.id)) + 1 : 1;
  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
      finddata();
    } catch (e) {
      // clear error
    }

    console.log("Done.");
  };

  const showToast = () => {
    ToastAndroid.show("Data added successfully!", ToastAndroid.SHORT);
  };

  const handleButtonPress = async () => {
    const contact = {
      id: newId,
      firstname: firstname,
      lastname: lastname,
      course: course,
      username: username,
      password: password,
    };
    const updateData = [...userData, contact];
    setUserData(updateData);
    await AsyncStorage.setItem("user", JSON.stringify(updateData));
    console.log(updateData);
    setFirstname("");
    setLastname("");
    setUsername("");
    setPassword("");
    setCourse("none");
    showToast();
    Keyboard.dismiss();
  };
  const go = () => {
    setModalVisible(false);
  };
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOpenModals = (item) => {
    setSelectedUserData(item);
    setModalVisibles(true);
  };

  const handleCloseModals = () => {
    setModalVisibles(false);
  };

  useEffect(() => {
    finddata();
  }, []);
  return (
    <View style={styles.containers1}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibles}
        onRequestClose={handleCloseModals}
      >
        <View style={styles.modalContainer}>
          <View style={styles.usermodal}>
            <Text style={styles.usermodalhead}>STUDENT INFORMATION</Text>
            <Text>Firstname: {selectedUserData?.firstname}</Text>
            <Text>Lastname: {selectedUserData?.lastname}</Text>
            <Text>Course: {selectedUserData?.course}</Text>
            <Text>Username: {selectedUserData?.username}</Text>
            <Text>Password: {selectedUserData?.password}</Text>
            <View style={styles.closemod}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCloseModals}
              >
                <Text style={styles.buttonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.container}>
            <TextInput
              placeholder="Firstname"
              placeholderTextColor="gray"
              onChangeText={handleTextChange1}
              value={firstname}
              style={styles.input}
            />
            <TextInput
              placeholder="Lastname"
              placeholderTextColor="gray"
              onChangeText={handleTextChange2}
              value={lastname}
              style={styles.input}
            />
            <View style={styles.pick}>
              <Picker
                selectedValue={course}
                style={styles.picker}
                onValueChange={(itemValue) => setCourse(itemValue)}
              >
                <Picker.Item label="Select Course" value="none" />
                <Picker.Item label="BSIT" value="BSIT" />
                <Picker.Item label="BSCS" value="BSCS" />
                <Picker.Item label="BSCRIM" value="BSCRIM" />
                <Picker.Item label="BSELEX" value="BSELEX" />
                <Picker.Item label="BSELECT" value="BSELECT" />
                <Picker.Item label="FPSM" value="FPSM" />
              </Picker>
            </View>
            <TextInput
              placeholder="Username"
              placeholderTextColor="gray"
              onChangeText={handleTextChange3}
              value={username}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              onChangeText={handleTextChange4}
              value={password}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.buttons}
              onPress={handleButtonPress}
            >
              <Text style={styles.text}>ADD STUDENT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttons} onPress={go}>
              <Text style={styles.text}>VIEW STUDENT LIST</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <DataTable style={styles.container4}>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title>ID</DataTable.Title>
          <DataTable.Title>NAME</DataTable.Title>
          <DataTable.Title>COURSE</DataTable.Title>
          <DataTable.Title>USERNAME</DataTable.Title>
        </DataTable.Header>

        <FlatList
          data={userData}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleOpenModals(item)}
            >
              <DataTable.Row>
                <DataTable.Cell>{item.id}</DataTable.Cell>
                <DataTable.Cell>{`${item.lastname}, ${item.firstname}`}</DataTable.Cell>
                <DataTable.Cell>{item.course}</DataTable.Cell>
                <DataTable.Cell>{item.username}</DataTable.Cell>
              </DataTable.Row>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </DataTable>

      <TouchableOpacity style={styles.buttons} onPress={handleOpenModal}>
        <Text style={styles.text}>ADD STUDENT</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  containers1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  name: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  names: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 40,
  },
  tables1: {
    width: "10%",
  },
  address: {
    color: "black",
    fontSize: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  containers: {
    flexDirection: "column",
    justifyContent: "flex-end",
    marginLeft: 20,
    gap: 20,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButton: {
    padding: 10,
    backgroundColor: "#6571e6",
    borderRadius: 5,
    margin: 10,
    width: 100,
  },
  button: {
    padding: 10,
    backgroundColor: "#6571e6",
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 50,
    gap: 20,
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    padding: 5,
    borderRadius: 10,
  },
  buttons: {
    backgroundColor: "#6571e6",
    padding: 10,
    width: "50%",
    height: 50,
    justifyContent: "center",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
  picker: {
    width: "100%",
    height: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  pick: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  tablerow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderColor: "#009879",
    borderBottomWidth: 0.9,
    borderLeftWidth: 0.9,
    borderRightWidth: 0.9,
  },
  tabletext: {
    fontSize: 15,
  },
  usermodal: {
    elevation: 10,
    backgroundColor: "#eeeee4",
    paddingLeft: 25,
    padding: 30,
    gap: 20,
    width: 300,
  },

  usermodalhead: {
    marginBottom: 20,
    fontWeight: "bold",
  },
  closemod: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
