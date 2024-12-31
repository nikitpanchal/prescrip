import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
  isAuthenticating: false,
  error: undefined,
  isFailed: false,
  PatientData: [],
  FirstPage: {
    Undilated: {
      Technique: '',
      Time: '',
      Iop: ''
    },
    Dilated: {
      Technique: '',
      Time: '',
      Iop: ''
    }
  }
};

export default (state = initialState, action) => {
  const { type, payload, error } = action;

  switch (type) {

    case ACTION_TYPES.GET_PATIENTLIST_REQUESTED:
      return {
        ...state,
        isAuthenticating: true,
        isFailed: false
      };
    case ACTION_TYPES.GET_PATIENTLIST_SUCCESS:
      
      return {
        ...state,
        PatientData: payload.data.data,
        isAuthenticating: false,
        isFailed: false
      };
    case ACTION_TYPES.UPDATETABEXAMPLE:
      
      if(payload.name=='Undilated'){
        state.FirstPage.Undilated.Technique=payload.item;
      }
      else{
        state.FirstPage.Dilated.Technique=payload.item;
      }
     
      return {
        ...state,
        FirstPage : state.FirstPage
        

      };
    default:
      return state;
  }
};
