import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
  isLoading: false,
  isError: false,
  syncData: null,
  lastSync: null,
  synced: false,
  configData: null,
  isAppStatus: false,
}

export default (state = initialState, action) => {
  const { type, payload, error } = action;

  switch (type) {

    case ACTION_TYPES.GET_UPDATE_APP_STATUS:
      return {
        ...state,
        isAppStatus: payload
      }

    case ACTION_TYPES.DOCTOR_SVC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false
      };
    case ACTION_TYPES.DOCTOR_SVC_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      }


    case ACTION_TYPES.ADD_CUSTOM_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      }

    case ACTION_TYPES.ADD_CUSTOM_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false
      };
    case ACTION_TYPES.ADD_CUSTOM_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      }


      //SVC


    case ACTION_TYPES.ADD_CUSTOM_DATA_SVC_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
      }

    case ACTION_TYPES.ADD_CUSTOM_DATA_SVC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false
      };
    case ACTION_TYPES.ADD_CUSTOM_DATA_SVC_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      }

    case ACTION_TYPES.SET_SYNC_FLAG:
      return {
        ...state,
        synced: payload.synced,
        lastSync: payload.lastSync
      }
    case ACTION_TYPES.APP_SETUP_CONFIG:
      return {
        ...state,
        configData: payload
      }
    default:
      return state;
  }
}