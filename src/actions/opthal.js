import * as ACTION_TYPES from "../constants/action-types";
export function setOpthalListData(data) {
    return {
      type: ACTION_TYPES.ADDOPTHALLIST_DETAILS,
      payload: data,
    };
  }
  
  export function setOpthalData(data) {
    return {
      type: ACTION_TYPES.ADDOPTHAL_DETAILS,
      payload: data,
    };
  }
  
  export function resetOpthalData() {
    return {
      type: ACTION_TYPES.RESETOPTHAL_DETAILS,
      payload: {},
    };
  }