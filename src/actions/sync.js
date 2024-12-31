
import * as ACTION_TYPES from "../constants/action-types";




export const add_custom_data_svc = (data) => ({
  types: [


    ACTION_TYPES.ADD_CUSTOM_DATA_SVC_REQUEST,
    ACTION_TYPES.ADD_CUSTOM_DATA_SVC_SUCCESS,
    ACTION_TYPES.ADD_CUSTOM_DATA_SVC_FAILURE
  ],
  payload: {
    client: 'default',
    request: {
      method: 'post',
      url: '/add-custom-svc',
      data: data
    }
  }
});

export const add_custom_data = (data) => ({
  types: [


    ACTION_TYPES.ADD_CUSTOM_DATA_REQUEST,
    ACTION_TYPES.ADD_CUSTOM_DATA_SUCCESS,
    ACTION_TYPES.ADD_CUSTOM_DATA_FAILURE
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/add-custom-data',
      data: data
    }
  }
});


//DELETE CUSTOM DATA
export const delete_custom_data = (data) => ({
  types: [


    ACTION_TYPES.DELETE_CUSTOM_DATA_REQUEST,
    ACTION_TYPES.DELETE_CUSTOM_DATA_SUCCESS,
    ACTION_TYPES.DELETE_CUSTOM_DATA_FAILURE
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/remove-custom-data',
      data: data
    }
  }
});
export const getRecentData = (data) => ({
  types: [ACTION_TYPES.DATA_SYNC_REQUEST,
  ACTION_TYPES.DATA_SYNC_SUCCESS],
  payload: {
    client: 'default',
    request: {
      method: "POST",
      url: '/get-doctor-recents',//'/getRecents',
      data: data
    }
  }
});

export const getdoctor_svc = (data) => ({
  types: [ACTION_TYPES.DOCTOR_SVC_REQUEST,
  ACTION_TYPES.DOCTOR_SVC_SUCCESS,
  ACTION_TYPES.DOCTOR_SVC_FAILURE],
  payload: {
    client: 'default',
    request: {
      method: "POST",
      url: '/get-doctor-svc-provided',//'/getRecents',
      data: data
    }
  }
});

export const getAllData = (data) => ({
  types: [
    ACTION_TYPES.SYNC_ALL_REQUEST,
    ACTION_TYPES.SYNC_ALL_SUCCESS
  ],
  payload: {
    client: 'default',
    request: {
      method: "POST",
      url: '/sync-all',
      data: data
    }

  }
});
export const getMasterData = (data) => ({
  types: [
    ACTION_TYPES.SYNC_MASTER_REQUEST,
    ACTION_TYPES.SYNC_MASTER_SUCCESS
  ],
  payload: {
    client: 'default',
    request: {
      method: "POST",
      url: '/sync-master-data',
      data: data
    }

  }
})
export const checkSyncRequired = (data) => ({
  types: [ACTION_TYPES.CHECK_SYNC_REQUESTED,
  ACTION_TYPES.CHECK_SYNC_SUCCESS],
  payload: {
    client: 'default',
    request: {
      method: "POST",
      url: '/check-sync-required',
      data: data
    }
  }

})
//Set Sync flag
export const setSyncFlag = (data) => ({
  type: ACTION_TYPES.SET_SYNC_FLAG,
  payload: data
});

// get update app status
export const setUpdateApp = (data) => ({
  type: ACTION_TYPES.GET_UPDATE_APP_STATUS,
  payload: data
});

//Get App Config Details
export const getAppConfig = (data) => ({

  types: [ACTION_TYPES.APP_SETUP_REQUEST,
  ACTION_TYPES.APP_SETUP_SUCCESS],
  payload: {
    client: 'default',
    request: {
      method: "POST",
      url: '/get-app-config-v3',
      data: data
    }
  }

});
export const setConfigData = (data) => ({
  type: ACTION_TYPES.APP_SETUP_CONFIG,
  payload: data
})