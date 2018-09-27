/**
 * Created by Anne
 */
import toast  from "./toast/toast.js"
import {$alert,$confirm}  from "./msgbox/msgbox.js"
import * as $loads  from "./ajax-load/index.js"
import './public-method'
//import date from "./date/date.js"
// var es6promise = require('es6-promise').Promise;
// window.Promise=es6promise.Promise;
// window._ = require('lodash');
window.$alert=$alert;
window.$confirm=$confirm;
window.toast=toast;
window.$load=$loads;

