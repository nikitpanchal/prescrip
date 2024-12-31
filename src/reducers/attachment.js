import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
    reading: '',                //Value for selected item
    attachments: [],            //Upload key
    isAttachmentEditing :false,
    isDataEditing :false,
    
    "DataType": '',
    "Graph": '',
    "Unit": '',
    
    "Upload": [],
    "Name": '',
    "Value": '',
    "keyBoradType" :'',
    graphtype: '',
    mdata: [],           //Will bind all json data here
    type: 'ChiefComplaints',
    displayname: 'Complaints',
    defaultlabel: 'Past Complaints',
    colorCode :'',
    subtext: '',
    Srno: 8,
    suggesticon: null,
    suggestname: '',
    suggestscreen: '',
    isLoading: false,
    isError: false,
    attachmentDataS3: []
}

export default (state = initialState, action) => {
    const { type, payload, error } = action;

    switch (type) {

        

        case ACTION_TYPES.SET_ATTACHMENT_EDITING:
        return {
            ...state,
            isAttachmentEditing: payload,
        }

        case ACTION_TYPES.SET_DATA_EDITING:
        return {
            ...state,
            isDataEditing: payload,
        }

        

        case ACTION_TYPES.SET_READING:
            return {
                ...state,
                Value: payload,
                DataType: payload,
            }
        case ACTION_TYPES.SET_READING_UNIT:
            return {
                ...state,
                Unit: payload,
            }

        case ACTION_TYPES.SET_UPLOAD_IMAGES:
            return {
                ...state,
                Upload: payload,
            }

        case ACTION_TYPES.SET_ATTACHMENT_DATA_S3:
            return {
                ...state,
                attachmentDataS3: payload,
                Upload: payload,
            }
        case ACTION_TYPES.SET_ATTACHMENT_DATA:
            return Object.assign({}, state, payload)
        case ACTION_TYPES.SET_ATTACHMENT:
            return {
                ...state,
                attachments: payload,
            }
        case ACTION_TYPES.SET_MDATA:
            return {
                ...state,
                mdata: payload,
            }
        case ACTION_TYPES.RESET_ATTACHMENT:
            return {
                ...state,
                reading: '',                //Value for selected item
                attachments: [],            //Upload key
                "DataType": '',
                "Graph": '',
                "Unit": '',
                "Upload": [],
                "Name": '',
                "Value": '',
                graphtype: '',
            }
        default:
            return state;
    }
}