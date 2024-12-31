import { Platform } from "react-native";
export default {
    container: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        resizeMode: 'cover',

    },


   
      
    title :{
        fontSize: 20,
        color: "#444444",
        fontFamily: "NotoSans-Bold",
        textAlign :'center',
        width :250,
        marginTop :10,
        alignSelf :'center'
        
    
      },

      decription :{
        fontSize: 15,
        color: "#636363",
        fontFamily: "NotoSans",
        textAlign :'center',
        width :250,
        alignSelf :'center'
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

