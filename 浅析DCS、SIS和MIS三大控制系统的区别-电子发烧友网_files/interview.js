/**
 * create time 2016年11月2日14:30:46
 * 高端访谈
 */


 var ELECFANS_HOST = window.location.host;
 var ELECFANS_DOMAIN_ARR = ELECFANS_HOST.split('.');
 var ELECFANS_DOMAIN_LEN = ELECFANS_DOMAIN_ARR.length;
 var ELECFANS_DOMAIN = ELECFANS_DOMAIN_ARR[(ELECFANS_DOMAIN_LEN-2)]+'.'+ELECFANS_DOMAIN_ARR[(ELECFANS_DOMAIN_LEN-1)];
 var ELECFANS_BBS = 'http://bbs.'+ELECFANS_DOMAIN;
 var ELECFANS_HOME = 'http://home.'+ELECFANS_DOMAIN;
 /*电子说头部的样式2018/04*/
 function in_array(needle, haystack, argStrict) {
    var key = '',
        strict = !!argStrict;
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }
    return false;
}
function EchoLoginInfo(data) {
    var info = $.parseJSON(data),
        top_loginHtm = '',
        interflow = '.interflow',
        infoUid = info.uid;

    sLoginUid = info.uid;
    // top_loginHtm += ' <div class="top-dropdown my-info clearfix">' + ' <div class="top-dropdown-toggle">' +
    //  '<a href="' + ELECFANS_HOME + '" class="u-info"><img src="' + info.avatar + '" width="20" height="20"><strong class="u-name">' + info.username + '</strong></a>'
    //  + '<span class="drop-icon"></span>' + '</div>' + '<ul class="top-dropdown-menu yahei">'
    //  + '<li><a href="' + ELECFANS_HOME + '">我的中心</a></li>'
    //  + '<li><a href="' + ELECFANS_BBS + '/user/' + sLoginUid + '/">我的主页</a></li>'
    //  + '<li id="topMyColumn"><a href="/d/mp/apply">申请专栏</a></li>'
    //  + '<li><a href="' + ELECFANS_BBS + '/user/' + sLoginUid + '/articles/' + '">我的文章</a></li>'
    //  + '<li><a href="/member/mydata/">我的资料</a></li>'
    //  + '<li><a href="' + ELECFANS_BBS + '/home.php?mod=spacecp">账号设置</a></li>'
    //  + ' <li><a  target="_self" href="' + ELECFANS_BBS + '/member.php?mod=logging&action=logout&refer=front">退出</a></li>'
    //  + '</ul></div><div class="notice"><a class="grey9"  href="' + ELECFANS_BBS + '/home.php?mod=space&do=pm" class="notice-num">' + info.msgnum + '</a></div>';
    top_loginHtm += '<a id="searchToggle" class="pd8"><img style="width: 16px;" src="/d/public/images/u222.png" /> </a>' +
        '<a  class="pd8 write_btn "><img style="width: 16px;" src="/d/public/images/u225.png" title="写文章" /> 写文章</a> <div class="top-dropdown my-info clearfix">' + ' <div class="top-dropdown-toggle">'
        + '<a href="' + ELECFANS_HOME + '" class="u-info"><img src="' + info.avatar + '" width="20" height="20"><strong class="u-name">' + info.username + '</strong></a>'
        + '<span class="drop-icon"></span>' + '</div>' + '<ul class="top-dropdown-menu yahei">'
        + '<li><a href="' + ELECFANS_BBS + '/infocenter.php' + '">我的中心</a></li>'
        + '<li><a href="' + ELECFANS_BBS + '/user/' + sLoginUid + '/">我的主页</a></li>'
        + '<li id="topMyColumn"><a href="/d/mp/apply">申请专栏</a></li>'
        + '<li><a href="' + ELECFANS_BBS + '/user/' + sLoginUid + '/articles/' + '">我的文章</a></li>'
        + '<li><a href="/member/mydata/">我的资料</a></li>'
        + '<li><a href="' + ELECFANS_BBS + '/home.php?mod=spacecp">账号设置</a></li>' +
        ' <li><a  target="_self" href="' + ELECFANS_BBS + '/member.php?mod=logging&action=logout&refer=front">退出</a></li></ul>' + ' </div>' + ' <a class="notice" href="' + ELECFANS_BBS + '/home.php?mod=space&do=pm" ><span ">' + info.msgnum + ' </span></a>';
    $.ajax({
        url: '/d/mp/checkStatus',
        type: 'post',
        success: function (res) {
            /*已登录 移除登录行为*/
            $(".send-write").removeClass('need-login');
            if (res.status == 2) {
                $("#topMyColumn a").attr('href', '/d/mp/message/status/2.html')
                $(".linkApply,.column-apply").attr('href', '/d/mp/message/status/2.html')
            } else if (res.status == 1) {
                $("#topMyColumn").html('<a href="/d/user/' + sLoginUid + '">我的专栏</a>')
                $(".HomeTop-requestBtn").remove();
            }
            /*如果没申请专栏显示入口*/
            $(".column-apply").unbind('click');
            if (res.status == 1) {
                $(".column-apply").hide();
            }
        }
    });
    sLoginUsername = info.username;
    aUnionLogin = info['unionlogin'];
    flagBindingQQ = false;
    flagBindingWeibo = false;
    userinfo = info;
    if (in_array(1, aUnionLogin)) flagBindingQQ = true;
    if (in_array(2, aUnionLogin)) flagBindingWeibo = true;

    //顶部登录后信息
    $("#login-info").html(top_loginHtm).show();
    $("#bdcs").css('right', $("#login-info").width() + 'px');
    $("#searchToggle").click(function (e) {
        e.stopPropagation();
        $("#bdcs").toggle();
    });
    $("#bdcs").click(function (e) {
        e.stopPropagation();
    });
    //判断用户是否为VIP用户
    //if(info.vip==0){
    //  var vipStr = '<div class="fr"><a class="vip-icon" href="http://vip.elecfans.com/" target="_blank" title="每天只需1块钱，玩转电子界人脉圈！" alt="每天只需1块钱，玩转电子界人脉圈！"></a></div>';
    //  $(vipStr).insertBefore('.my-info');
    //}else if(info.vip==1){
    //  var vStr = '<span class="v-icon" alt="VIP会员" title="VIP会员"></span>';
    //  $(vStr).insertBefore('.drop-icon');
    //}

    //顶部下拉菜单
    $(".top-dropdown").mouseDelay().hover(function() {
        $(".top-dropdown-menu").css("top", "23px");
    }, function() {
        $(".top-dropdown-menu").css("top", "-9999px");
    });
    //评论处登录信息
    if (typeof(article_detail_avatar)=="function" && $("#comment").length > 0) {
        var avatarUrl = article_detail_avatar(sLoginUid, 'middle');
        $('#comment-c-avatar').attr('src', avatarUrl);
        $('#comment-c-username').text(sLoginUsername);

        if (flagBindingWeibo) $('#share-weibo').prop('checked', true);
        if (flagBindingQQ) $('#share-qq').prop('checked', true);
    }
    $.unblockUI();
}



$(function(){
	var FW = {
		init : function(){

			// 文章ID
			this.webID = $('#webID').val();

			// 获取登录状态
			$.get(ElecfansApi_checklogin, {act:'article'},function(d){
				var m = $.parseJSON(d);
				FW.LoginStatus = m.uid === undefined ? false : true;
				FW.username = m.username;
				FW.uid = m.uid;

				// 页面头部登录状态
				if ( FW.LoginStatus ) {
					EchoLoginInfo(d);
				} else {
					$('#login-info').show();
				}

				// 获取第一页评论
				FW.getComment(1);

			});

			// 获取作家信息
			var $inter = $('.J_rss-inter');
			this.mid = $inter.data('mid');
			$.get('/webapi/arcinfo/attention?' + 'mid=' + FW.mid,function(m){
				if( m.error_code == 0 ){
					// 关注状态
					if ( m.data.attentioned == 0 ) {
						// 未关注
						$inter.text('关注');
					} else {
						// 已关注
						$inter.text('已关注').addClass('rssed');
					}
					$inter.css('visibility','visible');

					// 文章数
					$('.J_arcCount').text(m.data.arcCount)
					// 粉丝数
					$('.J_fansCount').text(FW.fansCount = m.data.fansCount)
				} else {
					alert(m.msg);
				}
			},'json')

			// 相关内容切换
			$('.art-about-art .hb li').mouseover(function(){
				var flag = $(this).index();
				$(this).addClass('on').siblings().removeClass('on')
				$('.art-about-art .bb').children().eq(flag).show().siblings().hide();
			})

			// 正文图片放大
			$.getScript('http://skin.elecfans.com/js/plugins/jquery.lightbox.min-0.5.js', function() {
				$('head').append('<link rel="stylesheet" href="http://skin.elecfans.com/js/plugins/jquery.lightbox-0.5.css"></link>')
		        $('.art-main-cont img').each(function(){

		            var $t = $(this);
					if (!$t.hasClass('need-login')) {
						// 过滤掉有超链的图片
						if (!$t.parent().is('a')) {
							$t.wrap('<a href="' + $t.attr('src') + '" rel="lightbox-img"></a>');
						}
					}
		        })
				$('.art-main-cont [rel="lightbox-img"]').lightBox({});
			});

			// 获取点赞数
			$.ajax({
				url : '/webapi/arcinfo/praise' + '?aid=' + FW.webID,
				type : 'get',
				dataType : 'json',
				// 同步 后面的点赞事件要根据返回的结果判定是否绑定
				async : false,
				success : function(m){
					FW.praised = !+m.data.praised;
					FW.likenum = +m.data.count;
					var $t_btn = $('.J_top-like').show();
					if ( m.error_code == 0 ){
						var users = m.data.users,htm = '',len = FW.likenum;
						var $box = $('.art-like-u');

						// 最多显示31个头像
						len = len > 31 ? 31 : len;
						if ( len ) {

							for ( var i = 0; i < len; i++ ) {
								htm += '<li><a href="http://bbs.elecfans.com/user/' + users[i].uid + '/" target="_blank"><img src="' + users[i].avatar + '" alt="' + users[i].userid + '1"/></a></li>';
							}
							len > 18 && (htm += '<li>...等<span class="J_bottom-like">' + FW.likenum + '</span>人点赞</li>');
						}
						$box.html(htm);
						if ( len > 15 ) {
							$box.css('text-align','left');
						}
						if ( len > 0 ){
							$('.art-like-up').text(FW.likenum);
							$t_btn.html([$t_btn.children().addClass('art-likeed'),'&nbsp;'+len]);
						}
					} else {
						alert(m.msg);
					}
				}
			})

			// 获取文章的收藏
			$.ajax({
				url : '/webapi/arcinfo/arcinfo' + '?aid=' + FW.webID,
				type : 'get',
				dataType : 'json',
				async : false,
				success : function(m){
					$('.J_stownum').text(FW.stownum = m.stownum);
					// $('.J_clicknum').text(m.clicknum);
					$('.J_replynum').text(m.replynum);
					+m.replynum && $('.J_top-reply').html([$('.J_top-reply').children().addClass('art-replyed'),'&nbsp;'+m.replynum]);

					FW.stowd = m.stowd;
					// FW.subscribed = m.subscribed;

					var $collect = $('.J_bottom-coll');
					var $t_btn = $('.J_top-coll').show();
					// var $rss = $('.J_rss-jszk');
				
					// 收藏状态
					if ( m.stownum == 0 ) {
						// 未收藏
						$collect.text('收藏')//.removeClass('art-collected');
						//$('.J_top-coll').children().removeClass('art-colled');
					} else {
						// 已收藏
						$collect.text('已收藏').addClass('art-collected');
						// .children().addClass('art-colled');
						$t_btn.html([$t_btn.children().addClass('art-colled'),'&nbsp;'+m.stownum]);
					}
					$collect.css('visibility','visible');
				}
			})
			
			// 绑定事件动作
			FW.bindAct();
		},
		// 获取评论列表
		getComment : function(p){
			$.get('/webapi/arcinfo/apiGetCommentJson' + '?aid=' + FW.webID + '&page=' + p + '&order=new',function(d){
				var $box;
				var m = d.data;
				var $reply = $('.art-main-reply');
				var l = m.length;
				if(window.location.href.indexOf('/interview')<0){
					l = 0;
				}
				if ( l > 0 ) {
					for ( var i = 0; i < l; i++ ) {
						$box = FW.appendComment( $reply,false,m[i] ).find('.ext');
							for( var k in m[i].child ) {
								FW.appendComment( $box,true,m[i].child[k] );
							}
					}
					// 还有更多评论
					if ( l < d.count && p === 1 ) {
						$('<dd><a href="javascript:;" class="load-more-comment">加载更多评论</a></dd>').appendTo($reply)
						.children().click(function(){
							FW.getComment(this.page++);
						})[0].page = 2;
					}
				} else {
					// 没有数据直接删除更多评论按钮
					$reply.find('dd:last').remove();
				}

				if ( d.count > 0 ) {
					$reply.show();
				}
			},'json' );
		},
		/**
		 * [appendComment 添加评论到列表方法]
		 * @param  {jq对象}  $box        [要追加的容器]
		 * @param  {Boolean} hasPid      [是否有父评论]
		 * @param  {object}  data        [评论数据]
		 * @return {jq对象}              [追加的评论]
		 */
		appendComment : function($box,hasPid,data){
			var htm;
			htm = hasPid ? '<div class="mt20">' : '<dd>';
			htm += '<a href="' + data.homeurl + '" target="_blank"><img src="' + data.avatar + '"></a>' +
		            '<div class="ext">' +
		                '<p>' +
		                	'<a class="name" href="' + data.homeurl + '" target="_blank">' +
				( hasPid ? data.username + '</a>&nbsp;回复&nbsp;<a class="name" href="' + data.homeurl + '" target="_blank">' + data.pusername + '：</a>' : data.username + '</a>：' ) +
		                    data.msg +
		                '</p>' +
		                '<p class="mt10">' +
		                    '<span class="time">' + data.dtime + '</span>' +
			                    '<a href="javascript:;" class="J_art-reply-pop" data-pid="' + data.id + '" data-uname="' + data.username + '">' +
			                        '<i class="icon"></i>' +
			                        '回复' +
			                    '</a>' +
		                '</p>' +
		            '</div>';
			htm += hasPid ? '</div">' : '</dd>';
			// 存在child属性说明是获取评论的父评论
			if ( data.child !== undefined ) {
				// 如果存在加载更多按钮
				if ( $box.has('.load-more-comment').length ) {
					return $(htm).insertBefore($box.children(':last'));
				} else {
				// 不存在加载更多按钮
					return $(htm).appendTo($box);
				}
			} else {
				// 否则为发表评论或获取评论的子评论
				if ( hasPid ) {
					// 回复其他用户和子评论
					$box.append(htm);
				} else {
					// 回复文章
					if ( $box.children('dd').length ) {
						$box.children('dd:first').before(htm);
					} else {
						$box.append(htm).show();
					}
				}
			}
		},
		// 一些动作绑定
		bindAct : function(){
			var $collect = $('.J_coll-btn');
			var $rss = $('.J_rss-inter');

			// 点击赞
			$('.J_like-btn').click(function(){
				if ( FW.praised ) {
					$.post('/webapi/arcinfo/praise',{aid:FW.webID},function(m){
						var $t_btn = $('.J_top-like');
						var $i_box = $('.art-like-u'),liHtm;
						// 点赞成功
						if ( m.error_code == 0 ) {
							$('.J_bottom-like').text(++FW.likenum);
							$t_btn.html([$t_btn.children().addClass('art-likeed'),'&nbsp;'+FW.likenum]);
							FW.praised = true;
							liHtm = '<li><a href="http://bbs.elecfans.com/user/' + FW.uid + '/" target="_blank"><img src="' + m.data.avatar + '" alt="' + FW.username + '"/></a></li>';
							if ( $i_box.children().length ) {
								$i_box.prepend(liHtm);
							} else {
								$i_box.html(liHtm);
							}
						} else {
							if(m.error_code==1000){
								$("#btnLogin").click();//登录
							}
							else{
							alert(m.msg);
								
							}
							
						}
					},'json');
				} else {
					alert('您已经点过赞了');
				}
			})

			// 点击顶部回复按钮
			$('.J_top-reply').click(function(){
				var $e = $('.art-main-deliver');
				$('body').animate({scrollTop:$e.offset().top});
				$e.find('textarea').focus();
			})

			// 点击收藏
			$collect.click(function(){
				var lIn = function(){
					$.get('/webapi/arcinfo/joinstowjson?aid=' + FW.webID,function(m){
						var $t_btn = $('.J_top-coll');
						var $b_btn = $('.J_bottom-coll');
						if ( m.error_code == 0 ) {
							var $e = $('.J_stownum');
							if ( m.data.type == 0 ) {
								$e.text( --FW.stownum );
								$b_btn.text('收藏').removeClass('art-collected');
								$t_btn.html([$t_btn.children().removeClass('art-colled'), FW.stownum ? '&nbsp;'+FW.stownum : '收藏']);
							} else {
								$e.text( ++FW.stownum );
								$b_btn.text('已收藏').addClass('art-collected');
								$t_btn.html([$t_btn.children().addClass('art-colled'),'&nbsp;'+FW.stownum]);
							}
						} else {
							alert(m.msg);
						}
					},'json');
				}
				FW.runFn.call(this,lIn);
			});

			// 点击关注
			$rss.click(function(){
				var lIn = function(){
					$.post('/webapi/arcinfo/attention',{mid:FW.mid},function(m){
						if ( m.error_code == 0 ) {
							if ( m.data.type == 0 ) {
								$rss.text('关注').removeClass('rssed');
								$('.J_fansCount').text(--FW.fansCount)
							} else {
								$rss.text('已关注').addClass('rssed');
								$('.J_fansCount').text(++FW.fansCount)
							}
						} else {
							alert(m.msg);
						}
					},'json');
				}
				FW.runFn.call(this,lIn);
			});

			// 发布评论&回复其他用户
			$('body').on('click', '.J_art-reply', function(event) {
				event.preventDefault();
				var lIn = function(){
					var $t = $(this);
					var pid = $t.data('pid');
					var $textarea = $t.siblings('textarea')
					var hasPid = pid !== undefined;
					var data = {
						aid : FW.webID,
						content : $.trim($textarea.val())
					}
					// 如果存在父id就是回复其他用户
					if ( hasPid ) {
						data.tid = pid;
					}
					$.ajax({
						url : '/webapi/arccomment/apiPubComment',
						type : 'post',
						dataType : 'json',
						data : data,
						beforeSend : function(){
							// 如果没有内容
							if ( !data.content ){
								$t.siblings('textarea').addClass('reply-empty-err').focus();
								return false;
							}
						},
						success : function(m){
							var $box = hasPid ? $t.closest('dd').children('.ext') : $('.art-main-reply');
							// 评论成功
							if ( m.error_code == 0 ) {
								// 加上父评论的用户名
								m.data.pusername = $t.siblings('.place').children('.name').text().replace('：','');
								// 追加评论到列表
								FW.appendComment($box,hasPid,m.data);
								// 移除错误提示、清空输入
								$textarea.removeClass('reply-empty-err').val('');
								// 移除发表框
								_closeReplyPop($t.closest('.art-main-reply-pop'));
								// 评论数增加
								var replynum = +$('.J_replynum').text() + 1;
								$('.J_replynum').text(replynum);
								$('.J_top-reply').html([$('.J_top-reply').children().addClass('art-replyed'),replynum]);
							} else {
								alert(m.msg);
							}
						}
					})
				}
				FW.runFn.call(this,lIn);
			});

			// 讨论列表中弹出回复其他用户
			$('body').on('click', '.J_art-reply-pop', function(event) {
				event.preventDefault();
				T = this;
				if ( T.pop ) {
					_closeReplyPop(T.pop);
				} else {
					var $box = $(T).parent();
					var htm = '<div class="art-main-reply-pop">' +
			                        '<span class="place">回复&nbsp;' +
			                            '<span class="name">' + $(T).attr('data-uname') + '：</span>' +
			                        '</span>' +
			                        '<textarea name="" rows="4"></textarea>' +
			                        '<button class="btn fr J_art-reply" data-pid=' + $(T).data('pid') + '>发表</button>' +
			                    '</div>';
			        var $pop = $(htm).appendTo($box).slideDown();
			        $pop.find('textarea').css({
			        	textIndent : $pop.find('.place').width() + 10,
			        	width : $box.width() - 20 - 2
			        });
			        T.pop = $pop;
		        }
			});
			// 移除发表框
			function _closeReplyPop($t){
				$t.slideUp('slow',function(){
					T.pop.remove();
					T.pop = false;
				});
			}

			// 清除文章内容图片宽高
			!function(){
				var $img = $('.art-main-cont img');
				$img.each(function(){
					$(this).css({
						width : 'auto',
						height : 'auto'
					});
				})
			}()
		},
		// 需要验证登录状态的函数用此函数调用
		runFn : function(lIn){
			if ( FW.LoginStatus ) {
				lIn.call(this);
			} else {
				$.ssoDialogLogin();
			}
		}
	}

	FW.init();

})