// Общий скрипт хаба: появление блоков (.rv), анимация-созвездие в хиро (#net), затемнение шапки.
(function(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll('.rv').forEach(function(el){io.observe(el);});

  var nav=document.getElementById('nav'),hero=document.querySelector('.hero');
  if(nav&&hero){var io2=new IntersectionObserver(function(es){es.forEach(function(e){nav.classList.toggle('on-dark',e.isIntersecting);});},{rootMargin:'-70px 0px 0px 0px',threshold:0});io2.observe(hero);}

  var c=document.getElementById('net');if(!c)return;
  var ctx=c.getContext('2d');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR=Math.min(window.devicePixelRatio||1,2);var W,H,nodes,raf;var GREEN='180,250,178';
  function size(){W=c.clientWidth;H=c.clientHeight;c.width=W*DPR;c.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);build();}
  function build(){var area=W*H,count=Math.max(30,Math.min(66,Math.round(area/24000)));nodes=[];for(var i=0;i<count;i++){var hub=Math.random()<0.24;nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,r:hub?(3.6+Math.random()*2.4):(1.5+Math.random()*1.6),hub:hub});}}
  function draw(move){ctx.clearRect(0,0,W,H);var maxd=Math.min(W,H)*0.19,maxd2=maxd*maxd;if(move){for(var i=0;i<nodes.length;i++){var n=nodes[i];n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;}}for(var a=0;a<nodes.length;a++){for(var b=a+1;b<nodes.length;b++){var dx=nodes[a].x-nodes[b].x,dy=nodes[a].y-nodes[b].y,d2=dx*dx+dy*dy;if(d2<maxd2){var al=(1-d2/maxd2)*0.45;ctx.strokeStyle='rgba('+GREEN+','+al.toFixed(3)+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y);ctx.lineTo(nodes[b].x,nodes[b].y);ctx.stroke();}}}for(var k=0;k<nodes.length;k++){var m=nodes[k];if(m.hub){ctx.shadowColor='rgba('+GREEN+',.7)';ctx.shadowBlur=12;ctx.fillStyle='rgba('+GREEN+',.95)';}else{ctx.shadowBlur=0;ctx.fillStyle='rgba(206,214,220,.9)';}ctx.beginPath();ctx.arc(m.x,m.y,m.r,0,6.283);ctx.fill();}ctx.shadowBlur=0;}
  function loop(){draw(true);raf=requestAnimationFrame(loop);}
  size();if(reduce){draw(false);}else{loop();}
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){cancelAnimationFrame(raf);size();if(reduce){draw(false);}else{loop();}},180);});
})();
