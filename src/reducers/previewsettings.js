import * as ACTION_TYPES from '../constants/action-types';

const initialState = {
  currenttabs: '',
  tabIndex: 0,
  formatData: [],
  labelData: [],
  isFailed: false,
  msg: null,
  status: null,
  prescriptionTemplate: [],
  templateData: {
    PaperSettings: {
      IsBW: 0,
      Margin: ['10', '10', '10', '10'],
      papername: 'A4',
      papersize: ['210', '297'],
      TemplateFontSize: '14',
      header: 1,
      footer: 1,
      body: 1,
    },
    Signature: '',
    Logo: '',
    PrescriptionList: [],
    Language: 'English',
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
  },

  webdata: null,
};

export default (state = initialState, action) => {
  const {type, payload, error} = action;

  switch (type) {
    case ACTION_TYPES.SET_DEFAULT_PREVIEW_SETTINGS_TAB:
      return {
        ...state,
        currenttabs: payload.tab,
      };
    case ACTION_TYPES.SET_TAB_FORMATDATA:
      return {
        ...state,
        formatData: payload.formatData,
      };
    case ACTION_TYPES.SET_TAB_LABELDATA:
      return {
        ...state,
        labelData: payload.labelData,
      };

    case ACTION_TYPES.TEMPLATE_DATA_STORE:
      return {
        ...state,
        templateData: payload.templateData,
      };

    case ACTION_TYPES.DELETE_PATIENT_VISIT_FAILED:
      return {
        ...state,
        isFailed: true,
      };
    // case ACTION_TYPES.LOAD_PRESCRIPTION_TEMPLATE_SUCCESS:
    //   return {
    //     ...state,
    //     prescriptionTemplate: payload.data.data.templateCombination
    //   }

    case ACTION_TYPES.SET_WEBDATA_ARRAY:
      return {
        ...state,
        webdata: payload.data,
      };

    case ACTION_TYPES.RESET_TEMPLATE_DATA:
      return {
        ...state,
        templateData: {
          PaperSettings: {
            IsBW: 0,
            Margin: ['10', '10', '10', '10'],
            papername: 'A4',
            papersize: ['210', '297'],
            TemplateFontSize: '14',
            header: 1,
            footer: 1,
            body: 1,
          },
          PrescriptionList: [],
          Language: 'English',
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
        },
      };

    default:
      return state;
  }
};
