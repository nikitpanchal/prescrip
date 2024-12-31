import * as ACTION_TYPES from '../constants/action-types';

export const userLoginSuccess = (data) => ({
  types: [
    ACTION_TYPES.USER_LOGIN_REQUESTED,
    ACTION_TYPES.USER_LOGIN_SUCCESS,
    ACTION_TYPES.USER_LOGIN_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/doctor-authentication',
      data: data,
    },
  },
});

export const setRegisterData = (data) => ({
  type: ACTION_TYPES.SET_REGISET_DATA,
  payload: data,
});

//Sourabh>>>

export const get_pending_videoconsultation = (
  startDate,
  endDate,
  doctorId,
) => ({
  types: [
    ACTION_TYPES.USER_VC_PENDING_REQUESTED,
    ACTION_TYPES.USER_VC_PENDING_SUCCESS,
    ACTION_TYPES.USER_VC_PENDING_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/get-pending-videoconsultation',
      data: {
        startDate,
        endDate,
        doctorId,
      },
    },
  },
});

export const mark_done_consultation = (
  digiConsultationId,
  doctorId,
  amt,
  convenienceFee,
  technologyFee,
  payId,
  orderId,
  patientName,
  patientMobile,
  consultComplete,
  transactionId,
) => ({
  types: [
    ACTION_TYPES.MARK_DONE_CONSULTATION_REQUESTED,
    ACTION_TYPES.MARK_DONE_CONSULTATION_SUCCESS,
    ACTION_TYPES.MARK_DONE_CONSULTATION_FAILED, //mark_done_consultation
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/mark-done-consultationv2',
      data: {
        digiConsultationId,
        doctorId,
        amt,
        convenienceFee,
        technologyFee,
        payId,
        orderId,
        patientName,
        patientMobile,
        consultComplete,
        transactionId,
      },
    },
  },
});

export const cancel_consultation = (
  digiConsultationId,
  consultComplete,
  doctorId,
  payId,
) => ({
  types: [
    ACTION_TYPES.CANCEL_CONSULTATION_REQUESTED,
    ACTION_TYPES.CANCEL_CONSULTATION_SUCCESS,
    ACTION_TYPES.CANCEL_CONSULTATION_FAILED, //mark_done_consultation
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/cancel-consultationV3', ///cancel-consultation
      data: {
        digiConsultationId,
        consultComplete,
        doctorId,
        payId,
      },
    },
  },
});

export const get_receipt_details = (transactionId, patient_Id, patientId) => ({
  types: [
    ACTION_TYPES.GET_RECEIPT_DETAILS_REQUESTED,
    ACTION_TYPES.GET_RECEIPT_DETAILS_SUCCESS,
    ACTION_TYPES.GET_RECEIPT_DETAILS_FAILED, //mark_done_consultation
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/get-receipt-details',
      data: {
        transactionId,
        patient_Id,
        patientId,
      },
    },
  },
});

export const delete_custom_receipt = (digiId) => ({
  types: [
    ACTION_TYPES.DELETE_CUSTOM_RECEIPT_REQUESTED,
    ACTION_TYPES.DELETE_CUSTOM_RECEIPT_SUCCESS,
    ACTION_TYPES.DELETE_CUSTOM_RECEIPT_FAILED, //mark_done_consultation
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/delete-custom-receipt',

      data: {
        digiId,
      },
    },
  },
});

export const get_billing_details = (startDate, endDate, type, doctorId) => ({
  types: [
    ACTION_TYPES.GET_BILLING_DETAILS_REQUESTED,
    ACTION_TYPES.GET_BILLING_DETAILS_SUCCESS,
    ACTION_TYPES.GET_BILLING_DETAILS_FAILED, //mark_done_consultation
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      //  url: "/get-billing-details",
      //   url: "/get-billing-details-v3",
      url: '/get-billing-details-v4',

      data: {
        startDate,
        endDate,
        type,
        doctorId,
      },
    },
  },
});

export const bank_details = (BankDetails, DoctorData_id) => ({
  types: [
    ACTION_TYPES.BANK_DETAILS_REQUESTED,
    ACTION_TYPES.BANK_DETAILS_SUCCESS,
    ACTION_TYPES.BANK_DETAILS_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'PATCH',
      url: '/doctor/bank-details/' + DoctorData_id,
      data: BankDetails,
    },
  },
});

export const delete_patient = (
  patient_id,
  PatientName,
  doctor_id,
  cid,
  action, otp
) => ({
  types: [
    ACTION_TYPES.DELETE_PATIENT_REQUESTED,
    ACTION_TYPES.DELETE_PATIENT_SUCCESS,
    ACTION_TYPES.DELETE_PATIENT_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'PATCH',
      url: '/patients/delete-patient-v2/' + patient_id,

      data: {
        PatientName,
        DoctorId: doctor_id,
        cid,
        action, otp
      },
    },
  },
});
export const delete_patient_email = (
  DoctorName, doctorEmail,
  PatientId,
  doctor_id,
  cid ,pname
) => ({
  types: [
    ACTION_TYPES.EMAIL_PATIENT_REQUESTED,
    ACTION_TYPES.EMAIL_PATIENT_SUCCESS,
    ACTION_TYPES.EMAIL_PATIENT_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/delete-patient-email',

      data: {
        doctorName:DoctorName, id: PatientId,
        DoctorId: doctor_id, doctorEmail,
        cid, patientName: pname
        
      },
    },
  },
});
//*********** GET PAST CHIF COMPLIENTS ************/

export const get_suggestions = (data) => ({
  types: [
    ACTION_TYPES.GET_SUGG_REQUESTED,
    ACTION_TYPES.GET_SUGG_SUCCESS,
    ACTION_TYPES.GET_SUGG_FAILED,
  ],

  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/get-suggestions', //"/doctor-authverify",
      data: data,
    },
  },
});

//*********** GET PAST CHIF COMPLIENTS ************/

export const get_chief_suggestions = (
  patient_Id,
  doctorId,
  patientId,
  specialization,
) => ({
  types: [
    ACTION_TYPES.GET_CHIEF_SUGG_REQUESTED,
    ACTION_TYPES.GET_CHIEF_SUGG_SUCCESS,
    ACTION_TYPES.GET_CHIEF_SUGG_FAILED,
  ],

  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/get-chief-suggestions', //"/doctor-authverify",
      data: {
        patient_Id,
        doctorId,
        patientId,
        specialization,
      },
    },
  },
});

export const patientvisits = (prescriptionObj) => ({
  types: [
    ACTION_TYPES.PATIENT_VISIT_REQUESTED,
    ACTION_TYPES.PATIENT_VISIT_SUCCESS,
    ACTION_TYPES.PATIENT_VISIT_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/patientvisits/',
      data: prescriptionObj,
    },
  },
});

export const updatepatientvisits = (prescriptionObj, id) => ({
  types: [
    ACTION_TYPES.UPDATE_PATIENT_VISIT_REQUESTED,
    ACTION_TYPES.UPDATE_PATIENT_VISIT_SUCCESS,
    ACTION_TYPES.UPDATE_PATIENT_VISIT_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'PATCH',
      url: '/patientvisits/' + id,
      data: prescriptionObj,
    },
  },
});

export const patients_recent_list = (
  skip,
  limit,
  search,
  sortby,
  age,
  gender,
  doctorid,
  patientCount,
) => ({
  types: [
    ACTION_TYPES.PATIENTS_RECENT_LIST_REQUESTED,
    ACTION_TYPES.PATIENTS_RECENT_LIST_SUCCESS,
    ACTION_TYPES.PATIENTS_RECENT_LIST_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'GET',
      url:
        '/recent-patients/?' +
        'skip=' +
        skip +
        '&limit=' +
        limit +
        '&search=' +
        search +
        '&sortby=' +
        sortby +
        '&age=' +
        age +
        '&gender=' +
        gender +
        '&doctorid=' +
        doctorid,
    },
  },
});

export const patients_list = (
  skip,
  limit,
  search,
  sortby,
  age,
  gender,
  doctorid,
  patientCount,
) => ({
  types: [
    ACTION_TYPES.PATIENTS_LIST_REQUESTED,
    ACTION_TYPES.PATIENTS_LIST_SUCCESS,
    ACTION_TYPES.PATIENTS_LIST_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'GET',
      url:
        '/patients/?' +
        'skip=' +
        skip +
        '&limit=' +
        limit +
        '&search=' +
        search +
        '&sortby=' +
        sortby +
        '&age=' +
        age +
        '&gender=' +
        gender +
        '&doctorid=' +
        doctorid +
        '&patientcount=' +
        patientCount,
    },
  },
});

//check user register vc or not
export const setVideoConsultationRegister = (vcRegister) => ({
  type: ACTION_TYPES.VC_CONSULTATIONFEE_REGISTER,
  payload: {
    vcRegister,
  },
});

export const setRegistrationData = (data) => ({
  type: ACTION_TYPES.SET_REGISET_DATA,
  payload: data,
});
export const setOTPToken = (data) => ({
  type: ACTION_TYPES.SET_OTP_TOKEN,
  payload: data,
});
export const requestRegisterOTP = (data) => ({
  types: [
    ACTION_TYPES.GET_REGISTER_OTP_REQUESTED,
    ACTION_TYPES.GET_REGISTER_OTP_SUCCESS,
    ACTION_TYPES.GET_REGISTER_OTP_FAILURE,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/doctor-register-getotp',
      data: data,
    },
  },
});
export const registrationVerify = (data) => ({
  types: [
    ACTION_TYPES.VERIFY_REGISTER_REQUESTED,
    ACTION_TYPES.VERIFY_REGISTER_SUCCESS,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/doctor-register-verification',
      data: data,
    },
  },
});
export const checkMobileNumber = (data) => ({
  types: [
    ACTION_TYPES.CHECK_MOBILE_REQUESTED,
    ACTION_TYPES.CHECK_MOBILE_SUCCESS,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/check-mobile-exists',
      data: data,
    },
  },
});
export const userRegistrationSuccess = (
  mobile,
  email,
  firstName,
  lastName,
  promoCode,
) => ({
  types: [
    ACTION_TYPES.USER_SIGNUP_REQUESTED,
    ACTION_TYPES.USER_LOGIN_SUCCESS,
    ACTION_TYPES.USER_SIGNUP_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/doctor-register',
      data: {
        mobile,
        email,
        firstName,
        lastName,
        promoCode,
      },
    },
  },
});

export const userOTPVerification = (doctorId, otp, deviceId, appVersion) => ({
  type: ACTION_TYPES.USER_OTP_VERIFICATION,
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/doctor-authverify-v2', //"/doctor-authverify-demo",
      data: {
        doctorId,
        otp, deviceId, appVersion
      },
    },
  },
});

export const setMobile = (mobile) => ({
  type: ACTION_TYPES.SET_MOBILE,
  payload: {
    mobile,
  },
});

export const setDoctorId = (doctorid) => ({
  type: ACTION_TYPES.SET_DOCTOR_ID,
  payload: {
    doctorid,
  },
});

export const setToken = (token) => ({
  type: ACTION_TYPES.SET_TOKEN,
  payload: {
    token,
  },
});

export const setCurrentTab = (tabRoute) => ({
  type: ACTION_TYPES.SET_CURRENT_TAB,
  payload: tabRoute,
});

export const isRefreshBilling = (refresh) => ({
  type: ACTION_TYPES.SET_BILLING_REFRESH,
  payload: refresh,
});
export const userRequestLogout = () => ({
  type: ACTION_TYPES.USER_LOGOUT_REQUESTED,

  payload: {},
});
