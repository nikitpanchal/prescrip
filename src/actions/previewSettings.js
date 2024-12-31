import * as ACTION_TYPES from "../constants/action-types";

export const setFormatTabData = (formatData) => ({

    type: ACTION_TYPES.SET_TAB_FORMATDATA,

    payload: formatData
});

export const setLabelTabData = (labelData) => ({

    type: ACTION_TYPES.SET_TAB_LABELDATA,

    payload: {labelData}
});


export const tabDataStore=(templateData)=>({

    type: ACTION_TYPES.TEMPLATE_DATA_STORE,
  
    payload: { templateData },
})



  export const setWebdata = (data) => ({

    type: ACTION_TYPES.SET_WEBDATA_ARRAY,
  
    payload: { data },
  });

  export const resetTemplateData = () => ({
    type: ACTION_TYPES.RESET_TEMPLATE_DATA,
    payload:{}
  })


export const onTemplateSave = (patientvisitsid, data) => ({
    types: [ACTION_TYPES.TEMPLATE_SAVE_REQUESTED,
    ACTION_TYPES.TEMPLATE_SAVE_SUCCESS,
    ACTION_TYPES.TEMPLATE_SAVE_FAILURE],
    payload: {
        client: "default",
        request: {
            method: "PATCH",
            url: "/patientvisits/template-settings/" + patientvisitsid,
            data:  data
            
        }
    }

})

//load template
//load certificates
export const loadPrescription=()=>({
  types :[ACTION_TYPES.LOAD_PRESCRIPTION_TEMPLATE_REQUEST,
 ACTION_TYPES.LOAD_PRESCRIPTION_TEMPLATE_SUCCESS,
ACTION_TYPES.LOAD_PRESCRIPTION_TEMPLATE_FAILURE],
payload : {
 request:{
   method:'GET',
   url:'/get-template-combination'
 }
}
})

export const deletePatientVisit = (patientvisitid,data) => ({
    types: [
      ACTION_TYPES.DELETE_PATIENT_VISIT_REQUESTED,
      ACTION_TYPES.DELETE_PATIENT_VISIT_SUCCESS,
      ACTION_TYPES.DELETE_PATIENT_VISIT_FAILED
    ],
    payload: {
      client: "default",
      request: {
        method: "PATCH",
        url: "/patientvisits/delete-patientvisit/"+patientvisitid,
        data: data
      }
    }
  });