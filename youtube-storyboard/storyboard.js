/**

TODO:
Beautify the code, more options like loop,preload,loading indicator,all videos sitewide
Bugs: Some videos does not load the preview

*/
$.ajaxSetup({

   type: "GET",
   dataType:"html"

 });
 function pageObj(obj){
	this.pageX = obj.parent().offset().left+100;
}
//function that transformes the sprite image
 function transformFrame(obj,e)
 {
		//console.log(e);
		//$(this).css('left',parseInt($(this).css('left'))-120); //image consist of resim 80 parts, object width  120px
		var diff = e.pageX - (obj.parent().offset().left+100); //mouse is over which pixel? 
		part = 10 * (obj.get(0).naturalHeight / 45);//there always 10 horizontal images but vertical images may vary. Each of 45px heigth so we can find number of them   ya
		diff = diff *(part/120); //we split by thumb count
		var topl = Math.floor(diff / 10); //which row is this 
		var leftl = Math.floor(diff % 10); //which column is this
		obj.css('left',100-(leftl*120)); //first thumb was alligned by 10px, we align new thumb horizontal
		obj.css('top',100-Math.floor(topl*(67.5))); //vertical alignment
 }
 var timeOut = Array();
 //function that handles continious play
 function playFrames(obj,e,interval)
 {
	if(e == null)
	{
		e = new pageObj(obj);
	}
	//console.log(interval);	
	if(e.pageX < obj.parent().offset().left+100+110){
		e.pageX += 1;
		transformFrame(obj,e);
		clearTimeout(timeOut[obj.attr('src')] );
		timeOut[obj.attr('src')] = setTimeout(function(){playFrames(obj,e,interval)},interval);
	
	}
 }
 //function that calculates speed of play
 function calculateInterval(videoTime)
 {
	timeParts = videoTime.split(":");
	var timeInSeconds = 0;
	for(i = 0;i<timeParts.length;i++)
	{
		timeInSeconds += timeParts[i] * Math.pow(60,timeParts.length-i-1);
	}
	var interval = timeInSeconds;
	if(interval>200)
	{
		interval = 200;
	}else if(interval<50)
	{
		interval = 50;
	}
	return interval;
 }
 //main load function
$(document).ready(function() {

	 $('.watch-sidebar-section a[href^="/watch"]').mouseover( function(){ //currently attaches to related videos
		if(!($(this).hasClass('cySend'))){
			$(this).addClass('cySend')
			var obj = $(this);
					$.ajax({
				  url: $(this).attr('href'),
				  success: function(data) {
					//console.log(data);
					var patt=new RegExp("\"storyboard_spec\": \"(.*?)\"","g");
					var result=patt.exec(data);
					patt=new RegExp("(http.*?)\\|.*?#M\\$M#(.*)","g");//"(http.*?)\\|.*?#M\\$M#(.*?)\\|","g"); 
					result=patt.exec(result[1]);
					//console.log(result);
					var http = result[1];
					var sigh = result[2];
					http = http.replace(/\\/g, "").replace("$L", "1").replace("$N", "M0");
					http += "?sigh="+sigh;
					var res = $(obj).find('.yt-thumb-clip-inner img').attr('src',http);
					res.attr('style','width: 1200px;left: 100px;position: relative;top: 100px;vertical-align: top;');
					var videoTime = $(obj).find(".video-time").text();
					var interval = calculateInterval(videoTime);				
					res.load(function(e){
						$(this).css('height',($(res).get(0).naturalHeight * 3)/2);
						$(this).css('left',100-240);
						playFrames(res,null,interval);
						res.mousemove(interval,function(e){
							playFrames(res,e,interval);
						});
					});
			  }
			});
		}	
		
	 
	});

});


