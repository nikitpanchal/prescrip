import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
  isLoading: false,
  isError: false,
  patientDetails: null
}

export default (state = initialState, action) => {
  const { type, payload, error } = action;

  switch (type) {
    case ACTION_TYPES.UPDATE_PATIENT_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case ACTION_TYPES.UPDATE_PATIENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false
      };
      case ACTION_TYPES.UPDATE_PATIENT_FAILURE:
        return {
          ...state,
          isLoading: false,
          isError: true,
        }
    default:
      return state;
  }
}