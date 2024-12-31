import * as ACTION_TYPES from "../constants/action-types";


export const setCertificateType=(certificate)=>({
type : ACTION_TYPES.SET_CERTICATE_TYPE,
payload : certificate
});

export const setPickerValue = (key, value) => ({
    type: ACTION_TYPES.SET_CERTIFICATE_PICKERVALUE,
    payload: {
      data: {
        key,
        value
      }
    }
  });
  export const setPaperSettings = (data) => ({
    type: ACTION_TYPES.SET_CERTIFICATE_PAPER,
    payload: {
      data: data
    }
  });

  export const setComponentData = (data) => ({
    type: ACTION_TYPES.SET_COMPONENTDATA,
    payload: {
      data: data
    }
  
  });

  export const setCertificateTemplateChange = (data) =>({
    type:ACTION_TYPES.CERTIFICATE_TEMPLATE_CHANGE,
    payload:{
      data:data
    }

  })

  export const setCustomData=(data)=>({
type : ACTION_TYPES.ADD_CUSTOMDATA,
payload : data,
  });


  export const setCertificateId=(id)=>({
type :ACTION_TYPES.SET_CERTIFICATE_ID,
payload : id,
  });
  export const createCertificate=(data)=>({
    types :[ACTION_TYPES.ADD_CERTIFICATE_REQUEST,
    ACTION_TYPES.ADD_CERTIFICATE_SUCCESS,
  ACTION_TYPES.ADD_CERTIFICATE_FAILED],
  payload :{
    request : {
      method : 'POST',
      url : '/patientvisits/create-certificate',
      data : data
    }
  }
  
  });

//Add to Fav

export const addToFavourite=(data)=>({
types :[ACTION_TYPES.SET_FAV_CERT_REQUEST,
ACTION_TYPES.SET_FAV_CERT_SUCCESS],
payload : {
  request : {
    method : 'POST',
    url : '/patientvisits/toggle-fav-certificate',
    data : data
  }
}
});

//load certificates
 export const loadCertificates=()=>({
   types :[ACTION_TYPES.LOAD_CERTIFICATE_REQUEST,
  ACTION_TYPES.LOAD_CERTIFICATE_SUCCESS,
ACTION_TYPES.LOAD_CERTIFICATE_FAILURE],
payload : {
  request:{
    method:'GET',
    url:'/get-template-combination'
  }
}
 })



  //Clear Certificate
  export const clearCertificate=()=>({
type : ACTION_TYPES.CLEAR_CERTIFICATE,
payload : null,
  });

  

  