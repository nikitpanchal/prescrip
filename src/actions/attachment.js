import * as ACTION_TYPES from "../constants/action-types";

//Get List
export const setReading = (data) => ({
    type: ACTION_TYPES.SET_READING,
    payload: data
});

//Get List
export const setAttachmentEditing = (data) => ({
    type: ACTION_TYPES.SET_ATTACHMENT_EDITING,
    payload: data
});


//Get List
export const setDataEditing = (data) => ({
    type: ACTION_TYPES.SET_DATA_EDITING,
    payload: data
});


//Get List
export const setAttachmentData = (data) => ({
    type: ACTION_TYPES.SET_ATTACHMENT_DATA,
    payload: data
});

//Set Attachment Data
export const setReadingUnit = (data) => ({
    type: ACTION_TYPES.SET_READING_UNIT,
    payload: data
});

//Set Attachment Data
export const setUploadImages = (data) => ({
    type: ACTION_TYPES.SET_UPLOAD_IMAGES,
    payload: data
});



//Set Attachment Data s3
export const setAttachmentDataS3 = (data) => ({
    type: ACTION_TYPES.SET_ATTACHMENT_DATA_S3,
    payload: data
});

//Set Attachment
export const setAttachment = (data) => ({
    type: ACTION_TYPES.SET_ATTACHMENT,
    payload: data
});

//Reset Attachment
export const resetAttachmentData = () => ({
    type: ACTION_TYPES.RESET_ATTACHMENT,
    payload: {}
});

//Reset Attachment
export const setItem = (data) => ({
    type: ACTION_TYPES.SET_ITEM,
    payload: data
});

//Reset Attachment
export const setMData = (data) => ({
    type: ACTION_TYPES.SET_MDATA,
    payload: data
});