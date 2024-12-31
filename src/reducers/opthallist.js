import * as ACTION_TYPES from "../constants/action-types";


const initialState = {
  screen:"",    //Left Eye / RightEye
  section : "",
  label : "",
  row : "",
  column : "",
  data : [],
  header : "",
  selectedvalue : "",
  loading : false,
}

export default (state = initialState, action) => {
  const { type, payload, error } = action;
//Request code

if(payload !=undefined && payload.request !=undefined)
{

if(payload.request.data !=undefined)
{



}
}

//Response code


  switch (type) {
    case ACTION_TYPES.ADDOPTHALLIST_DETAILS:
      return Object.assign({}, state, payload);
    case ACTION_TYPES.ADDFULLNAME:
      return {
        ...state,
      };
    default:
      return state;
  }
};
