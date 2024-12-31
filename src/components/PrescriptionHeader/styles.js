import { Platform } from "react-native";
export default {
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
   // margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  },
    container: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        resizeMode: 'cover',

    },


   
      
    title :{
        fontSize: 15,
        color: "#ffffff",
        fontFamily: "NotoSans-Bold"
    
      },

      decription :{
        fontSize: 24,
        color: "#fefeff",
        lineHeight: 30,
        fontFamily: "NotoSans-Bold"
      },



    headerIcon: { justifyContent: 'flex-start' },
  

    consult_text: { color: '#fff', fontWeight: 'bold', fontSize: 35 },
    consult_vide_text: { color: '#fff', fontSize: 20 },
    sec_container: { width: '100%', borderTopLeftRadius: 25, borderTopRightRadius: 25, justifyContent: 'center', marginTop: -19, backgroundColor: '#fafafa', paddingVertical: 10, paddingHorizontal: 15, height: '100%' },


    header: { resizeMode: 'cover', height: 180, paddingLeft: 10, paddingRight: 10, flexDirection: 'column', },

  
    sec_container: { position: 'relative', width: '100%', borderTopLeftRadius: 25, borderTopRightRadius: 25, justifyContent: 'center', marginTop: -19, backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 15, },
    check_box_style: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', },
    check_box_image_container: { flexDirection: 'row', alignSelf: "center", },
    checkbox_tic_tickoff_style: { height: 35, width: 35 },
    wha_register_container: { justifyContent: 'center', alignSelf: "center", paddingLeft: 10, },
    wha_register_text: { fontSize: 14, color: "#333", },

};

