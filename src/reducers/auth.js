import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
  token: undefined,
  clinicId: 0,
  prescription: {},
  suggestionPrescription: [],
  vcRegister: false,
  isAuthenticating: false,
  error: undefined,
  isFailed: false,
  tooltip: "",
  
  endTour : false,
  tabIndex: 0,
registerData:[],
  mobileNo: 0,
  doctorid: '',

  vcdata: null,
  msg: null,
  status: null,
  otpToken: null,
  registerData: {}
};

export default (state = initialState, action) => {
  const { type, payload, error } = action;

  switch (type) {

    case ACTION_TYPES.USER_LOGOUT_REQUESTED:
      return {
        ...initialState
      };

    case ACTION_TYPES.SET_BOTTOM_TAB:
      return {
        ...state,
        tooltip: payload.tab
      }
    case ACTION_TYPES.SET_MOBILE:
      return {
        ...state,
        mobileNo: payload.mobile
      }
    case ACTION_TYPES.SET_DOCTOR_ID:
      return {
        ...state,
        doctorid: payload.doctorid
      }
    case ACTION_TYPES.SET_TOKEN:
      return {
        ...state,
        token: payload.token
      }
    
    case ACTION_TYPES.SET_REGISET_DATA:
      return {
        ...state,
        registerData: payload
      }
    case ACTION_TYPES.SET_OTP_TOKEN:
      return {
        ...state,
        otpToken: payload
      }

      // case ACTION_TYPES.SET_REGISTER_DATA:
      //   return {
      //       ...state,
      //       registerData:payload.data
      //   }


    case ACTION_TYPES.SET_CLINICID:
      return {
        ...state,
        clinicId: payload.clinicId
      }

case ACTION_TYPES.GET_REGISTER_OTP_SUCCESS:
  return{
    ...state,
    isFailed: false,
        msg: payload.data.msg,
        status: payload.data.status,
        
    
  }
  case ACTION_TYPES.GET_REGISTER_OTP_FAILURE:
    return{
      ...state,
      isFailed : true,
      
    }
   


    case ACTION_TYPES.VC_CONSULTATIONFEE_REGISTER:
      return {
        ...state,
        vcRegister: payload.vcRegister
      }




    //Pending VC API @Sourabh

    case ACTION_TYPES.USER_VC_PENDING_REQUESTED:
      return {
        ...state,
      }
    case ACTION_TYPES.USER_VC_PENDING_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };

    //Mark as done
    case ACTION_TYPES.MARK_DONE_CONSULTATION_REQUESTED:
      return {
        ...state,
      }
    case ACTION_TYPES.MARK_DONE_CONSULTATION_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };

    case ACTION_TYPES.CANCEL_CONSULTATION_REQUESTED:
      return {
        ...state,
      }
    case ACTION_TYPES.CANCEL_CONSULTATION_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };



    case ACTION_TYPES.DELETE_CUSTOM_RECEIPT_REQUESTED:
      return {
        ...state,
      }
    case ACTION_TYPES.DELETE_CUSTOM_RECEIPT_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };


    case ACTION_TYPES.GET_BILLING_DETAILS_REQUESTED:
      return {
        ...state,
      }
    case ACTION_TYPES.GET_BILLING_DETAILS_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };




    case ACTION_TYPES.DELETE_PATIENT_REQUESTED:
      return {
        ...state,
      }
    case ACTION_TYPES.DELETE_PATIENT_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };





    case ACTION_TYPES.GET_BILLING_DETAILS_REQUESTED:
      return {
        ...state,
      }
    case ACTION_TYPES.GET_BILLING_DETAILS_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };

    case ACTION_TYPES.BANK_DETAILS_REQUESTED:
      return {
        ...state,
      }
    case ACTION_TYPES.BANK_DETAILS_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };



    case ACTION_TYPES.GET_RECEIPT_DETAILS_REQUESTED:
      return {
        ...state,
      }
    case ACTION_TYPES.GET_RECEIPT_DETAILS_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };



    case ACTION_TYPES.GET_PATIENTLIST_REQUESTED:
      return {
        ...state,
      }
    case ACTION_TYPES.GET_PATIENTLIST_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };


    case ACTION_TYPES.GET_CHIEF_SUGG_REQUESTED:
      return {
        ...state,
      }
    case ACTION_TYPES.GET_CHIEF_SUGG_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };

    case ACTION_TYPES.GET_SUGGESTION_REQUEST:
      return {
        ...state,
      }
    case ACTION_TYPES.GET_SUGGESTION_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };
    case ACTION_TYPES.PATIENTS_LIST_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        vcdata: payload.data.data,
        status: payload.data.status,
      };
     
    default:
      return state;
  }
};
