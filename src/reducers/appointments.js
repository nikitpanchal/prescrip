import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
  appointmentData: null,
  clinicId: 0,
  ClinicName: '',
  Address: '',
  isLoading: false,
  isError: false,
  selectedDate: null,
  slots: ''

}
export default (state = initialState, action) => {
  const { type, payload, error } = action;

  switch (type) {

    case ACTION_TYPES.GET_APPOINTMENT_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false
      }
    case ACTION_TYPES.GET_APPOINTMENT_SUCCESS:
      return {
        ...state,
        appointmentData: payload,
        isLoading: true,
        isError: false
      };
    case ACTION_TYPES.GET_APPOINTMENT_FAILURE:
      return {
        ...state,
        isLoading: true,
        isError: true
      }
    case ACTION_TYPES.SET_APPOINTMENT_CLINIC:
      return {
        ...state,
        clinicId: payload.clinicId,
        ClinicName: payload.ClinicName,
        Address: payload.Address,
        selectedDate: payload.selectedDate,
      }




    case ACTION_TYPES.GET_APPOINTMENT_TIMESLOTS_REQUEST:
      return {
        ...state,
      }
    case ACTION_TYPES.GET_APPOINTMENT_TIMESLOTS_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,
        slots: payload.data.data,
        status: payload.data.status,
      };



    case ACTION_TYPES.BOOK_APPOINTMENT_REQUEST:
      return {
        ...state,
      }
    case ACTION_TYPES.BOOK_APPOINTMENT_SUCCESS:
      return {
        ...state,
        isFailed: false,
        msg: payload.data.msg,

        status: payload.data.status,
      };


    default:
      return state;
  }
}