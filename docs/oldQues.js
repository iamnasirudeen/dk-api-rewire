"use strict";

const Queue = require("bull");
const request = require("request");
const AWS = require("aws-sdk");
const mongoose = require("mongoose");
const Async = require("async");
const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 20;

const Block = require("./Models/Block");
const Conversation = require("./Models/Conversation");
const Discussion = require("./Models/Discussion");
const DiscussionComment = require("./Models/DiscussionComment");
const DiscussionCommentReport = require("./Models/DiscussionCommentReport");
const DiscussionLove = require("./Models/DiscussionLove");
const DiscussionReport = require("./Models/DiscussionReport");

const User = require("./Models/User");
const Photo = require("./Models/Photo");

const mailQueue = new Queue("mail", process.env.REDIS_URI);
const photoQueue = new Queue("photo", process.env.REDIS_URI);
const cometChatQueue = new Queue("cometchat", process.env.REDIS_URI);
const deleteQueue = new Queue("delete", process.env.REDIS_URI);

let s3 = new AWS.S3({
  apiVersion: process.env.AWS_S3_API_VERSION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION
});

let ses = new AWS.SES({
  apiVersion: process.env.AWS_SES_API_VERSION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION
});

let rekognition = new AWS.Rekognition({
  apiVersion: process.env.AWS_REKOGNITION_API_VERSION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REKOGNITION_REGION
});

mailQueue.process("confirm", 2, (job, done) => {
  if (process.env.ENABLE_EMAIL_QUEUE === "false") return done();

  let username = job.data.username;
  let email = job.data.email;
  let token = job.data.token;

  let data =
    "{ \"username\":\"" +
    username +
    "\", \"token\":\"" +
    token +
    "\", \"siteURL\": \"" +
    process.env.SITE_URL +
    "\"}";

  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Source: process.env.FROM_EMAIL,
    Template: "Confirm",
    TemplateData: data,
    ReplyToAddresses: [process.env.FROM_EMAIL]
  };

  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

mailQueue.process("resendConfirm", 2, (job, done) => {
  //if (process.env.ENABLE_EMAIL_QUEUE === 'false') return done();

  let username = job.data.username;
  let email = job.data.email;
  let token = job.data.token;

  let data =
    "{ \"username\":\"" +
    username +
    "\", \"token\":\"" +
    token +
    "\", \"siteURL\": \"" +
    process.env.SITE_URL +
    "\"}";

  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Source: process.env.FROM_EMAIL,
    Template: "ResendConfirm",
    TemplateData: data,
    ReplyToAddresses: [process.env.FROM_EMAIL]
  };

  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

mailQueue.process("updateEmailConfirm", 2, (job, done) => {
  //if (process.env.ENABLE_EMAIL_QUEUE === 'false') return done();

  let username = job.data.username;
  let email = job.data.email;
  let token = job.data.token;

  let data =
    "{ \"username\":\"" +
    username +
    "\", \"token\":\"" +
    token +
    "\", \"siteURL\": \"" +
    process.env.SITE_URL +
    "\"}";

  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Source: process.env.FROM_EMAIL,
    Template: "UpdateEmailConfirm",
    TemplateData: data,
    ReplyToAddresses: [process.env.FROM_EMAIL]
  };

  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

mailQueue.process("forgot", 2, (job, done) => {
  //if (process.env.ENABLE_EMAIL_QUEUE === 'false') return done();

  let username = job.data.username;
  let email = job.data.email;
  let token = job.data.token;

  let data =
    "{ \"username\":\"" +
    username +
    "\", \"token\":\"" +
    token +
    "\", \"siteURL\": \"" +
    process.env.SITE_URL +
    "\"}";

  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Source: process.env.FROM_EMAIL,
    Template: "ForgotPassword",
    TemplateData: data,
    ReplyToAddresses: [process.env.FROM_EMAIL]
  };

  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

mailQueue.process("migrate", 10, (job, done) => {
  let username = job.data.username;
  let email = job.data.email;
  let token = job.data.token;

  let data =
    "{ \"username\":\"" +
    username +
    "\", \"token\":\"" +
    token +
    "\", \"siteURL\": \"" +
    process.env.SITE_URL +
    "\"}";

  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Source: process.env.FROM_EMAIL,
    Template: "MigrateMember",
    TemplateData: data,
    ReplyToAddresses: [process.env.FROM_EMAIL]
  };

  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

mailQueue.process("photoApproved", 2, (job, done) => {
  //if (process.env.ENABLE_EMAIL_QUEUE === 'false') return done();

  let username = job.data.username;
  let photoId = job.data.photoId;
  let email = job.data.email;

  let data =
    "{ \"username\":\"" +
    username +
    "\", \"photoId\":\"" +
    photoId +
    "\", \"siteURL\": \"" +
    process.env.SITE_URL +
    "\"}";

  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Source: process.env.FROM_EMAIL,
    Template: "PhotoApproved",
    TemplateData: data,
    ReplyToAddresses: [process.env.FROM_EMAIL]
  };

  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

mailQueue.process("flirt", 2, (job, done) => {
  //if (process.env.ENABLE_EMAIL_QUEUE === 'false') return done();

  let senderUsername = job.data.senderUser;
  let receiverUsername = job.data.receiverUsername;
  let email = job.data.email;
  let senderId = job.data.senderId;

  let data =
    "{ \"senderUsername\": \"" +
    senderUsername +
    "\", \"receiverUsername\": \"" +
    receiverUsername +
    "\", \"senderId\": \"" +
    senderId +
    "\", \"siteURL\": \"" +
    process.env.SITE_URL +
    "\"}";

  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Source: process.env.FROM_EMAIL,
    Template: "Flirt",
    TemplateData: data,
    ReplyToAddresses: [process.env.FROM_EMAIL]
  };

  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

mailQueue.process("message", 2, (job, done) => {
  //if (process.env.ENABLE_EMAIL_QUEUE === 'false') return done();

  let senderUsername = job.data.senderUsername;
  let email = job.data.email;
  let receiverUsername = job.data.receiverUsername;
  let senderId = job.data.senderId;

  let data =
    "{ \"senderUsername\": \"" +
    senderUsername +
    "\", \"receiverUsername\": \"" +
    receiverUsername +
    "\", \"senderId\": \"" +
    senderId +
    "\", \"siteURL\": \"" +
    process.env.SITE_URL +
    "\"}";

  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Source: process.env.FROM_EMAIL,
    Template: "Message",
    TemplateData: data,
    ReplyToAddresses: [process.env.FROM_EMAIL]
  };

  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

mailQueue.process("messageReply", 2, (job, done) => {
  //if (process.env.ENABLE_EMAIL_QUEUE === 'false') return done();

  let senderUsername = job.data.senderUsername;
  let email = job.data.email;
  let receiverUsername = job.data.receiverUsername;
  let senderId = job.data.senderId;

  let data =
    "{ \"senderUsername\":\" " +
    senderUsername +
    "\", \"receiverUsername\": \"" +
    receiverUsername +
    "\", \"senderId\": \"" +
    senderId +
    "\", \"siteURL\": \"" +
    process.env.SITE_URL +
    "\"}";

  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Source: process.env.FROM_EMAIL,
    Template: "MessageReply",
    TemplateData: data,
    ReplyToAddresses: [process.env.FROM_EMAIL]
  };

  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

photoQueue.process("moderate", 2, (job, done) => {
  if (process.env.ENABLE_PHOTO_QUEUE === "false") return done();

  let params = {
    Image: {
      S3Object: {
        Bucket: process.env.AWS_S3_ORIGINAL_PHOTO_BUCKET,
        Name: job.data.filename
      }
    },
    MinConfidence: 0.0
  };

  rekognition.detectModerationLabels(params, (err, data) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    if (data.hasOwnProperty("ModerationLabels")) {
      if (data.ModerationLabels.length > 0) {
        Photo.findById(job.data.photoId, (err, photo) => {
          if (err) {
            console.error(err);
            return done(err);
          }

          if (photo) {
            photo.moderationLabels = data.ModerationLabels;
            photo.avatar = false;
            photo.save((err) => {
              if (err) {
                console.error(err);
                return done(err);
              }

              done();
            });
          }
        });
      } else {
        console.log("No moderation labels.");
        done();
      }
    } else {
      console.log("No moderation labels.");
      done();
    }
  });
});

photoQueue.process("delete", 2, (job, done) => {
  if (process.env.ENABLE_PHOTO_QUEUE === "false") return done();

  let params = {
    Bucket: process.env.AWS_S3_ORIGINAL_PHOTO_BUCKET,
    Key: job.data.filename
  };

  User.findById(job.data.userId, (err, user) => {
    if (err) {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error(err);
          return done(err);
        }
        done();
      });
    } else {
      if (user.filename === job.data.filename) {
        user.filename = undefined;
        user.save((err) => {
          if (err) {
            console.error(err);
            return done(err);
          }
          done();
        });
      } else {
        done();
      }
    }
  });
});

cometChatQueue.process("createUser", 2, (job, done) => {
  if (process.env.ENABLE_CHAT_QUEUE === "false") return done();

  let url = process.env.SITE_URL + "/profile/" + job.data.userId;
  let body = {
    UID: job.data.userId,
    name: job.data.name,
    avatarURL: job.data.avatarURL,
    profileURL: url,
    role: job.data.role
  };

  let options = {
    method: "POST",
    url: "https://api.cometondemand.net/api/v2/createUser",
    headers: {
      "api-key": process.env.COMET_CHAT_API_KEY
    },
    form: body
  };

  request(options, (err, response, body) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    User.findByIdAndUpdate(
      job.data.userId,
      { $set: { cometchat: true } },
      (err, user) => {
        if (err) {
          console.error(err);
          return done(err);
        }

        done();
      }
    );
  });
});

cometChatQueue.process("updateUser", 2, (job, done) => {
  if (process.env.ENABLE_CHAT_QUEUE === "false") return done();

  let url = process.env.SITE_URL + "/profile/" + job.data.userId;
  let body = {
    UID: job.data.userId,
    name: job.data.name,
    avatarURL: job.data.avatarURL,
    profileURL: url,
    role: job.data.role
  };

  let options = {
    method: "POST",
    url: "https://api.cometondemand.net/api/v2/updateUser",
    headers: {
      "api-key": process.env.COMET_CHAT_API_KEY
    },
    form: body
  };

  request(options, (err, response, body) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    User.findByIdAndUpdate(
      job.data.userId,
      { $set: { cometchat: true } },
      (err, user) => {
        if (err) {
          console.error(err);
          return done(err);
        }

        done();
      }
    );
  });
});

cometChatQueue.process("addFriend", 2, (job, done) => {
  if (process.env.ENABLE_CHAT_QUEUE === "false") return done();

  let bodyOne = {
    UID: job.data.currentUserId,
    friendsUID: job.data.friendId
  };

  let bodyTwo = {
    UID: job.data.friendId,
    friendsUID: job.data.currentUserId
  };

  let optionsOne = {
    method: "POST",
    url: "https://api.cometondemand.net/api/v2/addFriends",
    headers: {
      "api-key": process.env.COMET_CHAT_API_KEY
    },
    form: bodyOne
  };

  let optionsTwo = {
    method: "POST",
    url: "https://api.cometondemand.net/api/v2/addFriends",
    headers: {
      "api-key": process.env.COMET_CHAT_API_KEY
    },
    form: bodyTwo
  };

  request(optionsOne, (err, response, body) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    request(optionsTwo, (err, response, body) => {
      if (err) {
        console.error(err);
        return done(err);
      }

      done();
    });
  });
});

cometChatQueue.process("deleteFriend", 2, (job, done) => {
  if (process.env.ENABLE_CHAT_QUEUE === "false") return done();

  let bodyOne = {
    UID: job.data.currentUserId,
    friendsUID: job.data.friendId
  };

  let bodyTwo = {
    UID: job.data.friendId,
    friendsUID: job.data.currentUserId
  };

  let optionsOne = {
    method: "POST",
    url: "https://api.cometondemand.net/api/v2/deleteFriends",
    headers: {
      "api-key": process.env.COMET_CHAT_API_KEY
    },
    form: bodyOne
  };

  let optionsTwo = {
    method: "POST",
    url: "https://api.cometondemand.net/api/v2/deleteFriends",
    headers: {
      "api-key": process.env.COMET_CHAT_API_KEY
    },
    form: bodyTwo
  };

  request(optionsOne, (err, response, body) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    request(optionsTwo, (err, response, body) => {
      if (err) {
        console.error(err);
        return done(err);
      }

      done();
    });
  });
});

cometChatQueue.process("blockUser", 2, (job, done) => {
  if (process.env.ENABLE_CHAT_QUEUE === "false") return done();

  let body = {
    senderUID: job.data.senderUID,
    receiverUID: job.data.receiverUID
  };

  let options = {
    method: "POST",
    url: "https://api.cometondemand.net/api/v2/blockUser",
    headers: {
      "api-key": process.env.COMET_CHAT_API_KEY
    },
    form: body
  };

  request(options, (err, response, body) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

cometChatQueue.process("unblockUser", 2, (job, done) => {
  if (process.env.ENABLE_CHAT_QUEUE === "false") return done();

  let body = {
    senderUID: job.data.senderUID,
    receiverUID: job.data.receiverUID
  };

  let options = {
    method: "POST",
    url: "https://api.cometondemand.net/api/v2/unblockUser",
    headers: {
      "api-key": process.env.COMET_CHAT_API_KEY
    },
    form: body
  };

  request(options, (err, response, body) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

cometChatQueue.process("createGroup", 2, (job, done) => {
  if (process.env.ENABLE_CHAT_QUEUE === "false") return done();

  let body = {
    GUID: job.data.groupId,
    name: job.data.name,
    type: 0
  };

  let options = {
    method: "POST",
    url: "https://api.cometondemand.net/api/v2/createGroup",
    headers: {
      "api-key": process.env.COMET_CHAT_API_KEY
    },
    form: body
  };

  request(options, (err, response, body) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

cometChatQueue.process("deleteGroup", 2, (job, done) => {
  if (process.env.ENABLE_CHAT_QUEUE === "false") return done();

  let body = {
    GUID: job.data.groupId
  };

  let options = {
    method: "POST",
    url: "https://api.cometondemand.net/api/v2/deleteGroup",
    headers: {
      "api-key": process.env.COMET_CHAT_API_KEY
    },
    form: body
  };

  request(options, (err, response, body) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

cometChatQueue.process("notify", 5, (job, done) => {
  if (process.env.ENABLE_CHAT_QUEUE === "false") return done();

  let body = {
    senderUID: process.env.COMET_CHAT_NOTIFICATION_UID,
    receiverUID: job.data.receiverId,
    message: job.data.message
  };

  let options = {
    method: "POST",
    url: "https://api.cometondemand.net/api/v2/sendMessage",
    headers: { "api-key": process.env.COMET_CHAT_API_KEY },
    form: body
  };

  request(options, (err, response, body) => {
    if (err) {
      console.error(err);
      return done(err);
    }

    done();
  });
});

deleteQueue.process("user", 2, (job, done) => {
  console.log("RUNNING JOB");
  User.findById(mongoose.Types.ObjectId(job.data.userId), (err, user) => {
    if (err) {
      console.error(err);
      done(err);
    } else {
      user.remove();
      done();
    }
  });
});

module.exports.mail = mailQueue;
module.exports.photo = photoQueue;
module.exports.cometChat = cometChatQueue;
module.exports.delete = deleteQueue;
