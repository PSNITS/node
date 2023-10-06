const express = require("express");

const router = express.Router()

const date = new Date();
function addZero(i) {
  if (i < 10) {i = "0" + i}
  return i;
}
const cMonth = date.getMonth() + 1;
const cTime = + String(addZero(date.getHours())) + ":" + String(addZero(date.getMinutes())) + ':' + String(addZero(date.getMinutes())) +'.' + String(addZero(date.getMilliseconds())) ;
const cDay= String(addZero(date.getFullYear())) + "-" + String(addZero(cMonth)) + "-" + String(addZero(date.getDate()));


module.exports = cTime
