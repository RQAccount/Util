var urlUtil = {
	go: function(pathname, param, option){

		option = $.extend({
			excludeParam: [], // 要排除的参数
			extendSearchParam: true // 是否基于当前页面的query参数
		}, option || {});

		if(typeof pathname !== 'string'){
			this.refresh(pathname);
			return;
		}
		var selfParam = $.extend(option.extendSearchParam ? getSearchParam() : {}, param);
		if(option && option.excludeParam && option.excludeParam.length) {
			option.excludeParam.forEach(function(p) {
				delete selfParam[p];
			});
		}
		location.href = pathname + '?' + $.param(selfParam);
	},
	refresh: function(param){
		var selfParam = $.extend(getSearchParam(),param);
		location.href = location.pathname + '?' + $.param(selfParam);
	},
    getUrlParamHash: function(paramName){
        var matches = location.search.match(/([^\?\=\&]+\=[^\&]+)/g);
        if(matches){
            var querys = {};
            matches.forEach(function (tmp) {
                var kv = tmp.split('=');
                kv[1] && (querys[kv[0]] = decodeURIComponent(kv[1]));
            });
            return paramName ? querys[paramName] : querys;
        }
    },
	getSearchParam: getSearchParam
}

function parseQueryString(str){
	var result = {};
	if(str && str.trim()){
		str.trim().split('&').forEach(function(item){
			var ar = item.split('=');
			if(ar.length === 2 && ar[1] !== ''){
				result[ar[0]] = decodeURIComponent(ar[1]);
			}
		});
		return result;
	}
	return result;
}

function getHashParam(){
	return parseQueryString(getHashStr());
}

function getHashStr(){
	var hashIndex = location.href.indexOf('#');
	return hashIndex > -1 ? location.href.slice(hashIndex+1) : '';
}

function getSearchParam(){
	return parseQueryString(location.search.replace('?', ''));
}

$.urlUtil = urlUtil;
