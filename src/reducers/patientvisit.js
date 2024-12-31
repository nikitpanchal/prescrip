import * as ACTION_TYPES from '../constants/action-types';

const initialState = {
  isLoading: false,
  isError: false,
  patientRxList: [],
  patientId: null,
  Commonid: null,
  id: null,
  referName: {Lab: null, Pharma: null, Specialist: null},
  Referral: [],
  suggestionPrescription: [],
  contact_name: null,
  settingdata: null,
  patientCount: 0,
  RecentPatient: [],

  settingnotificationdata: null,
  contact_mob: null,
  countryCode: '+91',
  SpecialistData: null,
  Gdata: null,
  prescriptionFav: {},
  vc_consult_id: '',
  vc_trans_id: '',
  payment_link: '',
  isFailed: false,
  navFrom: '',
  suggestionPatientData: [],
  // prescription :{bw},
  // patientDetails: null,
  printClickCount: 1,
  patientDetails: {
    _id: '',
    Mobile: '',
    CommonDetails: {
      id: '',
      Email: '',
      DOB: '',
      FullName: '',
      Userimage: '',
      Gpal: null,
      Gender: 'Male',
      Whatsapp: '',
      DoctorId: '',
      Referredby: '',
      PatientId: '',
      PatientHabits: [],
      Allergy: [],
      BodyDetails: {
        BloodGroup: '',
        Height: '',
        Weight: '',
        BMI: '',
        HeightUnit: '',
        WeightUnit: '',
      },
      PersonalHistory: [],
      FamilyHistory: [],
      Notes: [],
      CountryCode: ' +91',
      Locality: '',
      City: '',
      Country: '',
      Address: '',
      EmailAddress: '',
      LastSeen: null,
      WhenEntered: '',
      PersonalHistoryOther: [],
      FamilyHistoryOther: [],
      ismigrate: 0,
      RPCustomerId: null,
      IsFromWeb: false,
      RpayCustId: null,
    },
    VisitsIDCSV: [],
    DoctorsIDCSV: null,
    IsActive: 0,
    WhenEntered: '',
    ismigrate: 0,
  },

  prescription: {
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
        DisplayGenericName: 'Display Generic Name',
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
  },
  patientVisitId: null,
};

export default (state = initialState, action) => {
  const {type, payload, error} = action;
  let temp = null;
  switch (type) {
    case ACTION_TYPES.GET_RXLIST_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.GET_RXLIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        patientDetails: payload.data.patientDetails[0] || null,
        patientRxList: payload.data.patientRxList,
      };
    case ACTION_TYPES.RESET_RXLIST:
      return {
        ...state,
        isLoading: false,
        isError: false,
        //patientDetails:  null,
        patientRxList: [],
      };
    case ACTION_TYPES.GET_RXLIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    case ACTION_TYPES.MORE_RXLIST_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case ACTION_TYPES.MORE_RXLIST_SUCCESS:
      let rxl = state.patientRxList;
      Array.prototype.push.apply(rxl, payload.data.patientRxList);
      return {
        ...state,
        isLoading: false,
        isError: false,
        patientDetails: payload.data.patientDetails[0] || null,
        patientRxList: rxl,
      };
    case ACTION_TYPES.MORE_RXLIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    case ACTION_TYPES.APPOINTMENT_NAVIGATION_SWITCH:
      return {
        ...state,
        navFrom: payload,
      };
    case ACTION_TYPES.ADD_FAV_FAILURE:
      return {
        ...state,
        isFailed: true,
      };
    case ACTION_TYPES.DELETE_PATIENT_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.DELETE_PATIENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };
    case ACTION_TYPES.DELETE_PATIENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case ACTION_TYPES.SEND_PAYMENT_LINK_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.SEND_PAYMENT_LINK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };
    case ACTION_TYPES.SEND_PAYMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case ACTION_TYPES.DELETE_RX_REQUEST:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };
    case ACTION_TYPES.DELETE_RX_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };
    case ACTION_TYPES.SET_FOLLOWUP_REQUESTED:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };
    case ACTION_TYPES.SET_FOLLOWUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };
    case ACTION_TYPES.DELETE_RX_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case ACTION_TYPES.SET_PATIENT_ID:
      return {
        ...state,
        patientId: payload.id ? payload.id : null,
        Commonid: payload.patientId ? payload.patientId : null,
      };
    case ACTION_TYPES.SET_PRESCRIPTION_DATA:
      return {
        ...state,
        prescription: payload,
      };
    case ACTION_TYPES.SET_PRESCRIPTION_DATA_FAV:
      return {
        ...state,
        prescriptionFav: payload,
      };

    //GET SUGGESTION  for prescription
    case ACTION_TYPES.SET_SUGGESTION_DATA:
      return {
        ...state,
        suggestionPrescription: payload,
      };

    case ACTION_TYPES.SET_PRESCRIPTIONKEY_DATA:
      return {
        ...state,
        prescription: Object.assign({}, state.prescription, payload),
      };
    case ACTION_TYPES.SET_LABTEST_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.SET_LABTEST_SUCCESS:
      temp = Object.assign({}, state.prescription, {
        RecommendedLabTest: payload.data.data['RecommendedLabTest'],
      });
      return {
        ...state,
        loading: false,
        failed: false,
        //prescription: temp
      };

    case ACTION_TYPES.SET_ADVICE_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.SET_ADVICE_SUCCESS:
      temp = Object.assign({}, state.prescription, {
        Advice: payload.data.data['Advice'],
      });
      return {
        ...state,
        loading: false,
        failed: false,
      };
    case ACTION_TYPES.SET_INVESTIGATION_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.SET_INVESTIGATION_SUCCESS:
      temp = Object.assign({}, state.prescription, {
        Investigation: payload.data.data['Investigation'],
      });
      return {
        ...state,
        loading: false,
        failed: false,
        //prescription: temp
      };
    case ACTION_TYPES.SET_CHIEFCOMPLAINTS_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.SET_CHIEFCOMPLAINTS_SUCCESS:
      temp = Object.assign({}, state.prescription, {
        ChiefComplaints: payload.data,
      });
      return {
        ...state,
        loading: false,
        failed: false,
        //prescription: temp
      };
    case ACTION_TYPES.SET_CHIEFCOMPAINTS_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.SET_CHIEFCOMPAINTS_SUCCESS:
      temp = Object.assign({}, state.prescription, {
        ChiefComplaints: payload.data,
      });
      return {
        ...state,
        loading: false,
        failed: false,
        prescription: temp,
      };

    case ACTION_TYPES.SET_IS_FINISH_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.SET_IS_FINISH_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
      };

    case ACTION_TYPES.SET_IS_DISCARD_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.SET_IS_DISCARD_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
      };

    case ACTION_TYPES.SET_DIAGNOSIS_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.SET_DIAGNOSIS_SUCCESS:
      temp = Object.assign({}, state.prescription, {
        Diagnosis: payload.data.data['Diagnosis'],
      });
      return {
        ...state,
        loading: false,
        failed: false,
        prescription: temp,
      };
    case ACTION_TYPES.GET_ALL_REFERRAL_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.GET_ALL_REFERRAL_SUCCESS:
      return {
        ...state,
        Referral: payload.data.data.docs,
      };
    case ACTION_TYPES.LABTEST_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.LABTEST_SUCCESS:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.LABTEST_FAILURE:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.ADD_PATHLAB_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.ADD_PATHLAB_SUCCESS:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.ADD_PATHLAB_FAILURE:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.GET_SUGGESTION_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.GET_SUGGESTION_SUCCESS:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.GET_CHIEF_SUGG_FAILED:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.REFERRAL_CONTACT_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case ACTION_TYPES.REFERRAL_CONTACT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
      };

    case ACTION_TYPES.SET_LABORATORY:
      return {
        ...state,
        referName: payload.Name,
      };
    case ACTION_TYPES.SET_CONTACT_NAME:
      return {
        ...state,
        contact_name: payload.cont_name,
      };

    case ACTION_TYPES.SET_CONTACT_MOBILE:
      return {
        ...state,
        contact_mob: payload.cont_mob,
        countryCode: payload.countryCode
      };
    case ACTION_TYPES.SET_SPECIALIST_DATA:
      return {
        ...state,
        SpecialistData: payload.specialistdata,
      };
    case ACTION_TYPES.SETADDITIONAL_ASSESSMENT_REQUEST:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.SETADDITIONAL_ASSESSMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
      };

    case ACTION_TYPES.CREATE_UPDATE_PRESCRIPTION_REQUEST:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.CREATE_UPDATE_PRESCRIPTION_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
      };

    case ACTION_TYPES.CREATE_UPDATE_PRESCRIPTION_FAILURE:
      return {
        ...state,
        loading: false,
        failed: false,
      };

    case ACTION_TYPES.REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        failed: true,
      };

    case ACTION_TYPES.PATIENT_VISIT_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.PATIENT_VISIT_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        prescription: payload.data.data,
        status: payload.data.status,
      };

    case ACTION_TYPES.UPDATE_PATIENT_VISIT_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.UPDATE_PATIENT_VISIT_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        prescription: payload.data.data,
        status: payload.data.status,
      };

    case ACTION_TYPES.SET_PRESCRIPTION_VISIT_ID:
      return {
        ...state,
        patientVisitId: payload,
      };

    case ACTION_TYPES.FAVOURITE_REQUEST:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.FAVOURITE_:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };

    case ACTION_TYPES.FAVOURITE_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
      };

    case ACTION_TYPES.ADD_REFER:
      return {
        ...state,
        Gdata: payload.gdata,
      };

    case ACTION_TYPES.ADD_FAV_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.ADD_FAV_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
      };

    case ACTION_TYPES.GET_RECEIPT_DETAILS_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.GET_RECEIPT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
      };

    case ACTION_TYPES.OFFLINE_PAY_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.OFFLINE_PAY_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
      };

    case ACTION_TYPES.UPDATE_SUGGESTIONS_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.UPDATE_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
      };

    case ACTION_TYPES.EDIT_REFERRAL_CONTACT_REQUEST:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.EDIT_REFERRAL_CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
      };
    case ACTION_TYPES.EDIT_REFERRAL_CONTACT_FAILURE:
      return {
        ...state,
        loading: false,
        failed: true,
      };

    case ACTION_TYPES.SET_CHIEFCOMPLAINTS_EDIT_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false,
      };
    case ACTION_TYPES.SET_CHIEFCOMPLAINTS_EDIT_SUCCESS:
      temp = Object.assign({}, state.prescription, {
        ChiefComplaints: payload.data.data,
      });
      return {
        ...state,
        loading: false,
        failed: false,
        prescription: temp,
      };
    case ACTION_TYPES.EDIT_REFERRAL_CONTACT_FAILURE:
      return {
        ...state,
        loading: false,
        failed: true,
      };
    case ACTION_TYPES.SET_VC_TRANSACTION:
      return {
        ...state,
        vc_consult_id: payload.consult_id,
        vc_trans_id: payload.trans_id,
      };
    case ACTION_TYPES.SET_PAYMENT_LINK:
      return {
        ...state,
        payment_link: payload,
      };

    case ACTION_TYPES.SET_SUGGESTION_PATIENTVISIT_DATA:
      return {
        ...state,
        suggestionPatientData: payload,
      };

    case ACTION_TYPES.SETTING_REQUEST:
      return {
        ...state,
        loading: true,
        failed: false,
      };

    case ACTION_TYPES.SETTING_SUCCESS:
      return {
        ...state,
        loading: false,
        failed: false,
      };
    case ACTION_TYPES.SETTING_FAILURE:
      return {
        ...state,
        loading: false,
        failed: true,
      };

    case ACTION_TYPES.SET_SETTINGDATA:
      return {
        ...state,
        settingdata: payload.settingdata,
      };

    case ACTION_TYPES.SET_SETTINNOTIFICATIONGDATA:
      return {
        ...state,
        settingnotificationdata: payload.settingnotificationdata,
      };

    case ACTION_TYPES.SET_PATIENT_CLICK_COUNT:
      return {
        ...state,
        printClickCount: payload.data,
      };

    default:
      return state;
  }
};
