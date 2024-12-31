
import { Alert, Linking } from "react-native";
import Drawer from "./DrawerNavigator";
//import ChangePassword from "./../components/pages/ChangePasword"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import MyReward from "./../components/Myvsreward"
//import Loyaltypoints from "./../components/Loyaltypoints"
//Ravi Pages
import NoNetwork from "../components/NoNetwork/NetworkGlobal";
import VCWhatsAppNumberContainer from "../containers/VideoConsultation/VCWhatsAppNumberContainer";
import VCConsultationFeeContainer from "../containers/VideoConsultation/VCConsultationFeeContainer";

import VCSideBar from "../components/VCSidebar/VCSidebar";

import EditViewContainer from "../containers/DoctorProfileContainer/EditViewContainer";
import DoctorProfileViewContainer from "../containers/DoctorProfileContainer/DoctorProfileViewContainer";
import PatientProfileViewContainer from "../containers/DoctorProfileContainer/PatientProfileViewContainer";
import EditDoctorDetails from "../containers/EditDoctorDetails/EditDoctorDetails";

//Sourabh Pages
import PaymentReceiptContainer from "../containers/PaymentReceiptContainer/PaymentReceiptContainer";
import BankDetailContainer from "../containers/BankDetailContainer/BankDetailContainer";


import ReviewClinicContainer from "../containers/ReviewClinicContainer/ReviewClinicContainer";
import ChiefComplaintContainer from "../containers/ChiefComplaintContainer/ChiefCompliantContainer";
import PrescriptionWebView from "../containers/PrescriptionWebView/PrescriptionWebView";

import AddBillingReceiptContainer from "../containers/AddBillingReceiptContainer/AddBillingReceiptContainer";
import PatientBillingReceiptContainer from "../containers/PaymentReceiptContainer/PatientBillingReceiptContainer";

//IVR FLOW
import { navigationRef } from '../components/NoNetwork/RootNavigation';
import IvMyPatientsScreen from "../containers/IvrFlow/IvMyPatientsScreen";
import IvBookApp from "../containers/IvrFlow/IvBookApp";
import IvSuccess from "../containers/IvrFlow/IvSuccess";

//Pritish sir Pages
import OperatingHoursContainer from "../containers/ClinicOperatingHours/OperatingHours";
import PatientVisitHistoryContainer from "../containers/PatientVisitHistoryContainer/PatientVisitHistoryContainer";

//Ruben Pages
import AppointmentContactContainer from "../containers/AppointmentsContainer/AppointmentContactContainer";
import AppointmentMapContainer from "../containers/AppointmentsContainer/AppointmentMapContainer";
import PrescriptionPreviewHome from "../containers/PrescriptionPreviewContainer/PrescriptionPreviewHome";
import PrescriptionPreviewSetting from "../containers/PrescriptionPreviewContainer/PrescriptionPreviewSetting";
import CertificatePreviewHome from "../containers/CertificatePreviewContainer/CertificatePreviewHome";
import CertificateFavContainer from "../containers/CertificateFavContainer/CertificateFavContainer";
import FollowUpContainer from "../containers/FollowUpContainer/FollowUpContainer";

import ShareContainer from "../containers/Share/ShareContainer";
import ShareBAContainer from "../containers/Share/ShareBAContainer";
import CongratsClinicContainer from "../containers/CongratsClinic/CongratsClinicContainer";
import DoctorClinicAPContainer from "../containers/CongratsClinic/DoctorClinicAPContainer";
import PatientClinicAPContainer from "../containers/CongratsClinic/PatientClinicAPContainer";
import AddPatientContainer from "../containers/AddPatientContainer";
import FlatlistSearchContainer from "../containers/FlatlistSearchContainer/FlatlistSearchHabitContainer";
import FlatlistSearchHistoryContainer from "../containers/FlatlistSearchContainer/FlatlistSearchHistoryContainer";
import FlatlistSearchAllergyContainer from "../containers/FlatlistSearchContainer/FlatlistSearchAllergyContainer";
import AttachmentsContainer from "../containers/Finding/AttachmentsContainer";
import SeachFindingsContainer from "../containers/Finding/SeachFindingsContainer";
import AdditionalAssessmentContainer from "../containers/AdditionalAssessmentContainer";
import FinalPrescriptionContainer from "../containers/FinalPrescriptionContainer/FinalPrescriptionContainer";

import LogoutSocketHandler from "../components/NoNetwork/LogoutSocketHandler";

import LaboratoryContainer from "../containers/LaboratoryContainer/LaboratoryContainer";
import AddLaboratoryContainer from "../containers/AddLaboratoryContainer/AddLaboratoryContainer";
import SelectMedication from "../containers/AddMedication/SelectMedicine";
//Demo
import DatabaseDemo from "../containers/DatabaseDemo";
import ListMedication from "../containers/AddMedication/ListMedication";
import PatientNotes from "../containers/PatientNotes";
import DataSync from "../containers/DataSyncContainer";
import UseFavourite from "../containers/UseFavourite/UseFavourite";

//Settings
import SettingsContainer from "../containers/Settings/SettingsContainer";
import SettingsVideoConsultationContainer from "../containers/Settings/SettingsVideoConsultationContainer";
import SettingsClinicConsultation from "../containers/Settings/SettingsClinicConsultation";
import SettingsNotification from "../containers/Settings/SettingsNotification";
import SettingsPrintWebDevices from "../containers/Settings/SettingsPrintWebDevices";
import SettingsClinicNameConsultation from "../containers/Settings/SettingsClinicNameConsultation";
import OutClinicDateSlots from "../containers/Settings/OutClinicDateSlots";
import OutClinicTimeSlots from "../containers/Settings/OutClinicTimeSlots";
import SettingsAddOutOfClinicText from "../containers/Settings/SettingsAddOutOfClinicText";
import SettingsAddOutOfClinicNew from "../containers/Settings/SettingsAddOutOfClinicNew";
import SelectClinicHospital from "../containers/Settings/SelectClinicHospital";
import OutClinicTimeSlotsNew from "../containers/Settings/OutClinicTimeSlotsNew";
import DeleteSelectedClinic from "../containers/Settings/DeleteSelectedClinic";
import SettingsSubscription from "../containers/Settings/SettingsSubscription";
import SettingsSubscriptionDetails from "../containers/Settings/SettingsSubscriptionDetails";
import SettingsSubscriptionWeb from "../containers/Settings/SettingsSubscriptionWeb";
//Manage Assistant
import ManageAssistantHome from "../containers/ManageAssistant/ManageAssistantHome";
import AssistantDetails from "../containers/ManageAssistant/AssistantDetails";
import ManageAssistantClinic from "../containers/ManageAssistant/ManageAssistantClinic";
import AssistantType from "../containers/ManageAssistant/AssistantType";
import AssistantSuccess from "../containers/ManageAssistant/AssistantSuccess";

//Certificate
import SelectCertificate from "../containers/CeritificateContainer";
import CertificateInputForm from "../containers/CeritificateContainer/InputForm";
import ItemPicker from "../containers/CeritificateContainer/ItemPicker";
//Scan Qr Code
import ScanQrCode from "../components/ScanQrCode/index";
import DocumentViewer from "../components/CommonComponents/DocumentViewer";
import ShowVisitHistory from "../containers/ShowVisitDetails";


import PatientSearchComponent from "../components/PatientComponent/PatientSearchComponent";
import OpthalHome from "../containers/OpthalContainer/OpthalHome";
import More from "../containers/OpthalContainer/More";
import OpthalList from "../components/Opthal/OpthalList";

import BillingContainer from "../containers/BillingContainer/BillingContainer";
import AppointmentTypesContainer from "../containers/AppointmentsContainer/AppointmentTypesContainer";
import NoSubscription from "../components/NoNetwork/NoSubscription";

import Home from "../containers/HomeContainer";

import Loading from "../containers/LoadingContainer";
import Login from "../containers/LoginContainer";
import RegisterContainer from "../containers/LoginContainer/RegisterContainer";
import DigiConsultationSetupContainer from "../containers/LoginContainer/DigiConsultationSetupContainer";
import OTPContainer from "../containers/LoginContainer/OTPContainer";
import SpecializationContainer from "../containers/LoginContainer/SpecializationContainer";
import VideoConsultContainer from "../containers/LoginContainer/VideoConsultContainer";
import CongratsContainer from '../containers/LoginContainer/CongratsContainer';
import WhatsAppNumContainer from '../containers/LoginContainer/WhatsAppNumContainer';
import ConsultationFeeContainer from '../containers/LoginContainer/ConsultationFeeContainer';
import LandingScreen from '../components/Login/LandingScreen';
import WhatsNewContainer from '../containers/WhatsNewContainer/WhatsNewContainer'
import AppointmentContainer from '../containers/AppointmentContainer/AppointmentContainer'
import AbhaConsentCollection from '../containers/ABHA/M1/AbhaCreation/ConsentCollection';
import AadharAuthentication from "../containers/ABHA/M1/AbhaCreation/AadharAuthentication";
import AadharDetails from "../containers/ABHA/M1/AbhaCreation/AadharDetails";
import CreateAbhaAddress from "../containers/ABHA/M1/AbhaCreation/CreateAbhaAddress";
import VerifyAbhaAddress from "../containers/ABHA/M1/AbhaCreation/VerifyAbhaAddress";
import AddCareContext from "../containers/ABHA/M1/AbhaCreation/AddCareContext";
import LinkMobileWithAbha from "../containers/ABHA/M1/AbhaCreation/LinkMobileWithAbha";
const Stack = createNativeStackNavigator();
const config = {
  screens: {
    "SettingsSubscription": 's',
    
  },
};

const linking = {
  prefixes: ["https://rx.prescrip.in/app"],
  config
   
};
let screens =
{
  // Home: { screen: Home },
  Drawer: { screen: Drawer },
  ForceUpdateContainer: { screen: WhatsNewContainer },
  VCWhatsAppNumberContainer: { screen: VCWhatsAppNumberContainer },
  VCConsultationFeeContainer: { screen: VCConsultationFeeContainer },
  VCSideBar: { screen: VCSideBar },
  AppointmentContainer: { screen: AppointmentContainer },
  ReviewClinicContainer: { screen: ReviewClinicContainer },
  AppointmentContactContainer: { screen: AppointmentContactContainer },
  AppointmentMapContainer: { screen: AppointmentMapContainer },
  AppointmentTypesContainer: { screen: AppointmentTypesContainer },
  PrescriptionPreviewHome: { screen: PrescriptionPreviewHome },
  PrescriptionPreviewSetting: { screen: PrescriptionPreviewSetting },
  EditDoctorDetails: { screen: EditDoctorDetails },
  AddPatientContainer: { screen: AddPatientContainer },
  FlatlistSearchContainer: { screen: FlatlistSearchContainer },
  FlatlistSearchHistoryContainer: { screen: FlatlistSearchHistoryContainer },
  FlatlistSearchAllergyContainer: { screen: FlatlistSearchAllergyContainer },
  FollowUpContainer: { screen: FollowUpContainer },
  OperatingHours: { screen: OperatingHoursContainer },
  ShareContainer: { screen: ShareContainer },
  ShareBAContainer: { screen: ShareBAContainer },
  DoctorClinicAPContainer: { screen: DoctorClinicAPContainer },
  CongratsClinicContainer: { screen: CongratsClinicContainer },
  PatientClinicAPContainer: { screen: PatientClinicAPContainer },
  EditViewContainer: { screen: EditViewContainer },
  DoctorProfileViewContainer: { screen: DoctorProfileViewContainer },
  PatientProfileViewContainer: { screen: PatientProfileViewContainer },
  PatientVisitHistoryContainer: { screen: PatientVisitHistoryContainer },
  DatabaseDemo: { screen: DatabaseDemo },
  PrescriptionWebView: { screen: PrescriptionWebView },
  CertificateFavContainer: { screen: CertificateFavContainer },
  PatientBillingReceiptContainer: { screen: PatientBillingReceiptContainer },

  AddBillingReceiptContainer: { screen: AddBillingReceiptContainer },
  LogoutSocketHandler: { screen: LogoutSocketHandler },
  /* Modules Findings, Investigation, ChiefComplaints, LabTest, Advice, Diagnosis */
  FindingsContainer: { screen: SeachFindingsContainer },
  DiagnosisContainer: { screen: SeachFindingsContainer },
  ProviderContainer: { screen: SeachFindingsContainer },
  InvestigationContainer: { screen: SeachFindingsContainer },
  AdviceContainer: { screen: SeachFindingsContainer },
  RecommendedLabTestContainer: { screen: SeachFindingsContainer },
  AttachmentsContainer: { screen: AttachmentsContainer },
  AdditionalAssessmentContainer: { screen: AdditionalAssessmentContainer },

  //AddSpecialistContainer: { screen: AddSpecialistContainer },
  AdditionalAssessmentContainer: { screen: AdditionalAssessmentContainer },
  ChiefComplaintContainer: { screen: ChiefComplaintContainer },
  PrescriptionPreviewHome: { screen: PrescriptionPreviewHome },
  LaboratoryContainer: { screen: LaboratoryContainer },
  PharmacyContainer: { screen: LaboratoryContainer },
  SpecialistContainer: { screen: LaboratoryContainer },
  AddLaboratoryContainer: { screen: AddLaboratoryContainer },
  AddSpecialistContainer: { screen: AddLaboratoryContainer },
  AddPharmacyContainer: { screen: AddLaboratoryContainer },
  PrintPreview: { screen: PrescriptionPreviewHome },
  CertificatePrintPreview: { screen: CertificatePreviewHome },
  PrescriptionPreviewSetting: { screen: PrescriptionPreviewSetting },
  FinalPrescriptionContainer: { screen: FinalPrescriptionContainer },
  UseFavourite: { screen: UseFavourite },
  PaymentReceiptContainer: { screen: PaymentReceiptContainer },
  BankDetailContainer: { screen: BankDetailContainer },

  //IVR
  IvMyPatientsScreen: { screen: IvMyPatientsScreen },
  IvBookApp: { screen: IvBookApp },
  IvSuccess: { screen: IvSuccess },

  BillingContainer: { screen: BillingContainer },
  /*Settings*/
  SettingsContainer: { screen: SettingsContainer },
  SettingsVideoConsultationContainer: {
    screen: SettingsVideoConsultationContainer,
  },
  SettingsSubscription: {
    screen: SettingsSubscription,
  },
  SettingsSubscriptionDetails: {
    screen: SettingsSubscriptionDetails,
  },
  SettingsSubscriptionWeb: {
    screen: SettingsSubscriptionWeb,
  },
  SettingsClinicConsultation: { screen: SettingsClinicConsultation },
  SettingsNotification: { screen: SettingsNotification },
  SettingsPrintWebDevices: { screen: SettingsPrintWebDevices },
  SettingsClinicNameConsultation: { screen: SettingsClinicNameConsultation },
  OutofClinicDateSlots: { screen: OutClinicDateSlots },
  OutofClinicTimeSlots: { screen: OutClinicTimeSlots },
  SettingsAddOutOfClinicText: { screen: SettingsAddOutOfClinicText },
  SettingsAddOutOfClinicNew: { screen: SettingsAddOutOfClinicNew },
  SelectClinicHospital: { screen: SelectClinicHospital },
  OutClinicTimeSlotsNew: { screen: OutClinicTimeSlotsNew },
  DeleteSelectedClinic: { screen: DeleteSelectedClinic },
  ManageAssistantHome: { screen: ManageAssistantHome },
  AssistantDetails: { screen: AssistantDetails },
  ManageAssistantClinic: { screen: ManageAssistantClinic },
  AssistantType: { screen: AssistantType },
  AssistantSuccess: { screen: AssistantSuccess },

  /** Medication */
  SelectMedication: { screen: SelectMedication },
  ListMedication: { screen: ListMedication },
  /** Notes */
  PatientNotes: { screen: PatientNotes },
  DataSync: { screen: DataSync },

  /** Certificate */
  SelectCertificate: { screen: SelectCertificate },
  CertificateInputForm: { screen: CertificateInputForm },
  ItemPicker: { screen: ItemPicker },
  /** ScanQrCode */
  ScanQrCode: { screen: ScanQrCode },
  DocumentViewer: { screen: DocumentViewer },
  ShowVisitHistory: { screen: ShowVisitHistory },

  PatientSearchComponent: { screen: PatientSearchComponent },
  //Opthal
  OpthalHome: { screen: OpthalHome },
  More: { screen: More },
  OpthalList: { screen: OpthalList },
  Login: { screen: Login },
  Loading: { screen: Loading },
  NoSubscription: { screen: NoSubscription },
  Register: { screen: RegisterContainer, },
  OTP: { screen: OTPContainer },
  RegisterSpecialization: { screen: SpecializationContainer },
  RegisterVideoConsultation: { screen: VideoConsultContainer },
  AppointmentContainer: { screen: AppointmentContainer },
  RegistrationSuccess: { screen: CongratsContainer },
  DigiConsultationSetupContainer: { screen: DigiConsultationSetupContainer },

  WhatsAppNumContainer: { screen: WhatsAppNumContainer },
  ConsultationFeeContainer: { screen: ConsultationFeeContainer },
  LandingScreen: { screen: LandingScreen },
  ForceUpdateContainer: { screen: WhatsNewContainer },
  AbhaConsentCollection: { screen: AbhaConsentCollection },
  AadharAuthentication: { screen: AadharAuthentication },
  AadharDetails: { screen: AadharDetails },
  CreateAbhaAddress: { screen: CreateAbhaAddress },
  AddCareContext: { screen: AddCareContext },
  VerifyAbhaAddress: { screen: VerifyAbhaAddress },
  LinkMobileWithAbha: { screen: LinkMobileWithAbha }
};
const dd = []
 Object.keys(screens).forEach(element => {
  
  dd.push(<Stack.Screen
    name={element}
    component={screens[element].screen}
    options={{
      gestureEnabled: element == "SettingsSubscriptionWeb" ? false : true,
      headerBackVisible: false,
      headerShown: false
    }}
  />)
});

function MyStackNavigator() {
  return <NavigationContainer independent={true} linking={linking}>

    <Stack.Navigator screenOptions={{
      contentStyle: { backgroundColor: '#fff', width: '100%', height: '100%' }
    }} initialRouteName="Loading">
      {dd}
    </Stack.Navigator>
  </NavigationContainer>
};

export default MyStackNavigator;
