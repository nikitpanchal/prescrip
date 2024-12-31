
import * as ACTION_TYPES from "../constants/action-types";

export const getRxList = (data) => ({
  types: [
    ACTION_TYPES.GET_RXLIST_REQUEST,
    ACTION_TYPES.GET_RXLIST_SUCCESS,
    ACTION_TYPES.GET_RXLIST_FAILURE
  ],
  payload: {
    client: 'default',
    request: {
      method: 'post',
      url: '/patient-prescription-list',
      data: data
    }
  }
})
export const resetRxList=()=>({
  type: ACTION_TYPES.RESET_RXLIST,
  payload: null
})
export const loadMoreRxList = (data) => ({
  types: [
    ACTION_TYPES.MORE_RXLIST_REQUEST,
    ACTION_TYPES.MORE_RXLIST_SUCCESS,
    ACTION_TYPES.MORE_RXLIST_FAILURE
  ],
  payload: {
    client: 'default',
    request: {
      method: 'post',
      url: '/patient-prescription-list',
      data: data
    }
  }
})

export const deleteRxList = (id) => ({
  types: [
    ACTION_TYPES.DELETE_RX_REQUEST,
    ACTION_TYPES.DELETE_RX_SUCCESS,
    ACTION_TYPES.DELETE_RX_FAILURE
  ],
  payload: {
    client: 'default',
    request: {
      method: 'PATCH',
      url: '/patientvisits/delete-patientvisit' + id,
      data: { action: 0 }
    }
  }
})

export const deletePatient = (id, cid) => ({
  types: [
    ACTION_TYPES.DELETE_PATIENT_REQUEST,
    ACTION_TYPES.DELETE_PATIENT_SUCCESS,
    ACTION_TYPES.DELETE_PATIENT_FAILURE
  ],
  payload: {
    client: 'default',
    request: {
      method: 'PATCH',
      url: '/patients/delete-patient/' + id,
      data: { action: 0, cid: cid }
    }
  }
})

export const sendPaymentLink = (mobile, link) => ({
  types: [
    ACTION_TYPES.SEND_PAYMENT_REQUEST,
    ACTION_TYPES.SEND_PAYMENT_SUCCESS,
    ACTION_TYPES.SEND_PAYMENT_FAILURE
  ],
  payload: {
    client: 'default',
    request: {
      method: 'GET',
      url: '/send-payment-link/?mobile=' + mobile + '&link=' + link,
    }
  }
})

export const setPatientId = (data) => ({
  type: ACTION_TYPES.SET_PATIENT_ID,
  payload: data
});

export const setSuggestionData = (suggestionPrescription) => ({
  type: ACTION_TYPES.SET_SUGGESTION_DATA,
  payload: suggestionPrescription
});

export const setPrescription = (prescription) => ({
  type: ACTION_TYPES.SET_PRESCRIPTION_DATA,
  payload: prescription
});


export const clearPrescription = (prescription) => ({
  type: ACTION_TYPES.CLEAR_PRESCRIPTION_DATA,
  payload: prescription
});


export const setPrescriptionFav = (prescriptionFav) => ({
  type: ACTION_TYPES.SET_PRESCRIPTION_DATA_FAV,
  payload: prescriptionFav
});

export const setNavigationFlow = (data) => ({
  type: ACTION_TYPES.APPOINTMENT_NAVIGATION_SWITCH,
  payload: data
});

export const patientvisits = (prescriptionObj) => ({
  types: [
    ACTION_TYPES.PATIENT_VISIT_REQUESTED,
    ACTION_TYPES.PATIENT_VISIT_SUCCESS,
    ACTION_TYPES.PATIENT_VISIT_FAILED,
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/patientvisits/",
      data: prescriptionObj
    }
  }
})

export const sendRxSMS=(data)=>({
  type : ACTION_TYPES.SEND_RXSMS,
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/sendprescriptionlink",
      data: data
    }
  }
});

export const updatepatientvisits = (prescriptionObj, id) => ({
  types: [
    ACTION_TYPES.UPDATE_PATIENT_VISIT_REQUESTED,
    ACTION_TYPES.UPDATE_PATIENT_VISIT_SUCCESS,
    ACTION_TYPES.UPDATE_PATIENT_VISIT_FAILED,
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/patientvisits/" + id,
      data: prescriptionObj
    }
  }
})

export const get_chief_suggestions = (patient_Id, doctorId, patientId) => ({
  types: [
    ACTION_TYPES.GET_CHIEF_SUGG_REQUESTED,
    ACTION_TYPES.GET_CHIEF_SUGG_SUCCESS,
    ACTION_TYPES.GET_CHIEF_SUGG_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/get-chief-suggestions",//"/doctor-authverify",
      data: {
        patient_Id, doctorId, patientId
      }
    }
  }
})




export const addAsFav = (data) => ({
  types: [

    ACTION_TYPES.ADD_FAV_REQUESTED,
    ACTION_TYPES.ADD_FAV_SUCCESS,
    ACTION_TYPES.ADD_FAV_FAILURE
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/add-to-favorites",
      data: data
    }
  }

  
})



export const get_receipt_details = (transactionId,patient_Id,patientId) => ({
  types: [
    ACTION_TYPES.GET_RECEIPT_DETAILS_REQUESTED,
    ACTION_TYPES.GET_RECEIPT_DETAILS_SUCCESS,
    ACTION_TYPES.GET_RECEIPT_DETAILS_FAILED,  //mark_done_consultation

  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "/get-receipt-details",
      data:
      {
        transactionId,patient_Id,patientId

      }
    }
  }

})


export const offlinepayment = (data) => ({
  types: [


    ACTION_TYPES.OFFLINE_PAY_REQUESTED,
    ACTION_TYPES.OFFLINE_PAY_SUCCESS,
    ACTION_TYPES.OFFLINE_PAY_FAILURE
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "create-offline-payment",
      data: data
    }
  }

  
})






export const update_suggestion = (data) => ({
  types: [

    ACTION_TYPES.UPDATE_SUGGESTIONS_REQUESTED,
    ACTION_TYPES.UPDATE_SUGGESTIONS_SUCCESS,
    ACTION_TYPES.UPDATE_SUGGESTIONS_FAILURE
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: '/update-chief-suggestions',
      data: data
    }
  }
})


export const saveQuickRxFavourites = (patientvisitid, data) => ({
  types: [
    ACTION_TYPES.QUICKRX_SAVE_REQUESTED,
    ACTION_TYPES.QUICKRX_SAVE_SUCCESS,
    ACTION_TYPES.QUICKRX_SAVE_FAILURE
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/patientvisits/toggle-favourite/" + patientvisitid,//"/doctor-authverify",
      data: data
    }
  }
})
export const setPatientVisitKeyData = (payload) => ({
  type: ACTION_TYPES.SET_PRESCRIPTIONKEY_DATA,
  payload
})


export const setLabTest = (data, id) => ({
  types: [
    ACTION_TYPES.SET_LABTEST_REQUESTED,
    ACTION_TYPES.SET_LABTEST_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/patientvisits/labtest/" + id,
      data: data
    }
  }
})


export const updateChief = (prescriptionId, doctorId, chiefComplaints) => ({
  types: [
    ACTION_TYPES.SET_CHIEFCOMPLAINTS_EDIT_REQUESTED,
    ACTION_TYPES.SET_CHIEFCOMPLAINTS_EDIT_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "update-cheif-complaint",
      data: {
        prescriptionId,
        doctorId,
        chiefComplaints
      }
    }
  }
})


//Is finish API

export const isFinish = (prescriptionId) => ({
  types: [
    ACTION_TYPES.SET_IS_FINISH_REQUESTED,
    ACTION_TYPES.SET_IS_FINISH_SUCCESS,
    // ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "update-template-status",
      data: {
        prescriptionId
      }
    }
  }
})




//Is Discard API

export const isDiscard = (prescriptionId) => ({
  types: [

    ACTION_TYPES.SET_IS_DISCARD_REQUESTED,
    ACTION_TYPES.SET_IS_DISCARD_SUCCESS,
    // ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "POST",
      url: "discard-template",
      data: {
        prescriptionId
      }
    }
  }
})






export const setChiefComplaints = (data, id) => ({
  types: [
    ACTION_TYPES.SET_CHIEFCOMPLAINTS_REQUESTED,
    ACTION_TYPES.SET_CHIEFCOMPLAINTS_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/patientvisits/chiefcomplaints/" + id,
      data: data
    }
  }
})

export const setInvestigation = (data, id) => ({
  types: [
    ACTION_TYPES.SET_INVESTIGATION_REQUESTED,
    ACTION_TYPES.SET_INVESTIGATION_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/patientvisits/investigations/" + id,
      data: data
    }
  }
})

export const setAdvice = (data, id) => ({
  types: [
    ACTION_TYPES.SET_ADVICE_REQUESTED,
    ACTION_TYPES.SET_ADVICE_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/patientvisits/advice/" + id,
      data: data
    }
  }
})

export const setFindings = (data, id) => ({
  types: [
    ACTION_TYPES.SET_FINDINGS_REQUESTED,
    ACTION_TYPES.SET_FINDINGS_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/patientvisits/findings/" + id,
      data: data
    }
  }
})

export const setDiagnosis = (data, id) => ({
  types: [
    ACTION_TYPES.SET_DIAGNOSIS_REQUESTED,
    ACTION_TYPES.SET_DIAGNOSIS_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/patientvisits/diagnosis/" + id,
      data: data
    }
  }
})

export const suggestDoctor = (data, id) => ({
  types: [
    ACTION_TYPES.SUGGEST_DOCTOR_REQUESTED,
    ACTION_TYPES.SUGGEST_DOCTOR_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/patientvisits/suggest-doctor/" + id,
      data: data
    }
  }
})

export const suggestPathLab = (data, id) => ({
  types: [
    ACTION_TYPES.SUGGEST_PATHLAB_REQUESTED,
    ACTION_TYPES.SUGGEST_PATHLAB_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/patientvisits/suggest-pathlab/" + id,
      data: data
    }
  }
})

export const sendRxViaSms = (id) => ({
  types: [
    ACTION_TYPES.SEND_RXVIASMS_REQUESTED,
    ACTION_TYPES.SEND_RXVIASMS_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED
  ],
  payload: {
    client: "default",
    request: {
      method: "GET",
      url: "/patientvisits/send-rx-sms/" + id,
      data: data
    }
  }
})


export const getreferallist = (skip, limit, doctorid, type, sort,) => ({
  types: [
    ACTION_TYPES.GET_ALL_REFERRAL_REQUEST,
    ACTION_TYPES.GET_ALL_REFERRAL_SUCCESS,
    ACTION_TYPES.GET_ALL_REFERRAL_FAILURE,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'GET',
      url: '/referralcontact/?'
        + "skip=" + skip
        + "&limit=" + limit
        + "&doctorid=" + doctorid
        + "&type=" + type
        + "&sort=" + sort,


    }
  }
})
export const labtest = (id, Tes1t, Retest) => ({
  types: [
    ACTION_TYPES.LABTEST_REQUEST,
    ACTION_TYPES.LABTEST_SUCCESS,
    ACTION_TYPES.LABTEST_FAILURE,
  ],
  payload: {
    clinet: 'default',
    request: {
      method: 'PATCH',
      url: '/patientvisits/labtest/' + id,
      data: { RecommendedLabTest: [Tes1t, Retest] }

    }
  }

})
export const addpathlab = (id, pmobile, padd, pname, dname, Name, Mobile, Email, Address) => ({
  types: [
    ACTION_TYPES.ADD_PATHLAB_REQUEST,
    ACTION_TYPES.ADD_PATHLAB_SUCCESS,
    ACTION_TYPES.ADD_PATIENT_FAILED
  ],
  payload: {
    clinet: 'default',
    request: {
      method: 'PATCH',
      url: '/patientvisits/suggest-pathlab/' + id,
      data: { pmobile, padd, pname, dname, ReferredPathLabDetails: { Name, Mobile, Email, Address } }
    }
  }
})
export const getsuggetion = (doctorId, searchArray) => ({
  types: [
    ACTION_TYPES.GET_SUGGESTION_REQUEST,
    ACTION_TYPES.GET_SUGGESTION_SUCCESS,
    ACTION_TYPES.GET_SUGGESTION_FAILURE
  ],
  payload: {
    clinet: 'default',
    request: {
      method: 'POST',
      url: '/get-suggestions',
      data: { doctorId, searchArray }
    }
  }
})

export const referralcontact = (data) => ({
  types: [
    ACTION_TYPES.REFERRAL_CONTACT_REQUEST,
    ACTION_TYPES.REFERRAL_CONTACT_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/referralcontact/',
      data: data
    }
  }
})

export const setAdditionalAssesstment = (id, data) => ({
  types: [
    ACTION_TYPES.SETADDITIONAL_ASSESSMENT_REQUEST,
    ACTION_TYPES.SETADDITIONAL_ASSESSMENT_SUCCESS,
    ACTION_TYPES.REQUEST_FAILED,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'PATCH',
      url: '/patientvisits/additionalassessments/' + id,
      data: data
    }
  }
})

export const setlab = (Name) => ({
  type: ACTION_TYPES.SET_LABORATORY,
  payload: {
    Name
  }
});

export const setcontactname = (cont_name) => ({
  type: ACTION_TYPES.SET_CONTACT_NAME,
  payload: {
    cont_name
  }
})

export const setPrintClickCount = (data) => ({
  type: ACTION_TYPES.SET_PATIENT_CLICK_COUNT,
  payload: {
    data
  }
})

export const setcontactmobilenumber = (cont_mob) => ({
  type: ACTION_TYPES.SET_CONTACT_MOBILE,
  payload: {
    cont_mob
  }
})
export const setspecialistdata = (specialistdata) => ({
  type: ACTION_TYPES.SET_SPECIALIST_DATA,
  payload: {
    specialistdata
  }
})

export const setFollowupDate = (patientvisitid, data) => ({
  types: [
    ACTION_TYPES.SET_FOLLOWUP_REQUESTED,
    ACTION_TYPES.SET_FOLLOWUP_SUCCESS,
    ACTION_TYPES.SET_FOLLOWUP_FAILURE,
  ],
  payload: {
    client: "default",
    request: {
      method: "PATCH",
      url: "/patientvisits/followup/" + patientvisitid,
      data: data
    }
  }
})

//Pritish
export const getVisitPrescription = (patientvisitid) => ({
  types: [
    ACTION_TYPES.VISIT_PRESCRIPTION_REQUEST,
    ACTION_TYPES.VISIT_PRESCRIPTION_SUCCESS
  ],
  payload: {
    client: "default",
    request: {
      method: "GET",
      url: "/patientvisits/" + patientvisitid
       
    }
  }
})

//Sourabh
export const favourites = (doctorid) => ({
  types: [
    ACTION_TYPES.FAVOURITE_REQUEST,
    ACTION_TYPES.FAVOURITE_SUCCESS,
    ACTION_TYPES.FAVOURITE_FAILURE
  ],
  payload: {

    client: "default",
    request: {
      method: "POST",
      url: "/patientvisits/favourites/?" + "doctorid=" + doctorid,
      data: {}

    }
  }
})
export const createRefill = (data) => ({
  types: [ACTION_TYPES.REFILL_REQUEST,
  ACTION_TYPES.REFILL_SUCCESS],
  payload: {
    client: 'default',
    request: {
      method: "POST",
      url: "create-refill-rx",
      data: data,
    }
  }
})
export const setPrescriptionVisitId = (id) => ({
  type: ACTION_TYPES.SET_PRESCRIPTION_VISIT_ID,
  payload: id
})
export const setaddrefer = (gdata) => ({
  type: ACTION_TYPES.ADD_REFER,
  payload: {
    gdata
  }
});

export const editreferralcontact = (id, data) => ({
  types: [
    ACTION_TYPES.EDIT_REFERRAL_CONTACT_REQUEST,
    ACTION_TYPES.EDIT_REFERRAL_CONTACT_SUCCESS,
    ACTION_TYPES.EDIT_REFERRAL_CONTACT_FAILURE,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'PATCH',
      url: '/referralcontact/' + id,
      data: data
    }
  }
})
//Call this func with data when click on create prescription from VC.
//AND on DISCARD prescription with empty data
export const setVCTransactionDetails = (data) => ({
  type: ACTION_TYPES.SET_VC_TRANSACTION,
  payload: data
});


export const setSuggestionPatientData = (suggestionPatientData) => ({
  type: ACTION_TYPES.SET_SUGGESTION_PATIENTVISIT_DATA,
  payload: suggestionPatientData
});


export const create_update_prescription = (data) => ({
  types: [

    ACTION_TYPES.CREATE_UPDATE_PRESCRIPTION_REQUEST,
    ACTION_TYPES.CREATE_UPDATE_PRESCRIPTION_SUCCESS,
    ACTION_TYPES.CREATE_UPDATE_PRESCRIPTION_FAILURE,
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/create-update-prescription',
      data: data
    }
  }
})

export const setPaymentLink = (link) => ({
  type: ACTION_TYPES.SET_PAYMENT_LINK,
  payload: link
})
export const getPaymentLink = (data) => ({
  types: [
    ACTION_TYPES.PAYMENT_LINK_REQUEST,
    ACTION_TYPES.PAYMENT_LINK_SUCCESS
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/get-pay-link',
      data: data
    }
  }

})
export const getPaymentLinkSubscription = (data) => ({
  types: [
    ACTION_TYPES.PAYMENT_LINK_REQUEST,
    ACTION_TYPES.PAYMENT_LINK_SUCCESS
  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/get-pay-link-sub',
      data: data
    }
  }

})
export const resetRxLit = (data) => ({
  type: ACTION_TYPES.GET_RXLIST_SUCCESS,
  payload: { data }
})
export const submitRefer = (data) => ({
  types: [
    ACTION_TYPES.SUBMIT_REFER_REQUEST,
    ACTION_TYPES.SUBMIT_REFER_SUCCESS,

  ],
  payload: {
    client: 'default',
    request: {
      method: 'POST',
      url: '/update-referralcontact',
      data: data
    }
  }
})

