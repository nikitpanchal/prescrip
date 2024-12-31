
import * as ACTION_TYPES from "../constants/action-types";

export const updatePatient = (id, data) => ({
  types: [
    ACTION_TYPES.UPDATE_PATIENT_REQUEST,
    ACTION_TYPES.UPDATE_PATIENT_SUCCESS,
    ACTION_TYPES.UPDATE_PATIENT_FAILURE
  ],
  payload: {
    client: 'default',
    request: {
      method: 'PATCH',
      url: '/patient/' + id,
      data: data
    }
  }
})

export const deletePatient = (id, data) => ({
  types: [
    ACTION_TYPES.UPDATE_PATIENT_REQUEST,
    ACTION_TYPES.UPDATE_PATIENT_SUCCESS,
    ACTION_TYPES.UPDATE_PATIENT_FAILURE
  ],
  payload: {
    client: 'default',
    request: {
      method: 'PATCH',
      url: '/patient/delete-patient' + id,
      data: data
    }
  }
})

export const abdmenrollmentaadhar = (aadharNo) => ({
  types: [
    ACTION_TYPES.UPDATE_PATIENT_REQUEST,
    ACTION_TYPES.UPDATE_PATIENT_SUCCESS,
    ACTION_TYPES.UPDATE_PATIENT_FAILURE
  ],
  payload: {
    client: 'default',
    request: {
      "aadharNo": aadharNo
    }
  }
})