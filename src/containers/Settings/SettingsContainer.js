/// Pritish
import React, { Component } from "react";
import { Container, Content, Header } from "native-base";
import {
  Text,
  Image,
  View,
  StatusBar,
  BackHandler,
  TouchableOpacity,
  FlatList,
  StyleSheet, Dimensions
} from "react-native";
import { connect } from "react-redux";
import {
  Firefox_Icon,
  Chrome_Icon,
  Blue_Plus_Icon,
  Minus_Remove_Icon,
  Settings_Next_Step_Icon,
  Settings_DropDowncollapsed,
  Toggle_Off,
  Add_Icon,
  Manage_Assistants,
  Toggle_On,
  VideoConsultation_Icon,
  PrintViaWeb_Icon,
  Notifications_Icon,
  Clinic_Consultation_Icon,
  Out_Of_Clinic,
  Black_back,
  ic_note_delete,
  appIcon,
} from "../../constants/images";
import multipleTapHandler from "../../components/MultiTapHandle/index";
import SettingsHeader from "../../components/SettingsHeader/SettingsHeader";
import { get_outofclinic_time_and_date } from "../../actions/settings";
import _, { result } from "lodash";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";

class SettingsContainer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      isItemInArray: true,
      isSearchBoxShowing: false,
      text: "",
      arrayholder: this.normaldata,
      getOccData: [],
    };

    this.normaldata =
      this.props.doctorProfile.DoctorData.IsAssistant != 1 ||
        this.props.doctorProfile.DoctorData.RoleId == 3
        ? [
          {
            id: "1",
            title: "Video Consultation",
            description: "Manage settings related to Video Consulatations",
            images: VideoConsultation_Icon,
            navigation: "SettingsVideoConsultationContainer",
          },
          {
            id: "2",
            title: "Clinic Consultation",
            description:
              "Manage settings related to In-Clinic Consulatations",
            images: Clinic_Consultation_Icon,
            navigation: "SettingsClinicNameConsultation",
          },
          {
            id: "3",
            title: "Out of Clinic",
            description: "Schedule the days when clinic is not conducted",
            images: Out_Of_Clinic,
            navigation: this.state.getOccData.length
              ? "DeleteSelectedClinic"
              : "SettingsAddOutOfClinicNew",
          },
          {
            id: "4",
            title: "Notifications",
            description: "In-app notifications are Enabled",
            images: Notifications_Icon,
            navigation: "SettingsNotification",
          },
          {
            id: "5",
            title: "Manage Assistants",
            description: "Manage your Assistant's & their roles",
            images: Manage_Assistants,
            navigation: "ManageAssistantHome",
          },
          {
            id: "6",
            title: "Print via Web devices",
            description: "Manage printing devices, connected over Internet",
            images: PrintViaWeb_Icon,
            navigation: "SettingsPrintWebDevices",
          },
          {
            id: "7",
            description: "Manage Subscription",
            title: "Manage Subscription",
            images: appIcon,
            navigation: "SettingsSubscription",
            
          },
        ]
        : this.props.doctorProfile.DoctorData.RoleId == 2
          ? [
            {
              id: "2",
              title: "Clinic Consultation",
              description:
                "Manage settings related to In-Clinic Consulatations",
              images: Clinic_Consultation_Icon,
              navigation: "SettingsClinicNameConsultation",
            },
            {
              id: "3",
              title: "Out of Clinic",
              description: "Schedule the days when clinic is not conducted",
              images: Out_Of_Clinic,
              navigation: this.state.getOccData.length
                ? "DeleteSelectedClinic"
                : "SettingsAddOutOfClinicNew",
            },
          ]
          : [
            {
              id: "2",
              title: "Clinic Consultation",
              description:
                "Manage settings related to In-Clinic Consulatations",
              images: Clinic_Consultation_Icon,
              navigation: "SettingsClinicNameConsultation",
            },
          ];

    this.SearchData = [
      {
        head: "Video Consultation",
        title: "Video Consultation",
        navigation: "SettingsContainer",
        description: "Manage settings related to Video Consulatations",
        images: VideoConsultation_Icon,
      },
      {
        head: "Clinic Consultation",
        title: "Clinic Consultation",
        navigation: "SettingsContainer",
        description: "Manage settings related to In-Clinic Consulatations",
        images: Clinic_Consultation_Icon,
        navigation: "SettingsClinicNameConsultation",
      },
      {
        head: "Notification",
        title: "Notification",
        navigation: "SettingsContainer",
        description: "In-app notifications are Enabled",
        images: Notifications_Icon,
        navigation: "SettingsNotification",
      },
      {
        head: "Print via Web devices",
        title: "Print via Web devices",
        navigation: "SettingsContainer",
        description: "Manage printing devices, connected over Internet",
        images: PrintViaWeb_Icon,
      },
      {
        head: "Video Consultation",
        title: "Accept Online Appointments",
        navigation: "SettingsVideoConsultationContainer",
        description: "Enable",
        right_side_images: Toggle_On,
      },
      {
        head: "Video Consultation",
        title: "Pay Later For Consultation",
        navigation: "SettingsVideoConsultationContainer",
        description: "Enable",
        right_side_images: Toggle_On,
      },

      {
        head: "Clinic Consultation",
        title: "Add New Clinic",
        navigation: "SettingsClinicNameConsultation",
        right_side_images: Blue_Plus_Icon,
        color: "#0065D7",
      },

      {
        head: "Notification",
        title: "Receive Notifications",
        navigation: "SettingsNotification",
        description: "Enable",
        right_side_images: Toggle_On,
      },
      {
        head: "Print via Web devices",
        title: "Add New Print Device",
        navigation: "SettingsPrintWebDevices",
        right_side_images: Blue_Plus_Icon,
        color: "#0065D7",
      },
      {
        head: "Manage Subscription",
        title: "Manage Subscription",
        navigation: "SettingsSubscription",
        right_side_images: Blue_Plus_Icon,
        color: "#0065D7",
      },
    ];
  }

  checknavigation() {
    //console.log(this.state.getOccData.length);
    if (this.state.getOccData.length > 0) return "DeleteSelectedClinic";
    else return "SettingsAddOutOfClinicNew";
  }
  getoutofclinicdata() {
    try {
      let data = {
        doctorId: this.props.doctorProfile.DoctorData._id,
      };
      this.props.get_outofclinic_time_and_date(data).then((response) => {
        if (response.payload.data.Status == 1) {
          var newdata = _(response.payload.data.ooc)
            .groupBy((x) => x.OocId)
            .map((value, key) => ({ OocId: key, Clinics: value }))
            .value();
          this.setState({ getOccData: newdata }, () => { });

          // console.log("new item data" + JSON.stringify(newdata))
        }
      });
    } catch (error) {
      //  console.log(error);
    }
  }

  componentDidMount() {
    this.getoutofclinicdata();
    this.props.navigation.addListener("focus", () => {
      getScreenNameAnalytics({
        screen_name: "Settings",
        screen_class: "SettingsContainer",
      });
    });
    // this.getoutofclinicdata();
    this.setState({
      arrayholder: this.normaldata,
    });
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }
  handleBackButtonClick() {
    multipleTapHandler.clearNavigator();
    this.props.navigation.goBack(null);
    return true;
  }

  rightImageOnClick() {
    this.setState({
      text: "",
      isSearchBoxShowing: !this.state.isSearchBoxShowing,
    });
  }

  leftImageOnClick() {
    multipleTapHandler.clearNavigator(), this.props.navigation.goBack();
  }

  searchAction(text) {
    const newData = this.SearchData.filter((item) => {
      const itemData = item.title.toLowerCase();
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
      // if (itemData.startsWith(textData)) {
      //     return item;
      // }
    });

    if (text) {
      this.setState({
        arrayholder: newData,
        text: text,
      });
    } else {
      this.setState({
        arrayholder: this.normaldata,
        text: text,
      });
    }
  }
  navigate = (data) => {
    this.setState({
      arrayholder: this.normaldata,
      text: "",
      isSearchBoxShowing: false,
    });
    if (data.id == "3") {
      let route = this.state.getOccData.length
        ? "DeleteSelectedClinic"
        : "SettingsAddOutOfClinicNew";
      data.navigation = route;
      route = null;
    }
    // multipleTapHandler.multitap(
    //   () => this.props.navigation.navigate(data.navigation, data),
    //   data.navigation,
    // );

    this.props.navigation.navigate(data.navigation, data);
  };

  Item(data) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.navigate(data);
        }}
        style={{
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: "#fafafa",
          borderRadius: 5,
          paddingHorizontal: 14,
          paddingVertical: 11,
          marginVertical: 12,
        }}
      >
        {data.images ? (
          <TouchableOpacity>
            <Image
              source={data.images}
              style={{ height: 23, width: 23, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        ) : null}
        <View style={{ flexDirection: "column", flex: 1, paddingStart: 8 }}>
          <Text
            style={{
              fontSize: 18,
              paddingStart: 10,
              color: data.color ? data.color : "#000000",
              fontFamily: "NotoSans",
            }}
          >
            {data.title}
          </Text>

          <Text
            style={{
              flexWrap: "wrap",
              fletextAlign: "justify",
              fontSize: 12,
              paddingStart: 10,
              color: "#7c7c7c",
              fontFamily: "NotoSans",
              marginRight: 10,
            }}
          >
            {data.description}
          </Text>
        </View>
        {data.right_side_images ? (
          <TouchableOpacity>
            <Image
              source={data.right_side_images}
              style={{ height: 23, width: 23, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          translucent={true}
          backgroundColor="#dcdcdc"
        />
        <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
          {/* for HEADER */}
          <SettingsHeader
            {...this.props}
            bgImage={null}
            bgColor={"white"}
            cursorColor={"#0869d8"}
            tintColor={"#0b69d8"}
            title={null}
            description={"Settings"}
            titleColor={null}
            descriptionColor={"#3D3D3D"}
            placeholderTextColor={"#000000"}
            placeTextColor={"#000000"}
            placeholderTextSize={20}
            //this.props.placeholderTextColor ? this.props.placeholderTextColor :
            leftImage={Black_back}
            rightImage={null}
            rightImageCross={ic_note_delete}
            isSearchBoxShowing={this.state.isSearchBoxShowing}
            type={5}
            searchAction={(text) => this.searchAction(text)}
            leftImageOnClick={() => this.leftImageOnClick()}
            rightImageOnClick={null}
          />

          <View style={{ width: Dimensions.get('window').width }}>
            <FlatList
              data={this.state.arrayholder}
              renderItem={({ item }) => this.Item(item)}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{}}
            />
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  doctorProfile: state.doctorProfile,
});

const mapDispatchToProps = (dispatch) => ({
  get_outofclinic_time_and_date: (data) =>
    dispatch(get_outofclinic_time_and_date(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
const styles = StyleSheet.create({
  view_style: {
    flexDirection: "row",
    backgroundColor: "#008be0",
    height: 60,
  },
  Optometry_Record: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "left",
  },
  step_2_5: {
    fontSize: 12,
    color: "#ffffff",
  },
  Next: {
    height: 18,
    color: "#ffffff",
    textAlign: "center",
    resizeMode: "contain",
  },
  content_container: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
  },
  content_color: {
    color: "#383838",
    fontWeight: "600",
    fontSize: 16,
  },
  Next_blue: {
    height: 15,
    color: "#ffffff",
    textAlign: "center",
    resizeMode: "contain",
  },
});
