//This is an example code for SectionList//
import React, { Component } from 'react';
//import react in our code.
import {
  StyleSheet,
  View,
  SectionList,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { getCurreny } from '../../commonmethods/validation';
//import all the components we are going to use.
import multipleTapHandler from '../../components/MultiTapHandle/index';
import { S3BaseUrl } from '../../../app.json';
import { calculateAge, Difference_In_Days1 } from '../../commonmethods/common';
export default class BillingComponent extends Component {
  GetSectionListItem = (item) => {
    //Function for click on an item
  };
  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={{ height: 0.5, width: '100%' }} />
    );
  };

  Item(item, index) {
    let age = calculateAge(item.DOB, false);
    var delProv = this.props.doctorProfile.DoctorData.IsAssistant != 1;
    return (
      <TouchableOpacity
        style={styles.content_container}
        onLongPress={() => {
          delProv ?
            this.props.itemLongClick(item) : null;
        }}
        onPress={() => multipleTapHandler.multitap(
          () => this.props.onPatientClick(item),
          "PatientVisitHistoryContainer"
        )}>
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <View
            style={{
              marginRight: 20,
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              backgroundColor: true ? '#3eb88a' : '#2ca4c1',
              borderRadius: 15,
            }}>
            {item.Userimage == '' ? (
              <Image
                source={this.props.imagePath}
                style={{
                  resizeMode: 'cover',
                  alignSelf: 'center',
                  width: 40,
                  height: 40,
                  borderColor: 'white',
                  borderWidth: 2,
                  borderRadius: 5,
                }}></Image>
            ) : (
              <Image
                source={{ uri: S3BaseUrl + 'patientimg/' + item.Userimage }}
                style={{
                  resizeMode: 'cover',
                  alignSelf: 'center',
                  width: 40,
                  height: 40,
                  borderColor: 'white',
                  borderWidth: 2,
                  borderRadius: 5,
                }}></Image>
            )}
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'column',
            }}>
            <Text
              style={{ color: '#0066D7', fontSize: 20, fontFamily: 'NotoSans' }}>
              {item.FullName}
            </Text>

            <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}>
                <Text style={{ color: '#555454', fontSize: 16 }}>
                  {age.value + ' ' + age.units}
                </Text>
                <Text style={{ color: '#555454', fontSize: 18 }}>{'  |  '}</Text>
                <Text style={{ color: '#555454', fontSize: 16 }}>
                  {item.Gender}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SectionList
          ItemSeparatorComponent={this.FlatListItemSeparator}
          sections={this.props.finalArrayAfterTabClick}
          //stickySectionHeadersEnabled={false}
          scrollEnabled={true}
          refreshing={this.props.refresh}
          onRefresh={() => this.props.onRefresh()}
          stickySectionHeadersEnabled={true}
         
          renderSectionHeader={({ section }) => (
            <View style={{ backgroundColor: '#FAFAFA' }}>
              <Text style={styles.SectionHeaderStyle}>
                {this.props.isRecent == 0
                  ? 'All Patients'
                  : section.title == 'Older'
                    ? section.title + ' (' + section.data.length + ')'
                    : Difference_In_Days1(section.data[0].LastSeen) == 0
                      ? 'Today (' + section.data.length + ')'
                      : Difference_In_Days1(section.data[0].LastSeen) == 1
                        ? 'Yesterday (' + section.data.length + ')'
                        : section.title + ' (' + section.data.length + ')'}
              </Text>
            </View>
          )}
          renderItem={({ item, index }) => this.Item(item, index)}
          ListFooterComponent={
            this.props.finalArrayAfterTabClick.length > 0 ? (
              <TouchableOpacity
                style={{ backgroundColor: '#fff' }}
                onPress={() => this.props.rightImageOnClick()}>
                <Text
                  style={{
                    marginVertical: 5,
                    fontFamily: 'NotoSans',
                    color: '#0066D7',
                    fontSize: 18,
                    alignSelf: 'center',
                  }}>
                  {'View All'}
                </Text>
              </TouchableOpacity>
            ) : null
          }
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  SectionHeaderStyle: {
    fontSize: 14,
    padding: 5,
    marginLeft: 10,
    marginVertical: 8,
    color: '#4c4c4c',
    fontFamily: 'NotoSans',
  },
  view_style: {
    flexDirection: 'row',
    backgroundColor: '#008be0',
    height: 60,
  },
  Optometry_Record: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  step_2_5: {
    fontSize: 12,
    color: '#ffffff',
  },
  Next: {
    height: 18,
    color: '#ffffff',
    textAlign: 'center',
    resizeMode: 'contain',
  },
  content_container: {
    flexDirection: 'column',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1, width: Dimensions.get('window').width
  },
  content_color: {
    color: '#383838',
    fontWeight: '600',
    fontSize: 16,
  },
  Next_blue: {
    height: 15,
    color: '#ffffff',
    textAlign: 'center',
    resizeMode: 'contain',
  },
});
