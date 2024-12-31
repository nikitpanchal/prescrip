import * as ACTION_TYPES from "../constants/action-types";

export const updatePatientOBHistory = (patientGender) => ({

  type: ACTION_TYPES.UPDATE_PATIENT_OBHISTORY,

  payload: { patientGender },
});

export const editPatentDetails = (editPatient) => ({

  type: ACTION_TYPES.EDIT_PATIENT_DETAILS,

  payload: { editPatient },
});


export const setPatientHabits = (habits) => ({

  type: ACTION_TYPES.SET_PATIENT_HABITS,

  payload: { habits },
});


export const setPatientHistory = (history) => ({

  type: ACTION_TYPES.SET_PATIENT_HISTORY,

  payload: { history },
});

export const updatePatientHabits = (patientHabits) => ({

  type: ACTION_TYPES.UPDATE_PATIENT_HABITS,

  payload: { patientHabits },
});

export const updatePatientHistory = (patientHistory) => ({

  type: ACTION_TYPES.UPDATE_PATIENT_HISTORY,

  payload: { patientHistory },
});

export const setAllergyType = (allergyType) => ({

  type: ACTION_TYPES.SET_ALLERGY_TYPE,

  payload: { allergyType },
});

export const addPatient = (data) => ({

  types: [ACTION_TYPES.ADD_PATIENT_REQUESTED,
  ACTION_TYPES.ADD_PATIENT_SUCCESS,
  ACTION_TYPES.ADD_PATIENT_FAILED],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/patients/',
      data: data
    }
  }
});

export const patientPrescriptionList = (data) => ({

  types: [ACTION_TYPES.GET_PATIENTINFO_REQUESTED,
  ACTION_TYPES.GET_PATIENTINFO_SUCCESS,
  ACTION_TYPES.GET_PATIENTINFO_FAILED],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/patient-prescription-list/',
      data: data

    }
  }
});

export const updatePatientDetails = (patientid, data) => ({

  types: [ACTION_TYPES.UPDATE_PATIENT_REQUESTED,
  ACTION_TYPES.UPDATE_PATIENT_SUCCESS,
  ACTION_TYPES.UPDATE_PATIENT_FAILED],
  payload: {
    client: 'default',
    request: {
      method: 'PATCH',
      url: '/patients/' + patientid,
      data: data

    }
  }
});

export const updatePatientAbhaDetails = (data) => ({

  types: [ACTION_TYPES.UPDATE_PATIENT_REQUESTED,
  ACTION_TYPES.UPDATE_PATIENT_SUCCESS,
  ACTION_TYPES.UPDATE_PATIENT_FAILED],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/update-patient-abhadetails',
      data: data

    }
  }
});

export const setPatientData = (patientDetails) => ({

  type: ACTION_TYPES.SET_PATIENT_DATA,
  payload: patientDetails

});

export const setPatientAllergy = (patientAllergy) => ({

  type: ACTION_TYPES.SET_FLATLIST_ALLERGY,
  payload: { patientAllergy }

});

export const setlablist = (listdata) => ({
  type: ACTION_TYPES.SET_LAB_LIST,
  payload: listdata
});
export const discardPatient = () => ({
  type: ACTION_TYPES.DISCARD_PATIENT,
  payload: null
});
//Demo Function
export const addPatientAllergy = (data) => ({
  type: ACTION_TYPES.SET_ALLERGY,
  payload: data

});
export const getNotes = (data) => ({
  types: [
    ACTION_TYPES.NOTES_REQUEST,
    ACTION_TYPES.NOTES_SUCCESS
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/get-patient-notes',
      data: data
    }
  }
})
export const addNotes = (data) => ({
  types: [
    ACTION_TYPES.NOTES_SET_REQUEST,
    ACTION_TYPES.NOTES_SET_SUCCESS,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/add-patient-note',
      data: data
    }
  }
})
export const deleteNote = (data) => ({
  types: [ACTION_TYPES.NOTES_DELETE_REQUEST,
  ACTION_TYPES.NOTES_DELETE_SUCCESS],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/delete-patient-note',
      data: data
    }
  }
})
