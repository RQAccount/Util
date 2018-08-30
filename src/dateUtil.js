module.exports = {

    /**
    * @param with_hms 是否保留时分秒
    **/
    toDateObj: function(date, with_hms) {

        if(Object.prototype.toString.call(date) !== "[object Date]") {
            if(typeof date === "string") {
                var parts = date.split(/[-/]/),
                    year = parseInt(parts[0]),
                    month = parseInt(parts[1]) - 1,
                    day = parseInt(parts[2]);
                date = new Date(year, month, day);
            } else {
                throw new Error("date 参数应为字符串或日期对象");
            }
        }
        if(!with_hms) {
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }

        return date;
    },

    /* 
    * 在date的基础上加num天，num为负数则为减几天
    * @return 日期对象
    */
    add: function(date, num, needStr) {
        needStr = needStr !== void 0 ? needStr : typeof date === "string";
        date = this.toDateObj(date);
        num = num || 0;
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + num);
        return needStr ? this.format(date) : date;
    },

    /*
    * 增加月份
    */
    addMonth: function(date, length, needStr) {
        needStr = needStr !== void 0 ? needStr : typeof date === "string";
        date = this.toDateObj(this.clone(date));
        var day   = date.getDate(),
            month = date.getMonth();
        date.setMonth(month + length);
        if (date.getDate() != day) {
            date.setDate(0);
        }

        return needStr ? this.format(date) : date;
    },

    /**
    * 克隆一个日期，防止污染原引用
    **/
    clone: function(date) {
        if(Object.prototype.toString.call(date) === "[object Date]") {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        } else {
            return date;
        }
    },

    /*
    * 格式化日期字符串
    */
    format: function(date, str) {
        var self = this;
        
        str = str || "yyyy-MM-dd";
        if(typeof date === "string") {
            date = this.toDateObj(date);
        }

        return str.replace(/(week|eweek(\d*)|yyyy|eMM(\d*)|MM|M|dd|d)/g, function(all, $1, index, originStr) {
            // $1 代表第一个命中的分组
            switch($1) {
                case "yyyy":
                    return date.getFullYear();
                case "MM":
                    return self.padLeft(date.getMonth() + 1, 2, "0");
                case "M":
                    return date.getMonth() + 1;
                case "dd":
                    return self.padLeft(date.getDate(), 2, "0");
                case "d":
                    return date.getDate();
                case "week":
                    return self.getWeekStr(date);
                default: // 带有截断长度的正则匹配
                    var eWeekMatch = $1.match(/^eweek(\d*)$/),
                        dayOfWeek = date.getDay();
                    if(eWeekMatch) {
                        var eWeekStr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek];
                        if(eWeekMatch[1]) {
                            eWeekStr = eWeekStr.substring(0, eWeekMatch[1]);
                        }
                        return eWeekStr;
                    }
                    
                    var eMonthMatch = $1.match(/^eMM(\d*)$/),
                        month = date.getMonth();
                    if(eMonthMatch) {
                        var eMonthStr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month];
                        if(eMonthMatch[1]) {
                            eMonthStr = eMonthStr.substring(0, eMonthMatch[1]);
                        }
                        return eMonthStr;
                    }
            }
        });
    },

    getWeekStr: function(date) {
        date = this.toDateObj(date);
        return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()];
    },

    padLeft: function(str, len, c) {
        str = str + "";
        c = c || " ";
        while(str.length < len) {
            str = c + str;
        }
        return str;
    },

    /*
    * @param start String/Date 开始日期 inclusive
    * @param end String/Date 结束日期 inclusive
    * @desc 计算两个日期间距的天数，start,end 顺序无所谓，
    * @ret num Integer 
    */
    distance: function(start, end) {
        start = this.toDateObj(start);
        end = this.toDateObj(end);
        return parseInt(Math.abs(start - end) / 1000 / 60 / 60 / 24) + 1;
    },

    /*
    * @param d1 String/Date
    * @param d2 String/Date
    * @desc 比较 d1,d2 大小，排除时分秒
    * @ret num Integer >0表示d1>d2，==0表示d1==d2，<0表示d1<d2 
    */
    compare: function(d1, d2) {
        d1 = this.toDateObj(d1);
        d2 = this.toDateObj(d2);
        return d1 - d2;
    }
};
