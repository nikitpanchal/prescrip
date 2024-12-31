import * as ACTION_TYPES from "../constants/action-types";
const pkey = "i@ILKM1!"


export const getPatientList = (doctorid) => ({
  types: [
    ACTION_TYPES.GET_PATIENTLIST_REQUESTED,
    ACTION_TYPES.GET_PATIENTLIST_SUCCESS,
    ACTION_TYPES.USER_LOGIN_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/getpatientlist",
      data: {
        pkey,
        doctorid : doctorid
      }
    }
  }
});


export const updateTabExample = (item, pname, name) => ({
  type: ACTION_TYPES.UPDATETABEXAMPLE,
  payload: {
    item, pname, name
  }
});
