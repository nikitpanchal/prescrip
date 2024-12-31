import * as ACTION_TYPES from "../constants/action-types";
const initialState = {
  selectedClinic: null,
  appointmentData: null,
  clinicList: [],

  assistantData: [],
  //manageAsst
  manageAssistData: {
    asstProfile: "",
    asstFirstName: "",
    asstLastName: "",
    asstMobile: "",
    asstMail: "",
    asstClinicList: [],
    asstRole: {
      Header: "",
      permissions: [],
    },
  },
  clinicTimeSlots: [],
  clinicDateSlots: [],
  dateSlots: [],
  timeSlots: [],
};
export default (state = initialState, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case ACTION_TYPES.SET_CLINIC_EDIT:
      return {
        ...state,
        selectedClinic: payload,
      };
    case ACTION_TYPES.SET_APPOINTMENT_DATA:
      return {
        ...state,
        appointmentData: payload,
      };
    case ACTION_TYPES.SET_OUT_OF_CLINIC_TIMESLOTS:
      return {
        ...state,
        clinicTimeSlots: payload,
      };
    case ACTION_TYPES.SET_OUT_OF_CLINIC_DATESLOTS:
      return {
        ...state,
        clinicDateSlots: payload,
      };
    case ACTION_TYPES.SET_OUT_OF_CLINIC_NAME:
      return {
        ...state,
        clinicList: payload,
      };

    case ACTION_TYPES.SET_ASST_ROLE:
      return {
        ...state,
        asstRole: payload,
      };

    case ACTION_TYPES.STORE_ASSISTANT_DATA:
      return {
        ...state,
        assistantData: payload,
      };
    case ACTION_TYPES.SET_ASST_CLINIC_NAME:
      return {
        ...state,
        asstClinicList: payload,
      };

    case ACTION_TYPES.MANAGE_ASSISTANT_DATA:
      return {
        ...state,
        manageAssistData: payload,
      };
    case ACTION_TYPES.RESET_SETTING:
      return {
        ...state,
        selectedClinic: null,
        appointmentData: null,
        clinicList: [],
        clinicTimeSlots: [],
        clinicDateSlots: [],
        dateSlots: [],
        timeSlots: [],
      };
    case ACTION_TYPES.SET_CLINIC_OUT_DATES:
      return {
        ...state,
        dateSlots: payload,
      };
    case ACTION_TYPES.SET_CLINIC_OUT_TIMESLOTS:
      return {
        ...state,
        timeSlots: payload,
      };

    default:
      return state;
  }
};
