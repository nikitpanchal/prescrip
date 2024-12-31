import * as ACTION_TYPES from "../constants/action-types";
import { patientvisits } from "./patientVisit";
//Set Medicine
export const setMedicine = (med, flow) => ({

     type: ACTION_TYPES.SET_MEDICINE,
     payload: { med, flow }
});


//Add Medication to List
export const addToPrescription = (list) => ({
     type: ACTION_TYPES.ADD_TO_PRESCRIPTION,
     payload: list
});


//SET CURRENT VIEW in Dosage Flow
export const setCurrentDosageView = (view) => ({

     type: ACTION_TYPES.SET_MED_CURRENTVIEW,
     payload: view
});
export const resetMedicine=()=>({
     type : ACTION_TYPES.RESET_MEDICINE,
     payload : null
});
export const setPrescriptionMedicine=(patientvisitid,data)=>({
     types :[ACTION_TYPES.PRESCRIPTION_MED_REQUESTED,
     ACTION_TYPES.PRESCRIPTION_MED_SUCCESS],
     payload :{
          client: "default",
          request: {
            method: "PATCH",
            url: "/patientvisits/add-medication/" + patientvisitid,
            data: data
          }
     }
})
//ADD MEDICINCE TO SERVER
export const addCustomMedicine=(data)=>({
     types:[
          ACTION_TYPES.ADD_CUST_MEDICINE_REQUESTED,
          ACTION_TYPES.ADD_CUST_MEDICINE_SUCCESS
     ],
     payload :{
          client : 'default',
          request :{
               method : 'POST',
               url :'/add-update-new-dose',
               data : data
          }
     }

});
export const setCustomBrand=(brand)=>({
     type : ACTION_TYPES.SET_CUSTOM_BRAND,
     payload:brand
})