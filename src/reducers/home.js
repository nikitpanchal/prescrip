import * as ACTION_TYPES from "../constants/action-types";
const initialState = {
    currentTab : "MyPatients",
    refreshBilling : true,
    notificationOpened : false,
};
export default (state = initialState, action) => {
    const { type, payload, error } = action;
    switch (type) {
        case ACTION_TYPES.SET_CURRENT_TAB:
            return {
              ...state,
              currentTab : payload
            }
            case ACTION_TYPES.SET_BILLING_REFRESH:
              return {
                ...state,
                refreshBilling : payload
              }
            case ACTION_TYPES.NOTIFICATION_FLAG:
              return {
                ...state,
                notificationOpened: payload.flag
              }
            default:
      return state;
    };
}