import * as ACTION_TYPES from "../constants/action-types";


// {
//   rows : 4,
//   column : 3,
//   Column_Label : ["Sphere", "Cylinder", "Axis"],
//   Row_Label : ["Undilated AR Reading", "Dilated AR Reading", "Undilated Retinoscopy", "Dilated Retinoscopy"],
//   Name : "Picker",
//   Value : [
//     [1,2,3], [1,2,3], [1,2,3],
//     [1,2,3], [1,2,3], [1,2,3],
//     [1,2,3], [1,2,3], [1,2,3],
//     [1,2,3], [1,2,3], [1,2,3],
// ]
// }

const initialState = {
  Screen1: {
    Title: "Advanced Examination",
    Section: "Optometry Record",
    Subsection: "Ocular History",
    Section: "Optometry Record",
    Section: "Optometry Record",
  },
  Screen: {
    Description: "Stores Opthal Record",
    //ValuesType: "string array",
    Header: {
      Elements: [{
        Name: "Text",
        Subtitle: "Optometry Record",
        Label: "Ocular History",
        Values: ["Right Eye", "Left Eye"]
      }]
    },
    Footer: {
      Title: "Next /n Spectacle Prescription",
      Elements: [{
        Name: "Text",
        Label: "Next /n Spectacle Prescription",
        Subtitle: "Spectacle Prescription",
        Position: "Center",
      }, {
        Icon: "Right_Arrow",
        Navigate: "SpectaclePrescription",
        Position: "Right",
      }]
    },
    Body: {
      Elements: [{
        Name: "TopNavigator",
        //Label: ["Right Eye", "Left Eye"],
        //Values: ["Right Eye", "Left Eye"],
        Elements: [
          {
            Name: "Text",
            Label: "Right Eye",
            Elements: [
              {
                Name: "Text",
                Label: "Visual Activity",
                Elements: [{
                  Label: "Distance Uncorrected",
                  Name: "Picker",
                  Values: [1, 2, 3]
                },
                {
                  Label: "Distance (With Glass)",
                  Name: "Picker",
                  Values: [1, 2, 3]
                },
                {
                  Label: "Pinhole",
                  Name: "Picker",
                  Values: [1, 2, 3]
                },
                {
                  Label: "Near",
                  Name: "Picker",
                  Values: [1, 2, 3]
                }]
              },
              {
                Elements: [
                  {
                    Label: "Ocular Dominance",
                    Name: "Picker",
                    Values: [1, 2, 3]
                  },
                  {
                    Label: "Wearing Optical Correction",
                    Name: "Picker",
                    Values: [1, 2, 3]
                  },
                  {
                    Label: "Wearing Preset Glasses",
                    Name: "Picker",
                    Values: [1, 2, 3]
                  },
                  {
                    Label: "Last Spectacle Rx Checked",
                    Name: "Picker",
                    Values: [1, 2, 3]
                  },
                  {
                    Label: "Contact Lenses",
                    Name: "Picker",
                    Values: [1, 2, 3]
                  },
                  {
                    Label: "Type of Lens",
                    Name: "Picker",
                    Values: [1, 2, 3]
                  },
                  {
                    Label: "Type of Wear",
                    Name: "Picker",
                    Values: [1, 2, 3]
                  }]
              }
            ]
          },
          {
            Name: "Text",
            Label: "Left Eye",
            Elements: [{
              Label: "Occular Dominance",
              Name: "Picker",
              Values: [1, 2, 3]
            },
            {
              Label: "Wearing Optical Correction",
              Name: "Picker",
              Values: [1, 2, 3]
            },
            {
              Label: "Wearing Preset Glasses",
              Name: "Picker",
              Values: [1, 2, 3]
            }
            ]
          }],
        //Values: ["Occular History", "Spectacle Prescription", "Present Vision Record", "Refraction", "Keratometry"]
      }]
    }
  },
  lefteye: {
  },
  righteye: {
  },
  more: [],
  selecteddata: {
    lefteye: {},
    righteye: {},
    more: {}
  }
}


export default (state = initialState, action) => {
  const { type, payload, error } = action;
//Request code

if(payload !=undefined && payload.request !=undefined)
{

if(payload.request.data !=undefined)
{



}
}

//Response code

if(payload && payload.data)
{



}
  switch (type) {
    case ACTION_TYPES.ADDOPTHAL_DETAILS:
      return Object.assign({}, state, payload);
    case ACTION_TYPES.RESETOPTHAL_DETAILS:
      return {
        ...state,
        selecteddata: {
          lefteye: {},
          righteye: {},
          more: {}
        }
      };
    default:
      return state;
  }
};

class Sections {
  constructor() {
    this.Name = "",
      this.Title = "",
      this.Elements = []
  }
}


class Elements {
  constructor() {
    this.Name = "",
      this.Label = "",
      this.Values = "",
      this.Sections = []
    this.Description = [
      "If Top_Navigator  Goto Sections an array of screens will be found"
    ]
  }
}