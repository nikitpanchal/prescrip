import React, { Component } from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';


//Local imported components
import SideBar from "../containers/SlidebarContainer";
import Home from "../containers/HomeContainer";
import Modal from "../containers/ModalContainer";

import AdditionalAssessmentContainer from '../containers/AdditionalAssessmentContainer';
import { View, Text } from "react-native";
import PrescriptionPreviewHome from '../containers/PrescriptionPreviewContainer/PrescriptionPreviewHome';
import LaboratoryContainer from '../containers/LaboratoryContainer/LaboratoryContainer';
import AddLaboratoryContainer from '../containers/AddLaboratoryContainer/AddLaboratoryContainer';
import AttachmentsContainer from '../containers/Finding/AttachmentsContainer';

const Drawer = createDrawerNavigator();

const MyDrawerNavigator =
{
  Home: { screen: Home },
  Modal: { screen: Modal },
  AttachmentsContainer: { screen: AttachmentsContainer },
  AdditionalAssessmentContainer: { screen: AdditionalAssessmentContainer },
  PrintPreview: { screen: PrescriptionPreviewHome },
  LaboratoryContainer: { screen: LaboratoryContainer },
  PharmacyContainer: { screen: LaboratoryContainer },
  SpecialistContainer: { screen: LaboratoryContainer },
  AddLaboratoryContainer: { screen: AddLaboratoryContainer },
  AddSpecialistContainer: { screen: AddLaboratoryContainer },
  AddPharmacyContainer: { screen: AddLaboratoryContainer },

};
//   {
//     initialRouteName: "Home",
//     drawerWidth: Platform.isPad ? "50%" : "65%",
//     //contentComponent: props => <SideBar {...props} />
//   }
// );
const dd = [];
Object.keys(MyDrawerNavigator).forEach(element => {
  dd.push(<Drawer.Screen
    name={element}
    component={MyDrawerNavigator[element].screen}
    options={{
      headerBackVisible: false,
      headerShown: false
    }}
  />)
});

function MyDrawer() {
  return <Drawer.Navigator screenOptions={{
    drawerStyle: {
      backgroundColor: '#fff', flex: 1

    },
    contentStyle: { backgroundColor: '#fff',width: '100%', height:'100%'  }
   
   
  }} initialRouteName="Home" drawerContent={(props) => <SideBar {...props} />}>
    {dd}
  </Drawer.Navigator>
};


export default MyDrawer
