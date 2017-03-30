function Observer(data){
	this.data=data;
	this.makeObserver(data);
	this.eventsBus=new Event();
}
Observer.prototype.setterAndGetter = function(key,val) {

	let _this=this;
	Object.defineProperty(this.data,key,{
		enumerable:true,
		configurable:true,
		get:function(){
			console.log("你访问了"+key);
			return val;
		},
		set:function(newVal){


			console.log("你设置了"+key);
			console.log('新的'+key+'='+newVal);

			//触发$watch函数
			_this.eventsBus.emit(key,val,newVal);
            
            val =newVal;
			
			//如果newVal是对象的话
			if(typeof newVal==='object'){
				new Observer(val);
			}
		}

	})

};
Observer.prototype.makeObserver = function(obj) {

	let val;
	for(let key in obj){
		if(obj.hasOwnProperty(key)){
			val=obj[key];
			if(typeof val==='object'){
				new Observer(val);
			}
		}
		this.setterAndGetter(key,val);
	}
};

Observer.prototype.$watch = function(attr,callback) {
	this.eventsBus.on(attr,callback);
	// body...
};

function Event(){
	this.events={};
}

Event.prototype.on=function(attr,callback){
	if(this.events[attr]){
		this.events[attr].push(callback);
	}else{
		this.events[attr]=[callback];
	}
}

Event.prototype.off=function(attr){
	for(let key in this.events){
		if(this.events.hasOwnProperty(key)&&key===attr){
			delete this.events[key];
		}
	}
}
Event.prototype.emit=function(attr,...arg){
	this.events[attr]&&this.events[attr].forEach(function(item){
		item(...arg);
	})
}

let app=new Observer({
	name:'young',
	age:25
});
app.$watch('age',function(oldVal,newVal){
	console.log('我的年级变了，原来是：'+oldVal+',现在已经是'+newVal+'岁了');
});

app.$watch('age',function(oldVal,newVal){
	console.log('我的年纪变了，真的变成'+newVal+'岁了');
});

app.data.age=100;

app.$watch('name',function(oldName,newName){
	let val;
	if(typeof newName==='object'){
	    for(var key in newName){
	    	if(newName.hasOwnProperty(key)){
	    		console.log("you set "+key+":"+newName[key]);
	    	}
	    }
	}else{
	   console.log("you set new Name "+newName);
	}
	
});
app.data.name={firstname:"lei",lastname:"daiwen"};

app.data.name.firstname="Faye";