import React from 'react';
import Images from '../../Theme/Images';
import {
  ic_profile_image,
  Payment_Share_Icon,
  Need_Help_Icon,
} from '../../constants/images';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { Tooltip } from 'react-native-elements';

export const BillingHeader = ({
  IsRefunded,
  IsCancelled,
  PayType,
  serviceProvided,
  amount,
  leftImageOnClick,
  paymentStatus,
  date,
  time,
  statusImg,
  prescripTxt,
  isReceived,
  props,
}) => {
  const renderDataService = (item, index) => {
    return PayType != 5 ? (
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 6,
          borderWidth: 1,
          height: 18,
          marginVertical: 3,
          marginRight: 10,

          borderColor:
            PayType == 4 && item && item == 'Video Consulation'
              ? '#820091'
              : PayType == 4 && item && item == 'Clinic Appointment'
                ? '#db575a'
                : 'gray',
        }}>
        <Text
          style={{
            paddingHorizontal: 5,
            color:
              PayType == 4 && item == 'Video Consulation'
                ? '#820091'
                : PayType == 4 && item == 'Clinic Appointment'
                  ? '#db575a'
                  : 'gray',
            fontSize: 12,
          }}>
          {item == 'Video Consulation'
            ? 'Video Consulation'
            : item == 'Clinic Appointment'
              ? 'Clinic Appointment'
              : item}
        </Text>
      </View>
    ) : null;
  };

  return (
    <View
      style={{
        flex: serviceProvided ? 0.35 : 0.25,
        flexDirection: 'column',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 20,
      }}>
      <TouchableOpacity onPress={leftImageOnClick}>
        <Image
          source={Images.ic_black_back}
          style={{
            resizeMode: 'contain',
            height: 20,
            width: 20,
            marginVertical: 15,
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: 'NotoSans-Bold',
          color: '#3f3f3f',
        }}>{`Payment ${paymentStatus}`}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 0.9 }}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: 'NotoSans-Bold',
              color:
                IsCancelled || IsRefunded
                  ? '#3f3f3f'
                  : isReceived
                    ? '#2abb29'
                    : '#3f3f3f',
            }}>
            {'\u20B9 ' + amount.toFixed(2)}
          </Text>
        </View>
        <View style={{ flex: 0.1, alignSelf: 'flex-end', alignSelf: 'center' }}>
          <Image
            source={statusImg}
            style={{ resizeMode: 'contain', height: 30, width: 30 }}
          />
        </View>
      </View>

      {PayType == 5 ? null : PayType != 4 && serviceProvided ? (
        <View
          style={{
            marginVertical: 4,
            paddingLeft: 3,
            borderColor:
              prescripTxt == ' Precrip Pay Link ' || prescripTxt == ' Precrip Subscription ' ? '#02798a' : '#57185e',
            borderWidth: 0.5,
            width: prescripTxt == ' Precrip Pay Link ' || prescripTxt == ' Precrip Subscription ' ? 86 : 100,
            borderRadius: 5,
          }}>
          <Text
            style={{
              borderColor:
                prescripTxt == ' Precrip Pay Link ' || prescripTxt == ' Precrip Subscription ' ? '#02798a' : '#57185e',
              color:
                prescripTxt == ' Precrip Pay Link ' || prescripTxt == ' Precrip Subscription ' ? '#02798a' : '#57185e',
              fontSize: 10,
              fontFamily: 'NotoSans',
            }}>
            {prescripTxt}
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {(serviceProvided ? serviceProvided : []).map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  borderRadius: 6,
                  borderWidth: 1,
                  marginVertical: 3,
                  paddingVertical: 2,

                  marginRight: 10,

                  borderColor:
                    PayType == 4 && item && item == 'Video Consulation'
                      ? '#820091'
                      : PayType == 4 && item && item == 'Clinic Appointment'
                        ? '#db575a'
                        : 'gray',
                }}>
                <Text
                  style={{
                    paddingHorizontal: 5,
                    color:
                      PayType == 4 && item == 'Video Consulation'
                        ? '#820091'
                        : PayType == 4 && item == 'Clinic Appointment'
                          ? '#db575a'
                          : 'gray',
                    fontSize: 12,
                  }}>
                  {item == 'Video Consulation'
                    ? 'Video Consulation'
                    : item == 'Clinic Appointment'
                      ? 'Clinic Appointment'
                      : item}
                </Text>
              </View>
            );
          })}
        </View>
      )}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {PayType != 4 ? (
          <Text
            style={{
              fontSize: 12,
              color: '#767676',
              fontFamily: 'NotoSans',
              paddingBottom: 20,
            }}>{`${time}, ${date}`}</Text>
        ) : (
          <Text
            style={{
              fontSize: 12,
              color: '#767676',
              fontFamily: 'NotoSans',
              paddingBottom: 20,
            }}>{`${date}`}</Text>
        )}
      </View>
    </View>
  );
};

export const PatientBillingReceiptPending = ({
  amount,
  shareLink,
  prescripTxt,
  statusImg,
  day,
  time,
  date,
  paymentStatus,
  isReceived,
  RightImageOnClick,
  patientName,
  props,
}) => {
  return (
    <View>
      <View style={{ borderBottomColor: '#d6d6d6', borderBottomWidth: 0.6 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.9 }}>
            <Text
              style={{ color: '#a3a3a3', fontSize: 10, fontFamily: 'NotoSans' }}>
              To
            </Text>
            <Text
              style={{ color: '#0e0e0e', fontSize: 16, fontFamily: 'NotoSans' }}>
              {patientName}
            </Text>
          </View>
          <View style={{ flex: 0.1 }}>
            <Image
              source={ic_profile_image}
              style={{ resizeMode: 'contain', height: 40, width: 40 }}
            />
          </View>
        </View>
        <View style={{ marginVertical: 30 }}>
          <Text
            style={{
              color: '#a3a3a3',
              fontSize: 12,
            }}>{`Remarks: For Video Consultation on ${day}, ${date}`}</Text>
        </View>
        <TouchableOpacity
          onPress={shareLink}
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <Image
            source={Payment_Share_Icon}
            style={{
              resizeMode: 'contain',
              height: 15,
              width: 15,
              marginRight: 5,
            }}
          />
          <Text
            style={{
              color: '#a3a3a3',
              fontSize: 16,
              textTransform: 'uppercase',
              fontFamily: 'NotoSans-Bold',
              color: '#2998ae',
            }}>
            Share Payment link
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text
          style={{
            color: '#3a3a3a',
            fontFamily: 'NotoSans',
            marginVertical: 10,
          }}>
          Note
        </Text>
        <Text
          style={{
            fontSize: 10,
            lineHeight: 18,
            color: '#767676',
            fontFamily: 'NotoSans',
          }}>
          Prescrip deducts the Convienience fee and Technology fee of RS. 25/-
          for each consultations and transfers the rest to Doctor's account
          payment can take upto three working days to be reflected in your
          account.
        </Text>
      </View>

      <TouchableOpacity
        onPress={RightImageOnClick}
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Image
          source={Need_Help_Icon}
          style={{ resizeMode: 'contain', height: 10, width: 10, marginRight: 5 }}
        />
        <Text
          style={{
            color: '#0a62c9',
            fontSize: 10,
            textTransform: 'uppercase',
            fontFamily: 'NotoSans-Bold',
          }}>
          Need Help ?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const PatientBillingReceiptReceived = ({
  transactionFee,
  amount,
  patientName,
  paymentType,
  paymentTypeImg,
  prescripTxt,
  statusImg,
  day,
  time,
  date,
  shareReceipt,
  isReceived,
  fees,
  amountReceived,
  transactionId,
  RightImageOnClick,
  remark,
  paymentStatus,
  profileImg,
  props,
  PayType,
  IsCancelled,
  IsRefunded,
  platformFee,
}) => {
  var arrData = [];

  if (PayType == 5) {
    arrData = [
      {
        amount_name: 'Received Amount',
        amount_money:
          IsRefunded || IsCancelled
            ? amount.toFixed(2)
            : (amount - fees).toFixed(2), //amountReceived
      },
    ];
  } else if (PayType == 7) {
    arrData = [
      {
        amount_name: 'Total Amount',
        amount_money: amount.toFixed(2),
        images: null,
      },

    ];
  } else {


    arrData = [
      {
        amount_name: 'Total Amount',
        amount_money: amount.toFixed(2),
        images: null,
      },
      {
        amount_name: 'Fee',
        amount_money: fees.toFixed(2),
        images: Images.ic_info_blue,
      },
      {
        amount_name: 'Received Amount',
        amount_money: amountReceived.toFixed(2),
        images: null,
      },
    ];
  }

  const renderData = (item, index) => {
    return (
      <View style={{ flexDirection: 'row', padding: 15 }}>
        <View style={{ flex: 0.8, flexDirection: 'row' }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily:
                item.amount_name == 'Received Amount'
                  ? 'NotoSans-Bold'
                  : 'NotoSans',
            }}>
            {item.amount_name}
          </Text>

          {item.images ? (
            <Tooltip
              height={80}
              width={270}
              pointerColor={'#2998ae'}
              containerStyle={{
                alignSelf: 'flex-start',
                alignItems: 'flex-start',
                backgroundColor: '#2998ae',
              }}
              popover={
                <View style={{ flexDirection: 'column' }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontFamily: 'NotoSans',
                    }}>
                    {'Convenience Fee (' +
                      ((transactionFee / amount) * 100).toFixed(2) +
                      '%) = \u20B9 ' +
                      transactionFee.toFixed(2)}{' '}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontFamily: 'NotoSans',
                    }}>
                    {'Technology Fee  = \u20B9 ' + platformFee.toFixed(2)}{' '}
                  </Text>
                </View>
              }>
              <Image
                style={{
                  marginTop: 4,
                  height: 10,
                  width: 10,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                  marginStart: 5,
                }}
                source={item.images}
              />
            </Tooltip>
          ) : null}
        </View>
        <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily:
                item.amount_name == 'Received Amount'
                  ? 'NotoSans-Bold'
                  : 'NotoSans',
              color: item.amount_name == 'Received Amount' ? '#2b2b2b' : '#000',
            }}>{`\u20B9 ${item.amount_money}`}</Text>
        </View>
      </View>
    );
  };
  return (
    <View>
      <View style={{ borderBottomColor: '#d6d6d6', borderBottomWidth: 0.6 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.9 }}>
            <Text style={{ color: '#a3a3a3', fontSize: 10 }}>From</Text>
            <Text
              style={{ color: '#0e0e0e', fontSize: 16, fontFamily: 'NotoSans' }}>
              {patientName}
            </Text>
          </View>
          <View style={{ flex: 0.1 }}>
            <Image
              source={profileImg}
              style={{ resizeMode: 'contain', height: 40, width: 40 }}
            />
          </View>
        </View>
        {IsCancelled || IsRefunded ? null : (
          <View style={{ flexDirection: 'row', marginVertical: 20 }}>
            <View style={{ flex: 0.9 }}>
              <Text style={{ color: '#a3a3a3', fontSize: 10 }}>Using</Text>
              <Text
                style={{
                  color: '#0e0e0e',
                  fontSize: 16,
                  fontFamily: 'NotoSans',
                }}>
                {paymentType}
              </Text>
            </View>
            <View style={{ flex: 0.1 }}>
              <Image
                source={paymentTypeImg}
                style={{ resizeMode: 'contain', height: 25, width: 30 }}
              />
            </View>
          </View>
        )}

        <FlatList
          scrollEnabled={false}
          contentContainerStyle={{ backgroundColor: '#f7f7f7' }}
          style={{ borderRadius: 10, marginTop: 20 }}
          data={arrData}
          renderItem={({ item, index }) => renderData(item, index)}
        />

        <View style={{ marginVertical: 20 }}>
          <Text style={{ color: '#a3a3a3', fontSize: 12 }}>{remark}</Text>
          {PayType == 4 ? null : (
            <Text
              style={{
                color: '#a3a3a3',
                fontSize: 12,
              }}>{`Transaction ID: ${transactionId}`}</Text>
          )}
        </View>
        {IsCancelled || IsRefunded ? null : (
          <TouchableOpacity
            onPress={shareReceipt}
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
              marginBottom: 30,
            }}>
            <Image
              source={Payment_Share_Icon}
              style={{
                resizeMode: 'contain',
                height: 15,
                width: 15,
                marginRight: 5,
              }}
            />
            <Text
              style={{
                color: '#a3a3a3',
                fontSize: 16,
                textTransform: 'uppercase',
                fontFamily: 'NotoSans-Bold',
                color: '#2998ae',
              }}>
              Share Receipt
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {PayType != 7 ?
        <View>
          <Text
            style={{
              color: '#3a3a3a',
              fontFamily: 'NotoSans',
              marginVertical: 10,
            }}>
            Note
          </Text>
          <Text
            style={{
              fontSize: 10,
              lineHeight: 18,
              color: '#767676',
              fontFamily: 'NotoSans',
            }}>
            {IsRefunded == 1 && IsCancelled == null
              ? 'Refund process usually takes around 2 - 5 working days.\n Ask your patient to check their respective bank account for refunded amount'
              : PayType == 4
                ? 'This payment entry has been manually entered by you, Prescrip holds no responsibility for such payment records.'
                : 'Prescrip deducts the Convenience fee and Technology fee of RS. ' +
                fees.toFixed(2) +
                "/- for each consultations and transfers the rest to Doctor's account payment can take upto three working days to be reflected in your account."}
          </Text>
        </View>
        : null}
      {PayType == 4 || IsCancelled || IsRefunded ? null : (
        <TouchableOpacity
          onPress={RightImageOnClick}
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={Need_Help_Icon}
            style={{
              resizeMode: 'contain',
              height: 10,
              width: 10,
              marginRight: 5,
            }}
          />
          <Text
            style={{
              color: '#0a62c9',
              fontSize: 10,
              textTransform: 'uppercase',
              fontFamily: 'NotoSans-Bold',
            }}>
            Need Help ?
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
