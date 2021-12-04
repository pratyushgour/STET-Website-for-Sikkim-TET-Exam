const bcrypt = require("../node_modules/bcryptjs");
const Academic = require("../models/academic_model");
const Personal = require("../models/personal_model");
const File = require("../models/fileupload_model");
const SignUp = require("../models/signup_model");
const Razorpay = require("../node_modules/razorpay");
const Registration = require("../models/registration_model");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("../node_modules/multer");
const crypto = require("crypto");
const url =
  "MONGOURI?retryWrites=true&w=majority";
const mongoClient = require("mongodb").MongoClient;

// Global Variables
var academic_exam = "";
var fname = "";
var mname = "";
var lname = "";
var ffname = "";
var fmname = "";
var flname = "";
var mfname = "";
var mmname = "";
var mlname = "";
var category = "";
var aadhar = "";
var dob = "";
var address = "";
var district = "";
var state = "";
var pincode = "";
var sex = "";
var phone = "";
var email = "";
var current_number = null;
var today = new Date();
var date =
  today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
var time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var datetime = date + " " + time;

//Academic Details Functions Start

createAcademic = (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Fill Required Details",
    });
  }

  const academic = new Academic({
    App_Category: body.App_Category,
    Language: body.Language,
    Min_Qual: body.Min_Qual,
    Percentage: body.Percentage,
    Pro_Qual: body.Pro_Qual,
    University: body.University,
    Phone_Number: current_number,
  });

  console.log(academic);
  if (!academic) {
    return res.status(400).json({ success: false, error: err });
  }

  academic
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        message: "Academic Details Updated!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Academic Details not Updated!",
      });
    });
};

getAcademic = async (req, res) => {
  await Academic.find({}, (err, academicDetails) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!academicDetails.length) {
      return res
        .status(404)
        .json({ success: false, error: `Academic Details not found` });
    }
    return res.status(200).json({ success: true, data: academicDetails });
  }).catch((err) => console.log(err));
};

//Academic Details Functions End

//Personal Details Functions Start

createPersonal = (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Fill Required Details",
    });
  }

  const personal = new Personal({
    Fname: body.Fname,
    Mname: body.Mname,
    Lname: body.Lname,
    Gender: body.Gender,
    FH: body.FH,
    FHFname: body.FHFname,
    FHMname: body.FHMname,
    FHLname: body.FHLname,
    MFname: body.MFname,
    MMname: body.MMname,
    MLname: body.MLname,
    DOB: body.DOB,
    Category: body.Category,
    Aadhar: body.Aadhar,
    AddressOne: body.AddressOne,
    DistrictOne: body.DistrictOne,
    StateOne: body.StateOne,
    PinCodeOne: body.PinCodeOne,
    Phone1: body.Phone1,
    Email1: body.Email1,
    AddressTwo: body.AddressTwo,
    DistrictTwo: body.DistrictTwo,
    StateTwo: body.StateTwo,
    PinCodeTwo: body.PinCodeTwo,
    Phone2: body.Phone2,
    Email2: body.Email2,
    Phone_Number: current_number,
  });

  if (!personal) {
    return res.status(400).json({ success: false, error: err });
  }

  personal
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        message: "Personal Details Updated!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Personal Details not Updated!",
      });
    });
};

//Personal Details Functions End

//Payment Functions Start

function orderIdGet(options, instance) {
  return new Promise(function (resolve, reject) {
    instance.orders.create(options, function (err, order) {
      console.log(order);
      resolve(order.id);
    });
  });
}

razorPay = async (req, res) => {
  var instance = new Razorpay({
    key_id: "rzp_test_CIycCdg9OhYtbF",
    key_secret: "iX94yI43ZzxexZcZiuSIZFDU",
  });

  var options = {
    amount: 50000, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
    payment_capture: "0",
  };

  Order = await orderIdGet(options, instance);
  console.log(Order);
  res.json({ orderId: Order });
};

//Payment Functions End

//SignUp Functions Start
createUser = (req, res) => {
  const body = req.body;
  console.log(body);
  current_number = body.Phone_no;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Fill Required Details",
    });
  }
  var hash_pwd = body.Password;
  hash_pwd = bcrypt.hashSync(hash_pwd, 10);
  body.Password = hash_pwd;

  const signup = new SignUp(body);

  if (!signup) {
    return res.status(400).json({ success: false, error: err });
  }
  SignUp.findOne({ Phone_no: body.Phone_no }, (err, docs) => {
    if (docs != null) {
      console.log("Error" + err);
      console.log("Docs" + docs);
      return res.status(500).send("Username Already Exists");
    } else {
      signup
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            message: "Sign Up Successfull",
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).json({
            error,
            message: "Sign Up Unsuccessfull",
          });
        });
    }
  });
};
//SignUp Functions End

//LogIn Functions Start

verifyUser = (req, res) => {
  const body = req.body;
  console.log(body);
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Fill Required Details",
    });
  }
  //const login = new SignUp(body);

  SignUp.findOne({ Phone_no: body.Phone_no }, (err, docs) => {
    console.log(docs);
    if (docs != null) {
      current_number = docs.Phone_no;
      if (bcrypt.compareSync(body.Password, docs.Password)) {
        // req.session.user = {phone: docs.Phone_no};
        // console.log(req.session.user);
        return res.status(201).json({
          success: true,
          message: "Login Successfull",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Login Unsuccessfull",
        });
      }
    } else {
      console.log(err);
      return res.status(404).json({
        success: false,
        message: "Login Unsuccessfull",
      });
    }
  });
};

//LogIn Functions End

//Final Registration Functions********************************************************************************************

registerUser = (req, res) => {
  const body = req.body;
  const phone_number = current_number;

  console.log(body);
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Fill Required Details",
    });
  }

  const registration = new Registration({
    fname: body.fname,
    mname: body.mname,
    lname: body.lname,
    ffname: body.ffname,
    fmname: body.fmname,
    flname: body.flname,
    mfname: body.mfname,
    mmname: body.mmname,
    mlname: body.mlname,
    category: body.category,
    aadhar: body.aadhar,
    dob: body.dob,
    address: body.address,
    district: body.district,
    state: body.state,
    pincode: body.pincode,
    sex: body.sex,
    phone: phone_number,
    email: body.email,
    exam: body.exam,
    exam_date: "20 October 2020",
    venue: "Sikkim",
    eno: phone_number,
    Date: datetime,
  });

  if (!registration) {
    return res.status(400).json({ success: false, error: err });
  }
  Registration.findOne({ phone: phone_number }, (err, docs) => {
    if (docs != null) {
      console.log("Error" + err);
      console.log("Docs" + docs);
      return res.status(500).send("You have already Submitted!");
    } else {
      registration
        .save()
        .then(() => {
          // req.session.user = {phone: phone_number};
          // console.log(req.session.user);
          return res.status(201).json({
            success: true,
            message: "Registration Successfull",
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).json({
            error,
            message: "Registration Unsuccessfull",
          });
        });
    }
  });
};

getRegistration = (req, res) => {
  Academic.findOne({ Phone_Number: current_number }, (err, docs) => {
    console.log("Docs" + docs);
    console.log("Error" + err);
    if (!docs) {
      res.json({
        msg: "Please Update Academic Details",
      });
    } else {
      academic_exam = docs.App_Category;
      Personal.findOne({ Phone_Number: current_number }, (err, docs) => {
        console.log("Docs" + docs);
        console.log("Error" + err);
        if (!docs) {
          res.json({
            msg: "Please Update Personal Details",
          });
        } else {
          fname = docs.Fname;
          mname = docs.Mname;
          lname = docs.Lname;
          ffname = docs.FHFname;
          fmname = docs.FHMname;
          flname = docs.FHLname;
          mfname = docs.MFname;
          mmname = docs.MMname;
          mlname = docs.MLname;
          category = docs.Category;
          aadhar = docs.Aadhar;
          dob = docs.DOB;
          address = docs.AddressOne;
          district = docs.DistrictOne;
          state = docs.StateOne;
          pincode = docs.PinCodeOne;
          sex = docs.Gender;
          phone = current_number;
          email = docs.Email1;
          Registration.findOne({ phone: current_number }, (err, docs) => {
            console.log("Docs" + docs);
            console.log("Error" + err);
            if (!docs) {
              res.json({
                msg:
                  "New Candidate Found, Please Check Details and press 'Register Candidate'",
                fname: fname,
                mname: mname,
                lname: lname,
                ffname: ffname,
                fmname: fmname,
                flname: flname,
                mfname: mfname,
                mmname: mmname,
                mlname: mlname,
                category: category,
                aadhar: aadhar,
                dob: dob,
                address: address,
                district: district,
                state: state,
                pincode: pincode,
                sex: sex,
                phone: current_number,
                email: email,
                exam: academic_exam,
              });
            } else {
              res.json({
                msg: "Candidate Already Registered",
                fname: docs.fname,
                mname: docs.mname,
                lname: docs.lname,
                ffname: docs.ffname,
                fmname: docs.fmname,
                flname: docs.flname,
                mfname: docs.mfname,
                mmname: docs.mmname,
                mlname: docs.mlname,
                category: docs.category,
                aadhar: docs.aadhar,
                dob: docs.dob,
                address: docs.address,
                district: docs.district,
                state: docs.state,
                pincode: docs.pincode,
                sex: docs.sex,
                phone: current_number,
                email: docs.email,
                exam: docs.exam,
              });
            }
          });
        }
      });
    }
  });
};

//Final Registration Functions********************************************************************************************

//Test***********************************************************************************************************************
currentUser = (req, res) => {
  SignUp.findOne({ Phone_no: current_number }, (err, docs) => {
    if (!docs) {
      res.json({
        msg: "Please Sign Up!",
      });
    } else {
      res.json({
        phone_no: docs.Phone_no,
        Name: docs.Name,
      });
    }
  }).catch((err) => {
    res.json({
      msg: "Unidentified Error Occurred.",
    });
  });
};

// currentUser = (req, res) => {
//   console.log("I'm in");
//   console.log(req.session.user.phone);
//     if(req.session.user){
//       res.json({
//         phone_no: req.session.user.phone
//       });
//     }
//     else
//     {
//       res.json({
//         phone_no: null
//       });
//     }
// };

//Document Upload Start *************************************************************************************************

const promise = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//******************************************************************************************************************* */

storage1 = new GridFsStorage({
  db: promise,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: current_number + "_" + filename,
          bucketName: "Aadhar_Documents",
        };
        resolve(fileInfo);
      });
    });
  },
});

uploadAadhar = multer({
  storage: storage1,
});

function uploadAadharFun(req, res) {
  console.log(req.file);
  console.log(req.body);
  console.log(req.file.filename);
  return res.status(200).end();
}

//******************************************************************************************************************* */

storage2 = new GridFsStorage({
  db: promise,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: current_number + "_" + filename,
          bucketName: "Tenth_Documents",
        };
        resolve(fileInfo);
      });
    });
  },
});

uploadTenth = multer({
  storage: storage2,
});

function uploadTenthFun(req, res) {
  console.log(req.file);
  console.log(req.body);
  console.log(req.file.filename);
  return res.status(200).end();
}

//******************************************************************************************************************* */

// const conn3 = mongoose.connection;
// let gfs3;

// conn3.once("open", () => {
//   gfs3 = new mongoose.mongo.GridFSBucket(conn3.db, {
//     bucketName: "Twelveth_Documents", // Bucketname will be collection name
//   });
// });

storage3 = new GridFsStorage({
  db: promise, //here in case of diskstorage we use storage but in case of GridFS db will be used.
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: current_number + "_" + filename,
          bucketName: "Twelveth_Documents",
        };
        resolve(fileInfo);
      });
    });
  },
});

uploadTwelveth = multer({
  storage: storage3,
});

function uploadTwelvethFun(req, res) {
  console.log(req.file);
  console.log(req.body);
  console.log(req.file.filename);
  return res.status(200).end();
}

//******************************************************************************************************************* */

// const conn4 = mongoose.connection;
// let gfs4;

// conn4.once("open", () => {
//   gfs4 = new mongoose.mongo.GridFSBucket(conn4.db, {
//     bucketName: "Sikkim_Subject_Documents", // Bucketname will be collection name
//   });
// });

storage4 = new GridFsStorage({
  db: promise, //here in case of diskstorage we use storage but in case of GridFS db will be used.
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: current_number + "_" + filename,
          bucketName: "Sikkim_Subject_Documents",
        };
        resolve(fileInfo);
      });
    });
  },
});

uploadSubject = multer({
  storage: storage4,
});

function uploadSubjectFun(req, res) {
  console.log(req.file);
  console.log(req.body);
  console.log(req.file.filename);
  return res.status(200).end();
}

//******************************************************************************************************************* */

// const conn5 = mongoose.connection;
// let gfs5;

// conn5.once("open", () => {
//   gfs5 = new mongoose.mongo.GridFSBucket(conn5.db, {
//     bucketName: "Signature_Documents", // Bucketname will be collection name
//   });
// });

storage5 = new GridFsStorage({
  db: promise, //here in case of diskstorage we use storage but in case of GridFS db will be used.
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: current_number + "_" + filename,
          bucketName: "Signature_Documents",
        };
        resolve(fileInfo);
      });
    });
  },
});

uploadSignature = multer({
  storage: storage5,
});

function uploadSignatureFun(req, res) {
  console.log(req.file);
  console.log(req.body);
  console.log(req.file.filename);
  return res.status(200).end();
}

//******************************************************************************************************************* */

// const conn6 = mongoose.connection;
// let gfs6;

// conn6.once("open", () => {
//   gfs6 = new mongoose.mongo.GridFSBucket(conn6.db, {
//     bucketName: "Photo_Documents", // Bucketname will be collection name
//   });
// });

storage6 = new GridFsStorage({
  db: promise, //here in case of diskstorage we use storage but in case of GridFS db will be used.
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: current_number + "_" + filename,
          bucketName: "Photo_Documents",
        };
        resolve(fileInfo);
      });
    });
  },
});

uploadPhoto = multer({
  storage: storage6,
});

function uploadPhotoFun(req, res) {
  console.log(req.file);
  console.log(req.body);
  console.log(req.file.filename);
  return res.status(200).end();
}

//******************************************************************************************************************* */

// const conn7 = mongoose.connection;
// let gfs7;

// conn7.once("open", () => {
//   gfs7 = new mongoose.mongo.GridFSBucket(conn7.db, {
//     bucketName: "Birth_Certificate_Documents", // Bucketname will be collection name
//   });
// });

storage7 = new GridFsStorage({
  db: promise, //here in case of diskstorage we use storage but in case of GridFS db will be used.
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: current_number + "_" + filename,
          bucketName: "Birth_Certificate_Documents",
        };
        resolve(fileInfo);
      });
    });
  },
});

uploadBirth = multer({
  storage: storage7,
});

function uploadBirthFun(req, res) {
  console.log(req.file);
  console.log(req.body);
  console.log(req.file.filename);
  return res.status(200).end();
}

//******************************************************************************************************************* */

// const conn8 = mongoose.connection;
// let gfs8;

// conn8.once("open", () => {
//   gfs8 = new mongoose.mongo.GridFSBucket(conn8.db, {
//     bucketName: "Graduation_Certificate_Documents", // Bucketname will be collection name
//   });
// });

storage8 = new GridFsStorage({
  db: promise, //here in case of diskstorage we use storage but in case of GridFS db will be used.
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: current_number + "_" + filename,
          bucketName: "Graduation_Certificate_Documents",
        };
        resolve(fileInfo);
      });
    });
  },
});

uploadGradCir = multer({
  storage: storage8,
});

function uploadGradCirFun(req, res) {
  console.log(req.file);
  console.log(req.body);
  console.log(req.file.filename);
  return res.status(200).end();
}

//******************************************************************************************************************* */
// const conn9 = mongoose.connection;
// let gfs9;

// conn9.once("open", () => {
//   gfs9 = new mongoose.mongo.GridFSBucket(conn9.db, {
//     bucketName: "Graduation_Marksheet_Documents", // Bucketname will be collection name
//   });
// });

storage9 = new GridFsStorage({
  db: promise, //here in case of diskstorage we use storage but in case of GridFS db will be used.
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: current_number + "_" + filename,
          bucketName: "Graduation_Marksheet_Documents",
        };
        resolve(fileInfo);
      });
    });
  },
});

uploadGradMark = multer({
  storage: storage9,
});

function uploadGradMarkFun(req, res) {
  console.log(req.file);
  console.log(req.body);
  console.log(req.file.filename);
  return res.status(200).end();
}

//******************************************************************************************************************* */
// const conn10 = mongoose.connection;
// let gfs10;

// conn10.once("open", () => {
//   gfs10 = new mongoose.mongo.GridFSBucket(conn10.db, {
//     bucketName: "Community_Certificate_Documents", // Bucketname will be collection name
//   });
// });

storage10 = new GridFsStorage({
  db: promise, //here in case of diskstorage we use storage but in case of GridFS db will be used.
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: current_number + "_" + filename,
          bucketName: "Community_Certificate_Documents",
        };
        resolve(fileInfo);
      });
    });
  },
});

uploadComm = multer({
  storage: storage10,
});

function uploadCommFun(req, res) {
  console.log(req.file);
  console.log(req.body);
  console.log(req.file.filename);
  return res.status(200).end();
}

//Document Upload End *************************************************************************************************
/*Download Admit Card Start *************************************************************************************************/
getAdmitCard = (req, res) => {
  let fileName = req.params.filename;
  console.log(fileName);
  mongoClient.connect(url, function (err, client) {
    if (err) {
      throw err;
    }
    const db = client.db("Mongodb");
    const collection = db.collection(req.params.coll + ".files");
    const collectionChunks = db.collection(req.params.coll + ".chunks");
    collection.find({ filename: fileName }).toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      if (!docs || docs.length === 0) {
        return res.status(400).send();
      } else {
        collectionChunks
          .find({ files_id: docs[0]._id })
          .sort({ n: 1 })
          .toArray(function (err, chunks) {
            if (err) {
              throw err;
            }
            if (!chunks || chunks.length === 0) {
              return res.status(404).send();
            }
            let fileData = [];
            for (let i = 0; i < chunks.length; i++) {
              fileData.push(chunks[i].data.toString("base64"));
            }
            let finalFile =
              "data:" + docs[0].contentType + ";base64," + fileData.join("");
            console.log("File");
            res.status(200).json({ imageURL: finalFile });
          });
      }
    });
  });
};
/*Download Admit Card Start ******************************************** ************************************/

module.exports = {
  createAcademic,
  getAcademic,
  createPersonal,
  razorPay,
  createUser,
  verifyUser,
  registerUser,
  getRegistration,
  uploadAadhar,
  uploadAadharFun,
  uploadBirth,
  uploadBirthFun,
  uploadComm,
  uploadCommFun,
  uploadGradCir,
  uploadGradCirFun,
  uploadGradMark,
  uploadGradMarkFun,
  uploadPhoto,
  uploadPhotoFun,
  uploadSignature,
  uploadSignatureFun,
  uploadSubject,
  uploadSubjectFun,
  uploadTenth,
  uploadTenthFun,
  uploadTwelveth,
  uploadTwelvethFun,
  currentUser,
  getAdmitCard,
};
