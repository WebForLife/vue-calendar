/**
* 获取某周、某月、上月、某季度的开始日期、结束日期及判断日期第几周
*/

/**
 * @param {String} fmt yyyy-MM-dd
 * 
 * new Date('2019/09/01').Format('yyyy-MM-dd')
 * new Date('Tue Jan 01 2019 00:00:00 GMT+0800').Format('yyyy-MM-dd')
 * new Date(2019,0,1).Format('yyyy-MM-dd')
 * 
 * @result {String}  2019-01-01
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

        }
    }
    return fmt;
}

/** 
 * 月份转大写
 * 
 * @param {Number} value
 * */
const MounthUpperCase = (value = 0) => {
    return ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'][value];
}

/**
 * 时间不超过10前面加0
 * 
 *  */
const timeFormat = (value) => {
    return `00${value}`.substr(value.toString().length);
}

/**
 * 时间格式化为 2019/01/01
 * @param {String} date 日期格式
 */

const formatDate = (date) => {
    return `${date.getFullYear()}/${timeFormat(date.getMonth() + 1)}/${timeFormat(date.getDate())}`;
}

/**
 * 获得某月的天数
 * @param {Number} year 年
 * @param {Number} month  月份，注意:月份为真实月份，不用加1，
 * new Date(year,month,0) 最后的参数传0相当于获取的上个月的最后一天，即mounth-1月的天数，
 * 正好可以配合month从0开始
 */
const getMonthDays = (year, month) => {
    year = parseInt(year);
    month = parseInt(month);
    return new Date(year, month, 0).getDate();
}

/**
 * 获得某天对应某周的开始日期,星期一开始
 * @param {String} date 日期格式 2019/05/14
 * 
 * */
const getWeekStartDate = (date) => {
    date = new Date(date);
    let weekStartDate = date.getTime() - (date.getDay()-1) * 86400000;
    return formatDate(new Date(weekStartDate))
}

/**
 * 获得某天对应某周的结束日期,星期日结束
 * @param {String} date 日期格式 2019/05/14
 * 
 */
const getEndDateOfWeek = (date) =>{
    date = new Date(date);
    let weekStartDate = date.getTime() + (7-date.getDay()) * 86400000;
    return formatDate(new Date(weekStartDate))
}


//获得某月的开始日期　　
const getMonthStartDate=(date)=> {
    var monthStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
    return formatDate(monthStartDate);
}

//获得某月的结束日期　　
const getMonthEndDate = (date)=> {
    let paraYear = date.getFullYear();
    let paraMonth = date.getMonth();
    var monthEndDate = new Date(paraYear, paraMonth, getMonthDays(paraYear, paraMonth+1));
    return formatDate(monthEndDate);
}

//获得下月开始时间　
function getnextMonthStartDate(paraYear, lastMonth) {
    var nextMonthStartDate = new Date(paraYear, lastMonth, 1);
    return formatDate(nextMonthStartDate);
}

//获得上月开始时间　
function getLastMonthStartDate(paraYear, lastMonth) {
    var lastMonthStartDate = new Date(paraYear, lastMonth, 1);
    return formatDate(lastMonthStartDate);
}

//获得上月结束时间　
function getLastMonthEndDate(paraYear, lastMonth) {
    var lastMonthEndDate = new Date(paraYear, lastMonth, getMonthDays(lastMonth));
    return formatDate(lastMonthEndDate);
}

//获得某季度的开始日期　　
function getQuarterStartDate(paraYear, paraSeason) {
    switch (paraSeason) {
        case '1': return paraYear + "-01-01";
        case '2': return paraYear + "-04-01";
        case '3': return paraYear + "-07-01";
        case '4': return paraYear + "-10-01";
    }
}

//获得某季度的结束日期　　
function getQuarterEndDate(paraYear, paraSeason) {
    switch (paraSeason) {
        case '1': return paraYear + "-03-31";
        case '2': return paraYear + "-06-30";
        case '3': return paraYear + "-09-30";
        case '4': return paraYear + "-12-31";
    }
}

//获取某年某周的开始日期
function getBeginDateOfWeek(paraYear, weekIndex) {
    var firstDay = GetFirstWeekBegDay(paraYear);
    //7*24*3600000 是一星期的时间毫秒数,(JS中的日期精确到毫秒)
    var time = (weekIndex - 1) * 7 * 24 * 3600000;
    var beginDay = firstDay;
    //为日期对象 date 重新设置成时间 time
    beginDay.setTime(firstDay.valueOf() + time);
    return formatDate(beginDay);
}

//获取某年某周的结束日期
// function getEndDateOfWeek(paraYear, weekIndex) {
//     var firstDay = GetFirstWeekBegDay(paraYear);
//     //7*24*3600000 是一星期的时间毫秒数,(JS中的日期精确到毫秒)
//     var time = (weekIndex - 1) * 7 * 24 * 3600000;
//     var weekTime = 6 * 24 * 3600000;
//     var endDay = firstDay;
//     //为日期对象 date 重新设置成时间 time
//     endDay.setTime(firstDay.valueOf() + weekTime + time);
//     return formatDate(endDay);
// }

//获取日期为某年的第几周
function GetWeekIndex(dateobj) {
    var firstDay = GetFirstWeekBegDay(dateobj.getFullYear());
    if (dateobj < firstDay) {
        firstDay = GetFirstWeekBegDay(dateobj.getFullYear() - 1);
    }
    d = Math.floor((dateobj.valueOf() - firstDay.valueOf()) / 86400000);
    return Math.floor(d / 7) + 1;
}

//获取某年的第一天
function GetFirstWeekBegDay(year) {
    var tempdate = new Date(year, 0, 1);
    var temp = tempdate.getDay();
    if (temp == 1) {
        return tempdate;
    }
    temp = temp == 0 ? 7 : temp;
    tempdate = tempdate.setDate(tempdate.getDate() + (8 - temp));
    return new Date(tempdate);
}


export default {
    formatDate,
    timeFormat,
    getMonthDays,
    getWeekStartDate,
    getEndDateOfWeek,
    getMonthStartDate,
    getMonthEndDate,
    getLastMonthStartDate,
    getnextMonthStartDate,
}