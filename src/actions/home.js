import * as ACTION_TYPES from "../constants/action-types";

export const setTooltip=(tab)=>({
   
type : ACTION_TYPES.SET_BOTTOM_TAB,
payload : {tab}
   

   
});
export const setNotificationFlags=(flag)=>({
type : ACTION_TYPES.NOTIFICATION_FLAG,
payload : {flag}
});

