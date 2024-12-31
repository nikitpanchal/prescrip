
import * as ACTION_TYPES from "../constants/action-types";

export const setDoctorData = (doctorData) => ({
  type: ACTION_TYPES.SET_DOCTOR_DATA,
  payload: {
    doctorData
  }
})

export const setHeader = (data) => ({
  type: ACTION_TYPES.SET_HEADER,
  payload: data
})

export const setFooter = (data) => ({
  type: ACTION_TYPES.SET_FOOTER,
  payload: data
})
export const clearDoctorData = () => ({

  type: ACTION_TYPES.CLEAR_DOCTOR_DATA,

  payload: {},
});
export const setDoctorSpecialization = (doctorId, primarySpecialization) => ({
  type: ACTION_TYPES.DOCTOR_PRIMARY_SPECIALIZATION,
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/update-primary-specialization",
      data: {
        doctorId,
        primarySpecialization
      }
    }
  }

})

export const updateDoctorDetails = (objectValue, objectKey, doctorId) => ({
  type: ACTION_TYPES.UPDATE_DOCTOR_DETAILS,
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/update-doctor-details",
      data: {
        objectValue,
        objectKey,
        doctorId
      }
    }
  }

})

export const doctorServiceProvided = (data) => ({
  types: [ACTION_TYPES.DOCTOR_SERVICE_PROVIDED_REQUESTED,
  ACTION_TYPES.DOCTOR_SERVICE_PROVIDED_SUCCESS,
  ACTION_TYPES.DOCTOR_SERVICE_PROVIDED_FAILURE],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/get-app-config",
      data: data
    }
  }

})

//Update Doctor Profile
export const updateDoctorProfile = (data) => ({
  types: [ACTION_TYPES.UPDATE_PROFILE_REQUEST,
  ACTION_TYPES.UPDATE_PROFILE_SUCCESS,
  ACTION_TYPES.UPDATE_PROFILE_FAILURE],
  payload: {
    client: 'default',
    request: {
      method: 'post',
      url: '/update-doctor-personaldetails',
      data: data
    }
  }
});
export const updateDoctorSubscriptionDetails = (data) => ({
  types: [ACTION_TYPES.UPDATE_PROFILE_REQUEST,
  ACTION_TYPES.UPDATE_PROFILE_SUCCESS,
  ACTION_TYPES.UPDATE_PROFILE_FAILURE],
  payload: {
    client: 'default',
    request: {
      method: 'post',
      url: '/update-doctor-subscriptiondetails',
      data: data
    }
  }
});


export const setClinicDetails = (clinicAddress) => ({
  type: ACTION_TYPES.SET_CLINIC_DATA,
  payload: {
    clinicAddress
  }
})
export const getDoctorData = (data) => ({
  types: [ACTION_TYPES.GET_DOCTOR_DATA,
  ACTION_TYPES.GET_DOCTOR_DATA_SUCCESS,
  ACTION_TYPES.GET_DOCTOR_DATA_FAILURE],
  payload: {
    client: 'default',
    request: {
      method: 'post',
      url: '/get-doctor-data',
      data: data
    }
  }
})
export const addClinicAddresses = (data) => ({
  types: [ACTION_TYPES.UPDATE_CLINIC_REQUEST,
  ACTION_TYPES.UPDATE_CLINIC_SUCCESS,
  ACTION_TYPES.UPDATE_CLINIC_FAILURE],
  payload: {
    client: 'default',
    request: {
      method: 'post',
      url: '/update-doctor-clinics-v2',
      data: data
    }
  }
})
export const setDoctorFees = (TechFee) => ({
  type: ACTION_TYPES.SET_DOCTOR_CONSULT_FEE,
  payload: {
    TechFee,

  }
})

export const setVideoConsult = (videoConsult) => ({
  type: ACTION_TYPES.SET_VIDEO_CONSULT,
  payload: {
    videoConsult,

  }
})

//setting



export const UpdateSettings = (data) => {
  return {
    types: [
      ACTION_TYPES.SETTING_REQUEST,
      ACTION_TYPES.SETTING_SUCCESS,
      ACTION_TYPES.SETTING_FAILURE
    ],
    payload: {
      client: "default",
      request: {
        method: "POST",
        url: "/update-doctor-settings",
        data: data
      }
    }
  }
};

export const setsetttingdata = (settingdata) => ({
  type: ACTION_TYPES.SET_SETTINGDATA,
  payload: {
    settingdata
  }
})

export const setPatientCount = (patientCount) => ({
  type: ACTION_TYPES.SET_PATIENT_COUNT,
  payload: {
    patientCount
  }
})

export const setRecentPatient = (RecentPatient) => ({
  type: ACTION_TYPES.SET_RECENT_PATIENT,
  payload: {
    RecentPatient
  }
})
export const setsetttingnotificationdata = (settingnotificationdata) => ({
  type: ACTION_TYPES.SET_SETTINNOTIFICATIONGDATA,
  payload: { settingnotificationdata }

})