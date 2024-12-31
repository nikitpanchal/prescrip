
import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
  DoctorData: null,
  ClinicAddress: null,
  showHeader: true,
  showFooter: true,
  DoctorFees: null,
  VideoConsult: "",
  isLoading: false,
  patientCount :0,
  RecentPatient :[],


  isError: false,
  settingdata: null,
  Settingnotificationdata: 0,
}

export default (state = initialState, action) => {
  const { type, payload, error } = action;

  switch (type) {

    case ACTION_TYPES.SET_DOCTOR_DATA:
      return {
        ...state,
        DoctorData: payload.doctorData
      }
    case ACTION_TYPES.USER_LOGOUT_REQUESTED:
      return {
        ...initialState
      };
    case ACTION_TYPES.SET_HEADER:
      return {
        ...state,
        showHeader: payload
      };
    case ACTION_TYPES.SET_FOOTER:
      return {
        ...state,
        showFooter: payload
      };
    case ACTION_TYPES.SET_CLINIC_DATA:
      return {
        ...state,
        ClinicAddress: payload.clinicAddress
      }
    case ACTION_TYPES.UPDATE_CLINIC_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case ACTION_TYPES.UPDATE_CLINIC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
      }
    case ACTION_TYPES.UPDATE_CLINIC_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    case ACTION_TYPES.SET_DOCTOR_CONSULT_FEE:
      return {
        ...state,
        DoctorFees: payload.TechFee
      }
    case ACTION_TYPES.SET_VIDEO_CONSULT:
      return {
        ...state,
        VideoConsult: payload.videoConsult
      }

    case ACTION_TYPES.SET_PAYLATER:
      return {
        ...state,
        Paylater: payload.paylater
      }


    case ACTION_TYPES.SET_SETTINGDATA:
      return {
        ...state,
        settingdata: payload.settingdata
      }

    case ACTION_TYPES.SET_SETTINNOTIFICATIONGDATA:
      return {
        ...state,
        Settingnotificationdata: payload.settingnotificationdata
      }
      case ACTION_TYPES.SET_PATIENT_COUNT:
      return {
        ...state,
        patientCount: payload.patientCount
      }
      case ACTION_TYPES.SET_RECENT_PATIENT:
      return {
        ...state,
        RecentPatient: payload.RecentPatient
      }
    default:
      return state;
  }
}