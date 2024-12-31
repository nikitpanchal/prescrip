import { Platform, StatusBar, Dimensions } from "react-native";
export default {
    container: {
        flex: 1,
        flexDirection: 'column',
        width: Dimensions.get('window').width
        , resizeMode: 'cover',
        paddingTop: Platform.OS == "ios" ? null : 5

    },
    maincontainerview: { flex: 1, backgroundColor: '#fff' },
    statusbar_view: {
        flexDirection: 'column',
        top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
        marginBottom: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
    },
    header_height: { height: 180, width: '100%', },
    whatsappnum_icon: { width: 15, height: 20, resizeMode: 'contain' },
    whatsappnumbr_text_view: { flexDirection: 'column', paddingLeft: 10, paddingTop: 4},
    whatsapp_sec_container: { position: 'relative', width: '100%', borderTopLeftRadius: 25, borderTopRightRadius: 25, justifyContent: 'center', marginTop: -19, backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 15 },

    consult_text: { color: '#fff', fontFamily: 'NotoSans-Bold', fontSize: 35 },
    consult_vide_text: { color: '#fff', fontSize: 20, fontFamily: 'NotoSans-Bold' },
    checkbox_view: { color: '#fff', fontSize: 20, flexDirection: 'row', paddingTop: 8, },
    note_view: { justifyContent: 'flex-start', paddingTop: 20 },
    proceed_text: {
        fontSize: 16, color: "#fff", fontFamily: 'NotoSans-Bold'
    },
    linear_gradient_view: { width: '95%', height: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 25 },
    proceed_view: {
        alignItems: 'center',
        position: 'absolute',
        width: '100%', marginBottom: 20, paddingHorizontal: 10, bottom: 0
    },
    number_share: { color: '#929292', fontFamily: 'NotoSans', justifyContent: 'flex-start', fontSize: 14, paddingRight: 10, letterSpacing: 0.5, },
    note_text: { color: "#000", fontFamily: 'NotoSans-Bold', marginBottom: 5, fontSize: 19 },
    text_input: { flexDirection: 'row', borderBottomColor: '#ececec', borderBottomWidth: 2, alignItems: 'center' },
    whatsapp_no__text: { color: '#929292', fontSize: 15, paddingBottom: 3 },
    whatsapp_text_input_view: { justifyContent: 'flex-start', paddingTop: 40, flexDirection: "column", },
    textinput_code: { fontSize: 25, alignItems: 'center', },
    textinput_number: {
        width: "50%", fontSize: 25,
    },
    header: { resizeMode: 'cover', height: 180, paddingLeft: 10, paddingRight: 10, flexDirection: 'column', },
    headerIcon: { justifyContent: 'center', },
    whatsappnumber_text: { color: '#fff', fontWeight: 'bold', fontSize: 35, fontFamily: 'NotoSans-Bold' },
    sec_container: { position: 'relative', width: '100%', borderTopLeftRadius: 25, borderTopRightRadius: 25, justifyContent: 'center', marginTop: -19, backgroundColor: '#fff', paddingVertical: 10, },
    check_box_style: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', },
    check_box_image_container: { flexDirection: 'row', alignSelf: "center", },
    checkbox_tic_tickoff_style: { height: 36, width: 36 },
    wha_register_container: { justifyContent: 'center', alignSelf: "center", paddingHorizontal: 10, flex: 1, },
    consultmain_view: { flex: 1, backgroundColor: '#fff', },
    consulticon_view: { flexDirection: 'row', flex: 1, },
    consult_status_bar: {
        height: 45, alignItems: 'center', top: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
        marginBottom: Platform.OS === 'ios' ? null : StatusBar.currentHeight,
    },
    conuslt_icon_container: { flex: 1, marginLeft: 10, flexDirection: "row", paddingRight: 10, height: 45, justifyContent: 'center', alignItems: 'center' },
    consult_image_icon: { width: 15, height: 20, paddingLeft: 10, resizeMode: 'contain' },
    consult_text_view: { flexDirection: 'column', },
    consult_text_view2: { height: 160, width: '100%', flexDirection: 'column', },
    consult_text_view3: { justifyContent: 'center' },
    consult_fee_view: { paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
    consult_border_view: { flexDirection: 'column', justifyContent: 'center', borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f1f1', padding: 12, shadowColor: "#dadada", shadowOpacity: 0.7, shadowRadius: 2, shadowOffset: { height: 1, width: 1 } },
    consult_fee_text: { fontSize: 18, color: '#bbbbbb' },
    consult_fee_text2: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, marginTop: 8, borderRadius: 5, backgroundColor: '#fff', borderWidth: 1, borderColor: '#0c9bad', height: 70, },
    money_text: { fontSize: 30, textAlign: 'center', alignSelf: 'center', justifyContent: 'center', color: '#929292' },
    consult_textinput: { textAlign: 'right', marginLeft: 10, width: "80%", fontSize: 30, height: 55, margin: 0, padding: 0, fontFamily: 'NotoSans-Bold' },
    fee_maincontainer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },
    youwillreceive: { color: "#333", fontFamily: 'NotoSans-Bold', marginBottom: 5, fontSize: 19 },
    youwillreceive_view: { flexDirection: 'row', alignItems: 'center' },
    youwillreceive_money_text: { color: '#333', fontSize: 19, fontWeight: 'bold', textAlign: 'center', flexWrap: 'wrap' },
    youwillreceive_icon: { resizeMode: "contain", height: 15, width: 15, paddingLeft: 5 },
    followupfee_main_container: { paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
    followupfee_text: { fontSize: 18, color: '#bbbbbb' },
    consult_done_mainview: { width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 25 },
    followupfee_blurandfocus_view: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },
    followupfee_textinput: { textAlign: 'right', marginLeft: 10, width: "80%", fontSize: 30, height: 55, margin: 0, padding: 0, fontFamily: 'NotoSans-Bold' },
    followupfee_moneytext: { fontSize: 30, textAlign: 'center', alignSelf: 'center', justifyContent: 'center', color: '#929292' },
    followupfee_icon: { resizeMode: "contain", height: 15, width: 15, paddingLeft: 5 },
    conult_done_main_view: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%', paddingHorizontal: 10, zIndex: 0, bottom: 0,

    },
    conult_done_container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%', marginBottom: 10, paddingHorizontal: 10, zIndex: 0, bottom: 0,
    },
    consult_blur_text: { fontSize: 16, color: "#fff", fontFamily: 'NotoSans-Bold' },
    consultdone_text: { fontSize: 16, color: "#fff", fontFamily: 'NotoSans-Bold' },
    consult_blur: { width: '95%', borderRadius: 25, backgroundColor: "#c1c1c1", paddingVertical: 15, justifyContent: 'center', alignItems: 'center', },
    consult_showhide_view: { flexDirection: 'column', paddingVertical: 8 },
    consult_showhide_view2: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },
    gateway_fee: { color: "#333", marginBottom: 5, fontSize: 13 },
    gateway_fee_moneyview: { flexDirection: 'row', alignItems: 'center' },
    fee_moneyview: { color: '#333', fontSize: 13, textAlign: 'center', flexWrap: 'wrap' },
    whatsapp_register_text: { fontSize: 15, color: '#000000', fontFamily: 'NotoSans' },
    wha_register_text: { fontSize: 15, color: '#000000', fontFamily: 'NotoSans' },


};



