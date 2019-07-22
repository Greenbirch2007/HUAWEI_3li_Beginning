$(function(){
    /*判断文章段落前的空格，如果都是空格不加缩进*/
    /*  $(".simditor-body p").each(function () {
        var splitLen = $(this).text().substring(0, 4);
        if ($.trim(splitLen).length != 0) {
            $(this).css('text-indent', '32px');
        }
     });*/
    //comment  获取主站文章新模版详情页评论的数据

    //获取文章ID
    var webID = $('#webID').val();

    //判断文章是否需要检测登录态
    $.ajax({
    	type:"get",
    	url:"/webapi/arcinfo",
    	dataType:'json',
    	data :{
    		dopost: "arcinfo",
    		aid: webID
    	},
    	success:function(d){
    		if(d.need_check_door == 1){
    			// 获取登录状态
			    $.get(ElecfansApi_checklogin, {act: 'article'}, function (d) {
			        var m = $.parseJSON(d);
			        var LoginStatus = m.uid === undefined ? false : true;
			        if( !LoginStatus ){
			        	$(".simditor-body").css({
			        		"height"  : "450px",
			        		"overflow" : "hidden"
			        	});
			        	$(".simditor-body").after('<div class="seeHide"><a>阅读全文</a></div>');

			        	//点击是否查看更多的文章关门规则
			        	$(".seeHide a").click(function(){
			        		var a_time = $(".article-info .time").text();
	    					var referrer = document.referrer;
	    						//判断是否为百度过来或者首页过来
    						if( referrer != 'http://www.elecfans.net' && referrer != 'http://www.elecfans.net/index.html' && referrer != 'http://www.elecfans.net/' && referrer.indexOf("baidu") == -1 ){
    							//判断是否是当天的文章
    							if( _isToday(a_time) == false ){
    								$("#btnLogin").click();
    							}else{
		    						$(".simditor-body").css({
						        		"height"  : "auto",
						        		"overflow" : "inherit"
						        	});
						        	$(".seeHide").remove();
		    					}
    						}else{
    							$(".simditor-body").css({
					        		"height"  : "auto",
					        		"overflow" : "inherit"
					        	});
					        	$(".seeHide").remove();
    						}
			        	});

			        }else{
			        	if($(".seeHide")){
			        		$(".seeHide").remove();
			        	}
			        }
			    });
    		}
    	}
    });

    //判断是否为当天函数
    function _isToday(str){
	    var d = new Date(str.replace(/-/g,"/"));
	    var todaysDate = new Date();
	    if(d.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)){
	        return true;
	    } else {
	        return false;
	    }
	}


    $.ajax({
        type:'get',
        url:'/webapi/arcinfo/apiGetCommentJson' + '?aid=' + webID,
        dataType:'json',
        success:function(re){
            if(re.error_code==0){
                var data = re.data;
                var count = re.count;
                $('#comment_num_zz').html(count);
                var inner_str = '';
                for(i in data){
                    inner_str+='<article class="comment" >'+
			                        '<a href="'+data[i]['homeurl']+'" class="face"><img src="'+data[i]['avatar']+'"/></a>'+
			                        '<div class="main">'+
			                            '<header><a href="'+data[i]['homeurl']+'">'+data[i]['username']+'</a></header>'+
			                            '<div class="content">'+data[i]['msg']+'</div>'+
			                            '<footer class="time">'+data[i]['dtime']+'<a class="reply_com replyClass_'+data[i]['id']+'"  data-tid="'+data[i]['id']+'" data-name="'+data[i]['username']+'" style="color: #999;margin-left: 20px;font-size: 12px;">回复</a>'+
			                            '</footer>'
			                        for( var j in data[i]['child']){
			                        	var  data_j = data[i]['child'][j];
			                        	inner_str+='<dl class="son_comment">'+
					                                    '<dt class="first_level">'+
					                                        '<a href="'+data_j['homeurl']+'" class="face"><img src="'+data_j['avatar']+'"/></a>'+
					                                        '<span><a href="'+data_j['homeurl']+'" >'+data_j['username']+'</a></span>'+
					                                    '</dt>'+
					                                    '<dd>'+
					                                       ' <span>'+data_j['msg']+'</span>'+
					                                    '</dd>'+
					                                '</dl>'
			                        }
			                        inner_str+='</div></article>';
                }
                $('.detaildzs_list').append(inner_str);
            }
        }
    })

        var ali_verify;
        //评论 -------------------------------
        var comment = $("#comment");
        var comment_input = $("#comContent");
        !function(){
            // 插入阿里滑动验证dom
            if ($("#comSubmit").length) {
                var htm = '<div id="drag_verify"></div>'
                        +'<input type="hidden" id="csessionid">'
                        +'<input type="hidden" id="sig">'
                        +'<input type="hidden" id="token">'
                        +'<input type="hidden" id="aliscene">'
                $("#comSubmit").before(htm);
                $.getScript('//g.alicdn.com/sd/ncpc/nc.js?t=2015052012',function(){
                    // 文章评论阿里云验证
                    ali_verify = new noCaptcha();
                    // 应用标识,不可更改
                    var nc_appkey = 'FFFF0000000001784D08';
                    // 场景,不可更改
                    var nc_scene = 'activity';
                    var nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
                    var nc_option = {
                        // 渲染到该DOM ID指定的Div位置
                        renderTo: '#drag_verify',
                        appkey: nc_appkey,
                        scene: nc_scene,
                        token: nc_token,
                        // 测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
                        // trans: '{"name1":"code100"}',
                        // 校验成功回调
                        callback: function(data){
                            $('#csessionid').val(data.csessionid);
                            $('#sig').val(data.sig);
                            $('#token').val(nc_token);
                            $('#aliscene').val(nc_scene);
                            $("#post-err-tip").hide();
                        }
                    };
                    ali_verify.init(nc_option);
                })
            }
        }();

        //提交评论点击事件交互
        $("#comSubmit").on('click',function(){
            var $t = $(this);
            var content = comment_input.html();
            var tid = $(this).attr("data-tid");
            var aid =	webID  || article_id ;
            var $err = $t.prev('#post-err-tip');
            if ($('#token').val()) {
                $err.hide();
                postcomment( aid ,tid);
            } else {
                if (!$err.length) {
                    $err = $('<span id="post-err-tip" style="color: #c00;display: block;margin-top: 10px;">请先按住拖动上方滑块到最右边</span>').insertBefore($t);
                } else {
                    $err.show();
                }
            }
            //提交数据到服务器
            return false;
        });

        comment_input.on("input",function(){
        	var htm = this.innerHTML;
		     if (htm.length!= 0 && htm!='<br>') {
		        $(this).removeClass('placeholder');
		     } else {
		        $(this).addClass('placeholder');
		     }
        });

        //回复评论
        $("body").on("click",".reply_com",function(){
        	var reply_name = $(this).attr("data-name");
        	var tid = $(this).attr("data-tid");
        	comment_input.attr('placeholder', "回复"+reply_name+" :" );
        	comment_input.addClass('placeholder');
        	$("#comSubmit").attr("data-tid",tid);
        	$(window).scrollTop(comment_input.offset().top-300);
        });

        //提交评论或者回复的数据函数
        function postcomment( aid,tid ){
        	$.post('/webapi/arccomment',
                {
                	dopost: "apiPubComment",
                    aid: aid,
                    tid: tid,
                    content: comment_input.html(),
                    csessionid: $('#csessionid').val(),
                    sig: $('#sig').val(),
                    token: $('#token').val(),
                    aliscene: $('#aliscene').val()
                },function(data){
                	var data = JSON.parse(data);
                    //返回的数据格式：
                    if( data.status == "successed" ){
                    	var data = data.data;
//                  	console.log(data);
                    	if( tid == ""){
                    		//构建临时评论DOM
	                        var dom = '';
	                            dom += '<div class="comment temp" id="tempComment">';
	                        dom += '  <a href="' + data['homeurl'] + '" class="face"><img src="' + data['avatar'] + '" /></a>';
	                            dom += '  <div class="main">';
	                        dom += '     <p><a href="' + data['homeurl'] + '" >' + data['username']+ '</a></p>';
	                            dom += '     <div class="content">';
	                            dom += '     ' + data['msg'] + '';
	                            dom += '     </div>';
	                            dom += '    <footer class="time">' + data['dtime'] + '<a class="reply_com replyClass_'+data['id']+'"  data-tid="'+data['id']+'" data-name="'+data['username']+'" style="color: #999;margin-left: 20px;font-size: 12px;">回复</a></footer>';
	                            dom += '  </div>';
	                            dom += '</div>';
	                            //插入临时评论到列表
	                        $("#comment").append( dom );
                    	}else{
                    		var htm = '<dl class="son_comment">'+
	                                   ' <dt class="first_level">'+
	                                        '<a href="' + data['homeurl'] + '" class="face"><img src="' + data['avatar'] + '" /></a>'+
	                                        '<span><a href="' + data['homeurl'] + '" >' + data['username'] + '</a></span>'+
	                                    '</dt>'+
	                                    '<dd>'+
	                                        '<span style="color:#666">'+data['msg']+'</span>'+
	                                    '</dd>'+
	                                '</dl>'
                    		$(".replyClass_"+tid).parent().append( htm );
                    		$("#comSubmit").attr("data-tid","");
                    	}
                        //清空输入框
                        comment_input.html("");
                    }
                    if( data.status == "failed" ){
                    	if( data.msg != "logout" ){
                    		layer.open({
	                          title: '提示'
	                          ,content: data.msg
	                        });
                    	}
                    }
                    ali_verify.reload();
                }
            );
        }


//回复 -----------------------------------------------------------
        var win_width = $(window).width();
        if(win_width > 1000){
            //鼠标经过显示回应按钮
            comment.find("article.comment").hover(function(){
                comment.find("span.action").hide();
                $(this).find("span.action").show();
            },function(){
                comment.find("span.action").hide();
            });
        }
        //点回复操作
        comment.on('click','a.reply',function(){
            if( logined == false ){
                var dialog = new LnDialog();
                dialog.showLogin();
                return false;
            }

            var _this = $(this);
            var reply_id = _this.attr("data-id");//被回复的这条评论的ID
            var to_user_id = _this.attr("tuid");//被回复的这条评论是谁写的（该用户ID）

            var rname = _this.attr("data-name");
            var quote_content = _this.parent().parent().siblings().find("strong").html();//获取被回复那个评论的内容

            //构建回复表单DOM
            var dom = '';
                dom += '<div class="reply-form clearfix" id="replyForm">';
                dom += '    <div class="editable-wrap">';
                dom += '        <div class="editable" contentEditable="true" id="replyContent" placeholder="回复：'+rname+'"></div>';
                dom += '    </div>';
                dom += '    <div class="btn-wrap"><a id="replySubmit" href="#" class="btn">提交</a> <a class="btn cancel" id="replyCancel" href="#">取消</a></div>';
                dom += '</div>';
            //移除回复表单
			$("#replyForm").remove();
			//在当前回复按钮所在位置插入评论表单并显示
		    _this.parent("span").parent("footer").after( dom );
			$("#replyForm").fadeIn(400);
            //表单自动获得焦点
            $("#replyContent").focus();
            //取消按钮
            comment.on('click','a.cancel',function(){
                    $("#replyForm").remove();
                    return false;
            });
            $("#replySubmit").on('click',function(){
                    //获取内容
                    var reply_content = $("#replyContent").html();
                    //提示提交中...
                    $("#replyForm").after('<div id="replyTip" class="reply-tip" ><img src="/ui/images/loading.gif" /> 提交中...</div>');
                    //隐藏表单
                    $("#replyForm").hide();

                    //提交数据到服务器
                    $.post('/article/handleComment',
                        {
                            article_id: article_id,
                            article_user_id: article_user_id,
                            content: reply_content,
                            reply_id:reply_id,
                            reply_user_id:to_user_id
                        },function(data){
                            //返回的数据格式：
                            if( data.status == "successed" ){
                                //{"status":"successed","comment":{"uid":"1","username":"shaomai","create_time":1401355635,"content":"\u6d4b\u8bd5\u554a\u89c4\u8303\u7684\u89c4\u5b9a","type":"1","mainid":5,"pid":"0","puid":"0","pusername":"","topid":"0","id":3}}
                                //提示回复成功
                                $("#replyTip").html('<div id="replyOK" class="reply-ok"><span class="icon-check"></span> 回复成功</div>');
                                $("#replyForm").remove();
                                //构建临时回应DOM
                                var dom = '';
                                    dom += '';
                                    dom += '<article class="comment temp-reply">';
                                    dom += '    <a class="face" href="#"><img src="'+myface+'"></a>';
                                    dom += '    <div class="main">';
                                    dom += '        <header><a href="#">'+myname+'</a></header>';
                                    dom += '        <div class="content">';
                                    dom += '            <div class="reply-quote">'+quote_content+'</div>';
                                    dom += '            '+reply_content+'</div>';
                                    dom += '        <footer class="time">刚刚</footer>';
                                    dom += '    </div>';
                                    dom += '</article>';
                                //将临时回应DOM插入页面中
                                $("#cForm").before( dom );
                                //隐藏replyTip
                                setTimeout(function(){	$("#replyTip").fadeOut(200,function(){
                                        //页面滚动到最底部
                                        var target_top = $("#cForm").offset().top;
                                        $("html,body").animate({ scrollTop : target_top },800);
                                    }
                                )},1000);

                            }
                            if( data.status == "failed" ){
                                $("#replyForm").show();
                                $("#replyTip").remove();
                                alert( data.msg );
                            }
                        }
                    );
                    return false;
            });
            return false;
        })

        //删除评论 -----------------
        comment.on('click','a.delete',function(){
            var _this = $(this);
            var cid = _this.attr("data-id");

            //提交数据到服务器
            $.post('/article/deleteComment',
                {
                    cid:cid,
                    article_id:article_id
                },function(data){
                    //返回的数据格式：
                    if( data.status == "successed" ){

                        _this.parent().parent().parent().parent().slideUp(300);
                    }
                    if( data.status == "failed" ){

                        alert( data.msg );
                    }
                }
            );
            return false;
        });
    function Collect(_this,tagId){
        if(now_uid==''){
            $.tActivityLogin();
            return false;
        }

        _this.attr('disabled','disabled');
        var thisBtb = _this;
        $.ajax({
            url:'/plus/t.php',
            type:'post',
            data:{
                act:'attention',
                tagid:tagId,
            },
            success:function(data){
                $(this).removeAttr('disabled');
                if(data.error_code==0){
                    if(data.flag==1){
                        thisBtb.addClass('on').html('已关注');
                    }else{
                        thisBtb.removeClass('on').html('关注');
                    }
                }
            }
        })
    }
    /*
     * 判断是否收藏
     * */
    function CheakTag(_this,tagId){
        var thisBtb = _this;
        $.ajax({
            url:'/plus/t.php?act=checkattention&tagname=dram',
            type:'GET',
            data:{
                tagid:tagId,
            },
            success:function(data){
                $(this).removeAttr('disabled');
                if(data.error_code==0){
                    if(data.flag==1){
                        thisBtb.addClass('on').html('已关注');
                    }else{
                        thisBtb.removeClass('on').html('关注');
                    }
                    //异步加载标签关注数
                    var attention_count_span = $('#attention_count_span'+data.taginfo.id);
                    if(attention_count_span.length>0){
                        if(data.taginfo.attention_count){
                            attention_count_span.html(data.taginfo.attention_count);
                        }else{
                            attention_count_span.html(0);
                        }
                    }
                    //异步加载标签描述
                    var tag_desc_button  = $('#tag_desc_button'+data.taginfo.id);
                    if(tag_desc_button.length>0){
                        if(data.taginfo.desc){
                            var desc =  '<div class="bottom">'+data.taginfo.desc+'</div> ';
                            tag_desc_button.html(desc);
                        }
                    }
                }
            }
        })
    }

    function baidu_ad(posterid, htmlid, width, height) {
        if ($(htmlid).length > 0) {
            var randomnumber = Math.random();
            var ga = document.createElement('iframe');
            ga.src = 'http://www.elecfans.com/webapi/advertisement/baiduAd.html?target=_blank&cb=' + randomnumber + '&zoneid=' + posterid;
            ga.width = width;
            ga.height = height;
            ga.frameBorder = 0;
            ga.scrolling = 'no';
            var s = $(htmlid).append(ga);
        }
    }

    $(".hot-main>li").each(function(){
        $(this).click(function(){
            var getDataHref = $(this).attr('data-href');
            window.open(getDataHref);
        })
    });
    $(".hot-des").click(function(e){
        e.stopPropagation();
    })
    $(".hot-des .attend").click(function(){
        Collect($(this),$(this).attr('data-id'));
    });
    $(".hot-main li").hover(function(){
        if(!$(this).attr('data-hovered')){
            $(this).attr('data-hovered','1');
            var attendTag = $(this).find('.attend');
            CheakTag(attendTag,attendTag.attr('data-id'));
        }
    });
    $(document).click(function(){
        $("#bdcs").hide();
    });
    $(".simditor .simditor-body p").eq(1).after('<div id="new-middle-berry"></div>');
    // $(".simditor .simditor-body p").eq(3).after('<div style="float: left;margin-right: 18px;margin-top: 14px;" id="new-left-berry"></div>');
    var getArtBox = $(".article-list .article");
    var getArtLen = getArtBox.length;
    var addZoneId = [837, 838, 839];
    var addZoneNum = 0;
    getArtBox.each(function (i) {
        if ($(this).index() % 5 == 0) {
            $(this).after('<div style="height:150px;" id="new-listAd' + i + '"></div>');
            openX_ad(addZoneId[addZoneNum], '#new-listAd' + i + '', 675, 170);
            addZoneNum++;
            if (addZoneNum >= 3) {
                addZoneNum = 0;
            }
        }
    });

    if( $(".article-list .article").eq(1) ){
    	$(".article-list .article").eq(1).before('<div id="new_fsy_listAd"></div>');
    }
    var ic_ad = '<div id="new-ic-berry"></div>';
    $('#new-adsm-berry').before(ic_ad);
    openX_ic_ad(166, '#new_fsy_listAd', 675, 150);

    // openX_ad(821, '#MiddleLeaderboard', 728, 90);
    openX_ad(903, '#new-ic-berry', 300, 250);
    // openX_ad(820, '#new-adsm-berry', 300, 250);
    var st_ad = '<div id="st-source-berry"><div class="panel_hd">ST资源专区</div><div class="bd"></div></div>';
    $('#new-company-berry').before(st_ad);
    openX_ad(900, '#st-source-berry .bd', 300, 220);
    openX_ad(600, '#new-company-berry', 298, 345);
    openX_ad(842, '#new-company-zone', 300, 213);
    // openX_ad(822, '#IndexRightBottom', 300, 600);
    openX_ad(811, '#new-course-berry', 300, 417);
    openX_ad(812, '#new-webinar-berry', 300, 356);
    openX_ad(813, '#new-middle-berry', 675, 302);
    //  openX_ad(814, '#new-left-berry', 302, 280);




    var ad_id = 0;
    if( $('#adChannel').length > 0 ) {
        ad_id = $('#adChannel').val();
    }
    switch (ad_id) {
        case '1075':
            openX_ad(821, '#MiddleLeaderboard', 728, 90);
            openX_ad(820, '#new-adsm-berry', 300, 250);
            openX_ad(822, '#IndexRightBottom', 300, 600);
            break;
        case '148':
            openX_ad(14, '#TopLeaderboard', 728, 90);
            openX_ad(359, '#newTopAdRight', 260, 90);
            openX_ad(16, '#MiddleLeaderboard', 728, 90);
            openX_ad(18, '#BottomLeaderboard', 728, 90);
            openX_ad(15, '#IndexRightBottom', 300, 600);
            openX_ad(17, '#new-adsm-berry', 300, 250);
            openX_ad(20, '#Right3', 300, 250);
            openX_ad(21, '#ArticleAd', 300, 250);
            openX_ad(790, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(591, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(592, '#openx-ti-company', 300, 345);
            }
            break;
        case '155':
            openX_ad(7, '#TopLeaderboard', 728, 90);
            openX_ad(357, '#newTopAdRight', 260, 90);
            openX_ad(8, '#MiddleLeaderboard', 728, 90);
            openX_ad(9, '#BottomLeaderboard', 728, 90);
            openX_ad(10, '#IndexRightBottom', 300, 600);
            openX_ad(11, '#new-adsm-berry', 300, 250);
            openX_ad(12, '#Right3', 300, 250);
            openX_ad(13, '#ArticleAd', 300, 250);
            openX_ad(788, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(589, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(590, '#openx-ti-company', 300, 345);
            }
            break;
        case '144':
            openX_ad(29, '#TopLeaderboard', 728, 90);
            openX_ad(365, '#newTopAdRight', 260, 90);
            openX_ad(27, '#MiddleLeaderboard', 728, 90);
            openX_ad(25, '#BottomLeaderboard', 728, 90);
            openX_ad(28, '#IndexRightBottom', 300, 600);
            openX_ad(26, '#new-adsm-berry', 300, 250);
            openX_ad(23, '#Right3', 300, 250);
            openX_ad(24, '#ArticleAd', 300, 250);
            openX_ad(795, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(595, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(596, '#openx-ti-company', 300, 345);
            }
            break;
        case '200':
            openX_ad(36, '#TopLeaderboard', 728, 90);
            openX_ad(356, '#newTopAdRight', 260, 90);
            openX_ad(34, '#MiddleLeaderboard', 728, 90);
            openX_ad(32, '#BottomLeaderboard', 728, 90);
            openX_ad(35, '#IndexRightBottom', 300, 600);
            openX_ad(37, '#new-adsm-berry', 300, 250);
            openX_ad(31, '#Right3', 300, 250);
            openX_ad(30, '#ArticleAd', 300, 250);
            openX_ad(783, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(567, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(568, '#openx-ti-company', 300, 345);
            }
            break;
        case '47':
            openX_ad(44, '#TopLeaderboard', 728, 90);
            openX_ad(368, '#newTopAdRight', 260, 90);
            openX_ad(42, '#MiddleLeaderboard', 728, 90);
            openX_ad(40, '#BottomLeaderboard', 728, 90);
            openX_ad(43, '#IndexRightBottom', 300, 600);
            openX_ad(41, '#new-adsm-berry', 300, 250);
            openX_ad(39, '#Right3', 300, 250);
            openX_ad(38, '#ArticleAd', 300, 250);
            openX_ad(798, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(597, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(598, '#openx-ti-company', 300, 345);
            }
            break;
        case '59':
            openX_ad(51, '#TopLeaderboard', 728, 90);
            openX_ad(363, '#newTopAdRight', 260, 90);
            openX_ad(49, '#MiddleLeaderboard', 728, 90);
            openX_ad(47, '#BottomLeaderboard', 728, 90);
            openX_ad(50, '#IndexRightBottom', 300, 600);
            openX_ad(48, '#new-adsm-berry', 300, 250);
            openX_ad(46, '#Right3', 300, 250);
            openX_ad(45, '#ArticleAd', 300, 250);
            openX_ad(793, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(593, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(594, '#openx-ti-company', 300, 345);
            }
            break;
        case '56':
            openX_ad(58, '#TopLeaderboard', 728, 90);
            openX_ad(353, '#newTopAdRight', 260, 90);
            openX_ad(56, '#MiddleLeaderboard', 728, 90);
            openX_ad(54, '#BottomLeaderboard', 728, 90);
            openX_ad(57, '#IndexRightBottom', 300, 600);
            openX_ad(55, '#new-adsm-berry', 300, 250);
            openX_ad(53, '#Right3', 300, 250);
            openX_ad(52, '#ArticleAd', 300, 250);
            openX_ad(785, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(573, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(574, '#openx-ti-company', 300, 345);
            }
            break;
        case '57':
            openX_ad(72, '#TopLeaderboard', 728, 90);
            openX_ad(358, '#newTopAdRight', 260, 90);
            openX_ad(70, '#MiddleLeaderboard', 728, 90);
            openX_ad(68, '#BottomLeaderboard', 728, 90);
            openX_ad(71, '#IndexRightBottom', 300, 600);
            openX_ad(69, '#new-adsm-berry', 300, 250);
            openX_ad(67, '#Right3', 300, 250);
            openX_ad(66, '#ArticleAd', 300, 250);
            openX_ad(789, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(571, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(572, '#openx-ti-company', 300, 345);
            }
            break;
        case '841':
            openX_ad(79, '#TopLeaderboard', 728, 90);
            openX_ad(366, '#newTopAdRight', 260, 90);
            openX_ad(77, '#MiddleLeaderboard', 728, 90);
            openX_ad(75, '#BottomLeaderboard', 728, 90);
            openX_ad(78, '#IndexRightBottom', 300, 600);
            openX_ad(76, '#new-adsm-berry', 300, 250);
            openX_ad(74, '#Right3', 300, 250);
            openX_ad(73, '#ArticleAd', 300, 250);
            openX_ad(781, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(575, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(576, '#openx-ti-company', 300, 345);
            }
            break;
        case '38':
            openX_ad(86, '#TopLeaderboard', 728, 90);
            openX_ad(362, '#newTopAdRight', 260, 90);
            openX_ad(84, '#MiddleLeaderboard', 728, 90);
            openX_ad(82, '#BottomLeaderboard', 728, 90);
            openX_ad(85, '#IndexRightBottom', 300, 600);
            openX_ad(83, '#new-adsm-berry', 300, 250);
            openX_ad(81, '#Right3', 300, 250);
            openX_ad(80, '#ArticleAd', 300, 250);
            openX_ad(781, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(577, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(578, '#openx-ti-company', 300, 345);
            }
            break;
        case '967':
            openX_ad(93, '#TopLeaderboard', 728, 90);
            openX_ad(355, '#newTopAdRight', 260, 90);
            openX_ad(91, '#MiddleLeaderboard', 728, 90);
            openX_ad(89, '#BottomLeaderboard', 728, 90);
            openX_ad(92, '#IndexRightBottom', 300, 600);
            openX_ad(90, '#new-adsm-berry', 300, 250);
            openX_ad(88, '#Right3', 300, 250);
            openX_ad(87, '#ArticleAd', 300, 250);
            openX_ad(787, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(579, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(580, '#openx-ti-company', 300, 345);
            }
            break;
        case '783':
            openX_ad(100, '#TopLeaderboard', 728, 90);
            openX_ad(360, '#newTopAdRight', 260, 90);
            openX_ad(98, '#MiddleLeaderboard', 728, 90);
            openX_ad(96, '#BottomLeaderboard', 728, 90);
            openX_ad(99, '#IndexRightBottom', 300, 600);
            openX_ad(97, '#new-adsm-berry', 300, 250);
            openX_ad(95, '#Right3', 300, 250);
            openX_ad(94, '#ArticleAd', 300, 250);
            openX_ad(791, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(581, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(582, '#openx-ti-company', 300, 345);
            }
            break;
        case '55':
            openX_ad(107, '#TopLeaderboard', 728, 90);
            openX_ad(354, '#newTopAdRight', 260, 90);
            openX_ad(105, '#MiddleLeaderboard', 728, 90);
            openX_ad(103, '#BottomLeaderboard', 728, 90);
            openX_ad(106, '#IndexRightBottom', 300, 600);
            openX_ad(104, '#new-adsm-berry', 300, 250);
            openX_ad(102, '#Right3', 300, 250);
            openX_ad(101, '#ArticleAd', 300, 250);
            openX_ad(786, '#AdHtmlRight', 300, 125);

            if (!isArticlePage) {
                openX_ad(583, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(584, '#openx-ti-company', 300, 345);
            }
            break;
        case '922':
            openX_ad(114, '#TopLeaderboard', 728, 90);
            openX_ad(364, '#newTopAdRight', 260, 90);
            openX_ad(112, '#MiddleLeaderboard', 728, 90);
            openX_ad(110, '#BottomLeaderboard', 728, 90);
            openX_ad(113, '#IndexRightBottom', 300, 600);
            openX_ad(111, '#new-adsm-berry', 300, 250);
            openX_ad(109, '#Right3', 300, 250);
            openX_ad(108, '#ArticleAd', 300, 250);
            openX_ad(794, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(585, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(586, '#openx-ti-company', 300, 345);
            }
            break;
        case '50':
            openX_ad(121, '#TopLeaderboard', 728, 90);
            openX_ad(367, '#newTopAdRight', 260, 90);
            openX_ad(119, '#MiddleLeaderboard', 728, 90);
            openX_ad(117, '#BottomLeaderboard', 728, 90);
            openX_ad(120, '#IndexRightBottom', 300, 600);
            openX_ad(118, '#new-adsm-berry', 300, 250);
            openX_ad(116, '#Right3', 300, 250);
            openX_ad(115, '#ArticleAd', 300, 250);
            openX_ad(797, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(587, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(588, '#openx-ti-company', 300, 345);
            }
            break;
        case '931':
            openX_ad(130, '#TopLeaderboard', 728, 90);
            openX_ad(370, '#newTopAdRight', 260, 90);
            openX_ad(134, '#MiddleLeaderboard', 728, 90);
            openX_ad(129, '#BottomLeaderboard', 728, 90);
            openX_ad(135, '#IndexRightBottom', 300, 600);
            openX_ad(133, '#new-adsm-berry', 300, 250);
            openX_ad(132, '#Right3', 300, 250);
            openX_ad(131, '#ArticleAd', 300, 250);
            openX_ad(781, '#AdHtmlRight', 300, 125);
            break;
        case '934':
            openX_ad(137, '#TopLeaderboard', 728, 90);
            openX_ad(341, '#newTopAdRight', 260, 90);
            openX_ad(141, '#MiddleLeaderboard', 728, 90);
            openX_ad(136, '#BottomLeaderboard', 728, 90);
            openX_ad(142, '#IndexRightBottom', 300, 600);
            openX_ad(140, '#new-adsm-berry', 300, 250);
            openX_ad(139, '#Right3', 300, 250);
            openX_ad(138, '#ArticleAd', 300, 250);
            openX_ad(767, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(536, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(537, '#openx-ti-company', 300, 345);
            }
            break;
        case '947':
            openX_ad(144, '#TopLeaderboard', 728, 90);
            openX_ad(343, '#newTopAdRight', 260, 90);
            openX_ad(148, '#MiddleLeaderboard', 728, 90);
            openX_ad(143, '#BottomLeaderboard', 728, 90);
            openX_ad(149, '#IndexRightBottom', 300, 600);
            openX_ad(147, '#new-adsm-berry', 300, 250);
            openX_ad(146, '#Right3', 300, 250);
            openX_ad(145, '#ArticleAd', 300, 250);
            openX_ad(769, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(540, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(542, '#openx-ti-company', 300, 345);
            }
            break;
        case '986':
            openX_ad(151, '#TopLeaderboard', 728, 90);
            openX_ad(347, '#newTopAdRight', 260, 90);
            openX_ad(155, '#MiddleLeaderboard', 728, 90);
            openX_ad(150, '#BottomLeaderboard', 728, 90);
            openX_ad(156, '#IndexRightBottom', 300, 600);
            openX_ad(154, '#new-adsm-berry', 300, 250);
            openX_ad(153, '#Right3', 300, 250);
            openX_ad(152, '#ArticleAd', 300, 250);
            openX_ad(774, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(551, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(552, '#openx-ti-company', 300, 345);
            }
            break;
        case '840':
            openX_ad(158, '#TopLeaderboard', 728, 90);
            openX_ad(348, '#newTopAdRight', 260, 90);
            openX_ad(162, '#MiddleLeaderboard', 728, 90);
            openX_ad(157, '#BottomLeaderboard', 728, 90);
            openX_ad(163, '#IndexRightBottom', 300, 600);
            openX_ad(161, '#new-adsm-berry', 300, 250);
            openX_ad(160, '#Right3', 300, 250);
            openX_ad(159, '#ArticleAd', 300, 250);
            openX_ad(775, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(554, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(555, '#openx-ti-company', 300, 345);
            }
            break;
        case '987':
            openX_ad(165, '#TopLeaderboard', 728, 90);
            openX_ad(346, '#newTopAdRight', 260, 90);
            openX_ad(169, '#MiddleLeaderboard', 728, 90);
            openX_ad(164, '#BottomLeaderboard', 728, 90);
            openX_ad(170, '#IndexRightBottom', 300, 600);
            openX_ad(168, '#new-adsm-berry', 300, 250);
            openX_ad(167, '#Right3', 300, 250);
            openX_ad(166, '#ArticleAd', 300, 250);
            openX_ad(773, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(549, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(550, '#openx-ti-company', 300, 345);
            }
            break;
        case '45':
            openX_ad(172, '#TopLeaderboard', 728, 90);
            openX_ad(342, '#newTopAdRight', 260, 90);
            openX_ad(176, '#MiddleLeaderboard', 728, 90);
            openX_ad(171, '#BottomLeaderboard', 728, 90);
            openX_ad(177, '#IndexRightBottom', 300, 600);
            openX_ad(175, '#new-adsm-berry', 300, 250);
            openX_ad(174, '#Right3', 300, 250);
            openX_ad(173, '#ArticleAd', 300, 250);
            openX_ad(768, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(538, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(539, '#openx-ti-company', 300, 345);
            }
            break;
        case '988':
            openX_ad(186, '#TopLeaderboard', 728, 90);
            openX_ad(349, '#newTopAdRight', 260, 90);
            openX_ad(190, '#MiddleLeaderboard', 728, 90);
            openX_ad(185, '#BottomLeaderboard', 728, 90);
            openX_ad(191, '#IndexRightBottom', 300, 600);
            openX_ad(189, '#new-adsm-berry', 300, 250);
            openX_ad(188, '#Right3', 300, 250);
            openX_ad(187, '#ArticleAd', 300, 250);
            openX_ad(776, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(556, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(557, '#openx-ti-company', 300, 345);
            }
            break;
        case '138':
            openX_ad(193, '#TopLeaderboard', 728, 90);
            openX_ad(340, '#newTopAdRight', 260, 90);
            openX_ad(197, '#MiddleLeaderboard', 728, 90);
            openX_ad(192, '#BottomLeaderboard', 728, 90);
            openX_ad(198, '#IndexRightBottom', 300, 600);
            openX_ad(196, '#new-adsm-berry', 300, 250);
            openX_ad(195, '#Right3', 300, 250);
            openX_ad(194, '#ArticleAd', 300, 250);
            openX_ad(766, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(534, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(535, '#openx-ti-company', 300, 345);
            }
            break;
        case '834':
            openX_ad(207, '#TopLeaderboard', 728, 90);
            openX_ad(351, '#newTopAdRight', 260, 90);
            openX_ad(211, '#MiddleLeaderboard', 728, 90);
            openX_ad(206, '#BottomLeaderboard', 728, 90);
            openX_ad(212, '#IndexRightBottom', 300, 600);
            openX_ad(210, '#new-adsm-berry', 300, 250);
            openX_ad(209, '#Right3', 300, 250);
            openX_ad(208, '#ArticleAd', 300, 250);
            openX_ad(778, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(560, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(561, '#openx-ti-company', 300, 345);
            }
            break;
        case '201':
            openX_ad(130, '#TopLeaderboard', 728, 90);
            openX_ad(345, '#newTopAdRight', 260, 90);
            openX_ad(134, '#MiddleLeaderboard', 728, 90);
            openX_ad(129, '#BottomLeaderboard', 728, 90);
            openX_ad(135, '#IndexRightBottom', 300, 600);
            openX_ad(133, '#new-adsm-berry', 300, 250);
            openX_ad(132, '#Right3', 300, 250);
            openX_ad(131, '#ArticleAd', 300, 250);
            openX_ad(772, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(547, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(548, '#openx-ti-company', 300, 345);
            }
            break;
        case '875':
            openX_ad(126, '#TopLeaderboard', 728, 90);
            openX_ad(344, '#newTopAdRight', 260, 90);
            openX_ad(128, '#MiddleLeaderboard', 728, 90);
            openX_ad(127, '#BottomLeaderboard', 728, 90);
            openX_ad(125, '#IndexRightBottom', 300, 600);
            openX_ad(124, '#new-adsm-berry', 300, 250);
            openX_ad(123, '#Right3', 300, 250);
            openX_ad(122, '#ArticleAd', 300, 250);
            openX_ad(771, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(545, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(546, '#openx-ti-company', 300, 345);
            }
            break;
        case '898':
            openX_ad(200, '#TopLeaderboard', 728, 90);
            openX_ad(350, '#newTopAdRight', 260, 90);
            openX_ad(204, '#MiddleLeaderboard', 728, 90);
            openX_ad(199, '#BottomLeaderboard', 728, 90);
            openX_ad(205, '#IndexRightBottom', 300, 600);
            openX_ad(203, '#new-adsm-berry', 300, 250);
            openX_ad(202, '#Right3', 300, 250);
            openX_ad(201, '#ArticleAd', 300, 250);
            openX_ad(777, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(558, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(559, '#openx-ti-company', 300, 345);
            }
            break;
        case '996':
            openX_ad(65, '#TopLeaderboard', 728, 90);
            openX_ad(352, '#newTopAdRight', 260, 90);
            openX_ad(63, '#MiddleLeaderboard', 728, 90);
            openX_ad(61, '#BottomLeaderboard', 728, 90);
            openX_ad(64, '#IndexRightBottom', 300, 600);
            openX_ad(62, '#new-adsm-berry', 300, 250);
            openX_ad(60, '#Right3', 300, 250);
            openX_ad(59, '#ArticleAd', 300, 250);
            openX_ad(784, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(569, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(570, '#openx-ti-company', 300, 345);
            }
            break;
        case '1062':
            openX_ad(608, '#MiddleLeaderboard', 728, 90);
            openX_ad(616, '#BottomLeaderboard', 728, 90);
            openX_ad(610, '#IndexRightBottom', 300, 600);
            openX_ad(606, '#new-adsm-berry', 300, 250);
            openX_ad(613, '#Right3', 300, 250);
            openX_ad(614, '#ArticleAd', 300, 250);
            openX_ad(779, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(563, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(564, '#openx-ti-company', 300, 345);
            }
            break;
        case '1055':
            openX_ad(620, '#MiddleLeaderboard', 728, 90);
            openX_ad(621, '#BottomLeaderboard', 728, 90);
            openX_ad(623, '#IndexRightBottom', 300, 600);
            openX_ad(617, '#new-adsm-berry', 300, 250);
            openX_ad(618, '#Right3', 300, 250);
            openX_ad(619, '#ArticleAd', 300, 250);
            openX_ad(780, '#AdHtmlRight', 300, 125);
            if (!isArticlePage) {
                openX_ad(565, '#openx-ti-company', 300, 345);
            } else {
                openX_ad(566, '#openx-ti-company', 300, 345);
            }
            break;
        case '165':
            //ZhanHui
            openX_ad(267, '#TopLeaderboard', 728, 90);
            openX_ad(370, '#newTopAdRight', 260, 90);
            openX_ad(246, '#MiddleLeaderboard', 728, 90);
            openX_ad(247, '#ad_490_80_1', 490, 80);
            openX_ad(248, '#ad_490_80_2', 490, 80);
            openX_ad(249, '#ad_490_80_3', 490, 80);
            openX_ad(250, '#ad_490_80_4', 490, 80);
            openX_ad(251, '#ad_240_80_1_1', 240, 80);
            openX_ad(252, '#ad_240_80_1_2', 240, 80);
            openX_ad(253, '#ad_240_80_1_3', 240, 80);
            openX_ad(254, '#ad_240_80_1_4', 240, 80);
            openX_ad(255, '#ad_240_80_1_5', 240, 80);
            openX_ad(256, '#ad_240_80_1_6', 240, 80);
            openX_ad(257, '#ad_240_80_1_7', 240, 80);
            openX_ad(258, '#ad_240_80_1_8', 240, 80);
            openX_ad(259, '#ad_240_80_2_1', 240, 80);
            openX_ad(260, '#ad_240_80_2_2', 240, 80);
            openX_ad(261, '#ad_240_80_2_3', 240, 80);
            openX_ad(262, '#ad_240_80_2_4', 240, 80);
            openX_ad(263, '#ad_240_80_2_5', 240, 80);
            openX_ad(264, '#ad_240_80_2_6', 240, 80);
            openX_ad(265, '#ad_240_80_2_7', 240, 80);
            openX_ad(266, '#ad_240_80_2_8', 240, 80);
            openX_ad(781, '#AdHtmlRight', 300, 125);
            break;
        case 'taglist':
            openX_ad(226, '#TopLeaderboard', 728, 90);
            openX_ad(370, '#newTopAdRight', 260, 90);
            openX_ad(217, '#MiddleLeaderboard', 728, 90);
            openX_ad(218, '#IndexRightBottom', 300, 600);
            openX_ad(216, '#new-adsm-berry', 300, 250);
            openX_ad(215, '#Right3', 300, 250);
            openX_ad(213, '#BottomLeaderboard', 728, 90);
            openX_ad(781, '#AdHtmlRight', 300, 125);
            break;
        case 'homepage':
            openX_ad(226, '#TopLeaderLeft', 728, 90);
            openX_ad(273, '#TopLeaderRight', 260, 90);
            openX_ad(243, '#J_300_90', 300, 90);
            openX_ad(1, '#MiddleLeaderboard', 728, 90);
            openX_ad(2, '#BottomLeaderboard', 728, 90);
            openX_ad(3, '#new-adsm-berry', 300, 250);
            openX_ad(4, '#Right3', 300, 250);
            openX_ad(5, '#LeftAd', 300, 250);
            openX_ad(6, '#IndexRightBottom', 300, 600);
            openX_ad(268, '#index_ad_240_90_1', 240, 90);
            openX_ad(269, '#index_ad_240_90_2', 240, 90);
            openX_ad(270, '#index_ad_240_90_3', 240, 90);
            openX_ad(271, '#index_ad_240_90_4', 240, 90);
            openX_ad(781, '#AdHtmlRight', 300, 125);
            break;
        case '0':
            openX_ad(226, '#TopLeaderboard', 728, 90);
            openX_ad(370, '#newTopAdRight', 260, 90);
            openX_ad(243, '#J_300_90', 300, 90);
            openX_ad(1, '#MiddleLeaderboard', 728, 90);
            openX_ad(2, '#BottomLeaderboard', 728, 90);
            openX_ad(3, '#new-adsm-berry', 300, 250);
            openX_ad(4, '#Right3', 300, 250);
            openX_ad(5, '#LeftAd', 300, 250);
            openX_ad(6, '#IndexRightBottom', 300, 600);
            openX_ad(781, '#AdHtmlRight', 300, 125);
            break;
        // 新科技 栏目
        case '1067':
        case '1063':
        case '1068':
        case '1069':
        case '1070':
        case '1071':
        case '1072':
            // openX_ad(214, '#TopLeaderboard', 728, 90);
            openX_ad(370, '#newTopAdRight', 260, 90);
            // openX_ad(217, '#MiddleLeaderboard', 728, 90);
            baidu_ad('u2873653', '#MiddleLeaderboard', 728, 90);
            // openX_ad(213, '#BottomLeaderboard', 728, 90);
            openX_ad(218, '#IndexRightBottom', 300, 600);
            // openX_ad(216, '#new-adsm-berry', 300, 250);
            baidu_ad('u2873657', '#new-adsm-berry', 300, 250);
            openX_ad(215, '#Right3', 300, 250);
            // openX_ad(13, '#ArticleAd', 300, 250);
            baidu_ad('u2873657', '#ArticleAd', 300, 250);
            openX_ad(781, '#AdHtmlRight', 300, 125);
            break;
        default:
            console.log('ok');
            openX_ad(214, '#TopLeaderboard', 728, 90);
            openX_ad(370, '#newTopAdRight', 260, 90);
            openX_ad(217, '#MiddleLeaderboard', 728, 90);
            openX_ad(213, '#BottomLeaderboard', 728, 90);
            openX_ad(218, '#IndexRightBottom', 300, 600);
            openX_ad(216, '#new-adsm-berry', 300, 250);
            openX_ad(215, '#Right3', 300, 250);
            openX_ad(13, '#ArticleAd', 300, 250);
            openX_ad(781, '#AdHtmlRight', 300, 125);
            break;
    }


    var getAsideAds=$("#IndexRightBottom");
    var getContent=$(".amain");
    var getAdsOffTop=getAsideAds.offset();
    var getContentOffTop=getContent.offset();
    if (getAdsOffTop && getContentOffTop) {
            getAdsOffTop = getAdsOffTop.top;
            getContentOffTop = getContentOffTop.top;
            $(window).scroll(function() {
                var winTop = $(window).scrollTop();
                var getContentHeight = getContent.height();
                /*如果右栏高度过长就不固定广告*/
                if ($(".aside").height() > getContentHeight) {
                    return false;
                }
                var getAdsHeight = getAsideAds.height();
                var getScrollTop = $(window).scrollTop();

                if (getScrollTop > getAdsOffTop) {
                    getAsideAds.addClass("art-aside-fixed");
                }else {
                    getAsideAds.removeClass("art-aside-fixed");
                }

                var getLessHeight = getContentOffTop + getContentHeight - getScrollTop;//获得剩余滚动高度

            if (getLessHeight < getAdsHeight) {
                getAsideAds.css("margin-top", getLessHeight - getAdsHeight + "px");
            }else{
                getAsideAds.removeAttr("style");
            }
        });
    }
})//End document.ready
$(function () {
    var PcbText = ' <div class="ad-pcb fix-pcb">' +
        ' 	<div class="Quotemain">' +
        ' 	<div class="pcb-sign clearfix">' +
        ' 	<div class="lf pcb-logo">' +
        ' 	<img src="/skin-2012/images/pcb/pcb_btm_bg.png">' +
        ' 	</div>' +
        ' 	<div class="lf pcb-arrow">' +
        ' 	<img src="/skin-2012/images/pcb/pcb_btm_show.png">' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	<div class="clearfix fix-pcb-msg">' +
        ' 	<div class="lf fix-reimg">' +
        ' 	<img src="/skin-2012/images/pcb/fix_btm_msg.jpg">' +
        ' 	</div>' +
        ' 	<div class="lf fix-rePay">' +
        ' 	<h3>完善您的日常需求 <font>（更多了解更好服务）</font></h3>' +
        '		<dl>' +
        '		<dt>1. 您日常打板的采购频率为：</dt>' +
        '	<dd>' +
        '	<input type="radio" id="fix-week2" name="pcbPurchase2" value="week">' +
        '		<label for="fix-week2"><1周</label>' +
        '	<input type="radio" id="fix-mouth2"  name="pcbPurchase2" value="mouth">' +
        '		<label for="fix-mouth2"><1个月</label>' +
        '		<input type="radio" id="fix-other2"  name="pcbPurchase2" value="year">' +
        '		<label for="fix-other2">其他</label>' +
        '		</dd>' +
        '		</dl>' +
        '		<dl>' +
        '		<dt>2. 您最喜欢的其他快捷联络：</dt>' +
        '	<dd>' +
        '	<input type="radio" id="fix-QQ2" name="pcbqq2" value="qq">' +
        '		<label for="fix-QQ2">QQ</label>' +
        '		<input type="radio" id="fix-link2" name="pcbqq2" value="other">' +
        '		<label for="fix-link2">其他</label>' +
        '		<div >' +
        '		<input type="text" value="" id="pcb-link2">' +
        '		</div>' +
        '		</dd>' +
        '		</dl>' +
        ' 	<a href="" id="fix-href" target="_blank">直接下单</a>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	<div class="homeQuote home-quote clearfix">' +
        ' 	<div class="Quote-one lf">' +
        ' 	<h3 class="quote-font2">PCB报价计算器：</h3>' +
        ' <div class="form-column">' +
        ' 	<div class="form-item size-item"><h4 class="label">板子大小：<font> *</font></h4>' +
        ' <div class=" two-input">' +
        ' 	<div class="textbox"><input type="text" placeholder="长" class="VmWidth">' +
        ' 	<div class="unit">cm</div>' +
        ' 	</div>' +
        ' 	<div class="icon">X</div>' +
        ' 	<div class="textbox"><input type="text" placeholder="宽" class="VmLength">' +
        ' 	<div class="unit"><span>cm</span></div>' +
        ' </div>' +
        ' </div>' +
        ' </div>' +
        ' <div class="form-item layer-item" style="vertical-align: top;"><h4 class="label">层数：<font> *</font></h4>' +
        ' <div>' +
        ' <div class="textbox choosebox wid112" >' +
        ' 	<div class="choose-btn"><span class="btn-text fix-blayer">2</span><span class="icon icon-caret-down"></span></div>' +
        ' <div class="choose-menu">' +
        ' 	<ul data-key="blayer2" class="blayerOption" >' +
        ' 	</ul>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	<div class="form-column" style="margin: 2px 0 4px 0;">' +
        ' 	<div class="form-item choose-textbox count-item"><h4 class="label">板子数量：<font> *</font></h4>' +
        ' <div >' +
        ' <div class="textbox choosebox wid201" >' +
        ' 	<div class="choose-btn"><span class="btn-text ">10</span><span class="icon icon-caret-down"></span></div>' +
        ' <div class="choose-menu wider" style="display: none;">' +
        ' 	<ul data-key="bcount" class="bcountOption">' +
        ' 	</ul>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	<div class="form-item height-item"><h4 class="label">厚度：<font> *</font></h4>' +
        ' <div >' +
        ' <div class="textbox choosebox wid112">' +
        ' 	<div class="choose-btn"><span class="btn-text fix-bheight">1.6</span><span class="icon icon-caret-down"></span></div>' +
        ' <div class="choose-menu" style="display: none;">' +
        ' 	<ul data-key="bheight" class="bheightOption">' +
        ' 	</ul>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	<div >' +
        ' 	<h4 class="pch-p-tit">手机号码<font> *</font></h4>' +
        ' <div class="pch-phone">' +
        ' 	<input  type="text" placeholder="输入手机号码，报告结果将发送到您手机">' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	</div>' +
        ' 	<div class="Quote-two lf">' +
        ' 	<img src="/skin-2012/images/pcb/pcb_btm_btn.jpg">' +
        ' 	<input type="button" id="pcb-Fbtn">' +
        ' 	</div>' +
        ' 	<div class="Quote-there lf">' +
        ' 	<div class="random-num clearfix">' +
        ' 	<div class="lf">你的打板预算约：</div><div class="lr"><span></span>元</div>' +
        ' </div>' +
        ' <div class="kind-free">' +
        ' 	工程费： <font>？</font>元' +
        ' </div>' +
        ' <div class="kind-free">' +
        ' 	板材费： <font>？</font>元' +
        ' </div>' +
        ' <div class="kind-free">' +
        ' 	菲林费： <font>？</font>元' +
        ' </div>' +
        ' </div>' +
        ' </div>' +
        ' </div>' +
        ' </div>';
    $("body").after(PcbText);
    (function ($) {
        //计价框
        $(function () {
            setQuoteDom();
            var dataVm = {
                blayer: 2,
                blayer2: 2,
                bcount: 10,
                bwidth: '',//X
                blength: '',//Y
                bheight: 1.6,
                url: ''
            }
            dataVm.url = 'http://www.hqpcb.com/quote?btnid=2&layer=' + dataVm.blayer + '&width=' + dataVm.bwidth + '&length=' + dataVm.blength + '&count=' + dataVm.bcount + '&height=' + dataVm.bheight + '&tid=32'
            function setVmurl() {
                dataVm.url = 'http://www.hqpcb.com/quote?btnid=2&layer=' + dataVm.blayer + '&width=' + dataVm.bwidth + '&length=' + dataVm.blength + '&count=' + dataVm.bcount + '&height=' + dataVm.bheight + '&tid=32';
            }

            $('.Quotebtn').click(function () {
                window.open(dataVm.url);
            });

            $(".VmWidth").change(function () {
                dataVm.bwidth = $(this).val();
                setVmurl();
            });
            $(".VmLength").change(function () {
                dataVm.blength = $(this).val();
                setVmurl();
            });

            function setQuoteDom() {
                var blayerDom = '';
                blayerDom += '';
                blayerDom += '<li data="1">1</li>';
                blayerDom += '<li data="2">2</li>';
                blayerDom += '<li data="4">4</li>';
                blayerDom += '<li data="6">6</li>';
                blayerDom += '<li data="8">8</li>';
                blayerDom += '<li data="10">10</li>';
                blayerDom += '<li data="12">12</li>';
                blayerDom += '<li data="14">14</li>';
                blayerDom += '<li data="16">16</li>';
                $(".blayerOption").html(blayerDom);

                var bheightDom = '';
                bheightDom += '<li data="0.4">0.4</li>';
                bheightDom += '<li data="0.6">0.6</li>';
                bheightDom += '<li data="0.8">0.8</li>';
                bheightDom += '<li data="1.0">1.0</li>';
                bheightDom += '<li data="1.2">1.2</li>';
                bheightDom += '<li data="1.6">1.6</li>';
                bheightDom += '<li data="2.0">2.0</li>';
                bheightDom += '<li data="2.5">2.5</li>';
                bheightDom += '<li data="3.0">3.0</li>';
                $(".bheightOption").html(bheightDom);

                var countDom = '';
                countDom += '<li data="5">5</li>';
                countDom += '<li data="10">10</li>';
                countDom += '<li data="15">15</li>';
                countDom += '<li data="20">20</li>';
                countDom += '<li data="25">25</li>';
                countDom += '<li data="30">30</li>';
                countDom += '<li data="40">40</li>';
                countDom += '<li data="50">50</li>';
                countDom += '<li data="60">60</li>';
                countDom += '<li data="80">80</li>';
                countDom += '<li data="100">100</li>';
                countDom += '<li data="120">120</li>';
                countDom += '<li data="150">150</li>';
                countDom += '<li data="200">200</li>';
                countDom += '<li data="250">250</li>';
                countDom += '<li data="300">300</li>';
                countDom += '<li data="350">350</li>';
                countDom += '<li data="400">400</li>';
                countDom += '<li data="450">450</li>';
                countDom += '<li data="500">500</li>';
                countDom += '<li data="600">600</li>';
                countDom += '<li data="700">700</li>';
                countDom += '<li data="800">800</li>';
                countDom += '<li data="900">900</li>';
                countDom += '<li data="1000">1000</li>';
                countDom += '<li data="1500">1500</li>';
                countDom += '<li data="2000">2000</li>';
                countDom += '<li data="2500">2500</li>';
                countDom += '<li data="3000">3000</li>';
                countDom += '<li data="3500">3500</li>';
                countDom += '<li data="4000">4000</li>';
                countDom += '<li data="4500">4500</li>';
                countDom += '<li data="5000">5000</li>';
                countDom += '<li data="5500">5500</li>';
                countDom += '<li data="6000">6000</li>';
                countDom += '<li data="6500">6500</li>';
                countDom += '<li data="7000">7000</li>';
                countDom += '<li data="7500">7500</li>';
                countDom += '<li data="8000">8000</li>';
                countDom += '<li data="8500">8500</li>';
                countDom += '<li data="9000">9000</li>';
                $(".bcountOption").html(countDom);

            }

            function countBheight(index) {
                var min_height = 0.4,
                    max_height = 3.0,
                    def_height = 1.6;
                var layer = index == 0 ? parseInt(dataVm.blayer) : parseInt(dataVm.blayer2);
                switch (layer) {
                    case 1:
                        min_height = 0.6;
                        max_height = 2.0;
                        break;
                    case 2:
                        min_height = 0.4;
                        max_height = 2.5;
                        break;
                    case 4:
                        min_height = 0.6;
                        max_height = 2.5;
                        break;
                    case 6:
                        min_height = 0.8;
                        max_height = 3.0;
                        break;
                    case 8:
                        min_height = 1.0;
                        max_height = 3.0;
                        break;
                    case 10:
                        min_height = 1.2;
                        max_height = 3.0;
                        break;
                    case 12:
                    case 14:
                        min_height = 1.6;
                        max_height = 3.0;
                        break;
                    case 16:
                        min_height = 2.0;
                        max_height = 3.0;
                        def_height = 2.0;
                        break;
                }
                setBheight(min_height, max_height, def_height, index);
            }

            //板子层数与厚度的逻辑 -------------------------------------
            function setBheight(min_height, max_height, def_height, index) {
                var option = $(".bheightOption").eq(index).find("li");
                option.show();
                option.each(function (index, element) {
                    var _this = $(this);
                    var bheight = _this.attr("data");
                    if (bheight < min_height) {
                        _this.hide();
                    }
                    if (bheight > max_height) {
                        _this.hide();
                    }

                })
                //设置默认值
                dataVm.bheight = def_height;
                $(".bheightOption").parent().parent().find('.btn-text').html(dataVm.bheight);
            }

            $(".Quotemain .icon").css('vertical-align', 'top');
            $(".Quotemain").parents('.a_pr').css('overflow', 'visible');
            $(".Quotemain").find(".choose-btn").on('click', function () {
                var _this = $(this);
                var $thisChooseMenu = _this.siblings(".choose-menu");
                var $thisParent = _this.parent();
                $(".choose-menu").not($thisChooseMenu).hide();

                // 获取choosebox的宽度：width+左右边距
                var width = $thisParent.width() + parseInt($thisParent.css("paddingLeft")) + parseInt($thisParent.css("paddingRight"));
                //设置choose-menu宽度
                if ($thisChooseMenu.is(".wider")) {
                    width = width * 1.35;
                    if (width < 230) {
                        width = 230;
                    }
                }
                if ($thisChooseMenu.is(".wider-large")) {
                    width = width * 2;
                    if (width < 360) {
                        width = 360;
                    }
                }
                //飞针测试针对性处理
                $thisChooseMenu.width(width);
                $thisChooseMenu.toggle();

            })// End pcbForm
            $(".Quotemain").find(".choose-menu").find("li").on('click', function () {
                $(".choose-menu").hide();
            })
            //点击下拉菜单以外区域，关闭下单菜单
            $(document).on('click', function () {
                $(".choose-menu").hide();
            }).on('click', '.choosebox', function (event) {
                event.stopPropagation();
            })
            //计价框
            $(".homeQuote").find("ul[data-key]").on('click', 'li', function () {
                var _this = $(this);
                var $thisChooseBox = _this.parent().parent().parent(),
                    $btn = $thisChooseBox.find(".btn-text"),
                    html = _this.html(),
                    key = _this.parent().data("key"),
                    type = _this.parent().data("type"),
                    value = _this.attr("data");
                //数据绑定 -------
                if (type == 'number') {
                    value = Number(value);
                }
                dataVm[key] = value;
                //隐藏choose-menu
                $(".choose-menu").hide();

                //板子层数与板子厚度
                if (key == "blayer") {
                    countBheight(0);

                }
                if (key == "blayer2") {
                    countBheight(1);
                }
                $btn.html(value)
                setVmurl();
            })//End click 事件
        })
    })(jQuery)
    /*
     * 定义PCB返回URL和请求URL
     * */

    /*
     *获取随机数值
     * */
    function GetRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    setInterval(function () {
        var num = GetRandomNum(0, 5);
        $(".random-num span").html(fixRamdon[num]);
    }, 200);

    var fixRamdon = [50, 59, 85, 130, 260, 1088];

    var fixPcbTop = -90, fixDown = 1;
    /*弹出计价栏*/
    $(".pcb-sign").click(function () {
        if (fixDown == 1) {
            fixDown = 0;
            $(".pcb-arrow img").attr('src', '/skin-2012/images/pcb/pcb_btm_hide.png');
            $(".fix-pcb").css({'top': 'auto', 'bottom': '0px', 'margin-top': '0px'});
        } else {
            $(".pcb-arrow img").attr('src', '/skin-2012/images/pcb/pcb_btm_show.png');
            fixDown = 1;
            $(".fix-pcb").css({'top': '100%', 'bottom': 'auto', 'margin-top': fixPcbTop + 'px'});

        }
    });
    var getPcbLink2, GETPCBURL = 'http://www.hqpcb.com/promote/valuation?show=new';

    $("#pcb-Fbtn").click(function () {
        $(this).attr('disabled', 'disabled');
        var _this = $(this);
        $.ajax({
            url: GETPCBURL,
            data: {
                bwidth: $(".fix-pcb .VmWidth").val(),
                blength: $(".fix-pcb .VmLength").val(),
                bcount: $(".wid201 .btn-text").html(),
                bheight: $(".fix-bheight").html(),
                blayer: $(".fix-blayer").html(),
                mobile: $(".pch-phone input").val()
            },
            dataType: 'jsonp',
            success: function (data) {
                _this.removeAttr('disabled');
                if (data.code == 2000) {
                    /*$(".fix-pcb .homeQuote").hide();
                     $(".fix-pcb .fix-pcb-msg").show();
                     $("#fix-href").attr('href',data.data.online);
                     getPcbLink2 = data.data.online+'tid=25';*/
                    window.location.href = data.data.online + 'tid=25';
                } else {
                    alert(data.msg);
                }
            }
        })
    });

    $("[name=pcbqq2],[name=pcbPurchase2],#pcb-link2").change(function () {
        if ($(this).attr('name') == 'pcbqq2') {
            $("#pcb-link2").show();
        }
        setPcblink2();
    });
    /*重新定义PCB计价的URL*/
    function setPcblink2() {
        var setContentVal = '', setPurchaseval = '', setLinkVal = '';
        if ($("[name=pcbqq2]").val() != '' && $("[name=pcbqq2]").is(':checked')) {
            setContentVal = "&contact=" + $("[name=pcbqq2]:checked").val()
        }
        if ($("[name=pcbPurchase2]").val() != '' && $("[name=pcbPurchase2]").is(':checked')) {
            setPurchaseval = "&purchase=" + $("[name=pcbPurchase2]:checked").val()
        }
        if ($("#pcb-link2").val() != '') {
            setLinkVal = "&qq=" + $("#pcb-link2").val();
        }
        var setPckLink = getPcbLink2 + setContentVal + setPurchaseval + setLinkVal
        $("#fix-href").attr('href', setPckLink);
    }
    /*播放内容替换*/
	var loadHLS = false;
	$(".article-content embed").each(function (i) {
		var getHei = $(this).height();
		var getWid = $(this).width();
		var getSrc = $(this).attr('src');
		var getVideoType = getSrc.substring(getSrc.lastIndexOf(".") + 1, getSrc.length);
		if (getVideoType == "m3u8") {
			/*加载m3u8解析js */
			var setHost = 'http://www.elecfans.com/skin-2012/js/hls.js'; //设置域名
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = setHost;
			var body = document.getElementsByTagName("body").item(0);
			body.appendChild(script);


			$(this).parent().before('<video id="quickPlay' + i + '" height="' + getHei + '" width="' + getWid + '"  controls="controls" >your browser does not support the video tag</video>');
			/*文件加载后解析视频*/
			script.onload = script.onreadystatechange = function () {
				if (Hls.isSupported()) {
					var video = document.getElementById('quickPlay' + i);
					var hls = new Hls();
					hls.loadSource(getSrc);
					hls.attachMedia(video);
					hls.on(Hls.Events.MANIFEST_PARSED, function () {
						video.play();
					});
				}
			}
			$(this).parent().remove();
		} else if (getVideoType == "mp4") {
			$(this).parent().before('<video id="quickPlay' + i + '" height="' + getHei + '" width="' + getWid + '" autoplay="autoplay" src="' + getSrc + '" controls="controls" >your browser does not support the video tag</video>')
			/*视频自动播放添加背景图*/
			setTimeout(function () {
				$("#quickPlay" + i)[0].play()
				setTimeout(function () {
					$("#quickPlay" + i)[0].pause()
				}, 50)
			}, 2000);
			$(this).parent().remove();
		}
	});
});
