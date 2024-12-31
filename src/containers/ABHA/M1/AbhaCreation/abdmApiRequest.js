
import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage";
const apikey="RXKSIbnjklOp19PIKNnsmkOrosxkWO==";
const abdmRequest = async (dataBody, requestConfig) => {
    const token = await AsyncStorage.getItem('token')
    requestConfig.headers.authorization = token;
    requestConfig.headers.apikey = apikey;
    return new Promise((resolve, reject) => {
        axios.request(requestConfig)
            .then((response) => {
                let resdata = response.data;
                if (resdata.txnId || resdata.requestId) {
                    resolve({
                        data: resdata,
                        message: null
                    })
                }
                else if (resdata.code) {
                    if (resdata.details)
                        reject({
                            data: null,
                            message: resdata.details.message
                        })
                    else
                        reject({
                            data: null,
                            message: resdata.message
                        })
                }
                else if (resdata.error) {
                    reject({
                        data: null,
                        message: resdata.error.message
                    })


                }
                else {
                    if (resdata.loginId) {
                        reject({
                            data: null,
                            message: resdata.loginId
                        })
                    }
                    else
                        reject({
                            data: null,
                            message: resdata.error.message
                        })

                }

            })
            .catch((error) => {
                reject({
                    data: null,
                    message: 'Some Error Occured'
                });
            });
    })

}

export { abdmRequest }