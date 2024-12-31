export default {
  container: {
    flex: 1,
    backgroundColor:'#F4F6F7'
  },
  drawerCover: {
   flex:0.5,
   resizeMode: "cover",
    flexDirection: "column",paddingBottom:5
  },
  hosdetails: {
   backgroundColor: "#008be9",
    flexDirection: "row",
   // flex :1,
    //height: 50,
    alignItems: "center",
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    borderTopWidth: 0.2,
    borderTopColor: '#d4d4d4'
  },
  contdetails: {
    backgroundColor: "#fff",
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    padding: 10,



    borderBottomWidth: 4,
    borderBottomColor: '#eee'
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#64C8D0",
    marginLeft: 16
  },
  organizerName: {
    fontSize: 17,
    fontWeight: "bold",
    color: 'white'
  },
  organizerSubText: {
    fontSize: 15,
    color: '#e4edf2'
  },
  menuItem: {
    height: 70
  },
  menuText: {
    marginLeft: 16,
    fontSize: 17
  },
  menuInner: {
   
    borderBottomWidth: 0,
    marginLeft: 0,

  },
  menuTextInner: {
    marginLeft: 10,
    fontSize: 14,
    color: '#3b3b3b'
  },
  footer: {
    marginLeft: 16,
    flexDirection: "row",
    height: 70
  }
};
