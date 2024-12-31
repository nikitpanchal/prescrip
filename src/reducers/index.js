import { combineReducers } from "redux";
//import { reducer as formReducer } from "redux-form";
import { reducer as modalReducer } from "redux-modal";
import authReducers from "./auth";
import previewReducer from "./previewsettings";
import doctorProfile from "./doctorProfile";
import patientvisit from "./patientvisit";
import tab from "./TabsExample";
import patient from "./patient";
import patientProfile from './patientProfile';
import appointments from './appointments';
import attachment from './attachment';
import dosage from './dosage'
import sync from './sync';
import home from './home';
import certificates from './certificates';
import tooltip from './tooltip';
import opthal from './opthal';
import opthallist from './opthallist';
import settings from './settings';
export default combineReducers({
  //form: formReducer,
  modal: modalReducer,
  auth: authReducers,
  previewReducer,
  doctorProfile,
  patientProfile,
  tab,
  appointments,
  patientvisit,
  patient,
  attachment,
  dosage,
  sync,
  certificates,
  home,
  tooltip,
  opthal,
  opthallist,
  settings,
});
