import * as ACTION_TYPES from "../constants/action-types";


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

export const updateConsultationFee = (doctorId, consultationFee, followUpFee, url) => ({
  type: ACTION_TYPES.UPDATE_CONSULTATION_FEE,
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/update-consultation-fee",
      data: {
        doctorId,
        consultationFee,
        followUpFee,
        url

      }
    }
  }

})