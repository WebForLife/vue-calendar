
<template>
    <section class="container">
        <div class="flexRow topBox">
            <div>{{clickDayTxt}}</div>
            <div class="dealBox flexRow">
                <div class="preMonthBtn" v-if="preMonthCanClick" @click="preMonthClick()"></div>
                <div class="preMonthBtn noClickBtn" v-else></div>
                <div class="curDay">{{changeDate.Format('yyyy-MM')}}</div>
                <div v-if="nextMonthCanClick" class="nextMonthBtn" @click="nextMonthClick()"></div>
                <div v-else class="nextMonthBtn noClickBtn"></div>
            </div>
        </div>
        <!-- 周显示 -->
        <ul class="weekShow flexRow">
            <li class="dayItem" v-for="(item,index) in weekShow" :key="index">{{item}}</li>
        </ul>
        <!-- 月天数 -->
        <ul class="monthShow flexRow">
            <li class="dayItem" v-for="(item,index) in monthShow" :key="index" @click="dayItemClick(item,index)">
                <div :class="[{'notCurMonthDay':item.monthDayFlag != 'now'},{'clickDayMark':item.clickDayMark}]">{{item.txt}}</div>
            </li>
        </ul>
    </section>
</template>

<script>
    import dateDeal from "./dateDeal";
    export default {
        data() {
            return {
                monthShow: [],
                today: new Date(),
                changeDate: "",
                nextMonthCanClick: false,
                preMonthCanClick: true
            };
        },
        props: {
            sundayStart: {
                type: Boolean,
                default: () => true
            }
        },
        computed: {
            weekShow() {
                return this.sundayStart ?
                    ["日", "一", "二", "三", "四", "五", "六"] :
                    ["一", "二", "三", "四", "五", "六", "日"];
            },
            clickDayTxt() {
                let day = this.today.getDay();
                day = this.sundayStart ? day - 1 : day;
                let year = this.today.getFullYear();
                let month = this.today.getMonth() + 1;
                let date = this.today.getDate();
                return `${year}年${month}月${date}日 星期${
                    ["日", "一", "二", "三", "四", "五", "六"][day]
                }`;
            }
        },
        beforeMount() {
            this.changeDate = this.today;
        },
        mounted() {
            let curYear = this.today.getFullYear();
            let curMonth = this.today.getMonth();
            let curDay = this.today.getDate();
            this.monthShowView(curYear, curMonth, curDay);
        },
        methods: {
            // 当前展示的某天点击处理
            dayItemClick(thisDayData) {
                let monthDayFlag = thisDayData.monthDayFlag;
                let curYear = this.changeDate.getFullYear();
                let curMonth = this.changeDate.getMonth();
                if (
                    (monthDayFlag == "pre" && !this.preMonthCanClick) ||
                    (monthDayFlag == "next" && !this.nextMonthCanClick)
                ) {
                    return false;
                }
                if (monthDayFlag == "pre") {
                    this.preMonthClick(thisDayData.txt);
                }
                if (monthDayFlag == "next") {
                    this.nextMonthClick(thisDayData.txt);
                }
                if (monthDayFlag == "now") {
                    this.monthShowView(curYear, curMonth, thisDayData.txt);
                }
            },
            // 上个月点击
            preMonthClick(clickDay = 0) {
                let curYear = this.changeDate.getFullYear();
                let curMonth = this.changeDate.getMonth();
                if (curMonth == 0) {
                    curYear--;
                    curMonth = 11;
                } else {
                    curMonth--;
                }
                this.monthShowView(curYear, curMonth, clickDay);
            },
            // 下个月点击
            nextMonthClick(clickDay = 0) {
                if (!this.nextMonthCanClick) return;
                let curYear = this.changeDate.getFullYear();
                let curMonth = this.changeDate.getMonth();
                if (curMonth == 11) {
                    curYear = curYear + 1;
                    curMonth = 0;
                } else {
                    curMonth = curMonth + 1;
                }
                this.monthShowView(curYear, curMonth, clickDay);
            },
            monthShowView(curYear, curMonth, clickDay = 0) {
                this.changeDate = new Date(curYear, curMonth);
                this.monthShow = [
                    ...this.somePreMonthDay(curYear, curMonth),
                    ...this.curMonthDay(curYear, curMonth, clickDay),
                    ...this.someNextMonthDay(curYear, curMonth)
                ];
                if (clickDay != 0) {
                    this.today = new Date(curYear, curMonth, clickDay);
                    this.$emit(
                        "click-date",
                        new Date(curYear, curMonth, clickDay).Format("yyyy-MM-dd")
                    );
                }
                this.preNextMonthBtnClick();
            },
            // 上下月按钮是否可点击
            preNextMonthBtnClick() {
                let thisMonthStartDate = new Date();
                if (
                    this.changeDate.getTime() ==
                    new Date(
                        thisMonthStartDate.getFullYear(),
                        thisMonthStartDate.getMonth(),
                        1
                    ).getTime()
                ) {
                    this.nextMonthCanClick = false;
                } else {
                    this.nextMonthCanClick = true;
                }
                if (this.changeDate.getTime() == new Date(1970, 0, 1).getTime()) {
                    this.preMonthCanClick = false;
                } else {
                    this.preMonthCanClick = true;
                }
            },
            // 当前月份天数展示
            curMonthDay(year, month, clickDay = 0) {
                let monthArr = [];
                for (let i = 1; i <= dateDeal.getMonthDays(year, month + 1); i++) {
                    let temp = {
                        txt: i,
                        monthDayFlag: "now",
                        date: new Date(year, month, i)
                    };
                    // 点击今天
                    if (clickDay != 0 && clickDay == i) {
                        temp.clickDayMark = true;
                    }
                    monthArr.push(temp);
                }
                return monthArr;
            },
            /**
             * 当前月展示的上月剩余日期
             *
             *  */
            somePreMonthDay(year, month, clickDay = 0) {
                let preMonthShow = [];
                let preMonthDateCount = new Date(year, month, 0).getDate();
                let thisMonthStartDay = new Date(year, month, 1).getDay();
                thisMonthStartDay = thisMonthStartDay;
                if (!this.sundayStart) {
                    thisMonthStartDay == 0 && (thisMonthStartDay = 7);
                    thisMonthStartDay = thisMonthStartDay - 1;
                }
                for (let i = 0; i < thisMonthStartDay; i++) {
                    preMonthShow.unshift({
                        txt: preMonthDateCount - i,
                        monthDayFlag: "pre",
                        date: new Date(year, month - 1, preMonthDateCount - i)
                    });
                }
                return preMonthShow;
            },
            /**
             * 当前月展示的下月开始日期
             *
             *  */
            someNextMonthDay(year, month) {
                let nextMonthShow = [];
                let thisMonthEndDay = new Date(year, month + 1, 0).getDate(); //当前月的最后一天
                let thisMonthEndCount = new Date(
                    year,
                    month,
                    thisMonthEndDay
                ).getDay(); //当前月的最后一天对应的星期几
                let loopNums = this.sundayStart ?
                    6 - thisMonthEndCount :
                    7 - thisMonthEndCount;
                if (loopNums == 7) loopNums = 0;
                for (let i = 0; i < loopNums; i++) {
                    nextMonthShow.push({
                        txt: i + 1,
                        monthDayFlag: "next",
                        date: new Date(year, month + 1, i + 1)
                    });
                }
                return nextMonthShow;
            }
        }
    };
</script>

<style scoped>
    ul,
    li {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .flexRow {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .flexCol {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .container {
        background: #fff;
        width: 100%;
        box-sizing: border-box;
        padding: 2% 2% 2% 2%;
        font-family: -apple-system, "PingFang SC", "Microsoft Yahei", sans-serif;
        text-align: center;
        font-size: 16px;
    }
    .topBox {
        justify-content: space-between;
        height: 35px;
    }
    .weekShow {
        width: 100%;
        padding: 10px 0;
        border-top: 1px solid #ccc;
    }
    .monthShow {
        width: 100%;
        padding: 10px 0;
        flex-wrap: wrap;
        justify-content: flex-start;
    }
    .dayItem {
        width: 14.25%;
        height: 40px;
        line-height: 40px;
    }
    .notCurMonthDay {
        color: #ccc;
    }
    .clickDayMark {
        color: red;
    }
    .curDay {
        margin: 0 10px;
    }
    .preMonthBtn {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        overflow: hidden;
        background: url("./img/left_icon_default.png") no-repeat;
        background-size: 100% 100%;
    }
    .nextMonthBtn {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        overflow: hidden;
        background: url("./img/right_icon_default.png") no-repeat;
        background-size: 100% 100%;
    }
    .preMonthBtn.noClickBtn {
        background: url("./img/left_icon_disabled.png") no-repeat;
        background-size: 100% 100%;
    }
    .nextMonthBtn.noClickBtn {
        background: url("./img/right_icon_disabled.png") no-repeat;
        background-size: 100% 100%;
    }
</style>
