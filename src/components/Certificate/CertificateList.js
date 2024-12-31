import React from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { getScreenNameAnalytics } from "../../commonmethods/analytics";
import {
  NotoSans,
  NotoSans_BoldItalic,
  NotoSans_Italic,
  NotoSans_Bold,
} from "../../constants/font";
import { ic_blue_arrow, ic_close_button } from "../../constants/images";
import multipleTapHandler from "../MultiTapHandle/index";
export default class CertificateList extends React.Component {
  constructor(props) {
    super(props);
    this.db = this.props.databaseContext.db;
    this.state = {
      certifates: [],
    };
  }
  componentDidMount() {
    multipleTapHandler.clearNavigator();
    getScreenNameAnalytics({
      screen_name: "SelectCertificate",
      screen_class: "CertificateList",
    });
    this.getDbData();
  }
  renderItem(data, inndex) {
    return (
      <TouchableOpacity
        onPress={() =>
          multipleTapHandler.multitap(
            () => this.setSelectedCertificate(data.item),
            "CertificateInputForm"
          )
        }
        style={{
          backgroundColor: "#ffffff",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <Text style={{ fontFamily: NotoSans, color: "#444444", fontSize: 16 }}>
          {data.item.name}
        </Text>
        <Image
          source={ic_blue_arrow}
          style={{ resizeMode: "contain", width: 15, height: 15 }}
        />
      </TouchableOpacity>
    );
  }
  ItemSeprator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#cdcdcd",
        }}
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#F7F7F7", width : Dimensions.get('window').width }}>
        <FlatList
          data={this.state.certifates}
          renderItem={(item, index) => this.renderItem(item, index)}
          keyExtractor={(item) => item.cert_id}
          extraData={this.state}
          ItemSeparatorComponent={this.ItemSeprator}
          ListFooterComponent={this.ItemSeprator}
        ></FlatList>
      </View>
    );
  }
  //Methods

  getDbData() {
    this.db.transaction((tx) => {
      let query = "SELECT DATA FROM MasterData where Srno = 15";
      tx.executeSql(
        query,
        [],
        (tx, result) => {
          let resData = result.rows.raw()[0];
          let certiData = JSON.parse(resData.Data);

          certiData = certiData.Value;
          this.setState({
            certifates: certiData,
          });
        },
        (error) => {}
      );
    });
  }
  setSelectedCertificate(item) {
    this.props.clearCertificate();
    this.props.setCertificateType(item);
    this.props.navigation.navigate("CertificateInputForm");
  }
}
