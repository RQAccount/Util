/**
 * 依赖zepto
 */
;(function($){
    //手机号只做6-15位宽校验
    var RULES = {
        Mobile:/^[0-9]*[1-9][0-9]*$/,
        Mail:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        Text:/^[a-zA-Z0-9]\w*$/,
        Number:/^[0-9]*[1-9][0-9]*$/,
        Password:/(?!^\d+$)(?!^[a-zA-Z]+$)^[0-9a-zA-Z]*/
    }

    /**
     * 类型校验
     * @param value
     * @param type
     * @returns {boolean}
     */
    function typeCheck(value,type) {
        if( !type ) {
            return true;
        }
        if( RULES[type] ){
            return RULES[type].test(value);
        }
        else
            return true;
    }

    /**
     * 长度和非空校验
     * @param value
     * @param state
     * @returns {boolean}
     */
    function lenCheck(value,state) {
        if( !state )
            return true;
        if( state == 'NOTNULL' || state == 'NotNULL' || state == 'notnull'){
            if($.trim(value).length >0 )
                return true;
            else
                return false;
        }
        else {
            var min = state.split("-")[0];
            var max = state.split("-")[1];
            if( min && min!="")
                min = parseInt(min);
            else
                min = 0;
            if( max && max!="")
                max = parseInt(max);
        }
        if( min != undefined && value.length < parseInt( min )){
            return false;
        }
        if( max != undefined && value.length > parseInt( max )){
            return false;
        }
        return true;
    }

    /**
     * 输入框校验
     * @param ipt       校验的输入框
     * @returns {*}
     */
    function validate(ipt) {
        var value = $(ipt).val();
        var str = $(ipt).attr("validate");
        if( !str )
            return true;
        var rules = str.split('|');
        var type = rules[0];
        var state = rules[1];

        if( !typeCheck(value,type) )
            return false;
        if( !lenCheck(value,state) )
            return false;
        return true;

    }

    /**
     * 立即执行校验
     * @constructor
     */
    $.fn.Vali = function(){
        if( $(this).attr('disabled') == 'disabled' || $(this).attr('disabled') == true)
            return true;
        else
            return validate(this);
    }
    /**
     * 内容发生修改时进行校验
     * @param rules     校验规则，目前只支持传入方法，
     * @param success   校验成功回调
     * @param fail      校验失败回调
     */
    $.fn.changeVali = function(rules,success,fail) {
        var me = this;
        $(me).on('input',function() {
            if( rules && $.isFunction(rules) ){
                var result = rules();
            }
            else {
                var result = validate(me);
            }
            //console.log(result)
            if( result ){
                //校验通过
                if( success && $.isFunction(success) ) {
                    success();
                }
                return true;
            }
            else {
                if( fail && $.isFunction(fail)) {
                    fail();
                }
                return false;
            }
        });
    }
    /**
     * 对表单内所有input进行检验
     * 忽略disable的input框
     * @param fail        校验失败回调
     * @returns {boolean}   校验通过返回true，失败返回false
     */
    $.fn.formVali = function(fail){
        var form = this;
        var ipts = $(form).find('input');
        var result = null;
        var failList = [];
        for(var i = 0,len = ipts.length; i < len; i++) {
            if( $(ipts[i]).attr('disabled') != 'disabled' && $(ipts[i]).attr('disabled') != true ) {
                if (validate(ipts[i]) == false) {
                   // console.log(ipts[i])
                    failList.push(ipts[i]);
                    result = false;
                    $(ipts[i]).addClass('red-font');
                    $(ipts[i]).focus(function () {
                        $(this).removeClass('red-font');
                    });
                }
            }
        }
        if(result == false){
            if( fail && $.isFunction(fail)){
                fail(failList);
            }
            else
                return false;
        }
        else
            return true;
    }
})(Zepto)