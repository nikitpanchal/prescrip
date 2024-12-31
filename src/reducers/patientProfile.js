import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
    patientGender: null,
    editPatient: false,
    patientHistory: [{"Datainfo":["Type"],"Value":[]}],
    patientHabits: [{"Datainfo":["Type","Form"],"Value":[["Tabacco","Cigarettes, Bidis,Scented Chewing Mixtures (PAN), Cigars,Hookah,Gutka"],["Alcohol","Beer,Wine,Whiskey,Gin,Vodka,Rum,Tequila"],["Over Eating","Junk Food","Fast Food"]]}],
    patientNotes : [],
    habits: [],
    history: [],
    patientAllergy: null,
    selectedAllergy: [
        {
            "Environmental": "",
            "Food": "",
            "Drugs": "",
            "Other": ""
        }
    ],
    patientDetails: null,
    allergyType: null
}

export default (state = initialState, action) => {
    const { type, payload, error } = action;

    switch (type) {
        case ACTION_TYPES.UPDATE_PATIENT_OBHISTORY:
            return {
                ...state,
                patientGender: payload.patientGender
            }

        case ACTION_TYPES.EDIT_PATIENT_DETAILS:
            return {
                ...state,
                editPatient: payload.editPatient
            }

        case ACTION_TYPES.UPDATE_PATIENT_HABITS:
            return {
                ...state,
                patientHabits: payload.patientHabits
            }

        case ACTION_TYPES.UPDATE_PATIENT_HISTORY:
            return {
                ...state,
                patientHistory: payload.patientHistory
            }

        //set final habits result

        case ACTION_TYPES.SET_PATIENT_HABITS:
            return {
                ...state,
                habits: payload.habits
            }

        //set final history result

        case ACTION_TYPES.SET_PATIENT_HISTORY:
            return {
                ...state,
                history: payload.history
            }

        case ACTION_TYPES.SET_ALLERGY_TYPE:
            return {

                ...state,
                allergyType: payload.allergyType
            }


        case ACTION_TYPES.SET_PATIENT_DATA:
            return {
                ...state,
                patientDetails: payload
            }

        case ACTION_TYPES.SET_FLATLIST_ALLERGY:
            return {
                ...state,
                patientAllergy: payload.patientAllergy
            }
        case ACTION_TYPES.DISCARD_PATIENT:
            return {
                ...state,
                patientGender: null,
                editPatient: false,
                patientHistory :[],
                habits: [],
                history: [],
                selectedAllergy: [
                    {
                        "Environmental": "",
                        "Food": "",
                        "Drugs": "",
                        "Other": ""
                    }
                ],
                patientDetails: null,
                allergyType: null
            }
        //Demo
        case ACTION_TYPES.SET_ALLERGY:
            return {
                ...state,
                selectedAllergy: payload
            }


        default:
            return state;

    }
}
