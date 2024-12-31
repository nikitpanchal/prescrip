/* eslint-disable prettier/prettier */
/* eslint-disable no-irregular-whitespace */
var RNFS = require('react-native-fs')


var TEST_DATA = `<?xml version="1.0" encoding="UTF-8"?>
 <App>
    <Dealer>
       <Dealer_UID>0000001</Dealer_UID>
       <Dealer_Instance>d2495h5j685904j4k4h4h</Dealer_Instance>
       <Dealer_Status>Active</Dealer_Status>
       <Dealer_Level>Bronze</Dealer_Level>
       <Dealer_Company>ACME ELECTRONICS</Dealer_Company>
       <Dealer_GST>G1Z123456781ZA</Dealer_GST>
       <Dealer_Name>Sanjay</Dealer_Name>
       <Dealer_Surname>Shah</Dealer_Surname>
       <Dealer_email1>ss@gmail.com</Dealer_email1>
       <Dealer_email2>ss@gmail.com</Dealer_email2>
       <Dealer_Mobile1>+9820098200</Dealer_Mobile1>
       <Dealer_Mobile2>NA</Dealer_Mobile2>
       <Dealer_Phone1>+912260020030</Dealer_Phone1>
       <Dealer_Phone2>+912260020032</Dealer_Phone2>
       <Dealer_Address>
          <Address_Rev>1</Address_Rev>
          <Flat_No>100</Flat_No>
          <Floor>3</Floor>
          <Building>Softhouse</Building>
          <Road>SV Road</Road>
          <Area>Bandra West</Area>
          <Landmark>HP Petrol pump</Landmark>
          <City>Mumbai</City>
          <State>Maharashtra</State>
          <Zip>4000212</Zip>
          <Country>India</Country>
       </Dealer_Address>
    </Dealer>
    <App_Data>
       <UID>00000000000001</UID>
       <Uinstance>abced567ystehdjl</Uinstance>
       <Dealer_link>ACME ELECTRONICS</Dealer_link>
       <Dealer_SaleRef>30400 11.01.2016</Dealer_SaleRef>
       <Installer_link>ABC_Electricals</Installer_link>
       <Creation_Date>01/02/2019</Creation_Date>
       <Update_Date>01/02/2019</Update_Date>
       <Preferences>
          <DHCP>Off</DHCP>
          <Local_IP>Local_IP&gt;192.168.1.200</Local_IP>
          <Static_IP>202.30.56.88</Static_IP>
          <dyn_IP>tanmay_noip.com</dyn_IP>
          <Use_Local>TRUE</Use_Local>
          <Use_Static>TRUE</Use_Static>
          <Use_dyn>FALSE</Use_dyn>
          <Use_Auto_Network_GPS>FALSE</Use_Auto_Network_GPS>
          <Use_Skins>FALSE</Use_Skins>
          <Current_SKIN>1</Current_SKIN>
          <Preferred_Start_Page>Home</Preferred_Start_Page>
       </Preferences>
    </App_Data>
    <User_Settings>
       <User_count>3</User_count>
       <User_data>
          <id>1</id>
          <Account_Status>VALID</Account_Status>
          <Cloud_acess>1</Cloud_acess>
          <Event_acess>0</Event_acess>
          <Notification_acess>0</Notification_acess>
          <User_Type>ADMIN</User_Type>
          <Installation_status>INSTALLED</Installation_status>
          <User_id>tanmaypatil@xyz.com</User_id>
          <Mobile>+919820012345</Mobile>
          <Restrict_location>0</Restrict_location>
          <Restrict_room>0</Restrict_room>
          <Validity />
       </User_data>
       <User_data>
          <id>2</id>
          <Account_Status>VALID</Account_Status>
          <Cloud_acess>1</Cloud_acess>
          <Event_acess>0</Event_acess>
          <Notification_acess>0</Notification_acess>
          <User_Type>USER</User_Type>
          <Installation_status>INSTALLED</Installation_status>
          <User_id>sk@xyz.com</User_id>
          <Mobile>+919820065650</Mobile>
          <Restrict_location>0</Restrict_location>
          <Restrict_room>0</Restrict_room>
          <Validity />
       </User_data>
       <User_data>
          <id>3</id>
          <Account_Status>VALID</Account_Status>
          <Cloud_acess>1</Cloud_acess>
          <Event_acess>0</Event_acess>
          <Notification_acess>0</Notification_acess>
          <User_Type>GUEST</User_Type>
          <Installation_status>INSTALLED</Installation_status>
          <User_id>skguest@xyz.com</User_id>
          <Mobile>+919820070000</Mobile>
          <Restrict_location>0</Restrict_location>
          <Restrict_room>0</Restrict_room>
          <Validity />
       </User_data>
    </User_Settings>
    <Locations>
       <Location_Count>2</Location_Count>
       <Location>
          <Location_ID>1</Location_ID>
          <Location_Name>Home</Location_Name>
          <Latitude>19.25.66</Latitude>
          <Longitude>78.22.33</Longitude>
          <ContactNo>+9122600200500</ContactNo>
          <ContactNo>+919820098200</ContactNo>
          <Email>tanmaypatil2@xyz.com</Email>
          <Address>
             <Flat_No>102</Flat_No>
             <Floor>3</Floor>
             <Building>Firmware Heights</Building>
             <Road>SV Road</Road>
             <Area>Worli Sea face</Area>
             <Landmark>TV Tower</Landmark>
             <City>Mumbai</City>
             <State>Maharashtra</State>
             <Zip>560212</Zip>
             <Country>India</Country>
          </Address>
          <Rooms />
       </Location>
       <Location>
          <Location_ID>2</Location_ID>
          <Location_Name>Farmhouse</Location_Name>
          <Latitude>19.35.66</Latitude>
          <Longitude>78.32.33</Longitude>
          <ContactNo>+9122600200501</ContactNo>
          <ContactNo>+919820098201</ContactNo>
          <Email>tanmaypatil2@xyz.com</Email>
          <Address>
             <Flat_No>102</Flat_No>
             <Floor>3</Floor>
             <Building>Firmware Heights</Building>
             <Road>SV Road</Road>
             <Area>Worli Sea face</Area>
             <Landmark>TV Tower</Landmark>
             <City>Mumbai</City>
             <State>Maharashtra</State>
             <Zip>560212</Zip>
             <Country>India</Country>
          </Address>
          <Rooms>
             <Room_count>5</Room_count>
             <Room>
                <Room_ID>2</Room_ID>
                <Location_ID>1</Location_ID>
                <Room_Name>Living</Room_Name>
                <Room_UI_theme>2</Room_UI_theme>
                <Room_layout>1</Room_layout>
                <Room_layout_scale>1</Room_layout_scale>
                <Room_layout_orient>0</Room_layout_orient>
                <Room_lighting />
                <Room_curtains />
                <Room_fan />
                <Room_ac />
                <Room_media />
                <Room_security />
                <Room_camera />
                <Room_favourites />
                <Room_UI>
                   <Room_Icon />
                   <Room_Theme />
                </Room_UI>
             </Room>
             <Room>
                <Room_ID>2</Room_ID>
                <Room_Name>Dining</Room_Name>
                <Room_UI_theme>2</Room_UI_theme>
                <Room_layout>1</Room_layout>
                <Room_layout_scale>1</Room_layout_scale>
                <Room_layout_orient>0</Room_layout_orient>
                <Room_lighting />
                <Room_curtains />
                <Room_fan />
                <Room_ac />
                <Room_media />
                <Room_security />
                <Room_camera />
                <Room_favourites />
                <Room_UI>
                   <Room_Icon />
                   <Room_Theme />
                </Room_UI>
             </Room>
             <Room>
                <Room_ID>3</Room_ID>
                <Room_Name>Master Bed</Room_Name>
                <Room_UI_theme>2</Room_UI_theme>
                <Room_layout>1</Room_layout>
                <Room_layout_scale>1</Room_layout_scale>
                <Room_layout_orient>0</Room_layout_orient>
                <Room_lighting />
                <Room_curtains />
                <Room_fan />
                <Room_ac />
                <Room_media />
                <Room_security />
                <Room_camera />
                <Room_favourites />
                <Room_UI>
                   <Room_Icon />
                   <Room_Theme />
                </Room_UI>
             </Room>
             <Room>
                <Room_ID>4</Room_ID>
                <Room_Name>Childrens Bed</Room_Name>
                <Room_UI_theme>2</Room_UI_theme>
                <Room_layout>1</Room_layout>
                <Room_layout_scale>1</Room_layout_scale>
                <Room_layout_orient>0</Room_layout_orient>
                <Room_lighting />
                <Room_curtains />
                <Room_fan />
                <Room_ac />
                <Room_media />
                <Room_security />
                <Room_camera />
                <Room_favourites />
                <Room_UI>
                   <Room_Icon />
                   <Room_Theme />
                </Room_UI>
             </Room>
             <Room>
                <Room_ID>5</Room_ID>
                <Room_Name>Guest</Room_Name>
                <Room_UI_theme>2</Room_UI_theme>
                <Room_layout>1</Room_layout>
                <Room_layout_scale>1</Room_layout_scale>
                <Room_layout_orient>0</Room_layout_orient>
                <Room_lighting />
                <Room_curtains />
                <Room_fan />
                <Room_ac />
                <Room_media />
                <Room_security />
                <Room_camera />
                <Room_favourites />
                <Room_UI>
                   <Room_Icon />
                   <Room_Theme />
                </Room_UI>
             </Room>
          </Rooms>
       </Location>
    </Locations>
    <Log>
       <LogEntry>28/11/2017 14:45 Added Location 1</LogEntry>
       <LogEntry>28/11/2017 16:02 Updated Location 1/Hub/Hub_Password/12345^</LogEntry>
    </Log>
    <Account_Info>
       <Account_Status>Active</Account_Status>
       <Start_Date>01.01.2017</Start_Date>
       <Last_Active>20.09.2017</Last_Active>
       <Last_Backup>15.08.2017</Last_Backup>
       <Last_Restore>01.01.2017</Last_Restore>
       <Address>
          <Flat_No>102</Flat_No>
          <Floor>3</Floor>
          <Building>Firmware Heights</Building>
          <Road>SV Road</Road>
          <Area>Worli Sea face</Area>
          <Landmark>TV Tower</Landmark>
          <City>Mumbai</City>
          <State>Maharashtra</State>
          <Zip>560212</Zip>
          <Country>India</Country>
       </Address>
    </Account_Info>
 </App>`

export default {
  TEST_DUMMY_DATA: TEST_DATA,
  DEVICE_TYPE_ALL: 1,
  DEVICE_TYPE_LIGHT: 2,
  DEVICE_TYPE_FAN: 3,
  DEVICE_TYPE_CURTAINS: 4,
  DEVICE_TYPE_AC: 5,
  DEVICE_TYPE_MEDIA: 6,
  DEVICE_TYPE_SECURITY: 7,

  KEY_DEVICE_SCAN_KEYWORD: 'RAYLOGIC_',
  KEY_DEVICE_IP: 'http://192.168.4.1:80/',
  API_GET_DEVICE_DATA: 'devicedata', // 1
  API_GET_NETWORK: 'network', // 2
  API_POST_SETTINGS_NETWORK: 'settingsnetwork', // 3
  API_GET_MQTT: 'mqtt', // 4
  API_POST_SETTINGS_MQTT: 'settingsmqtt', // 5
  API_GET_CONFIG_MOD: 'configmod', // 6
  API_POST_SETTINGS_CONFIG: 'settingsconfig', // 7

  // Device Config constatns
  KEY_INDEX: 'index',
  // GET DEVICE DATA KEYS
  KEY_MODEL_NO: 'Model_no',
  KEY_MODEL_NAME: 'Model_name',
  KEY_FIRMWARE_VER: 'Firmware_ver',
  KEY_FIRMWARE_VER_2: 'Firmware_ver_2',
  KEY_HARDWARE_VER: 'Hardware_ver',
  KEY_DATE_CONFIGURATION: 'date_of_configuration',
  KEY_SERIAL_1: 'Serial_1',
  KEY_SERIAL_2: 'Serial_2',
  KEY_MAC_ID_STA: 'Mac_id_Sta',
  KEY_MAC_ID_AP: 'Mac_id_AP',
  KEY_DOM: 'DoM',
  KEY_BATCH_NO: 'Batch_no',
  KEY_SERVICE_NO: 'Service_no',
  KEY_NAME: 'Name',
  KEY_SPECIAL_1: 'Special_1',
  KEY_SPECIAL_2: 'Special_2',
  KEY_SPECIAL_3: 'Special_3',
  KEY_SPECIAL_4: 'Special_4',

  ARRAY_DEVICE_DATA: [
    'Model_no', 'Model_name', 'Firmware_ver', 'Firmware_ver_2', 'Hardware_ver',
    'date_of_configuration', 'Serial_1', 'Serial_2', 'Mac_id_Sta', 'Mac_id_AP',
    'DoM', 'Batch_no', 'Service_no', 'Name',
    'Special_1', 'Special_2', 'Special_3', 'Special_4'
  ],

  // GET NETWORK KEYS && POST NETWORK_SETTINGS KEY
  ARRAY_NETWORK_SETINGS: [
    'SSID',
    'Password',
    'IP_Add',
    'Subnet_Add',
    'Gateway_Add',
    'DHCP',
    'User_ID',
    'Location_ID',
    'Room_ID',
    'Device_ID',
    'Device_mdns_name',
  ],

  ARRAY_MQTT_SETTINGS: [
    'Mqtt_Host',
    'Port',
    'Client_name',
    'MQTTONOFF',
    'Auto_Reconnect',
    'Packet_Timeout',
    'Command_Timeout',
    'TLS_HandshakeTimeout',
    'KeepAliveInterval',
    'isSSLHostnameVerify',
    'Struct_id1',
    'Struct_id2',
    'MQTTVersion',
    'isCleanSession',
    'isWillMsgPresent',
    'Username',
    'Password',
    'isRetained',
    'QOS',
    'Echo',
    'Topic1',
    'Topic2',
    'Topic3',
    'Topic4',
  ],

  ARRAY_CONFIG_MOD: [
    'cpw0', 'cpw1', 'cpw2', 'cpw3', 'cpw4', 'cpw5', 'cpw6', 'cpw7', 'cpw8', 'cpw9',
    'cpw10', 'cpw11', 'cpw12', 'cpw13', 'cpw14', 'cpw15', 'cpw16', 'cpw17', 'cpw18', 'cpw19',
    'cpw20', 'cpw21', 'cpw22', 'cpw23', 'cpw24', 'cpw25', 'cpw26', 'cpw27', 'cpw28', 'cpw29',
    'cpw30', 'cpw31', 'cpw32', 'cpw33', 'cpw34', 'cpw35', 'cpw36', 'cpw37', 'cpw38',
  ],

  ARRAY_CHANNEL_VALUE: ['Ch1_value', 'Ch2_value', 'Ch3_value', 'Ch4_value', 'Ch5_value', 'Ch6_value', 'Ch7_value', 'Ch8_value'],
  ARRAY_MASK_VALUE: ['Ch1_mask', 'Ch2_mask', 'Ch3_mask', 'Ch4_mask', 'Ch5_mask', 'Ch6_mask', 'Ch7_mask', 'Ch8_mask'],
  ARRAY_TYPE_VALUE: ['Ch1_type', 'Ch2_type', 'Ch3_type', 'Ch4_type', 'Ch5_type', 'Ch6_type', 'Ch7_type', 'Ch8_type'],
  ARRAY_NAME_VALUE: ['Chan1_name', 'Chan2_name', 'Chan3_name', 'Chan4_name', 'Chan5_name', 'Chan6_name', 'Chan7_name', 'Chan8_name'],

  KEY_SSID: 'SSID',
  KEY_PASSWORD: 'Password',
  KEY_IP_ADD: 'IP_Add',
  KEY_SUBNET_ADD: 'Subnet_Add',
  KEY_GATEWAY_ADD: 'Gateway_Add',
  KEY_DHCP: 'DHCP',
  KEY_USER_ID: 'User_ID',
  KEY_LOCATION_ID: 'Location_ID',
  KEY_ROOM_ID: 'Room_ID',
  KEY_DEVICE_ID: 'Device_ID',
  KEY_DEVICE_MDNS_NAME: 'Device_mdns_name',

  // POST CONFIG SETTINGS **Use this key multiple times
  KEY_CPW_0: 'cpw0',
  KEY_CPW_1: 'cpw1',
  KEY_CPW_2: 'cpw2',
  KEY_CPW_3: 'cpw3',
  KEY_CPW_4: 'cpw4',
  KEY_CPW_5: 'cpw5',
  KEY_CPW_6: 'cpw6',
  KEY_CPW_7: 'cpw7',
  KEY_CPW_8: 'cpw8',
  KEY_CPW_9: 'cpw9',
  KEY_CPW_10: 'cpw10',
  KEY_CPW_11: 'cpw11',
  KEY_CPW_12: 'cpw12',
  KEY_CPW_13: 'cpw13',
  KEY_CPW_14: 'cpw14',
  KEY_CPW_15: 'cpw15',
  KEY_CPW_16: 'cpw16',
  KEY_CPW_17: 'cpw17',
  KEY_CPW_18: 'cpw18',
  KEY_CPW_19: 'cpw19',
  KEY_CPW_20: 'cpw20',
  KEY_CPW_21: 'cpw21',
  KEY_CPW_22: 'cpw22',
  KEY_CPW_23: 'cpw23',
  KEY_CPW_24: 'cpw24',
  KEY_CPW_25: 'cpw25',
  KEY_CPW_26: 'cpw26',
  KEY_CPW_27: 'cpw27',
  KEY_CPW_28: 'cpw28',
  KEY_CPW_29: 'cpw29',
  KEY_CPW_30: 'cpw30',
  KEY_CPW_31: 'cpw31',
  KEY_CPW_32: 'cpw32',
  KEY_CPW_33: 'cpw33',
  KEY_CPW_34: 'cpw34',
  KEY_CPW_35: 'cpw35',
  KEY_CPW_36: 'cpw36',
  KEY_CPW_37: 'cpw37',
  KEY_CPW_38: 'cpw38',

  // Seperator,Joiner, prefix, Sufix & Terminators
  KEY_CR: ' ', // \r will be used in future
  KEY_PREFIX: '&',
  KEY_JOIN: '=',
  KEY_TERMINATOR: '&$',
  KEY_CR_TCP: '\r',

  KEY_DATA_JOINER: '&#$',

  // ====================
  KEY_START_DEVICE_ID: '21',

  

  // DATASYNC MAP KEYS
  MAP_KEY_ACCOUNT: 'mapAccount',
  MAP_KEY_PREFERENCES: 'mapPreferences',
  MAP_KEY_USER: 'mapUser',
  MAP_KEY_DEALER: 'mapDealer',
  MAP_KEY_LOCATION: 'mapLocation',
  MAP_KEY_ROOMS: 'mapRooms',
  MAP_KEY_SCENE: 'mapScene',
  MAP_KEY_SCENE_DATA: 'mapSceneData',
  MAP_KEY_SCENE_OBJECT: 'mapSceneObject',
  MAP_KEY_SCHEDULE: 'mapSchedule',


  MAP_KEY_DEVICE_HARDWARE_SETTINGS: 'mapDeviceHardwareSetting',
  MAP_KEY_DEVICE_MQTT_SETTINGS: 'mapDeviceMqttSettings',
  MAP_KEY_DEVICE_NETWORK_SETTINGS: 'mapDeviceNetworkSettings',
  MAP_KEY_LIGHT_DEVICE: 'mapLightDevice',
  MAP_KEY_LIGHT_DEVICE_SETTINGS: 'mapLightDeviceSettings',
  MAP_KEY_LIGHT_CONFIG_SETTINGS: 'mapLightConfigSettings',
  MAP_KEY_TCP_CONNECTION: 'mapTcpConnection',
  MAP_KEY_CHANNEL_SETTINGS: 'mapCahnnelSettings',

  MAP_KEY_DEVICE_DATA: 'mapDeviceData',
  MAP_KEY_NETWORK_DATA: 'mapNetworkData',
  MAP_KEY_CONFIG_MOD_DATA: 'mapConfigModData',
  MAP_KEY_MQTT_DATA: 'mapMqttData',
  MAP_KEY_MOD_DEVICE: 'mapModDevice',
  MAP_KEY_CURRENT_STATUS: 'mapCurrentStatus',

  /* MAP_KEY_:"", */

  FILE_DIRECTORY: RNFS.DocumentDirectoryPath,
  FILE_NAME: '/raylogic.txt',

  CHANNEL_RELAY: '0',
  CHANNEL_DIMMER: '1',
  CHANNEL_FAN: '2',
  CHANNEL_CURTAIN: '3',

  DEFAULT_COMMAND_INDEX: '000',

  DATA_CONST_AR: '*AR=',
  DATA_FIX_BYTE: '00',
  DATA_COMMAND_TYPE: '1A',
  DATA_CONST_AR_STATUS: '?AR40=',
  DATA_CONST_AR_STATUS_RESPONSE: '+AR40=',

  DATA_COMMAND_TYPE_OPEN_CLOSE: '27',
  DATA_COMMAND_TYPE_STOP: '26',

  COMMAND_RELAY_ON: '02',
  COMMAND_RELAY_OFF: '01',

  COMMAND_DIMMER_ON: '01',
  COMMAND_DIMMER_OFF: 'FF',

  COMMAND_FAN_OFF: '01',
  COMMAND_FAN_SPEED_1: '02',
  COMMAND_FAN_SPEED_2: '03',
  COMMAND_FAN_SPEED_3: '04',
  COMMAND_FAN_SPEED_4: '05',

  COMMAND_CURTAIN_CLOSE: '01',
  COMMAND_CURTAIN_OPEN: '02',
  COMMAND_CURTAIN_STOP: '00',

  CONST_TYPE_OPEN: 0,
  CONST_TYPE_CLOSE: 1,
  CONST_TYPE_STOP: 2,
  // =====================
  TEST_DEVICE_ID: '23',

  TEST_TCP_IP: '192.168.1.171',
  TEST_TCP_PORT: 5550,

  EVENT_ON_TCP_RECEIVE: 'onTcpReceive',
  EVENT_ON_TCP_RECEIVE_CURTAIN: 'onTcpReceiveCurtain',
  EVENT_ON_SCENE_TRIGGERED: 'onSceneTriggered',
  EVENT_ON_DATA_LOAD: 'onDataLoad'
}

/**
 * &cpw0=0&cpw1=1&cpw2=0&cpw3=0&cpw4=0&cpw5=0&cpw6=6&cpw7=7&cpw8=0&cpw9=9&cpw10=10
&cpw11=0&cpw12=&cpw13=&cpw14=&cpw15=0&cpw16=0&cpw17=Relay 1&cpw18=1&cpw19=1&cpw20=255
&cpw21=&cpw22=0&cpw23=0&cpw24=Dimmer 1&cpw25=0&cpw26=&cpw27=&cpw28=&cpw29=0&cpw30=0
&cpw31=Relay 2&cpw32=2&cpw33=&cpw34=&cpw35=&cpw36=0&cpw37=0&cpw38=Fan 1&$
 */
