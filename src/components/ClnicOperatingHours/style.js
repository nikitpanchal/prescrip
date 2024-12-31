import styles from "../sidebar/styles";
import {
 
  Dimensions
   
} from "react-native";
export default {
  container: {
    flex: 1,
    
    backgroundColor: '#fafafa'
  },
  curve_view:
  {
    
    flex: 1,
    marginBottom: 60,
    backgroundColor: '#f7f7f7', borderTopEndRadius: 20, borderTopLeftRadius: 20
  },


  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 20,
    // paddingHorizontal : 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
}