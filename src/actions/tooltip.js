import * as ACTION_TYPES from "../constants/action-types";


export const setTooltipStatus=(payload)=>({
  type:ACTION_TYPES.SET_TOOLTIP_DATA,
  payload
  })

  export const setfirstrun = (firstrun) => ({

    type: ACTION_TYPES.SET_FIRSTRUN,
    payload: {
      firstrun
    }
  });