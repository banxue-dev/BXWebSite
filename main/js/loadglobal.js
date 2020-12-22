
var global_config={
	//backuprequesturl: 'http:\/\/localhost:8091/family/' //全局请求前缀
	backuprequesturl: 'http:\/\/www.banxue.fun:8091/family/' //全局请求前缀
	,reqver:'/v1.0/'
}
var pageParams={};
var groupType={
	case:0,
	news:1,
	service:3
}
var eleExist=function(ele){
	if($(ele).length<1){
		return false;
	}
	return true;
}
/*
	内容加载框----会覆盖容器原数据
*/
var cntloadding_={
	container:{
		width:'100%',
		height:'50',
		setCaontHeight:function(ca){
			//设置当容器高度为0时的默认高度
			if(cntloadding_.container.height<1){
				$(ca).height(100);
			}else{
				$(ca).height(cntloadding_.container.height);
			}
		}
	},
	show:function(container){

		cntloadding_.container.width=$(container).width()+'px';
		cntloadding_.container.height=$(container).height();
		cntloadding_.container.setCaontHeight(container);
		if(eleExist('#wb_loader_show')){
			$('#wb_loader_show').show();
		}else{
			$(container||'body').append('<div id="wb_loader_show"  class="loader-container"><div class="loader four"></div></div>');
			//$(container||'body').append('<div id="wb_loader_show" style="width:'+cntloadding_.container.width+';'+cntloadding_.container.getHeight()+';" class="loader-container"><div class="loader four"></div></div>');
		}
	}
	,hide:function(){
		$('#wb_loader_show').hide();
			console.log('loadingHide');
	}
}
var admin={
	req:function(options){
		options.data = options.data || {};
		options.data=$.extend(options.data,{orgCode:'2323020606142230135144314536332747182433141833503111181661242752'});
		options.loadele && cntloadding_.show(options.loadele);
		$.ajax({
			url:global_config.backuprequesturl+options.name+global_config.reqver+'api/'+options.interface,
			type:'post',
			data:options.data,
			dataType:'json',
			success:function(res){
				if(options.done){
					if(res.code='000000'){
						options.done(res.data);
					}
				}else if (options.success){
					options.success(res);
				}
				options.loadele &&cntloadding_.hide();
			},error:function(r){
				options.loadele &&cntloadding_.hide();
				console.log('请求失败');
			}
		});
	}
}
function tobar(ind,url,ele){
	$('.first-level').parent().removeClass('current');
	$('.first-level:eq('+ind+')').parent().addClass('current');
	var pid=$(ele).attr('data-id');
	if(pid){
		pageParams.id=pid;
	}else{
		pageParams={};
	}
	loadhtml_('#main_',url);
}
function loadhtml_(ele,uri){
	$.ajax({
		url:uri,
		success:function(res){
			$(ele).html(res);
		},error:function(r){
			console.log(r);
		}
	});
}

var loadContactInfo=function(){
	
	admin.req({
		name:'contactInfo',
		interface:'getContactInfoSingle',
		done:function(data){
			global_config.contactInfo=data;
			//浏览器标题显示用的
			$('#top_title').html(data.webTitle);
			loadGroupInfo();
			loadhtml_('#fh5co-header','/main/header.html');
			loadhtml_('#global_bottom','/main/bottom.html');
		}
	});
}
var loadGroupInfo=function(){
	//加载分组配置
	admin.req({
		name:'groupConfig',
		interface:'getGroupConfigList',
		done:function(data){
			global_config.groupConfig=data;
			//浏览器标题显示用的
			loadAboutOurInfo();
		}
	});
}
var loadAboutOurInfo=function(){
	//加载关于我们
	admin.req({
		name:'aboutOurInfo',
		interface:'getAboutOurInfoList',
		done:function(data){
			global_config.aboutOurInfo=data[0];
			loadhtml_('#main_','/main/main.html');
		}
	});
}
var loadRandomeCase=function(container,count){
	admin.req({
			name:'caseInfo',
			interface:'getRandomCaseInfoList',
			data:{count:count},
			done:function(data){
				var html='';
				for(var i=0;i<data.length;i++){
					html+='<div class="xm3 xs3 xl6 margin-big-bottom text-center"><a data-id="'+data[i].caseId+'" onclick="tobar(2,'+("'/main/page/case/case_detail.html'")+',this);"  href="javascript:void(0);" title="">';
			        html+='    <div class="media-img">';
			        html+='      <div class="zoomimgs" style="background-image:url('+data[i].caseImg+')"></div>';
			        html+='    </div>';
			        html+='    <h3>'+data[i].caseName+'</h3>';
			        html+='    </a></div>';
				}
			    $(container).html(html);
			}
		});	
}
var loadRandomeNews=function(container,count){
	admin.req({
			name:'newsInfo',
			interface:'getRandomNewsInfoList',
			data:{count:count},
			done:function(data){
				var html='';
				for(var i=0;i<data.length;i++){

			        html+='<div class="xm3 xs3 xl6 margin-large-bottom text-center">';
			        html+=' <div class="item"><a href="/main/a/news/hyxw/7.html" title="'+data[i].newsTitle+'">';
			        html+='    <div class="artzoomimgs" style="background-image:url('+data[i].newsImg+')"></div>';
			        html+='    <h3>'+data[i].newsTitle+'</h3>';
			        html+='   <p class="desc">'+data[i].newsBrief+'</p>';
			        html+='    </a></div></div>';
				}
			    $(container).html(html);
			}
		});	
}
//加载联系方式
loadContactInfo();