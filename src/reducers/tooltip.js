import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
  toolTipStatus: {
    createAppointment: true,
    shareProfile: true,
    shareDoctorProfile: true,
    patientScreenSearch: true,

    patientVisitHistryFAB: true,
    patientVisitHistryIncomplete: true,
    chiefComplaintContainerAdd: true,
    NotesTooltip: true,

    createNotesTooltip: true,
    chiefComplaintContainerClock: true,

    prescriptionPreviewPrint: true,

    searchFindingContainerShowAll: true,
    searchFindingContainerRefer: true,

    printPreviewSetting: true,
    printPreviewPinch: true,
    printPreviewAddSection: true,

    certificateSetting: true,
    medicationEdit: true,
    billingTooltip: true,

    assistantHomeAdd: true,
    assistantDetailsAdd: true,
    assistantDetailsEdit: true,
    assistantDetailsRole: true,
  },
  firstrun: true,
};

export default (state = initialState, action) => {
  const { type, payload, error } = action;

  switch (type) {
    case ACTION_TYPES.SET_TOOLTIP_DATA:
      return {
        ...state,
        toolTipStatus: Object.assign({}, state.toolTipStatus, payload),
      };
    case ACTION_TYPES.SET_FIRSTRUN:
      return {
        ...state,
        firstrun: payload.firstrun,
      };
    default:
      return state;
  }
};
