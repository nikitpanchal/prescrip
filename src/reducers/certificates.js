import * as ACTION_TYPES from "../constants/action-types";
const initialState = {
    selectedCertificate: null,
    componentList: null,
    submittedDate: null,
    paperSetting: null,
    InputFormData: {},
    ComponentData: null,
    certificateSettings: null,
    certCombination:null,
    customData: {},
    id: "",
    certificateResponse: null,
}
export default (state = initialState, action) => {
    const { type, payload, error } = action;

    switch (type) {

        case ACTION_TYPES.SET_CERTICATE_TYPE:
            return {
                ...state,
                selectedCertificate: payload
            }
        case ACTION_TYPES.SET_CERTIFICATE_PICKERVALUE:
            let val = state.InputFormData;
            val[payload.data.key] = payload.data.value;
            return {
                ...state,
                InputFormData: val,
            };
        case ACTION_TYPES.SET_CERTIFICATE_PAPER:
            return {
                ...state,
                paperSetting: payload.data

            };
        case ACTION_TYPES.CERTIFICATE_TEMPLATE_CHANGE:
            return {
                ...state,
                certificateSettings: payload.data

            };

        case ACTION_TYPES.ADD_CUSTOMDATA:
            return {
                ...state,
                customData: payload
            }
        case ACTION_TYPES.SET_CERTIFICATE_ID:
            return {
                ...state,
                id: payload
            }
        case ACTION_TYPES.ADD_CERTIFICATE_SUCCESS:
            return {
                ...state,
                certificateResponse: payload.data.data,
                id: payload.data.data._id,
                paperSetting : payload.data.data.PaperSettings
            }
            case ACTION_TYPES.CLEAR_CERTIFICATE:
                return{
                    ...state,
                    id : "",
                    submittedDate: null,
                   
                    InputFormData: {},
                    ComponentData: null,
                    certificateSettings: null,
                    
                    id: "",
                    certificateResponse: null,
                }

                case ACTION_TYPES.LOAD_CERTIFICATE_SUCCESS:
                    return {
                        ...state,
                        certCombination:payload.data.data.certCombination
                    }

        default:
            return state;
    }
}