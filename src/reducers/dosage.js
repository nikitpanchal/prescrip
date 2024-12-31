import * as ACTION_TYPES from "../constants/action-types";

const initialState = {
  medicine : {
    form : [null,-1],
    brand : [null,-1],
    generic : null,
    dose : [null,-1],
    regimen : [null,-1],
    duration : [null,-1],
    startfrom : null,
    reminder : false,
    schedule : null,
    customBrand : false,
    MostUsed : [],
    editIndex : -1,
    remarks : null,
  },
  medicineList :[],
  currentView : 'Dosage Form',
  customBrand :null,
  dosageFlow:[
    {
        name : 'Dosage Form',
        selected :false,
        value : '',
        valueIndex : 0  
    },
    {
        name : 'Brand Name',
        selected : false,
        value : '',
        valueIndex : 0    
    },
    {
        name : 'Dose',
        selected : false,
        value : '',
        valueIndex : 0    
    },
    {
        name : 'Dose Regime',
        selected : false,
        value : '',
        valueIndex : 0    
    },
    {
        name : 'Duration',
        selected : false,
        value : '',
        valueIndex : 0    
    }

]
  
};
export default (state = initialState, action) => {
  const { type, payload, error } = action;

  switch (type) {
    case ACTION_TYPES.SET_MEDICINE:
      return {
        ...state,
        medicine : payload.med,
        dosageFlow : payload.flow
      };
      case ACTION_TYPES.SET_MED_CURRENTVIEW:
        return{
          ...state,
          currentView : payload
        };
        case ACTION_TYPES.ADD_TO_PRESCRIPTION:
          return{
            ...state,
            medicineList : payload
          }
          case ACTION_TYPES.SET_CUSTOM_BRAND:
            return{
              ...state,
              customBrand :payload,
            }
          case ACTION_TYPES.RESET_MEDICINE:
            return{
              ...state,
              medicine : {
                form : [null,-1],
                brand : [null,-1],
                generic : null,
                dose : [null,-1],
                regimen : [null,-1],
                duration : [null,-1],
                startfrom : null,
                reminder : false,
                schedule : null,
                editIndex : -1,
                customBrand : false,
                MostUsed : null,
                remarks : null,
              },
              customMedicine :null,
              currentView : 'Dosage Form',
            }
    default:
      return state;
  }
};