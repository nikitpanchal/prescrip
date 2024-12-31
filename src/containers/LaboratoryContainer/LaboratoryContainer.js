//**code by ravi */
import React, { Component } from "react";
import { Container, Text } from "native-base";
import {
  KeyboardAvoidingView,
  Keyboard,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedbackBase,
  Alert,
  BackHandler,
  SafeAreaView,
  Dimensions,
} from "react-native";
import {
  save_btn_green,
  save_blue_btn,
  Save_pink_btn,
  ic_add_blue,
  search_blue,
  Add_green_btn,
  Search_green,
  Add_Pink_btn,
  Search_Pink_btn,
  Black_back,
  ic_note_delete,
  ic_add_button,
  SuggestLab_grey_btn,
} from "../../constants/images";
import { connect } from "react-redux";
import { withDb } from "../../DatabaseContext/withDatabase";
import LinearGradient from "react-native-linear-gradient";
import { setlablist } from "../../actions/patientProfie";
import {
  getreferallist,
  labtest,
  addpathlab,
  getsuggetion,
  setlab,
  setaddrefer,
} from "../../actions/patientVisit";
// import ToastComponent from '../Toast/toastComponent'
import ToastComponent from "../../components/Toast/toastComponent";
import Images from "../../Theme/Images";
import Toast, { DURATION } from "react-native-easy-toast";
import EmptyHomePrescrip from "../../components/EmptyHome/EmptyHomePrescrip";
import { empty_vc, Laboratory_N_Data_Icon } from "../../constants/images";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

const DATA = [];
const test = [
  {
    title: "ravi",
  },
];
let pastComplients = [];

class LaboratoryContainer extends Component {
  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      isItemInArray: true,
      arrayHolder: [],
      filterList: [],
      arrayHolder1: 0,
      text_input_Holder: "",
      text: "",
      menuIndex: -1,
      attachdata: DATA,
      isValid: false,
      show: false,
      less_more_text: false,
      labshow: false,
      viewshow: false,
      normalLabtest: [],
      pastLabs: [],
      labname: "",
      description: "",
      showToast: false,
    };
    this._unsubscribe = null;
    this.toast = React.createRef();
    this.myInput = React.createRef();
    this.gdata = {
      DoctorID: "",
      Name: "",
      Mobile: "",
      Alternateno: "",
      Address: "",
      Email: "",
      Pincode: "",
      City: "",
      State: "",
      Specialist: "",
      LocationName: "",
      MICRNo: "",
      Type: 0,
      CountryCode: '+91'
    };
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    this._unsubscribe ? this._unsubscribe() : null;
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    multipleTapHandler.clearNavigator();
    this.props.navigation.pop();
    return true;
  }

  ToggleFunction = () => {
    this.setState({
      show: this.state.show == true ? false : true,
      less_more_text: this.state.less_more_text == true ? false : true,
    });
  };

  // NewToggleFunction = () => {
  //     this.getreflist();
  //     this.setState({ viewshow: this.state.viewshow == true ? false : true, labshow: this.state.labshow == true ? false : null })
  // }

  Morelessfunction() {
    if (this.state.show == true) {
      return (
        <View style={{ flexDirection: "column", backgroundColor: "#f1f1f1" }}>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              borderBottomColor: "#cccccc",
              borderBottomWidth: 1,
              backgroundColor: "#f1f1f1",
              paddingHorizontal: 18,
              paddingVertical: 18,
            }}
          >
            <Text
              style={{ fontSize: 16, color: "#c4c4c4", fontFamily: "NotoSans" }}
            >
              All
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 13,
                  color: "#f21c68",
                  fontFamily: "NotoSans",
                }}
              >
                show suggestions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  deleleitem(id, index) {
    DATA.splice(index, 1);
    this.setState({
      menuIndex: -1,
      attachdata: DATA,
    });
  }

  componentDidMount() {
    multipleTapHandler.clearNavigator();
    let { type, color } = this.props.route.params;
    getScreenNameAnalytics({
      screen_name: type,
      screen_class: "LaboratoryContainer",
    });
    //this.props.setlablist(this.state.text_input_Holder)
    let self = this;
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      Keyboard.dismiss();
      self.getreflist();
    });
  }



  //api call
  getreflist() {
    try {
      var displayname = this.props.route.params.type;
      var type = 0;
      switch (displayname) {
        case "Laboratory":
          type = 2;
          break;
        case "Pharmacy":
          type = 1;
          break;
        case "Specialist":
          type = 3;
          break;
        default:
      }
      let self = this,
        { _id } = this.props.doctorProfile.DoctorData;
      this.props
        .getreferallist(0, 20, _id, type, "WhenEntered")
        .then((payload) => {
          var data = payload.payload.data;
          if (data.status == 2000) {
            //self.setState({ arrayHolder: data.data.docs })
            this.setState({
              arrayHolder: data.data.docs,
              filterList: data.data.docs,
              arrayHolder1: data.data.docs.length,
            });
            // this.setState({
            //     showToast: true ,
            //    description :"SucessFully Added"
            //   })

            //   setTimeout(() => {
            //       this.setState({
            //           showToast : false,

            //       })

            //     }, 2000);
          } else {
            Alert.alert(payload.error.response.data.errors.msg);
          }
        });
    } catch (err) { }
  }

  getsuggetionlist() {
    try {
      this.props
        .getsuggetion("5ebbc887651369101c612672", "Loss of Appetite")
        .then((payload) => {
          var data = payload.payload.data;

          if (data.status == 0) {
          } else if (data.status == 1) {
            const count = 0;
            pastLabs = data.suggesstion.map((val) => {
              let item = {
                name: val[0],
                id: count + 1,
              };
              return item;
            });

            this.setState({
              pastLabs: pastLabs,
            });
          }
        });
    } catch (err) { }
  }

  Done_btn() {
    this.handleBackButtonClick();
    //this.props.navigation.navigate("SearchFindingsContainer", { NavigationData: this.props.route.params })
  }

  //when on search data add api call
  AddData() {
    try {
      this.props
        .addpathlab(
          this.props.doctorProfile.DoctorData._id,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        )
        .then((payload) => {
          if (payload.payload.data.status == 2000) {
          } else {
            Alert.alert(payload.error.response.data.errors.msg);
          }
        });
    } catch (err) { }
  }

  SearchFilterFunction(text1) {
    this.setState({
      text_input_Holder: text1,
    });

    this.setState({ text_input_Holder: text1 }, () => {
      this.gdata.Name = this.state.text_input_Holder.trim();
    });
    let text = text1.trim();

    if (text) {
      let newData = this.state.arrayHolder.filter((item) => {
        let itemData = item.Name.toLowerCase();

        let textData = text.trim().toLowerCase();
        if (itemData.startsWith(textData)) {
          return itemData;
        }
      });

      this.setState({ filterList: newData });

      // let newData2 = this.state.arrayHolder.filter(item => {
      //     let itemData1 = item.Name.toUpperCase()
      //     const textData1 = text.trim().toUpperCase();
      //     if (itemData1.startsWith(textData1)) {
      //         return itemData1
      //     }
      //   });

      this.setState({
        isItemInArray: false,
      });
    } else {
      this.setState({ filterList: this.state.arrayHolder });
      this.setState({ isItemInArray: true });
    }
  }

  joinData() {
    //  this.props.setlab(this.gdata);
    // let referName = this.props.patientvisit.referName;
    // if (this.gdata.Type == 2) {
    //     referName.Lab = this.gdata
    // }
    // if (this.gdata.Type == 1) {
    //     referName.Pharma = this.gdata
    // }
    // if (this.gdata.Type == 3) {
    //     referName.Specialist = this.gdata
    // }
    // this.props.setlab(referName);

    this.setState({ isItemInArray: true, text_input_Holder: "" });
    Keyboard.dismiss();
    this.props.navigation.push("AddLaboratoryContainer", {
      item: this.gdata,
      type: this.gdata.Type,
      NavigationData: this.props.route.params,
    });
  }

  Item(data, index) {
    return (
      <View
        style={{
          flex: 0.4,
          flexDirection: "column",
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: "#fafafa",
        }}
      >
        <View style={{ flexDirection: "column", paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 18,
              paddingVertical: 18,
              justifyContent: "space-between",
              borderRadius: 8,
              backgroundColor: "#fff",
              padding: 12,
              shadowColor: "#d9d9d9",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.32,
              shadowRadius: 5.46,
              elevation: 8,
            }}
          >
            <View style={{ flexDirection: "column", flex: 1 }}>
              <Text
                style={{
                  color: "#3f3e3e",
                  fontSize: 14,
                  fontFamily: "NotoSans-Bold",
                }}
              >
                {data.title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.deleleitem(data.title, index)}
            >
              <Image
                source={ic_note_delete}
                style={{ width: 14, height: 14, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  SelectedHeader = () => {
    return (
      <Text
        style={{
          fontSize: 16,
          color: "#c4c4c4",
          fontFamily: "NotoSans",
          backgroundColor: "#fafafa",
          paddingHorizontal: 18,
          paddingVertical: 18,
        }}
      >
        Selected
      </Text>
    );
  };

  onClick(item) {
    multipleTapHandler.clearNavigator();

    let referName = this.props.patientvisit.referName;
    if (item.Type == 2) {
      referName.Lab = item;
    }
    if (item.Type == 1) {
      referName.Pharma = item;
    }
    if (item.Type == 3) {
      referName.Specialist = item;
    }
    this.props.setlab(referName);

    this.setState({
      showToast: true,
      description: "Successfully selected ",
    });

    setTimeout(() => {
      this.setState({
        showToast: false,
      });
      this.Done_btn();
    }, 800);

    //this.props.navigation.push("AddLaboratoryContainer", { item: item, NavigationData: this.props.route.params })
  }

  Navigatetoaddlaboratorty() {
    this.props.setaddrefer(null);
    multipleTapHandler.multitap(
      () => this.joinData(this.state.text_input_Holder.trim()),
      "AddLaboratoryContainer"
    );
    this.setState({ text_input_Holder: "" });
  }

  render() {
    let { type, color } = this.props.route.params;
    let { statusBarHeight } = this.props.databaseContext;
    let colorCode = "";
    let search_btn = "";
    let plus_btn = "";

    switch (type) {
      case "Laboratory":
        colorCode = "#f21c68";
        search_btn = Search_Pink_btn;
        plus_btn = Add_Pink_btn;
        this.gdata.Type = 2;
        break;
      case "Specialist":
        colorCode = "#0aadad";
        search_btn = Search_green;
        plus_btn = Add_green_btn;
        this.gdata.Type = 3;
        break;
      case "Pharmacy":
        colorCode = "#0aadad";
        search_btn = search_blue;
        plus_btn = ic_add_blue;
        this.gdata.Type = 1;
        break;

      default:
    }

    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#fff"
        />

        <SafeAreaView>
          <View
            style={[
              styles.viewcontainer,
              {
                paddingTop:
                  Platform.OS === "ios"
                    ? statusBarHeight || 0 + 0
                    : statusBarHeight || 0 + 23,
              },
            ]}
          >
            <View style={[styles.headeview, { paddingTop: 10 }]}>
              <TouchableOpacity onPress={() => this.handleBackButtonClick()}>
                <Image source={Black_back} style={styles.black_back_images} />
              </TouchableOpacity>
              <View style={{ paddingStart: 15, flex: 1 }}>
                <Text uppercase={true} style={styles.recom_labtest}>
                  {"recommend " + type}
                </Text>
                <TouchableOpacity
                  style={styles.searchview_container}
                  onPress={() => {
                    this.myInput.focus();
                  }}
                >
                  <TextInput
                    value={this.state.text_input_Holder}
                    onChangeText={(text) => this.SearchFilterFunction(text)}
                    placeholder={"Search For " + type + "..."}
                    placeholderTextColor={color}
                    returnKeyType={"next"}
                    autoCorrect={false}
                    keyboardType="default"

                    ref={(ref) => this.myInput = ref}
                    style={styles.searchview_textinputstyle}
                  />
                  <Image
                    source={search_btn}
                    style={styles.search_pink_images}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>

        {this.state.text_input_Holder.trim().length > 0 &&
          this.state.filterList == 0 ? (
          <View style={styles.suggestionview_container}>
            <View style={styles.add_labtest_continer}>
              <View style={styles.addview}>
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    paddingHorizontal: 14,
                  }}
                >
                  <View style={styles.addview}>
                    <Text
                      style={{
                        fontSize: 24,
                        color: color, paddingTop: 5,
                        fontFamily: "NotoSans-Bold",
                      }}
                    >
                      {this.state.text_input_Holder.trim()}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: color,
                        fontFamily: "NotoSans",

                      }}
                    >
                      Add as {type}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.Navigatetoaddlaboratorty()}
                  >
                    <Image source={plus_btn} style={styles.add_pink_images} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.Laboratoryviewcontainer}>
          <View style={styles.laboratory_text_view}>
            <Text style={styles.lab_text}>{type}</Text>
          </View>
          {this.state.filterList.length == 0 ? (
            <EmptyHomePrescrip
              isLottie={true}
              sectionImg={Laboratory_N_Data_Icon}
              imagePath={empty_vc}
              title={
                "No " +
                type +
                (this.state.text_input_Holder == "" ? " available " : " found")
              }
              colorCode={"red"}
              isShowButton={false}
              description={
                this.state.text_input_Holder == ""
                  ? null
                  : "For adding '" +
                  this.state.text_input_Holder +
                  "' as " +
                  type +
                  "\nYou can do it by clicking \u2295 symbol"
              }
            />
          ) : (
            <FlatList
              style={{ marginBottom: 80 }}
              data={this.state.filterList}
              showsVerticalScrollIndicator={false}
              keyExtractor={(index) => index.toString() + type}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.jointdataview}
                  onPress={() => this.onClick(item)}
                >
                  <Text style={{ fontSize: 16, color: "#595757" }}>
                    {item.Name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View style={styles.next_button_container}>
          <TouchableOpacity
            style={styles.next_btn_view}
            onPress={() => this.Done_btn()}
          >
            <LinearGradient
              colors={[color, color]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 0.8]}
              style={styles.linear_gradient_view}
            >
              <Text uppercase={true} style={styles.next_btn_text}>
                Done
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {this.state.showToast
          ? this.toast.show(
            <ToastComponent
              {...this.props}
              textColorCode={"#fafdfa"}
              imagePath={Images.Success}
              description={this.state.description}
            />,

            1000
          )
          : null}
        <Toast
          position="bottom"
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            bottom: 60,

            elevation: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('screen').width * 90 / 100,
            backgroundColor: "#29b62f",
            borderRadius: 15,
          }}
          ref={(ref) => this.toast = ref}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  patientProfile: state.patientProfile,
  doctorProfile: state.doctorProfile,
  patientvisit: state.patientvisit,
  Referral: state.patientvisit.Referral,
  displayname: state.attachment.displayname,
  subtext: state.attachment.subtext,
  type: state.attachment.type,
});
const mapDispatchToProps = (dispatch) => ({
  setlablist: (listdata) => dispatch(setlablist(listdata)),
  getreferallist: (skip, limit, doctorid, type, sort) =>
    dispatch(getreferallist(skip, limit, doctorid, type, sort)),
  labtest: (id, Tes1t, Retest, data) =>
    dispatch(labtest(id, Tes1t, Retest, data)),
  addpathlab: (
    id,
    pmobile,
    padd,
    pname,
    dname,
    Name,
    Mobile,
    Email,
    Address,
    data
  ) =>
    dispatch(
      addpathlab(
        id,
        pmobile,
        padd,
        pname,
        dname,
        Name,
        Mobile,
        Email,
        Address,
        data
      )
    ),
  getsuggetion: (doctorId, searchArray) =>
    dispatch(getsuggetion(doctorId, searchArray)),
  setlab: (Name) => dispatch(setlab(Name)),
  setaddrefer: (gdata) => dispatch(setaddrefer(gdata)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDb(LaboratoryContainer));

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f1f1" },
  viewcontainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    alignContent: "center",
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderBottomColor: "#dedede",
    borderBottomWidth: 2,
    width: Dimensions.get('window').width
  },
  headeview: { flexDirection: "row", alignItems: "center" },
  black_back_images: { height: 20, width: 20, resizeMode: "contain" },
  recom_labtest: { fontSize: 10, color: "#919191", fontFamily: "NotoSans" },
  searchview_container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchview_textinputstyle: {
    includeFontPadding: false,
    padding: 0,
    fontSize: 20,
    color: "#242424",
    width: "90%",
  },
  search_pink_images: { height: 20, width: 20, resizeMode: "contain" },
  suggestionview: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  suggestion_text: { fontSize: 16, color: "#c4c4c4", fontFamily: "NotoSans" },
  showall_text: { fontSize: 13, color: "#f21c68", fontFamily: "NotoSans" },
  suggestionview_container: {
    flexDirection: "column",
    backgroundColor: "#f1f1f1", width: Dimensions.get('window').width
  },
  showsuggetion_container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  all_text: { fontSize: 16, color: "#c4c4c4", fontFamily: "NotoSans" },
  show_suggetion: { fontSize: 13, color: "#f21c68", fontFamily: "NotoSans" },
  Laboratoryviewcontainer: { backgroundColor: "#fff", flex: 1, height: "100%", backgroundColor: "#fff", },
  laboratory_text_view: {
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 18,
    paddingVertical: 18, width: Dimensions.get('window').width
  },
  lab_text: { fontSize: 18, color: "#c4c4c4", fontFamily: "NotoSans" },
  jointdataview: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    flex: 1,
  },
  add_labtest_continer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    paddingStart: 8,
    paddingVertical: 18,
  },
  addview: { flexDirection: "column", backgroundColor: "#fff", flex: 1 },
  add_holdertext: {
    fontSize: 22,
    color: "#f21c68",
    fontFamily: "NotoSans-Bold",
  },
  add_labtext: {
    fontSize: 11,
    color: "#f21c68",
    fontFamily: "NotoSans",
    paddingTop: 5,
  },
  add_pink_images: { height: 27, width: 27, resizeMode: "contain" },
  add_list_view: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
  },
  add_list_text: { fontSize: 16, color: "#595757" },
  next_button_container: {

    backgroundColor: "#fff",
    flexDirection: "column",
    paddingHorizontal: 8,
    bottom: 0,
    paddingBottom: 20, width: Dimensions.get('window').width,
    position: "absolute",
  },
  suggest_lab_view: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 25,
  },
  suggest_pink_image: { height: 15, width: 15, resizeMode: "contain" },
  suggestion_laboratory_text: {
    fontSize: 15,
    color: "#f21c68",
    fontFamily: "NotoSans",
    paddingStart: 5,
  },
  next_btn_view: {
    flexDirection: "column",
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    width: "100%",
  },
  linear_gradient_view: {
    width: "95%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 25,
  },
  next_btn_text: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "NotoSans-Bold",
  },
});
