记录每天晚上最后一秒的时间
最近游戏涉及签到功能，需要用到计算每天最后一秒的时间戳。

注意：
*参数 time 是当天任意时间的时间戳
此函数返回的是时间戳*

``` typescript
public count_end_time (time: number) {
        let year = new Date(time).getFullYear();
        let month = new Date(time).getMonth() + 1;
        let day = new Date(time).getDate();
        let month_str = month >= 10 ? month.toString() : '0' + month;
        let day_str = day >= 10 ? day.toString() : '0' + day;
        let str = year + '/' + month_str + '/' + day_str + ' ' + '23:59:59';
        return new Date(str).getTime();
    }
```