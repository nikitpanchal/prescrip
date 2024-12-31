import analytics from "@react-native-firebase/analytics";

export async function logAnalytics(doctorId, doctorName, Event_Name) {
  try {
    //console.log("Analyzing Screen_Name: " + Screen_Name + " Action: " + Action);

    await analytics().logEvent(Event_Name, {
      docid: doctorId,
      docName: doctorName,
      value: doctorName + doctorId,
    });
  } catch (ex) {
    console.log("Firebase exception : " + ex);
  }
}
export async function logAnalyticsConsultation(Event_Name, consultationObject) {
  try {
    //console.log("Analyzing Screen_Name: " + Screen_Name + " Action: " + Action);

    await analytics().logEvent(Event_Name, consultationObject);
  } catch (ex) {
    console.log("Firebase exception : " + ex);
  }
}

export async function getScreenNameAnalytics(screenData) {
  try {
    //console.log("Analyzing Screen_Name: " + Screen_Name + " Action: " + Action);
  //  alert(JSON.stringify(screenData));
    await analytics().logScreenView(screenData);
  } catch (ex) {
   // console.log("Firebase exception : " + ex);
  }
}

export async function getUserDetailsAnalytics(userData) {
  try {
   // alert(JSON.stringify(userData));
    await analytics().setUserId(userData.userId.substring(0,8));
    await analytics().setUserProperty("doctor", userData.doctorName);
  } catch (ex) {
   // console.log("Firebase exception : " + ex);
  }
}
