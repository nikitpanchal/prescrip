import * as ACTION_TYPES from "../constants/action-types";

//Get List
export const getAppointmentList=(data)=>({
    types :[
        ACTION_TYPES.GET_APPOINTMENT_REQUEST,
        ACTION_TYPES.GET_APPOINTMENT_SUCCESS,
        ACTION_TYPES.GET_APPOINTMENT_FAILURE
    ],
    payload :{
        client : 'default',
        request : {
            method : 'post',
            url : '/get-appointments',
            data : data
        }
    } 
});

//get_appontment_timeslots
export const get_appontment_timeslots=(data)=>({
    types :[
        ACTION_TYPES.GET_APPOINTMENT_TIMESLOTS_REQUEST,
        ACTION_TYPES.GET_APPOINTMENT_TIMESLOTS_SUCCESS,
        ACTION_TYPES.GET_APPOINTMENT_TIMESLOTS_FAILURE
    ],
    payload :{
        client : 'default',
        request : {
            method : 'post',
            url : '/get-appontment-timeslots',
            data : data
        }
    } 
});


//Get List
export const book_appointment_app=(data)=>({
    types :[
        ACTION_TYPES.BOOK_APPOINTMENT_REQUEST,
        ACTION_TYPES.BOOK_APPOINTMENT_SUCCESS,
        ACTION_TYPES.BOOK_APPOINTMENT_FAILURE
    ],
    payload :{
        client : 'default',
        request : {
            method : 'post',
            url : '/book-appointment-app',
            data : data
        }
    } 
});

//Set Appointment Clinic
export const setAppointmentClinic=(data)=>({
    type : ACTION_TYPES.SET_APPOINTMENT_CLINIC,
    payload : data
});
//Cancel Appointment
export const cancelAppointment=(data)=>({
    types :[
        ACTION_TYPES.CANCEL_APPOINTMENT_REQUEST,
        ACTION_TYPES.CANCEL_APPOINTMENT_SUCCESS,
        ACTION_TYPES.CANCEL_APPOINTMENT_FAILURE
    ],
    payload :{
        client : 'default',
        request : {
            method : 'post',
            url : '/cancel-appointment',
            data : data
        }
    } 
});

//Mark Appointment Done
export const markAppointmentDone=(data)=>({
    types :[
        ACTION_TYPES.DONE_APPOINTMENT_REQUEST,
        ACTION_TYPES.DONE_APPOINTMENT_SUCCESS,
        ACTION_TYPES.DONE_APPOINTMENT_FAILURE
    ],
    payload :{
        client : 'default',
        request : {
            method : 'post',
            url : '/mark-done-appointment',
            data : data
        }
    } 
});