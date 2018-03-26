const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const geo = require('./weather.js')
var app = express();
var place = 'Folwark Leszczynowka';

// var f_place = document.getElementById('place_subbmit').addEventListner('click',
// 		function(){
// 			document.getElementById('input_place').getValue();
// 		})
// console.log(f_place);
// var place = encodeURIComponent(f_place);
hbs.registerPartials(__dirname+'/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
})

hbs.registerHelper('message',(text) => {
	return text.toUpperCase();
})

// app.use((request,response,next) => {
// 	response.render('maint.hbs');
// })

app.use((request, response,next) => {
	var time = new Date();
	var log = `${time}: ${request.method}, ${request.url}`;
	fs.appendFile('server.log', log +'\n', (error) => {
		if (error){
			console.log('Unable to log message');
		}
	});
	next();
})

app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/info',(request,response) => {
	response.send('My info page');
});

app.get('/about',(request,response) => {
	response.render('about.hbs', {
		title: 'About page',
		year: new Date().getFullYear(),
		welcome: 'Hello!',
		ref1: '/me',
		img: "http://images.mentalfloss.com/sites/default/files/styles/mf_image_16x9/public/iStock-496545234.jpg?itok=9mv-23FB&resize=1100x619"
	});
})

app.get('/404',(request,response) => {
	response.send({
		error: 'Page not found'
	});
});

//////////////////////////////////////////////////////



hbs.registerHelper('p_mess',(text) => {
	return text;
});

app.get('/me',(request, response) => {
	response.render('index.hbs',{
		putin: 'Controlled by V.V. Putin',
		ref1: '/about',
		img: "http://media.mnn.com/assets/images/2015/05/hedgehog.jpg.653x0_q80_crop-smart.jpg"
	});
});

app.listen(8080, () => {
	console.log('Server is up on port 8080');
});

app.get('/w',(request,response) => {
		//response.sendFile(path.join(__dirname+'/index2.html'));
		geo.geocode(place).then((result) => {
	    //console.log(place+" "+JSON.stringify(result));
	    return geo.weather(result.lat,result.lng)
	}, (errorMessage) => {
	    console.log(errorMessage);
	}).then((results) => {
		//console.log("Temperature is",results);
		//response.send(`The temperature in ${place} is ${results.temp} and is ${results.precipType}`);
		if(results.precipType!=undefined){
			response.send(`The temperature in ${place} is ${results.temp} and is ${results.precipType}`);
		}
		else{
			response.send(`The temperature in ${place} is ${results.temp} and is sunny`);			
		}
	}).catch((errorMessage) => {
		response.send("Error",errorMessage);
	})
});

