export type Action =
  | { type: "PUSH_NEW_ROUTE", route: string }
  | { type: "POP_ROUTE" }
  | { type: "POP_TO_ROUTE", route: string }
  | { type: "REPLACE_ROUTE", route: string }
  | { type: "REPLACE_OR_PUSH_ROUTE", route: string }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "SET_USER", name: string }
  | { type: "SET_LIST", list: string };

export type Dispatch = (action: Action | Array<Action>) => any;
export type GetState = () => Object;
export type PromiseAction = Promise<Action>;

export const OPEN_DRAWER = "OPEN_DRAWER";
export const CLOSE_DRAWER = "CLOSE_DRAWER";

export const USER_LOGOUT_REQUESTED = "USER_LOGOUT_REQUESTED";

export const USER_SCAN_REQUESTED = "USER_SCAN_REQUESTED";
export const USER_SCAN_SUCCESS = "USER_SCAN_SUCCESS";
export const USER_SCAN_FAILED = "USER_SCAN_FAILED";

export const SCAN_HISTORY_REQUESTED = "SCAN_HISTORY_REQUESTED";
export const SCAN_HISTORY_SUCCESS = "SCAN_HISTORY_SUCCESS";
export const SCAN_HISTORY_FAILED = "SCAN_HISTORY_FAILED";

export const SWITCH_ENVIRONMENT = "SWITCH_ENVIRONMENT";
export const SWITCH_BUNDLE = "SWITCH_BUNDLE";

export const GET_PATIENTLIST_REQUESTED = "GET_PATIENTLIST_REQUESTED";
export const GET_PATIENTLIST_SUCCESS = "GET_PATIENTLIST_SUCCESS";

export const UPDATETABEXAMPLE = "UPDATETABEXAMPLE";
export const SET_SUGGESTION_PATIENTVISIT_DATA =
  "SET_SUGGESTION_PATIENTVISIT_DATA";

//PRITISH
//SET current bottom tab
export const SET_BOTTOM_TAB = "SET_BOTTOM_TAB";
export const SET_CURRENT_TAB = "SET_CURRENT_TAB";
export const SET_BILLING_REFRESH = "SET_BILLING_REFRESH";
export const SET_REGISET_DATA = "SET_REGISET_DATA";
export const SET_OTP_TOKEN = "SET_OTP_TOKEN";

export const SET_TOOLTIP_DATA = "SET_TOOLTIP_DATA";

export const GET_REGISTER_OTP_REQUESTED = "GET_REGISTER_OTP_REQUESTED";
export const GET_REGISTER_OTP_SUCCESS = "GET_REGISTER_OTP_SUCCESS";
export const GET_REGISTER_OTP_FAILURE = "GET_REGISTER_OTP_FAILURE";
export const VERIFY_REGISTER_REQUESTED = "VERIFY_REGISTER_REQUESTED";
export const VERIFY_REGISTER_SUCCESS = "VERIFY_REGISTER_SUCCESS";
export const CHECK_MOBILE_REQUESTED = "CHECK_MOBILE_REQUESTED";
export const CHECK_MOBILE_SUCCESS = "CHECK_MOBILE_SUCCESS";

export const GET_REGISTER_DATA = "GET_REGISTER_DATA";

export const GET_UPDATE_APP_STATUS = "GET_UPDATE_APP_STATUS";

//Sourabh
export const USER_VC_PENDING_REQUESTED = "USER_VC_PENDING_REQUESTED";
export const USER_VC_PENDING_SUCCESS = "USER_VC_PENDING_SUCCESS";
export const USER_VC_PENDING_FAILED = "USER_VC_PENDING_FAILED";

export const MARK_DONE_CONSULTATION_REQUESTED =
  "MARK_DONE_CONSULTATION_REQUESTED";
export const MARK_DONE_CONSULTATION_SUCCESS = "MARK_DONE_CONSULTATION_SUCCESS";
export const MARK_DONE_CONSULTATION_FAILED = "MARK_DONE_CONSULTATION_FAILED";

export const CANCEL_CONSULTATION_REQUESTED = "CANCEL_CONSULTATION_REQUESTED";
export const CANCEL_CONSULTATION_SUCCESS = "CANCEL_CONSULTATION_SUCCESS";
export const CANCEL_CONSULTATION_FAILED = "CANCEL_CONSULTATION_FAILED";

export const GET_BILLING_DETAILS_REQUESTED = "GET_BILLING_DETAILS_REQUESTED";
export const GET_BILLING_DETAILS_SUCCESS = "GET_BILLING_DETAILS_SUCCESS";
export const GET_BILLING_DETAILS_FAILED = "GET_BILLING_DETAILS_FAILED";

export const DELETE_CUSTOM_RECEIPT_REQUESTED =
  "DELETE_CUSTOM_RECEIPT_REQUESTED";
export const DELETE_CUSTOM_RECEIPT_SUCCESS = "DELETE_CUSTOM_RECEIPT_SUCCESS";
export const DELETE_CUSTOM_RECEIPT_FAILED = "DELETE_CUSTOM_RECEIPT_FAILED";

export const GET_RECEIPT_DETAILS_REQUESTED = "GET_RECEIPT_DETAILS_REQUESTED";
export const GET_RECEIPT_DETAILS_SUCCESS = "GET_RECEIPT_DETAILS_SUCCESS";
export const GET_RECEIPT_DETAILS_FAILED = "GET_RECEIPT_DETAILS_FAILED";

export const BANK_DETAILS_REQUESTED = "BANK_DETAILS_REQUESTED";
export const BANK_DETAILS_SUCCESS = "BANK_DETAILS_SUCCESS";
export const BANK_DETAILS_FAILED = "BANK_DETAILS_FAILED";

export const DELETE_PATIENT_REQUESTED = "DELETE_PATIENT_REQUESTED";
export const DELETE_PATIENT_SUCCESS = "DELETE_PATIENT_SUCCESS";
export const DELETE_PATIENT_FAILED = "DELETE_PATIENT_FAILED";

export const EMAIL_PATIENT_REQUESTED = "EMAIL_PATIENT_REQUESTED";
export const EMAIL_PATIENT_SUCCESS = "EMAIL_PATIENT_SUCCESS";
export const EMAIL_PATIENT_FAILED = "EMAIL_PATIENT_FAILED";


//RUBAN
export const USER_LOGIN_REQUESTED = "USER_LOGIN_REQUESTED";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAILED = "USER_LOGIN_FAILED";

export const USER_SIGNUP_REQUESTED = "USER_SIGNUP_REQUESTED";
export const USER_SIGNUP_SUCCESS = "USER_SIGNUP_SUCCESS";
export const USER_SIGNUP_FAILED = "USER_SIGNUP_FAILED";

export const USER_OTP_VERIFICATION = "USER_OTP_VERIFICATION";

export const DOCTOR_PRIMARY_SPECIALIZATION = "DOCTOR_PRIMARY_SPECIALIZATION";

export const UPDATE_DOCTOR_DETAILS = "UPDATE_DOCTOR_DETAILS";
export const UPDATE_CONSULTATION_FEE = "UPDATE_CONSULTATION_FEE";

export const SET_TAB_FORMATDATA = "SET_TAB_FORMATDATA";
export const SET_TAB_LABELDATA = "SET_TAB_LABELDATA";
export const SET_MOBILE = "SET_MOBILE";
export const SET_DOCTOR_ID = "SET_DOCTOR_ID";
export const SET_DOCTOR_DATA = "SET_DOCTOR_DATA";
export const SET_DOCTOR_CONSULT_FEE = "SET_DOCTOR_CONSULT_FEE";
export const CLEAR_DOCTOR_DATA = "CLEAR_DOCTOR_DATA";
export const SET_TOKEN = "SET_TOKEN";

export const SET_CLINICID = "SET_CLINICID";

export const SET_HEADER = "SET_HEADER";
export const SET_FOOTER = "SET_FOOTER";

//Clinic Setup
export const SET_CLINIC_DATA = "SET_CLINIC_DATA";
export const SET_VIDEO_CONSULT = "SET_VIDEO_CONSULT";

//CLINIC ADDRESS
export const UPDATE_CLINIC_REQUEST = "UPDATE_CLINIC_REQUEST";
export const UPDATE_CLINIC_SUCCESS = "UPDATE_CLINIC_SUCCESS";
export const UPDATE_CLINIC_FAILURE = "UPDATE_CLINIC_FAILURE";

//CLINIC ADDRESS
export const GET_DOCTOR_DATA = "GET_DOCTOR_DATA";
export const GET_DOCTOR_DATA_SUCCESS = "GET_DOCTOR_DATA_SUCCESS";
export const GET_DOCTOR_DATA_FAILURE = "GET_DOCTOR_DATA_FAILURE";

//DOCTOR PROFILE
export const UPDATE_PROFILE_REQUEST = "UPDATE_PROFILE_REQUEST";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILURE = "UPDATE_PROFILE_FAILURE";

//SET CURRENT APPOINTMENT CLINIC
export const SET_APPOINTMENT_CLINIC = "SET_APPOINTMENT_CLINIC";

//GET APPOINTMENTS SLOTS
export const GET_APPOINTMENT_TIMESLOTS_REQUEST =
  "GET_APPOINTMENT_TIMESLOTS_REQUEST";
export const GET_APPOINTMENT_TIMESLOTS_SUCCESS =
  "GET_APPOINTMENT_TIMESLOTS_SUCCESS";
export const GET_APPOINTMENT_TIMESLOTS_FAILURE =
  "GET_APPOINTMENT_TIMESLOTS_FAILURE";

//GET APPOINTMENTS SLOTS
export const BOOK_APPOINTMENT_REQUEST = "BOOK_APPOINTMENT_REQUEST";
export const BOOK_APPOINTMENT_SUCCESS = "BOOK_APPOINTMENT_SUCCESS";
export const BOOK_APPOINTMENT_FAILURE = "BOOK_APPOINTMENT_FAILURE";

//GET APPOINTMENTS
export const GET_APPOINTMENT_REQUEST = "GET_APPOINTMENT_REQUEST";
export const GET_APPOINTMENT_SUCCESS = "GET_APPOINTMENT_SUCCESS";
export const GET_APPOINTMENT_FAILURE = "GET_APPOINTMENT_FAILURE";

//APPOINTMENT MARK DONE
export const DONE_APPOINTMENT_REQUEST = "DONE_APPOINTMENT_REQUEST";
export const DONE_APPOINTMENT_SUCCESS = "DONE_APPOINTMENT_SUCCESS";
export const DONE_APPOINTMENT_FAILURE = "DONE_APPOINTMENT_FAILURE";

//APPOINTMENT CANCEL
export const CANCEL_APPOINTMENT_REQUEST = "CANCEL_APPOINTMENT_REQUEST";
export const CANCEL_APPOINTMENT_SUCCESS = "CANCEL_APPOINTMENT_SUCCESS";
export const CANCEL_APPOINTMENT_FAILURE = "CANCEL_APPOINTMENT_FAILURE";

//patient details
export const EDIT_PATIENT_DETAILS = "EDIT_PATIENT_DETAILS";
export const UPDATE_PATIENT_OBHISTORY = "UPDATE_PATIENT_OBHISTORY";

export const UPDATE_PATIENT_HABITS = "UPDATE_PATIENT_HABITS";
export const UPDATE_PATIENT_HISTORY = "UPDATE_PATIENT_HISTORY";

export const SET_PATIENT_HABITS = "SET_PATIENT_HABITS";
export const SET_PATIENT_HISTORY = "SET_PATIENT_HISTORY";

export const ADD_PATIENT_SUCCESS = "ADD_PATIENT_SUCCESS";
export const ADD_PATIENT_REQUESTED = "ADD_PATIENT_REQUESTED";
export const ADD_PATIENT_FAILED = "ADD_PATIENT_FAILED";

export const GET_PATIENTINFO_SUCCESS = "GET_PATIENTINFO_SUCCESS";
export const GET_PATIENTINFO_REQUESTED = "GET_PATIENTINFO_REQUESTED";
export const GET_PATIENTINFO_FAILED = "GET_PATIENTINFO_FAILED";

export const UPDATE_PATIENT_REQUESTED = "UPDATE_PATIENT_REQUESTED";
export const UPDATE_PATIENT_SUCCESS = "UPDATE_PATIENT_SUCCESS";
export const UPDATE_PATIENT_FAILED = "UPDATE_PATIENT_FAILED";

export const PATIENTS_LIST_SUCCESS = "PATIENTS_LIST_SUCCESS";
export const PATIENTS_LIST_REQUESTED = "PATIENTS_LIST_REQUESTED";
export const PATIENTS_LIST_FAILED = "PATIENTS_LIST_FAILED";

export const PATIENTS_RECENT_LIST_SUCCESS = "PATIENTS_RECENT_LIST_SUCCESS";
export const PATIENTS_RECENT_LIST_REQUESTED = "PATIENTS_RECENT_LIST_REQUESTED";
export const PATIENTS_RECENT_LIST_FAILED = "PATIENTS_RECENT_LIST_FAILED";

export const SET_PATIENT_DATA = "SET_PATIENT_DATA";
export const SET_FLATLIST_ALLERGY = "SET_FLATLIST_ALLERGY";

//vc register auth
export const VC_CONSULTATIONFEE_REGISTER = "VC_CONSULTATIONFEE_REGISTER";

//RX
export const GET_RXLIST_REQUEST = "GET_RXLIST_REQUEST";
export const GET_RXLIST_SUCCESS = "GET_RXLIST_SUCCESS";
export const GET_RXLIST_FAILURE = "GET_RXLIST_FAILURE";

export const DELETE_RX_REQUEST = "DELETE_RX_REQUEST";
export const DELETE_RX_SUCCESS = "DELETE_RX_SUCCESS";
export const DELETE_RX_FAILURE = "DELETE_RX_FAILURE";

export const RESET_RXLIST = "RESET_RXLIST";

export const REFER_SPECIALIST_REQUEST = "REFER_SPECIALIST_REQUEST";
export const REFER_SPECIALIST_SUCCESS = "REFER_SPECIALIST_SUCCESS";
export const REFER_SPECIALIST_FAILURE = "REFER_SPECIALIST_FAILURE";

export const SEND_PAYMENT_LINK_REQUEST = "SEND_PAYMENT_LINK_REQUEST";
export const SEND_PAYMENT_LINK_SUCCESS = "SEND_PAYMENT_LINK_SUCCESS";
export const SEND_PAYMENT_LINK_FAILURE = "SEND_PAYMENT_LINK_FAILURE";

//Apointment and patientlist switch

export const APPOINTMENT_NAVIGATION_SWITCH = "APPOINTMENT_NAVIGATION_SWITCH";

export const MORE_RXLIST_REQUEST = "MORE_RXLIST_REQUEST";
export const MORE_RXLIST_SUCCESS = "MORE_RXLIST_SUCCESS";
export const MORE_RXLIST_FAILURE = "MORE_RXLIST_FAILURE";

//SET PATIENT ID
export const SET_ALLERGY_TYPE = "SET_ALLERGY_TYPE";

//RX Template Settings

export const TEMPLATE_SAVE_REQUESTED = "TEMPLATE_SAVE_REQUESTED";
export const TEMPLATE_SAVE_SUCCESS = "TEMPLATE_SAVE_SUCCESS";
export const TEMPLATE_SAVE_FAILURE = "TEMPLATE_SAVE_FAILURE";

export const QUICKRX_SAVE_REQUESTED = "QUICKRX_SAVE_REQUESTED";
export const QUICKRX_SAVE_SUCCESS = "QUICKRX_SAVE_SUCCESS";
export const QUICKRX_SAVE_FAILURE = "QUICKRX_SAVE_FAILURE";

export const ADD_FAV_REQUESTED = "ADD_FAV_REQUESTED";
export const ADD_FAV_SUCCESS = "ADD_FAV_SUCCESS";
export const ADD_FAV_FAILURE = "ADD_FAV_FAILURE";

export const OFFLINE_PAY_REQUESTED = "OFFLINE_PAY_REQUESTED";
export const OFFLINE_PAY_SUCCESS = "OFFLINE_PAY_SUCCESS";
export const OFFLINE_PAY_FAILURE = "OFFLINE_PAY_FAILURE";

export const UPDATE_SUGGESTIONS_REQUESTED = "UPDATE_SUGGESTIONS_REQUESTED";
export const UPDATE_SUGGESTIONS_SUCCESS = "UPDATE_SUGGESTIONS_SUCCESS";
export const UPDATE_SUGGESTIONS_FAILURE = "UPDATE_SUGGESTIONS_FAILURE";

//CHIEF compliement

export const GET_CHIEF_SUGG_REQUESTED = "GET_CHIEF_SUGG_REQUESTED";
export const GET_CHIEF_SUGG_SUCCESS = "GET_CHIEF_SUGG_SUCCESS";
export const GET_CHIEF_SUGG_FAILED = "GET_CHIEF_SUGG_FAILED";

export const GET_SUGG_REQUESTED = "GET_SUGG_REQUESTED";
export const GET_SUGG_SUCCESS = "GET_SUGG_SUCCESS";
export const GET_SUGG_FAILED = "GET_SUGG_FAILED";

export const PATIENT_VISIT_REQUESTED = "PATIENT_VISIT_REQUESTED";
export const PATIENT_VISIT_SUCCESS = "PATIENT_VISIT_SUCCESS";
export const PATIENT_VISIT_FAILED = "PATIENT_VISIT_FAILED";

export const UPDATE_PATIENT_VISIT_REQUESTED = "UPDATE_PATIENT_VISIT_REQUESTED";
export const UPDATE_PATIENT_VISIT_SUCCESS = "UPDATE_PATIENT_VISIT_SUCCESS";
export const UPDATE_PATIENT_VISIT_FAILED = "UPDATE_PATIENT_VISIT_FAILED";

export const SET_PATIENT_ID = "SET_PATIENT_ID";

export const SET_PRESCRIPTION_DATA = "SET_PRESCRIPTION_DATA";
export const SET_PRESCRIPTION_DATA_FAV = "SET_PRESCRIPTION_DATA_FAV";

export const SET_SUGGESTION_DATA = "SET_SUGGESTION_DATA";

//Used for Module
export const SET_READING = "SET_READING";
export const SET_ATTACHMENT_EDITING = "SET_ATTACHMENT_EDITING";
export const SET_DATA_EDITING = "SET_DATA_EDITING";

export const SET_READING_UNIT = "SET_READING_UNIT";
export const SET_ATTACHMENT = "SET_ATTACHMENT";
export const RESET_ATTACHMENT = "RESET_ATTACHMENT";
export const SET_ATTACHMENT_DATA = "SET_ATTACHMENT_DATA";
export const SET_PRESCRIPTIONKEY_DATA = "SET_PRESCRIPTIONKEY_DATA";
export const REMOVE_ITEM = "REMOVE_ITEM"; //Not used
export const SET_ITEM = "SET_ITEM";
export const SET_MDATA = "SET_MDATA";

export const SET_ATTACHMENT_DATA_S3 = "SET_ATTACHMENT_DATA_S3";
export const SET_UPLOAD_IMAGES = "SET_UPLOAD_IMAGES";

export const SET_LABTEST_REQUESTED = "SET_LABTEST_REQUESTED";
export const SET_LABTEST_SUCCESS = "SET_LABTEST_SUCCESS";
export const REQUEST_FAILED = "REQUEST_FAILED";

export const SET_FINDINGS_REQUESTED = "SET_FINDINGS_REQUESTED";
export const SET_FINDINGS_SUCCESS = "SET_FINDINGS_SUCCESS";

export const SET_ADVICE_REQUESTED = "SET_ADVICE_REQUESTED";
export const SET_ADVICE_SUCCESS = "SET_ADVICE_SUCCESS";

export const SET_INVESTIGATION_REQUESTED = "SET_INVESTIGATION_REQUESTED";
export const SET_INVESTIGATION_SUCCESS = "SET_INVESTIGATION_SUCCESS";

export const SET_DIAGNOSIS_REQUESTED = "SET_DIAGNOSIS_REQUESTED";
export const SET_DIAGNOSIS_SUCCESS = "SET_DIAGNOSIS_SUCCESS";

export const SUGGEST_DOCTOR_REQUESTED = "SUGGEST_DOCTOR_REQUESTED";
export const SUGGEST_DOCTOR_SUCCESS = "SUGGEST_DOCTOR_SUCCESS";

export const SUGGEST_PATHLAB_REQUESTED = "SUGGEST_PATHLAB_REQUESTED";
export const SUGGEST_PATHLAB_SUCCESS = "SUGGEST_PATHLAB_SUCCESS";

export const SEND_RXVIASMS_REQUESTED = "SEND_RXVIASMS_REQUESTED";
export const SEND_RXVIASMS_SUCCESS = "SEND_RXVIASMS_SUCCESS";

export const SET_FOLLOWUP_REQUESTED = "SET_FOLLOWUP_REQUESTED";
export const SET_FOLLOWUP_SUCCESS = "SET_FOLLOWUP_SUCCESS";
export const SET_FOLLOWUP_FAILURE = "SET_FOLLOWUP_FAILURE";

//SET LAB TEST
export const SET_LAB_LIST = "SET_LAB_LIST";

//ravi
export const GET_ALL_REFERRAL_REQUEST = "GET_ALL_REFERRAL_REQUEST";
export const GET_ALL_REFERRAL_SUCCESS = "GET_ALL_REFERRAL_SUCCESS";
export const GET_ALL_REFERRAL_FAILURE = "GET_ALL_REFERRAL_FAILURE";
//ravi
export const LABTEST_REQUEST = "LABTEST_REQUEST";
export const LABTEST_SUCCESS = "LABTEST_SUCCESS";
export const LABTEST_FAILURE = "LABTEST_FAILURE";

//ravi
export const ADD_PATHLAB_REQUEST = "ADD_PATHLAB_REQUEST";
export const ADD_PATHLAB_SUCCESS = "ADD_PATHLAB_SUCCESS";
export const ADD_PATHLAB_FAILURE = "ADD_PATHLAB_FAILURE";

//ravi
export const GET_SUGGESTION_REQUEST = "GET_SUGGESTION_REQUEST";
export const GET_SUGGESTION_SUCCESS = "GET_SUGGESTION_SUCCESS";
export const GET_SUGGESTION_FAILURE = "GET_SUGGESTION_FAILURE";
//ravi
export const REFERRAL_CONTACT_REQUEST = "GET_SUGGESTION_REQUEST";
export const REFERRAL_CONTACT_SUCCESS = "GET_SUGGESTION_SUCCESS";
export const REFERRAL_CONTACT_FAILURE = "GET_SUGGESTION_FAILURE";
export const SET_LABORATORY = "SET_LABORATORY";
export const SET_CONTACT_MOBILE = "SET_CONTACT_MOBILE";
export const SET_CONTACT_NAME = "SET_CONTACT_NAME";
export const SET_SPECIALIST_DATA = "SET_SPECIALIST_DATA";

export const SET_PATIENT_CLICK_COUNT = "SET_PATIENT_CLICK_COUNT";

export const SETADDITIONAL_ASSESSMENT_REQUEST =
  "SETADDITIONAL_ASSESSMENT_REQUEST";
export const SETADDITIONAL_ASSESSMENT_SUCCESS =
  "SETADDITIONAL_ASSESSMENT_SUCCESS";
export const CREATE_UPDATE_PRESCRIPTION_REQUEST =
  "CREATE_UPDATE_PRESCRIPTION_REQUEST";
export const CREATE_UPDATE_PRESCRIPTION_SUCCESS =
  "CREATE_UPDATE_PRESCRIPTION_SUCCESS";
export const CREATE_UPDATE_PRESCRIPTION_FAILURE =
  "CREATE_UPDATE_PRESCRIPTION_FAILURE";

//template
export const TEMPLATE_DATA_STORE = "TEMPLATE_DATA_STORE";
export const TEMPLATE_HEIGHT_KEYBOARD = "TEMPLATE_HEIGHT_KEYBOARD";

export const DELETE_PATIENT_VISIT_REQUESTED = "DELETE_PATIENT_VISIT_REQUESTED";
export const DELETE_PATIENT_VISIT_SUCCESS = "DELETE_PATIENT_VISIT_SUCCESS";
export const DELETE_PATIENT_VISIT_FAILED = "DELETE_PATIENT_VISIT_FAILED";

export const SET_CHIEFCOMPLAINTS_REQUESTED = "SET_CHIEFCOMPLAINTS_REQUESTED";
export const SET_CHIEFCOMPLAINTS_SUCCESS = "SET_CHIEFCOMPLAINTS_SUCCESS";

export const SET_IS_FINISH_REQUESTED = "SET_IS_FINISH_REQUESTED";
export const SET_IS_FINISH_SUCCESS = "SET_IS_FINISH_SUCCESS";

export const SET_IS_DISCARD_REQUESTED = "SET_IS_DISCARD_REQUESTED";
export const SET_IS_DISCARD_SUCCESS = "SET_IS_DISCARD_SUCCESS";

export const SET_CHIEFCOMPLAINTS_EDIT_REQUESTED =
  "SET_CHIEFCOMPLAINTS_EDIT_REQUESTED";
export const SET_CHIEFCOMPLAINTS_EDIT_SUCCESS =
  "SET_CHIEFCOMPLAINTS_EDIT_SUCCESS";

//webdata array
export const SET_WEBDATA_ARRAY = "SET_WEBDATA_ARRAY";

//Pritish - Patient Discard
export const DISCARD_PATIENT = "DISCARD_PATIENT";
//Demo Action
export const SET_ALLERGY = "SET_ALLERGY";
//Pritish
export const NOTES_REQUEST = "NOTES_REQUEST";
export const NOTES_SUCCESS = "NOTES_SUCCESS";
export const NOTES_SET_REQUEST = "NOTES_SET_REQUEST";
export const NOTES_SET_SUCCESS = "NOTES_SET_SUCCESS";
export const NOTES_DELETE_REQUEST = "NOTES_DELETE_REQUEST";
export const NOTES_DELETE_SUCCESS = "NOTES_DELETE_SUCCESS";

//MEDICATION
export const SET_MEDICINE = "SET_MEDICINE";
export const SET_MED_CURRENTVIEW = "SET_MED_CURRENTVIEW";
export const ADD_TO_PRESCRIPTION = "ADD_TO_PRESCRIPTION";
export const RESET_MEDICINE = "RESET_MEDICINE";
export const PRESCRIPTION_MED_REQUESTED = "PRESCRIPTION_MED_REQUESTED";
export const PRESCRIPTION_MED_SUCCESS = "PRESCRIPTION_MED_SUCCESS";
export const ADD_CUST_MEDICINE_REQUESTED = "ADD_CUST_MEDICINE_REQUESTED";
export const ADD_CUST_MEDICINE_SUCCESS = "ADD_CUST_MEDICINE_SUCCESS";
export const SET_CUSTOM_BRAND = "SET_CUSTOM_BRAND";

//VISIT FAV
export const FAVOURITE_REQUEST = "FAVOURITE_REQUEST";
export const FAVOURITE_SUCCESS = "FAVOURITE_SUCCESS";
export const FAVOURITE_FAILURE = "FAVOURITE_FAILURE";

//REFILL
export const REFILL_REQUEST = "REFILL_REQUEST";
export const REFILL_SUCCESS = "REFILL_SUCCESS";

//VISIT PRESCRIPTION
export const VISIT_PRESCRIPTION_REQUEST = "VISIT_PRESCRIPTION_REQUEST";
export const VISIT_PRESCRIPTION_SUCCESS = "VISIT_PRESCRIPTION_SUCCESS";
export const SET_PRESCRIPTION_VISIT_ID = "SET_PRESCRIPTION_VISIT_ID";

//Sync

export const ADD_CUSTOM_DATA_REQUEST = "ADD_CUSTOM_DATA_REQUEST";
export const ADD_CUSTOM_DATA_SUCCESS = "ADD_CUSTOM_DATA_SUCCESS";
export const ADD_CUSTOM_DATA_FAILURE = "ADD_CUSTOM_DATA_FAILURE";
//Delete
export const DELETE_CUSTOM_DATA_REQUEST = "DELETE_CUSTOM_DATA_REQUEST";
export const DELETE_CUSTOM_DATA_SUCCESS = "DELETE_CUSTOM_DATA_SUCCESS";
export const DELETE_CUSTOM_DATA_FAILURE = "DELETE_CUSTOM_DATA_FAILURE";

export const ADD_CUSTOM_DATA_SVC_REQUEST = "ADD_CUSTOM_DATA_SVC_REQUEST";
export const ADD_CUSTOM_DATA_SVC_SUCCESS = "ADD_CUSTOM_DATA_SVC_SUCCESS";
export const ADD_CUSTOM_DATA_SVC_FAILURE = "ADD_CUSTOM_DATA_SVC_FAILURE";

//FETCH RECENT DATA
export const DOCTOR_SVC_REQUEST = "DATA_SYNC_REQUEST";
export const DOCTOR_SVC_SUCCESS = "DOCTOR_SVC_SUCCESS";
export const DOCTOR_SVC_FAILURE = "DOCTOR_SVC_FAILURE";

export const CHECK_SYNC_REQUESTED = "CHECK_SYNC_REQUESTED";
export const CHECK_SYNC_SUCCESS = "CHECK_SYNC_SUCCESS";
export const SYNC_MASTER_REQUEST = "SYNC_MASTER_REQUEST";
export const SYNC_MASTER_SUCCESS = "SYNC_MASTER_SUCCESS";
export const SYNC_ALL_REQUEST = "SYNC_ALL_REQUEST";
export const SYNC_ALL_SUCCESS = "SYNC_ALL_SUCCESS";

//Certificate
export const SET_CERTICATE_TYPE = "SET_CERTICATE_TYPE";
export const SET_TEMPLATE_ID = "SET_TEMPLATE_ID";
export const ADD_CUSTOMDATA = "ADD_CUSTOMDATA";
export const ADD_CUSTOMDATA_REQUEST = "ADD_CUSTOMDATA_REQUEST";
export const ADD_CUSTOMDATA_SUCCESS = "ADD_CUSTOMDATA_SUCCESS";
export const ADD_CUSTOMDATA_FAILED = "ADD_CUSTOMDATA_FAILED";
export const SET_COMPONENTDATA = "SET_COMPONENTDATA";
export const SET_CERTIFICATE_PICKERVALUE = "SET_CERTIFICATE_PICKERVALUE";
export const SET_CERTIFICATE_PAPER = "SET_CERTIFICATE_PAPER";
export const ADD_CERTIFICATE_REQUEST = "ADD_CERTIFICATE_REQUEST";
export const ADD_CERTIFICATE_SUCCESS = "ADD_CERTIFICATE_SUCCESS";
export const ADD_CERTIFICATE_FAILED = "ADD_CERTIFICATE_FAILED";
export const SET_CERTIFICATE_ID = "SET_CERTIFICATE_ID";
export const CLEAR_CERTIFICATE = "CLEAR_CERTIFICATE";
export const SET_CERTIFICATE_NAME = "SET_CERTIFICATE_NAME";
export const SET_CERTIFICATE_DATA = "SET_CERTIFICATE_DATA";
export const SET_FAV_CERT_REQUEST = "SET_FAV_CERT_REQUEST";
export const SET_FAV_CERT_SUCCESS = "SET_FAV_CERT_SUCCESS";

export const CERTIFICATE_TEMPLATE_CHANGE = "CERTIFICATE_TEMPLATE_CHANGE";

export const CERTIFICATE_TEMPLATE_CHANGE_REQUEST =
  "CERTIFICATE_TEMPLATE_CHANGE_REQUEST";
export const CERTIFICATE_TEMPLATE_CHANGE_SUCCESS =
  "CERTIFICATE_TEMPLATE_CHANGE_SUCCESS";
export const CERTIFICATE_TEMPLATE_CHANGE_FAILURE =
  "CERTIFICATE_TEMPLATE_CHANGE_FAILURE";

export const LOAD_CERTIFICATE_REQUEST = "LOAD_CERTIFICATE_REQUEST";
export const LOAD_CERTIFICATE_SUCCESS = "LOAD_CERTIFICATE_SUCCESS";
export const LOAD_CERTIFICATE_FAILURE = "LOAD_CERTIFICATE_FAILURE";

export const LOAD_PRESCRIPTION_TEMPLATE_REQUEST =
  "CERTIFICATE_PRESCRIPTION_TEMPLATE_REQUEST";
export const LOAD_PRESCRIPTION_TEMPLATE_SUCCESS =
  "CERTIFICATE_PRESCRIPTION_TEMPLATE_SUCCESS";
export const LOAD_PRESCRIPTION_TEMPLATE_FAILURE =
  "CERTIFICATE_PRESCRIPTION_TEMPLATE_FAILURE";

export const RESET_TEMPLATE_DATA = "RESET_TEMPLATE_DATA";

//ADD REFER
export const ADD_REFER = "ADD_REFER";
export const SUBMIT_REFER_REQUEST = "SUBMIT_REFER_REQUEST";
export const SUBMIT_REFER_SUCCESS = "SUBMIT_REFER_SUCCESS";
//export const SUBMIT_REFER_REQUEST="SUBMIT_REFER_REQUEST";

//FETCH RECENT DATA
export const DATA_SYNC_REQUEST = "DATA_SYNC_REQUEST";
export const DATA_SYNC_SUCCESS = "DATA_SYNC_SUCCESS";
export const SET_SYNC_FLAG = "SET_SYNC_FLAG";

//EDIT REFERAL
export const EDIT_REFERRAL_CONTACT_REQUEST = "EDIT_REFERRAL_CONTACT_REQUEST";
export const EDIT_REFERRAL_CONTACT_SUCCESS = "EDIT_REFERRAL_CONTACT_SUCCESS";
export const EDIT_REFERRAL_CONTACT_FAILURE = "EDIT_REFERRAL_CONTACT_FAILURE";

//VC PAYMENT LINK TRANSACTION
export const SET_VC_TRANSACTION = "SET_VC_TRANSACTION";
export const SET_PAYMENT_LINK = "SET_PAYMENT_LINK";
export const PAYMENT_LINK_REQUEST = "PAYMENT_LINK_REQUEST";
export const PAYMENT_LINK_SUCCESS = "PAYMENT_LINK_SUCCESS";

//SETTINGS
export const SETTING_REQUEST = "SETTING_REQUEST";
export const SETTING_SUCCESS = "SETTING_SUCCESS";
export const SETTING_FAILURE = "SETTING_FAILURE";
export const SET_SETTINGDATA = "SET_SETTINGDATA";
export const SET_SETTINNOTIFICATIONGDATA = "SET_SETTINNOTIFICATIONGDATA";
export const SET_PAYLATER = "SET_PAYLATER";
export const SET_CLINIC_EDIT = "SET_CLINIC_EDIT";
export const SET_APPOINTMENT_DATA = "SET_APPOINTMENT_DATA";
export const SET_CLINIC_OUT_DATES = "SET_CLINIC_OUT_DATES";
export const SET_CLINIC_OUT_TIMESLOTS = "SET_CLINIC_OUT_TIMESLOTS";
export const SET_OUT_OF_CLINIC_REQUEST = "SET_OUT_OF_CLINIC_REQUEST";
export const SET_OUT_OF_CLINIC_SUCCESS = "SET_OUT_OF_CLINIC_SUCCESS";
export const SET_OUT_OF_CLINIC_FAILURE = "SET_OUT_OF_CLINIC_FAILURE";
export const GET_AWAY_APPOINTMENT_TIMESLOTS_REQUEST =
  "GET_AWAY_APPOINTMENT_TIMESLOTS_REQUEST";
export const GET_AWAY_APPOINTMENT_TIMESLOTS_SUCCESS =
  "GET_AWAY_APPOINTMENT_TIMESLOTS_SUCCESS";
export const GET_AWAY_APPOINTMENT_TIMESLOTS_FAILURE =
  "GET_AWAY_APPOINTMENT_TIMESLOTS_FAILURE";

export const SET_PATIENT_COUNT = "SET_PATIENT_COUNT";

export const SET_OUT_OF_CLINIC_NAME = "SET_OUT_OF_CLINIC_NAME";
export const SET_OUT_OF_CLINIC_TIMESLOTS = "SET_OUT_OF_CLINIC_TIMESLOTS";
export const SET_OUT_OF_CLINIC_DATESLOTS = "SET_OUT_OF_CLINIC_DATESLOTS";

export const GET_OUT_OF_CLINIC_REQUEST = "GET_OUT_OF_CLINIC_REQUEST";
export const GET_OUT_OF_CLINIC_SUCCESS = "GET_OUT_OF_CLINIC_SUCCESS";
export const GET_OUT_OF_CLINIC_FAILURE = "GET_OUT_OF_CLINIC_FAILURE";

export const GET_OUT_OF_CLINIC_TIME_DATE_REQUEST =
  "GET_OUT_OF_CLINIC_TIME_DATE_REQUEST";
export const GET_OUT_OF_CLINIC_TIME_DATE_SUCCESS =
  "GET_OUT_OF_CLINIC_TIME_DATE_SUCCESS";
export const GET_OUT_OF_CLINIC_TIME_DATE_FAILURE =
  "GET_OUT_OF_CLINIC_TIME_DATE_FAILURE";
export const REMOVE_OOC_CLINIC_REQUEST = "REMOVE_OOC_CLINIC_REQUEST";
export const REMOVE_OOC_CLINIC_SUCCESS = "REMOVE_OOC_CLINIC_SUCCESS";
export const REMOVE_OOC_CLINIC_FAILURE = "REMOVE_OOC_CLINIC_FAILURE";
export const RESET_SETTING = "RESET_SETTING";

//Manage Assist

export const SET_ASST_CLINIC_NAME = "SET_ASST_CLINIC_NAME";
// export const SET_ASST_NAME = "SET_ASST_NAME";
// export const SET_ASST_MOBILE = "SET_ASST_MOBILE";
export const SET_ASST_ROLE = "SET_ASST_ROLE";

export const ASST_DATA_REQUEST = "ASST_DATA_REQUEST";
export const ASST_DATA_SUCCESS = "ASST_DATA_SUCCESS";
export const ASST_DATA_FAILURE = "ASST_DATA_FAILURE";

export const UPDATE_ASST_DATA_REQUEST = "UPDATE_ASST_DATA_REQUEST";
export const UPDATE_ASST_DATA_SUCCESS = "UPDATE_ASST_DATA_SUCCESS";
export const UPDATE_ASST_DATA_FAILURE = "UPDATE_ASST_DATA_FAILURE";

export const DELETE_ASST_DATA_REQUEST = "DELETE_ASST_DATA_REQUEST";
export const DELETE_ASST_DATA_SUCCESS = "DELETE_ASST_DATA_SUCCESS";
export const DELETE_ASST_DATA_FAILURE = "DELETE_ASST_DATA_FAILURE";

export const GET_ASST_DATA_REQUEST = "GET_ASST_DATA_REQUEST";
export const GET_ASST_DATA_SUCCESS = "GET_ASST_DATA_SUCCESS";
export const GET_ASST_DATA_FAILURE = "GET_ASST_DATA_FAILURE";

export const STORE_ASSISTANT_DATA = "STORE_ASSISTANT_DATA";

export const MANAGE_ASSISTANT_DATA = "MANAGE_ASSISTANT_DATA";

//APP SETUP
export const APP_SETUP_REQUEST = "APP_SETUP_REQUEST";
export const APP_SETUP_SUCCESS = "APP_SETUP_SUCCESS";
export const APP_SETUP_CONFIG = "APP_SETUP_CONFIG";

//landing screen

export const SET_FIRSTRUN = "SET_FIRSTRUN";

//Opthal
export const ADDOPTHAL_DETAILS = "ADDOPTHAL_DETAILS";
export const RESETOPTHAL_DETAILS = "RESETOPTHAL_DETAILS";
export const ADDOPTHALLIST_DETAILS = "ADDOPTHALLIST_DETAILS";

//get service providded

export const DOCTOR_SERVICE_PROVIDED_REQUESTED =
  "DOCTOR_SERVICE_PROVIDED_REQUESTED";
export const DOCTOR_SERVICE_PROVIDED_SUCCESS =
  "DOCTOR_SERVICE_PROVIDED_SUCCESS";
export const DOCTOR_SERVICE_PROVIDED_FAILURE =
  "DOCTOR_SERVICE_PROVIDED_FAILURE";

//Notifications
export const NOTIFICATION_FLAG = "NOTIFICATION_FLAG";

//Send Prescription SMS
export const SEND_RXSMS = "SEND_RXSMS";
