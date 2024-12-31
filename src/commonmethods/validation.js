//12.00 AM to 4.00 am : Good Night
//4.00 am - 12.00 pm - Good morning
//12.00 - 4.00 pm - after noon
//4.00 - 12.00 am - Eveenibg
export const getDayWishes = () => {
    var today = new Date()
    var curHr = today.getHours()

    if (curHr < 4) {
        return 'Good night'
    }
    else if (curHr < 13) {
        return 'Good morning'
    }
    else if (curHr < 17) {
        return 'Good afternoon'
    } else {
        return 'Good evening'
    }
}

export const getCurreny = () => {
    return '₹'
}

export const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const monthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const oneToNinenine = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];

export const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export const period = ["Day(s)", "Month(s)", "Year(s)"];

export const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const getTime = (dateString) => {
    var systemDate = new Date(dateString);
    var hours = systemDate.getHours();
    var minutes = systemDate.getMinutes();
    var strampm;
    if (hours >= 12) {
        strampm = "PM";
    } else {
        strampm = "AM";
    }
    hours = hours % 12;
    if (hours == 0) {
        hours = 12;
    }
    var _hours = hours < 10 ? "0" + hours : hours;
    var _minutes = minutes < 10 ? "0" + minutes : minutes;

    return _hours + ":" + _minutes + " " + strampm;
}

export const getDateDiffFromToday = (dateString) => {
    var today = new Date();
    var enterDate = new Date(dateString);
    const diffTime = Math.abs(today - enterDate);

    if (today.getDate() == enterDate.getDate()) {
        const diffDays = 0;
        return diffDays;

    } else {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


        return diffDays;
    }

}

export const Difference_In_Days = (dateString) => {
    var today = new Date();
    var enterDate = new Date(dateString);
    // To calculate the time difference of two dates 
    var Difference_In_Time = enterDate.getTime() - today.getTime();

    // To calculate the no. of days between two dates 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days;
}

export const hasSpecialCharacter = (input, field) => {
    //Regex for Valid Characters i.e. Alphabets, Numbers and Space.
    var regex = /^[A-Za-z0-9 ]+$/

    //Validate TextBox value against the Regex.
    var isValid = regex.test(input);
    if (!isValid) {
        return {
            isvalid: true,
            msg: "Please enter valid " + field

        };

    } else {
        return { isvalid: false, msg: "" };//"Does not contain Special Characters.";
    }

};

export const getYears = (date1, date2) => {
    let years = new Date(date1).getFullYear() - new Date(date2).getFullYear();
    let month = new Date(date1).getMonth() - new Date(date2).getMonth();
    let dateDiff = new Date(date1).getDay() - new Date(date2).getDay();
    if (dateDiff < 0) {
        month -= 1;
    }
    if (month < 0) {
        years -= 1;
    }
    return years;
}

export const isPincodeValid = (input, field) => {

    if (input.length == 6) {
        return {
            isvalid: true,
            msg: ""
        }

    } else {
        return {
            isvalid: false,
            msg: "Please enter valid " + field
        }
    }
}

export const isNameValid = (input, field) => {
    let regex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/
    var isValid = regex.test(input);
    if (!isValid) {
        return {
            isvalid: false,
            msg: "Please enter valid " + field
        }

    } else {
        return {
            isvalid: true,
            msg: ""
        }
    }
}

export const isAddressValid = (input, field) => {
    let regex = /^[a-zA-Z0-9\s,.'-]{3,}$/
    var isValid = regex.test(input.trim());
    if (!isValid) {
        return {
            isvalid: false,
            msg: "Please enter valid " + field
        }

    } else {
        return {
            isvalid: true,
            msg: ""
        }
    }
}






export const isName = (input) => {
    // let regex = /^[A-Za-z]+$/;
    let regex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/


    let regex1 = /^[0-9]+$/;

    if (regex.test(input.trim())) {
        return 'name';
    } else if (regex1.test(input.trim())) {
        return 'number';
    } else {
        return 'false';
    }


}


export const isEmailValid = (input, field) => {
    let regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    var isValid = regex.test(input.trim());
    if (!isValid) {
        return {
            isvalid: false,
            msg: "Please enter valid " + field
        }

    } else {
        return {
            isvalid: true,
            msg: ""
        }
    }
}

export const isValidIfsc = (input, field) => {
    let regex = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;

    var isValid = regex.test(input);
    if (!isValid) {
        return {
            isvalid: false,
            msg: "Please enter valid " + field
        }

    } else {
        return {
            isvalid: true,
            msg: ""
        }
    }
}

export const isPhoneno = (input, field) => {
    let regex = /\d{10,}/
    var isValid = regex.test(input);
    if (!isValid) {
        return {
            isvalid: false,
            msg: "Please enter valid " + field
        }

    } else {
        return {
            isvalid: true,
            msg: ""
        }
    }
}

export const isValidPanCard = (input, field) => {

    let regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    var isValid = regex.test(input);
    if (!isValid) {
        return {
            isvalid: false,
            msg: "Please enter valid " + field
        }

    } else {
        return {
            isvalid: true,
            msg: ""
        }
    }
}

export const isValidContactNo = (input, field) => {

    let regex = /^[0-9]\d{2,4}-\d{6,8}$/
    var isValid = regex.test(input);
    if (!isValid) {
        return {
            isvalid: false,
            msg: "Please enter valid " + field
        }

    } else {
        return {
            isvalid: true,
            msg: ""
        }
    }
}
export const isValidCountryCode = (input, field) => {
    let regex = /^\+(\d{1}\-)?(\d{1,3})$/;
    var isValid = regex.test(input);
    if (!isValid) {
        return {
            isvalid: false,
            msg: "Please enter valid " + field
        }

    } else {
        return {
            isvalid: true,
            msg: ""
        }
    }
}
export const isImageValid = /\.(gif|jpg|jp|jpeg|tiff|png)$/i

//End