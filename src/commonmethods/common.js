import { Alert, Linking } from 'react-native';

export const generateGuid = () => {
  var result, i, j;
  result = '';
  for (j = 0; j < 32; j++) {
    if (j == 8 || j == 12 || j == 16 || j == 20) result = result + '-';
    i = Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
    result = result + i;
  }
  return result;
};

export const Difference_In_Days = (date) => {
  // To set two dates to two variables
  var date1 = new Date(date);
  var date2 = new Date();

  // To calculate the time difference of two dates
  // var Difference_In_Time = date2.getTime() - date1.getTime();

  var diffD = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));

  // To calculate the no. of days between two dates
  // var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  return diffD;
};

export const Difference_In_Days1 = (date) => {
  var ogDate = new Date(date);
  var todayDate = new Date();
  let date1 = new Date(ogDate.getFullYear(), ogDate.getMonth(), ogDate.getDate());

  let date2 = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  //Alert.alert(todayDate.toString())
  // To calculate the time difference of two dates
  let Difference_In_Time = date2.getTime() - date1.getTime();
  
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  // const diffTime = Math.abs(date2 - date1);
 // Alert.alert(Difference_In_Days.toString())
  // //var diffD = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));

  // // To calculate the no. of days between two dates
  // let Difference_In_Days = Math.ceil(diffTime / (1000 * 3600 * 24));

  return Difference_In_Days;
};

export const calculateAge = (date, input) => {
  if (!date) {
    age = {
      value: 0,
      units: 'Years',
    };
    return age;
  }
  let nowmill = new Date();
  let dobmill = new Date(date);
  let ageinmilli = nowmill.valueOf() - dobmill.valueOf();

  //Age varible
  let years = Math.floor(ageinmilli / 31536000000);

  let days = Math.floor((ageinmilli % 31536000000) / 86400000);
  let months = Math.floor(days / 30);
  days = days % 30;

  let age = {};
  if (input) {
    if (years > 0) {
      age = {
        value: years,
        units: 'Years',
      };
    } else if (months > 0) {
      age = {
        value: months,
        units: 'Months',
      };
    } else {
      age = {
        value: days,
        units: 'Days',
      };
    }
  } else {
    if (years > 2) {
      age = {
        value: years,
        units: 'Years',
      };
    } else if (years <= 2 && years > 0) {
      age = {
        value: years * 12 + months,
        units: 'Months',
      };
    } else if (months > 0) {
      age = {
        value: months,
        units: 'Months',
      };
    } else {
      age = {
        value: days,
        units: 'Days',
      };
    }
  }

  return age;
};
export const getDOB = (ageObj) => {
  let date = null;
  let age = isNaN(parseInt(ageObj.value)) ? 0 : parseInt(ageObj.value);
  let units = ageObj.units;
  if (age == NaN) {
    age = 0;
  }
  let currentDate = new Date();
  let ageDate = null;
  switch (units) {
    case 'Days':
      ageDate = currentDate.getDate() - age;
      currentDate.setDate(ageDate);
      break;
    case 'Months':
      ageDate = currentDate.getMonth() - age;
      currentDate.setMonth(ageDate);
      break;
    case 'Years':
      ageDate = currentDate.getFullYear() - age;
      currentDate.setFullYear(ageDate);
      break;
  }

  return currentDate;
};

export const sendToApps = (link, apptype) => {
  if (!isUndefined(link)) {
    Linking.canOpenURL(link)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            'Please install ' +
            apptype +
            ' to send direct message to students via whatsapp',
          );
        } else {
          return Linking.openURL(link);
        }
      })
      .catch((err) => { });
  } else {
  }
};
export const Gpal = {
  Gravida: '',
  Para: '',
  Abortus: '',
  Living: '',
  Surgery: '',
  Menarch: '',
  MenustrationCycle: '',
  Duration: '',
  BleedingDuration: '',
  BleedingType: '',
  BleedingPeriods: '',
  BleedingIntercourse: '',
  MenustralPain: '',
  LMP: '',
  Pregnant: false,
  GestationalAge: '',
  EDD: '',
};
export const def_prescription = {
  _id: '',
  PatientID: '',
  DoctorID: '',
  DoctorHeaderDetails: {
    Logo: '',
    Specialist: '',
    Qualification: '',
    MICRNo: '',
    CouncilName: '',
    Signature: '',
    DisplayLabel: {
      ChiefComplaints: 'Chief Complaints',
      History: 'History',
      Findings: 'Findings',
      Investigation: 'Investigation',
      LabTest: 'LabTest',
      Notes: 'Notes',
      Diagnosis: 'Diagnosis',
      Prescription: 'Prescription',
      'Display Generic Name': 'Display Generic Name',
      Advice: 'Advice',
      Followup: 'Followup',
      DoctorDetails: 'Doctor Details',
      DigitalImageSignature: 'Digital Image Signature',
    },
    DoctorEmail: '',
    Clinic: [],
  },
  DoctorFooterDetails: '',
  PaperSettings: {
    IsBW: 0,
    Margin: ['10', '10', '10', '10'],
    papername: 'A4',
    body: 1,
    TemplateFontSize: '16',
    header: 1,
    footer: 1,
  },
  Allergy: [],
  PatientDetails: {
    Height: ' ',
    Weight: ' ',
    BMI: '',
    Mobile: '',
    ReferralDrrName: '',
    PatientId: '',
    Address: '',
    id: 1,
    FullName: '',
    Age: '',
    EmailAddress: '',
  },
  PersonalHistory: [],
  FamilyHistory: [],
  Habits: '',
  ChiefComplaints: [],
  Findings: [],
  Investigation: [],
  Diagnosis: [],
  Provider: [],
  RecommendedLabTest: [],
  Notes: '',
  Advice: [],
  PrescriptionList: [],
  ViewCount: 0,
  FollowupDate: null,
  Language: 'English',
  Reminder: 0,
  SOSReport: 0,
  ReferredDoctorDetails: null,
  ReferredPharmacyDetails: null,
  ReferredPathLabDetails: null,
  MedicineReminder: null,
  DisplayPreferences: [
    'Chief Complaints',
    'Patient History / Family History',
    'On Examination / Findings',
    'Investigations',
    'Recommend Clinical Tests',
    'Diagnosis',
    'Notes',
    'Prescription',
    'Display Generic Name',
    'Advice',
    'Follow up',
    'Doctor Details',
    'Digital Image Signature',
  ],
  WhenEntered: '',
  IsActive: 1,
  url: '',
  ConsultType: 1,
  CertificateData: '',
  CertificateType: '',
  EditedOn: null,
  Favourite: '',
  FollowUpText: null,
  Gpal: null,
  IsFavourite: 0,
  IsNotes: 0,
  IsPrint: false,
  LastSeen: '',
  PatientHabits: [],
  Type: 'Homeopathic Doctor',
  WhenFavourite: null,
  sms: null,
};

export const offline_def_prescription = {
  _id: '',
  PatientID: '',
  DoctorID: '',
  DoctorHeaderDetails: {
    Logo: '',
    DoctorEmail: '',
    DoctorName: '',
    Specialist: '',
    Qualification: '',
    MICRNo: '',
    CouncilName: '',
    Clinic: [],
    DisplayLabel: {
      ChiefComplaints: 'Chief Complaints',
      History: 'History',
      Findings: 'Findings',
      Investigation: 'Investigation',
      LabTest: 'Recommended Cinical Tests',
      Notes: 'Notes',
      Diagnosis: 'Diagnosis',
      Prescription: 'Rx',
      DisplayGenericName: 'Display Generic Name',
      Advice: 'Advice',
      Followup: 'Follow Up',
      DigitalImageSignature: 'Digital Image Signature',
    },
    Signature: '',
  },
  DoctorFooterDetails: '',
  PaperSettings: {
    IsBW: 0,
    Margin: [30, 10, 10, 10],
    TemplateFontSize: '14',
    papername: 'A4',
    papersize: ['210', '297'],
    header: 1,
    footer: 1,
    body: 1,
  },
  Allergy: [],
  PatientDetails: {
    id: -1,
    FullName: '',
    Age: '',
    Height: '',
    Weight: '',
    BMI: '',
    Mobile: '',
    Gender: '',
    ReferralDrrName: '',
    PatientId: '',
    EmailAddress: '',
    Address: '',
  },
  FamilyHistory: [],
  Habits: '',
  ChiefComplaints: [],
  Findings: [],
  Investigation: [],
  Diagnosis: [],
  Notes: '',
  Advice: [],
  RecommendedLabTest: [],
  FollowupDate: '',
  Language: 'English',
  Reminder: 0,
  SOSReport: 0,
  PrescriptionList: [],
  ViewCount: 0,
  IsPrint: false,
  sms: 0,
  ReferredDoctorDetails: null,
  ReferredPharmacyDetails: null,
  ReferredPathLabDetails: null,
  WhenEntered: '',
  IsActive: 1,
  EditedOn: null,
  Favourite: '',
  IsFavourite: 0,
  WhenFavourite: null,
  IsNotes: 0,
  DisplayPreferences: [
    'Chief Complaints',
    'Patient History / Family History',
    'On Examination / Findings',
    'Investigations',
    'Recommend Clinical Tests',
    'Diagnosis',
    'Notes',
    'Prescription',
    'Display Generic Name',
    'Advice',
    'Follow up',
    'Doctor Details',
    'Digital Image Signature',
  ],
  PatientHabits: [],
  PersonalHistory: [],
  LastSeen: '',
  Type: '',
  CertificateType: '',
  CertificateData: '',
  url: '',
  FollowUpText: '',
  Gpal: null,
};
