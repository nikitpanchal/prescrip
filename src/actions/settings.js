import * as ACTION_TYPES from "../constants/action-types";

export const setSettingClinic = (data) => ({
  type: ACTION_TYPES.SET_CLINIC_EDIT,
  payload: data,
});
export const setOutOfCliniNameList = (data) => ({
  type: ACTION_TYPES.SET_OUT_OF_CLINIC_NAME,
  payload: data,
});

export const setAsstRole = (data) => ({
  type: ACTION_TYPES.SET_ASST_ROLE,
  payload: data,
});

export const setAsstCliniNameList = (data) => ({
  type: ACTION_TYPES.SET_ASST_CLINIC_NAME,
  payload: data,
});

export const manageAsstData = (data) => ({
  type: ACTION_TYPES.MANAGE_ASSISTANT_DATA,
  payload: data,
});

export const storeAssitantData = (data) => ({
  type: ACTION_TYPES.STORE_ASSISTANT_DATA,
  payload: data,
});

export const getAssitantData = (doctorId) => ({
  types: [
    ACTION_TYPES.GET_ASST_DATA_REQUEST,
    ACTION_TYPES.GET_ASST_DATA_SUCCESS,
    ACTION_TYPES.GET_ASST_DATA_FAILURE,
  ],
  payload: {
    client: "default",
    request: {
      method: "GET",
      url: "/get-assistant-list/" + doctorId,
    },
  },
});

export const setAssitantData = (data) => ({
  types: [
    ACTION_TYPES.ASST_DATA_REQUEST,
    ACTION_TYPES.ASST_DATA_SUCCESS,
    ACTION_TYPES.ASST_DATA_FAILURE,
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/add-assistant",
      data: data,
    },
  },
});

export const updateAssitantData = (data) => ({
  types: [
    ACTION_TYPES.UPDATE_ASST_DATA_REQUEST,
    ACTION_TYPES.UPDATE_ASST_DATA_SUCCESS,
    ACTION_TYPES.UPDATE_ASST_DATA_FAILURE,
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/update-assistant-details",
      data: data,
    },
  },
});

export const deleteAssitantData = (assistantId) => ({
  types: [
    ACTION_TYPES.DELETE_ASST_DATA_REQUEST,
    ACTION_TYPES.DELETE_ASST_DATA_SUCCESS,
    ACTION_TYPES.DELETE_ASST_DATA_FAILURE,
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/delete-assistant/" + assistantId,
    },
  },
});

export const setOutOfCliniTimeSlotsNew = (data) => ({
  type: ACTION_TYPES.SET_OUT_OF_CLINIC_TIMESLOTS,
  payload: data,
});

export const setOutOfClinicDateSlotsNew = (data) => ({
  type: ACTION_TYPES.SET_OUT_OF_CLINIC_DATESLOTS,
  payload: data,
});
export const setOutOfClinicsSlots = (data) => ({
  type: ACTION_TYPES.SET_APPOINTMENT_DATA,
  payload: data,
});

export const setOutOfClinicsDateSlots = (data) => ({
  type: ACTION_TYPES.SET_CLINIC_OUT_DATES,
  payload: data,
});

export const setOutOfClinicsTimeSlots = (data) => ({
  type: ACTION_TYPES.SET_CLINIC_OUT_TIMESLOTS,
  payload: data,
});

export const setOutOfClinic = (data) => ({
  types: [
    ACTION_TYPES.SET_OUT_OF_CLINIC_REQUEST,
    ACTION_TYPES.SET_OUT_OF_CLINIC_SUCCESS,
    ACTION_TYPES.SET_OUT_OF_CLINIC_FAILURE,
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/enable-disable-appointmentslots",
      data: data,
    },
  },
});

export const getOutOfClinicData = (data) => ({
  types: [
    ACTION_TYPES.GET_OUT_OF_CLINIC_REQUEST,
    ACTION_TYPES.GET_OUT_OF_CLINIC_SUCCESS,
    ACTION_TYPES.GET_OUT_OF_CLINIC_FAILURE,
  ],
  payload: {
    clinet: "default",
    request: {
      method: "post",
      url: "/enable-disable-appointmentslots",
      data: data,
    },
  },
});

export const get_away_appontment_timeslots = (data) => ({
  types: [
    ACTION_TYPES.GET_AWAY_APPOINTMENT_TIMESLOTS_REQUEST,
    ACTION_TYPES.GET_AWAY_APPOINTMENT_TIMESLOTS_SUCCESS,
    ACTION_TYPES.GET_AWAY_APPOINTMENT_TIMESLOTS_FAILURE,
  ],
  payload: {
    client: "default",
    request: {
      method: "post",
      url: "/get-awayappontment-timeslots",
      data: data,
    },
  },
});

export const get_outofclinic_time_and_date = (data) => ({
  types: [
    ACTION_TYPES.GET_OUT_OF_CLINIC_TIME_DATE_REQUEST,
    ACTION_TYPES.GET_OUT_OF_CLINIC_TIME_DATE_SUCCESS,
    ACTION_TYPES.GET_OUT_OF_CLINIC_TIME_DATE_FAILURE,
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/get-ooc-data",
      data: data,
    },
  },
});

export const resetSettings = () => ({
  type: ACTION_TYPES.RESET_SETTING,
  payload: null,
});
export const delete_ooc = (data) => ({
  types: [
    ACTION_TYPES.REMOVE_OOC_CLINIC_REQUEST,
    ACTION_TYPES.REMOVE_OOC_CLINIC_SUCCESS,
    ACTION_TYPES.REMOVE_OOC_CLINIC_FAILURE,
  ],
  payload: {
    clinet: "default",
    request: {
      method: "POST",
      url: "/remove-ooc-data",
      data: data,
    },
  },
});
