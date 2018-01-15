/*
	Автор скрипта: Gad575

	ToDo:
	- работа 24/7.
	- полностью автоматическая система покупки роли Премиум участник клана.
	- нормальное шифрование премиум-кодов.
	- премодерация сообщений для нарушителей.
	- перманентный бан на сервере для ЧСников.
	- игра.

	Запустить бота:
	node "bot.js"
	Отключить бота:
	Ctrl + C
*/
const Discord = require('discord.js');
const Cleverbot = require('cleverbot-node');
const config = require('./config.json');
const fs = require('fs');
const Qiwi = require('node-qiwi-api').Qiwi;
const Base64 = require('js-base64').Base64;
const client = new Discord.Client();
const clbot = new Cleverbot;
const Wallet = new Qiwi(config.qiwiToken);

clbot.configure({botapi: config.cleverbotToken});

function victorine(message){
	message.channel.send('Старт викторины через 30 секунд.\n5 правильных ответов - перевод в Основной клан.\n4-3 правильных ответа - повышение до Лучшего участника клана.\n2-1 правильных ответа - повышение до Почетного участника клана.\nВремя на ответы: 20 секунд.');
	intervalOne = setInterval(questionOne, 30000);
	messageParameter = message;
}
function questionOne(){
	messageParameter.channel.send('Вопрос #1:\nКогда был создан Основной клан?\nВарианты:\n1) В июне\n2) В июле\n3)В августе\n\nФормат ответа:\n/gad 1 <ЦифраПравильногоОтвета>');
	clearInterval(intervalOne);
	intervalTwo = setInterval(questionTwo, 20000);
}
function questionTwo(){
	messageParameter.channel.send('Вопрос #2:\nКогда была создана Академия?\nВарианты:\n1) В октябре\n2) В ноябре\n3) В декабре\n\nФормат ответа:\n/gad 2 <ЦифраПравильногоОтвета>');
	clearInterval(intervalTwo);
	intervalThree = setInterval(questionThree, 20000);
}
function questionThree(){
	messageParameter.channel.send('Вопрос #3:\nКогда был создан этот сервер?\nВарианты:\n1) При создании клана\n2) После создания клана\n3) До создания клана\n\nФормат ответа:\n/gad 3 <ЦифраПравильногоОтвета>');
	clearInterval(intervalThree);
	intervalFour = setInterval(questionFour, 20000);
}
function questionFour(){
	messageParameter.channel.send('Вопрос #4:\nКто глава обоих кланов?\nВарианты:\n1) Gad575\n2) rabitocs57 и Alex_Tob\n3) Бот\n\nФормат ответа:\n/gad 4 <ЦифраПравильногоОтвета>');
	clearInterval(intervalFour);
	intervalFive = setInterval(questionFive, 20000);
}
function questionFive(){
	messageParameter.channel.send('Вопрос #5:\nКогда был создан бот?\nВарианты:\n1) В октябре\n2) В ноябре\n3) В декабре\n\nФормат ответа:\n/gad 5 <ЦифраПравильногоОтвета>');
	clearInterval(intervalFive);
	intervalFinal = setInterval(final, 20000);
}
function final(){
	messageParameter.channel.send('Правильные ответы в формате ВОПРОС-ОТВЕТ:\n1-3\n2-2\n3-1\n4-1\n5-3.');
	clearInterval(intervalFinal);
}

function banParams(message, userForBan){
	intervalID = setInterval(autoUnbanUser, 3600000);
	messageParam = message;
	userForUnban = userForBan;
}
function autoBanUser(message, reason){
	var userForBan = message.member;
	if(userForBan.roles.some(r=>["Модератор", "Премиум участник клана", "На испытательных работах", "Лучший участник клана", "Почетный участник клана", "Участник клана"].includes(r.name)) ) {
		message.channel.send('[АВТОБАН]\n' + userForBan + ' был забанен. Причина: ' + reason);
		var oldOne = message.guild.roles.find("name", "Премиум участник клана");
		var oldTwo = message.guild.roles.find("name", "На испытательных работах");
		var oldThr = message.guild.roles.find("name", "Лучший участник клана");
		var oldFor = message.guild.roles.find("name", "Почетный участник клана");
		var oldFiv = message.guild.roles.find("name", "Участник клана");
		var moder = message.guild.roles.find("name", "Модератор");
		userForBan.removeRole(oldOne);
		userForBan.removeRole(oldTwo);
		userForBan.removeRole(oldThr);
		userForBan.removeRole(oldFor);
		userForBan.removeRole(oldFiv);
		userForBan.removeRole(moder);
		var newRole = message.guild.roles.find("name", "Заблокированный");
		userForBan.addRole(newRole);
		console.log('Сработала система автобана');
		banParams(message, userForBan);
		message.delete();
	}
}
function autoUnbanUser(){
	var oldRole = messageParam.guild.roles.find("name", "Заблокированный");
	userForUnban.removeRole(oldRole);
	var newRole = messageParam.guild.roles.find("name", "Участник клана");
	userForUnban.addRole(newRole);
	clearInterval(intervalID);
	messageParam.channel.send('[АВТОБАН]\n' + userForUnban + ' был разбанен. Истек срок бана пользователя.');
	console.log('Сработала система авторазбана');
}

function addPremiumRole() {
	var message = premiumActivateMessage;
	var member = premiumActivateMessage.member;
	var checkPremium = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Новая покупка.txt', 'utf8');
	if(checkPremium == 'Одобрено') {
		fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Новая покупка.txt', null, 'utf8');
		var oldOne = message.guild.roles.find("name", "На испытательных работах");
		var oldTwo = message.guild.roles.find("name", "Лучший участник клана");
		var oldThr = message.guild.roles.find("name", "Почетный участник клана");
		var oldFor = message.guild.roles.find("name", "Участник клана");
		member.removeRole(oldOne);
		member.removeRole(oldTwo);
		member.removeRole(oldThr);
		member.removeRole(oldFor);
		var newRole = message.guild.roles.find("name", "Премиум участник клана");
		member.addRole(newRole);
		message.channel.send(member + ' премиализован.');
		console.log(member.user.username + ' активировал премиум код: ' + config.premium);
	}else
	if(checkPremium == 'Не одобрено') {
		fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Новая покупка.txt', null, 'utf8');
		message.channel.send(member + ' не премиализован. Причина: роль не оплачена.');
	}
}

function premoderation() {
	var message = premoderationMessage;
	var member = premoderationMessage.member;
	var checkPremoderation = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Нарушитель ' + member.user.username + '.txt', 'utf8');
	if(checkPremoderation == 'Одобрено') {
		fs.writeFileSync('Нарушитель ' + member.user.username + '.txt', null, 'utf8');
		message.channel.send(fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Сообщение от нарушителя ' + member.user.username + '.txt', 'utf8'));
		console.log(member.user.username + ' отправил сообщение, являясь нарушителем.');
	}else
	if(checkPremoderation == 'Не одобрено') {
		fs.writeFileSync('Нарушитель ' + member.user.username + '.txt', null, 'utf8');
	}
}

client.on("ready", () => {
	client.user.setGame(config.botInfo.version + ' | GADhelp');
	console.log('Бот запущен');
});

client.on("guildMemberAdd", (member) => {
	var channel = member.guild.channels.find('name', 'general');
	channel.send(member.user.username + ' зашел на сервер.');
	member.send('Добро пожаловать на сервер.\nЕсли ты хочешь вступить в наш клан, напиши в канал knn на сервере следующие данные.');
	member.send('Формат твоего ответа:\n"Хочу вступить в клан: ТвойНик, ТвойУровеньМехаников, ТвойУровеньБешеных, ТвойУровеньСкитальцев, ТвойУровеньМусорщиков, ТвойУровеньСтепныхВолков, ТвойУровеньДетейРассвета, ТвойОМ, ТвоеОружиеНаКрафтеСкладе, ТвойВозраст, КланыВкоторыхТыБылРаньше" без кавычек с соответствующими изменениями (информация про возраст останется конфиденциальной и будет известна только Главе клана).');
	console.log(member.user.username + ' зашел на сервер.');
});
client.on("guildMemberRemove", (member) => {
	var channel = member.guild.channels.find('name', 'general');
	channel.send(member.user.username + ' покинул сервер.');
	console.log(member.user.username + ' покинул сервер.');
});

client.on('message', (message) => {
	if(message.author === client.user) return; // Если отправитель бот, игнор
	// Система Автобана
	if(message.channel.type === 'text') {
		if(message.member.roles.some(r=>["Модератор", "Премиум участник клана", "На испытательных работах", "Лучший участник клана", "Почетный участник клана", "Участник клана"].includes(r.name)) ) {
			checkMessage = message;
			var autoSpam = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Антиспам ' + message.member.user.username + '.txt', 'utf8');
			if(autoSpam == '0'){
				var reason = 'нарушение Раздела 1 Главы 1 Пункта 1 Правил клана.';
				autoBanUser(message, reason);
			}else{
				fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Антиспам ' + message.member.user.username + '.txt', '0', 'utf8');
				temp = setInterval(clear, 5000);
			}
		}
		if(message.member.roles.some(r=>["Нарушитель", "Нарушитель - академия"].includes(r.name)) ) {
			fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Сообщение от нарушителя ' + message.member.user.username + '.txt', message, 'utf8');
			fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Нарушитель ' + message.member.user.username + '.txt', null, 'utf8');
			message.channel.send('Сообщение отправлено на премодерацию.');
			message.delete();
			premoderationMessage = message;
			premoderationInterval = setInterval(premoderation, 1000);
		}
	}

	var badWords = ["пизд", "бля", "муд", "пид", "еба", "сук", "мать", "пох", "хуй", "мр", "мам", "чур", "осел", "ишак", "рак", "олень", "гав"];
	if(badWords.some(word => message.content.includes(word))) {
		if(message.channel.name != 'bombilka') {
			var reason = 'нарушение Раздела 1 Главы 1 Пунктов 2, 3, 4, 7 Правил клана.';
			autoBanUser(message, reason);
		}
	}

	var falseWords = ["не говорил"];
	if(falseWords.some(word => message.content.includes(word))) {
		var reason = 'нарушение Раздела 1 Главы 1 Пункта 5 Правил клана.';
		autoBanUser(message, reason);
	}

	var urlWords = ["http"];
	if(urlWords.some(word => message.content.includes(word))) {
		var reason = 'нарушение Раздела 1 Главы 1 Пункта 6 Правил клана.';
		autoBanUser(message, reason);
	}

	var capWords = ["Gad575", "гад"];
	if(capWords.some(word => message.content.includes(word))) {
		var reason = 'нарушение Раздела 1 Главы 1 Пункта 9 Правил клана.';
		autoBanUser(message, reason);
	}

	var words = ["за что", "почему"];
	if(words.some(word => message.content.includes(word))) {
		var reason = 'нарушение Раздела 1 Главы 1 Пункта 10 Правил клана.';
		autoBanUser(message, reason);
	}

	var ageWords = ["сколько"];
	if(ageWords.some(word => message.content.includes(word))) {
		var reason = 'нарушение Раздела 1 Главы 1 Пункта 13 Правил клана.';
		autoBanUser(message, reason);
	}
	// Авторекрутинг
	if(message.channel.type === 'text') {
		if(message.content.startsWith('Хочу вступить в клан:')){
			var nick = message.member.user.username;
			var msg = message;
			fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Заявка в клан от игрока ' + nick + '.txt', msg, 'utf8');
			message.reply('Заявка на рассмотрении.');
			var channel = client.channels.find('id', '387975062751412224');
			console.log('Подана заявка в клан от игрока ' + nick);
			channel.send('Подана заявка в клан от игрока ' + nick);
		}
	}
	// Предпочтения игроков
	if(message.channel.type === 'text') {
		if(message.content.startsWith('Мои предпочтения: ')){
			var nick = message.member.user.username;
			var msg = message;
			fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Предпочтения игрока ' + nick + '.txt', msg, 'utf8');
			message.reply('Предпочтения записаны.');
			console.log('Записаны предпочтения игрока ' + nick);
		}
	}
	// Правильные ответы на викторину
	if(message.content == '/gad 1 2'){
		message.delete();
		var member = message.member;
		message.channel.send(member + ' дал правильный ответ!');
	}else
	if(message.content == '/gad 2 3'){
		message.delete();
		var member = message.member;
		message.channel.send(member + ' дал правильный ответ!');
	}else
	if(message.content == '/gad 3 2'){
		message.delete();
		var member = message.member;
		message.channel.send(member + ' дал правильный ответ!');
	}else
	if(message.content == '/gad 4 1'){
		message.delete();
		var member = message.member;
		message.channel.send(member + ' дал правильный ответ!');
	}else
	if(message.content == '/gad 5 2'){
		message.delete();
		var member = message.member;
		message.channel.send(member + ' дал правильный ответ!');
	}

	// Команда перевода новичков в Академию
	if(message.content.startsWith(config.prefix + 'new')) {
		var member = message.member;
		if(member.id == config.ownerID) {
			message.delete();
			var newUser = message.mentions.members.first();
			var role = message.guild.roles.find("name", "Участник клана");
			newUser.addRole(role);
			message.channel.send(newUser + ' был принят в клан.');
			newUser.send(newUser + ', добро пожаловать в наш клан!\nЕсли ты хочешь указать свои предпочтения (оружие, ОМ, время игры), то напиши их, начиная свое сообщение с "Мои предпочтения: " без кавычек.');
			console.log(newUser.user.username + ' был переведен в основной клан.');
		}else{
			message.channel.send('Действие доступно только Главе клана.');
		}
	}

	//Режим умного бота
	if(message.content.startsWith('Бот, ')) {
		if(config.botInfo.enabledCommands.enableBotCommands.enableCleverBot.GADcleverbot == true) {
			if(message.channel.type === 'text') {
				if(badWords.some(word => message.content.includes(word))) {
					message.reply('Я не общаюсь с матершинниками.');
				}else{
					clbot.write(message.content, (Response) => {
						message.channel.startTyping();
						setTimeout(() => {
							message.channel.send(Response.output);
							message.channel.stopTyping();
						}, Math.random() * (1 - 3) + 1 * 1000);
					});
					console.log('[CleverBot] Отправлено сообщение.');
				}
			}
		}else{
			message.reply('Режим умного бота временно отключен.');
		}
	}

	// Команда помощи
	if(message.content == config.prefix + 'help') {
		if(config.botInfo.enabledCommands.GADhelp == true) {
			const embed = new Discord.RichEmbed()
			.setImage('http://gad-server.ucoz.org/img/SiteImg.jpg');
		
			var botInformation = 'Информация о боте:\nИмя бота: ' + config.botInfo.name + '\nВерсия бота: ' + config.botInfo.version + '\nРазработчик бота: ' + config.botInfo.developer + '\n';
			var versionInformation = 'Информация об обновлении ' + config.botInfo.version + ':\n' + config.botInfo.update + '\n';
			var commandOne = 'Привет! - поздороваться с ботом.\nGADhi <ИмяПользователя> - поздороваться с игроком от имени бота.\nGADbye <ИмяПользователя> - попрощаться с игроком от имени бота.';
			var commandTwo = 'GADmusic - воспроизвести музыку.\nДоступные конфигурации:\nGADmusic default - конфигурация по умолчанию.\nGADmusic alex_tob - конфигурация от Alex_Tob.';
			var commandThree = 'GADrules - Правила клана и Пользовательское соглашение клана.';
			var commandFour = 'GADwarn <ИмяПользователя> - предупредить участника сервера о нарушении Правил клана.';
			var commandFive = 'GADban <ИмяПользователя> - забанить участника сервера.\nGADunban <ИмяПользователя> - разбанить участника сервера.';
			var commandSix = 'GADpermanentban <ИмяПользователя> - забанить навсегда участника сервера.';
			var commandSeven = 'GADdelete - удалить 100 сообщений в канале.';
			var commandEight = 'GADinfouser <ИмяПользователя> - вывести информацию о пользователе.';
			var commandNine = 'GADsite - вывести информацию о сайте клана.';
			var commandTen = 'GADyoutube - вывести информацию о ютуб-канале клана.';
			var premium = 'GADpremium - проверить покупку роли "Премиум участник клана"';
			var party = 'GADparty <ИмяПользователя> - написать предпочтения пользователя для поиска пати.';
			message.member.send(botInformation + versionInformation + '\nКоманды:\n' + commandOne + '\n' + commandTwo + '\n' + commandThree + '\n' + commandFour + '\n' + commandFive + '\n' + commandSix + '\n' + commandSeven + '\n' + commandEight + '\n' + commandNine + '\n' + commandTen + '\n\n' + party + '\n\n' + premium);
			message.member.send({embed});
			message.reply('Список команд отправлен в личные сообщения.');
			message.channel.send({embed});
			console.log('Применена команда помощи.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	// Команда обновления
	if(message.content == config.prefix + 'update') {
		var member = message.member;
		if(member.id == config.ownerID) {
			message.delete();
			message.channel.send('Обновление бота до версии ' + config.botInfo.version + ':\n' + config.botInfo.update);
		}else{
			message.channel.send('Действие доступно только Главе клана.');
		}
		console.log('Применена команда информации об обновлении.');
	}

	// Команда поиска пати
	if(message.content.startsWith(config.prefix + 'party')) {
		var member = message.member;
		if(member.roles.some(r=>["Спайдер", "Друг гада - мастер в железе", "Друг гада - мастер в тактике", "Друг гада", "Премиум участник клана"].includes(r.name)) ) {
			message.delete();
			var user = message.mentions.members.first();
			var msg = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Предпочтения игрока ' + user.user.username + '.txt', 'utf8');
			message.channel.send('Предпочтения игрока ' + user.user.username + ':\n' + msg);
		}else{
			message.channel.send('Действие доступно только Главе клана, Друзьям главы, Премиум участникам клана.');
		}
		console.log('Применена команда поиска пати.');
	}

	// Команды приветствия
	if(message.content == 'Привет!') {
		if(config.botInfo.enabledCommands.enableBotCommands.GADhi == true) {
			message.reply('Привет!');
			console.log('Применена команда приветствия.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}

	if(message.content.startsWith(config.prefix + 'hi')) {
		if(config.botInfo.enabledCommands.enableBotCommands.GADhi == true) {
			var member = message.member;
			if(member.roles.some(r=>["Спайдер", "Друг гада - мастер в железе", "Друг гада - мастер в тактике", "Друг гада", "Премиум участник клана", "На испытательных работах"].includes(r.name)) ) {
				message.delete();
				var member = message.mentions.members.first();
				message.channel.send(member + ', привет!');
			}else{
				message.channel.send('Действие доступно только Главе клана, Друзьям главы, Премиум участникам клана и Участникам Основного клана.');
			}
			console.log('Применена команда приветствия от имени бота.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	if(message.content.startsWith(config.prefix + 'bye')) {
		if(config.botInfo.enabledCommands.enableBotCommands.GADhi == true) {
			var member = message.member;
			if(member.roles.some(r=>["Спайдер", "Друг гада - мастер в железе", "Друг гада - мастер в тактике", "Друг гада", "Премиум участник клана", "На испытательных работах"].includes(r.name)) ) {
				message.delete();
				var member = message.mentions.members.first();
				message.channel.send(member + ', пока!');
			}else{
				message.channel.send('Действие доступно только Главе клана, Друзьям главы, Премиум участникам клана и Участникам Основного клана.');
			}
			console.log('Применена команда приветствия от имени бота.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	// Команда премиализации
	if(message.content.startsWith(config.prefix + 'premium')) {
		if(config.botInfo.enabledCommands.enableBotCommands.premuimBotCommands.GADpremium == true) {
			var member = message.member;
			if(member.roles.some(r=>["Спайдер", "Друг гада - мастер в железе", "Друг гада - мастер в тактике", "Друг гада", "Модератор", "Премиум участник клана"].includes(r.name)) ) {
				message.reply('У тебя и так есть привилегии премиум-пользователя.');
			}else{
				var decodePremium = Base64.decode(config.premium);
				if(message.content == 'GADpremium ' + decodePremium) {
					var member = message.member;
					if(member.roles.some(r=>["На испытательных работах", "Лучший участник клана", "Почетный участник клана", "Участник клана"].includes(r.name)) ) {
						message.delete();
						Wallet.getBalance((err, info) => {
							if(err) {
								console.log(err);
							}
							fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Новая покупка.json', JSON.stringify(info), 'utf8');
						});
						message.reply('Ожидается подтверждение покупки...');
						premiumActivateMessage = message;
						var premiumInterval = setInterval(addPremiumRole, 1000);
					}else{
						message.channel.send('Невозможно премиализовать пользователя.');
					}
				}else{
					message.reply('Премиум-код некорректен.');
				}
			}
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	// Команды ресурсов клана
	if(message.content == config.prefix + 'site') {
		if(config.botInfo.enabledCommands.enableBotCommands.GADsite == true) {
			var member = message.mentions.members.first();
			message.channel.send('Сайт клана: http://gad-server.ucoz.org/');
			console.log('Применена команда вывода информации о сайте клана.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	if(message.content == config.prefix + 'youtube') {
		if(config.botInfo.enabledCommands.enableBotCommands.GADyoutube == true) {
			var member = message.mentions.members.first();
			message.channel.send('Ютуб-канал клана: https://www.youtube.com/channel/UCiCZKoQjCnHGn1-h8vhmzzA/');
			console.log('Применена команда вывода информации о ютуб-канале клана.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	// Команда Правил клана
	if(message.content == config.prefix + 'rules') {
		if(config.botInfo.enabledCommands.enableBotCommands.GADrules == true) {
			message.channel.send('Правила клана: http://gad-server.ucoz.org/index/clanrules/0-8.');
			console.log('Применена команда информации о Правилах клана.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	// Команда получения информации о пользователе
	if(message.content.startsWith(config.prefix + 'infouser')) {
		if(config.botInfo.enabledCommands.enableBotCommands.GADinfouser == true) {
			var member = message.member;
			if(member.roles.some(r=>["Спайдер", "Друг гада - мастер в железе", "Друг гада - мастер в тактике", "Друг гада", "Премиум участник клана"].includes(r.name)) ) {
				message.delete();
				var member = message.mentions.members.first();
				if(member.roles.some(r=>["Спайдер"].includes(r.name)) ) {
					var fails = 'Пользователь является Главой клана и имеет иммунитет к Правилам клана.';
				}else
				if(member.roles.some(r=>["Друг гада - мастер в железе", "Друг гада - мастер в тактике", "Друг гада"].includes(r.name)) ) {
					var fails = 'Пользователь является другом Главы клана и имеет иммунитет к Правилам клана.';
				}else{
					var fails = '0';
				}

				if(member.roles.some(r=>["Спайдер"].includes(r.name)) ) {
					var role = 'Спайдер';
					var userStatus = 'В основном клане.';
				}else
				if(member.roles.some(r=>["Друг гада - мастер в железе", "Друг гада - мастер в тактике", "Друг гада"].includes(r.name)) ) {
					var role = 'Друг гада';
					var userStatus = 'В основном клане.';
				}else
				if(member.roles.some(r=>["Модератор"].includes(r.name)) ) {
					var role = 'Модератор';
					var userStatus = 'В основном клане.';
				}else
				if(member.roles.some(r=>["Премиум участник клана"].includes(r.name)) ) {
					var role = 'Премиум участник клана';
					var userStatus = 'В основном клане.';
				}else
				if(member.roles.some(r=>["На испытательных работах"].includes(r.name)) ) {
					var role = 'На испытательных работах';
					var userStatus = 'В основном клане.';
				}else
				if(member.roles.some(r=>["Лучший участник клана"].includes(r.name)) ) {
					var role = 'Лучший участник клана';
					var userStatus = 'В академии.';
				}else
				if(member.roles.some(r=>["Почетный участник клана"].includes(r.name)) ) {
					var role = 'Почетный участник клана';
					var userStatus = 'В академии.';
				}else
				if(member.roles.some(r=>["Участник клана"].includes(r.name)) ) {
					var role = 'Участник клана';
					var userStatus = 'В академии.';
				}else
				if(member.roles.some(r=>["Заблокированный"].includes(r.name)) ) {
					var role = 'Заблокированный';
					var userStatus = 'Заблокирован.';
				}

				message.channel.send('Информация о пользователе ' + member + ':\nИмя пользователя: ' + member.user.username + '\nID пользователя: ' + member.id + '\nКоличество нарушений Правил клана: ' + fails + '\nРоль пользователя: ' + role + '\nСтатус пользователя: ' + userStatus);
			}else{
				message.channel.send('Действие доступно только Главе клана, Друзьям Главы и Премиум участникам клана.');
			}
			console.log('Применена команда получения информации о пользователе.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	// Модерационные команды
	if(message.content.startsWith(config.prefix + 'warn')) {
		if(config.botInfo.enabledCommands.enableBotCommands.GADwarn == true) {
			var member = message.member;
			if(member.roles.some(r=>["Спайдер", "Друг гада - мастер в железе", "Друг гада - мастер в тактике", "Друг гада", "Модератор"].includes(r.name)) ) {
				var member = message.mentions.members.first();
				if(member.roles.some(r=>["Премиум участник клана", "На испытательных работах", "Лучший участник клана", "Почетный участник клана", "Участник клана"].includes(r.name)) ) {
					message.delete();
					message.channel.send(member + ', предупреждение.');
				}else{
					message.channel.send('Невозможно предупредить пользователя.');
				}
			}else{
				message.channel.send('Действие доступно только Главе клана, Друзьям главы, Модераторам.');
			}
			console.log('Применена команда предупреждения.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	if(message.content.startsWith(config.prefix + 'ban')) {
		if(config.botInfo.enabledCommands.enableBotCommands.GADban == true) {
			var member = message.member;
			if(member.roles.some(r=>["Спайдер", "Друг гада - мастер в железе", "Друг гада - мастер в тактике", "Друг гада", "Модератор"].includes(r.name)) ) {
				var member = message.mentions.members.first();
				if(member.roles.some(r=>["Премиум участник клана", "На испытательных работах", "Лучший участник клана", "Почетный участник клана", "Участник клана"].includes(r.name)) ) {
					message.delete();
					message.channel.send(member + ' был забанен.');
					if(member.roles.some(r=>["Премиум участник клана", "На испытательных работах"].includes(r.name)) ) {
						message.channel.send(member + ' будет переведен в Академию на исправительные работы после разбана. Срок: 1 неделя.');
					}
					var oldOne = message.guild.roles.find("name", "Премиум участник клана");
					var oldTwo = message.guild.roles.find("name", "На испытательных работах");
					var oldThr = message.guild.roles.find("name", "Лучший участник клана");
					var oldFor = message.guild.roles.find("name", "Почетный участник клана");
					var oldFiv = message.guild.roles.find("name", "Участник клана");
					member.removeRole(oldOne);
					member.removeRole(oldTwo);
					member.removeRole(oldThr);
					member.removeRole(oldFor);
					member.removeRole(oldFiv);
					var newRole = message.guild.roles.find("name", "Заблокированный");
					member.addRole(newRole);
				}else{
					message.channel.send('Невозможно забанить пользователя.');
				}
			}else{
				message.channel.send('Действие доступно только Главе клана, Друзьям главы, Модераторам.');
			}
			console.log('Применена команда бана.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	if(message.content.startsWith(config.prefix + 'unban')) {
		if(config.botInfo.enabledCommands.enableBotCommands.GADunban == true) {
			var member = message.member;
			if(member.roles.some(r=>["Спайдер", "Друг гада - мастер в железе", "Друг гада - мастер в тактике", "Друг гада", "Модератор"].includes(r.name)) ) {
				var member = message.mentions.members.first();
				if(member.roles.some(r=>["Заблокированный"].includes(r.name)) ) {
					message.delete();
					var oldRole = message.guild.roles.find("name", "Заблокированный");
					member.removeRole(oldRole);
					var newRole = message.guild.roles.find("name", "Участник клана");
					member.addRole(newRole);
					message.channel.send(member + ' был разбанен.');
				}else{
					message.channel.send('Невозможно разбанить пользователя.');
				}
			}else{
				message.channel.send('Действие доступно только Главе клана, Друзьям главы, Модераторам.');
			}
			console.log('Применена команда разбана.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	if(message.content.startsWith(config.prefix + 'permanentban')) {
		if(config.botInfo.enabledCommands.enableBotCommands.GADpermanentban == true) {
			var member = message.member;
			if(member.id == config.ownerID) {
				var member = message.mentions.members.first();
				member.ban();
				message.delete();
				message.channel.send(member + ' был забанен перманентно.')
			}else{
				message.channel.send('Действие доступно только Главе клана.');
			}
			console.log('Применена команда вечного бана.');
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	// Команда очистки чата.
	if(message.content.startsWith(config.prefix + 'delete')) {
		if(config.botInfo.enabledCommands.enableBotCommands.GADdelete == true) {
			var member = message.member;
			if(member.id == config.ownerID) {
				var amount = '100';
				message.channel.fetchMessages({
					limit: amount,
				}).then((messages) => {
					message.channel.bulkDelete(messages);
					message.channel.send('Чат очищен: удалено 100 сообщений.');
				});
			}else{
				message.channel.send('Действие доступно только Главе клана.');
			}
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	// Особые команды
	// Команда музыки
	if(message.content.startsWith(config.prefix + 'music')) {
		if(config.botInfo.enabledCommands.enableBotCommands.GADmusic == true) {
			var member = message.member;
			if(member.roles.some(r=>["Спайдер", "Друг гада - мастер в железе", "Друг гада - мастер в тактике", "Друг гада", "Почетный гость"].includes(r.name)) ) {
				message.delete();
				message.member.voiceChannel.join()
				.then(connection => {
					if(message.content == config.prefix + 'music default') {
						message.channel.send('Старт проигрывания музыки.\nКонфигурация: по умолчанию.');
						var dispatcherOneOne = connection.playFile('D:/Моя папка/Музыка/Crossout/Crossout - Паучок.mp3');
						dispatcherOneOne.on('end', () => {
							var dispatcherOneTwo = connection.playFile('D:/Моя папка/Музыка/Crossout/Crossout - Затишье перед бурей.mp3');
							dispatcherOneTwo.on('end', () => {
								var dispatcherOneThr = connection.playFile('D:/Моя папка/Музыка/Crossout/Crossout - Активность в бою.mp3');
								dispatcherOneThr.on('end', () => {
									var dispatcherOneFor = connection.playFile('D:/Моя папка/Музыка/Crossout/Crossout - Эпическая музыка 2.mp3');
									dispatcherOneFor.on('end', () => {
										var dispatcherOneFiv = connection.playFile('D:/Моя папка/Музыка/Crossout/Crossout - Эпическая музыка 1.mp3');
										dispatcherOneFiv.on('end', () => {
											var dispatcherOneSix = connection.playFile('D:/Моя папка/Музыка/Crossout/Crossout - Праздник победы.mp3');
											dispatcherOneSix.on('end', () => {
												var dispatcherOneSeven = connection.playFile('D:/Моя папка/Музыка/Crossout/Crossout - Motorhead.mp3');
												dispatcherOneSeven.on('end', () => {
													var dispatcherOneEight = connection.playFile('D:/Моя папка/Музыка/Crossout/Crossout - New Order.mp3');
													dispatcherOneEight.on('end', () => {
														var dispatcherOneNine = connection.playFile('D:/Моя папка/Музыка/Crossout/Crossout - Bulletproof.mp3');
														dispatcherOneNine.on('end', () => {
															connection.disconnect();
															message.channel.send('Конец проигрывания музыки.');
														});
													});
												});
											});
										});
									});
								});
							});
						});
					}else
					if(message.content == config.prefix + 'music alex_tob') {
						message.channel.send('Старт проигрывания музыки.\nКонфигурация: от Alex_Tob.');
						var dispatcherTwoOne = connection.playFile('D:/Моя папка/Музыка/От Шурика/Fivefold - Worst Mistake.mp3');
						dispatcherTwoOne.on('end', () => {
							var dispatcherTwoTwo = connection.playFile('D:/Моя папка/Музыка/От Шурика/Linkin Park - New Divide (Live In Madrid).mp3');
							dispatcherTwoTwo.on('end', () => {
								var dispatcherTwoThr = connection.playFile('D:/Моя папка/Музыка/От Шурика/skilet - Rise.mp3');
								dispatcherTwoThr.on('end', () => {
									var dispatcherTwoFor = connection.playFile('D:/Моя папка/Музыка/От Шурика/Skillet - Awake and Alive (Rock Radio Mix).mp3');
									dispatcherTwoFor.on('end', () => {
										var dispatcherTwoFiv = connection.playFile('D:/Моя папка/Музыка/От Шурика/Skillet - Hero (iTunes Session).mp3');
										dispatcherTwoFiv.on('end', () => {
											var dispatcherTwoSix = connection.playFile('D:/Моя папка/Музыка/От Шурика/Баста Моя игра - Моя игра.mp3');
											dispatcherTwoSix.on('end', () => {
												connection.disconnect();
												message.channel.send('Конец проигрывания музыки.');
											});
										});
									});
								});
							});
						});
					}
				});
				console.log('Применена команда музыки.');
			}else{
				message.channel.send('Действие доступно только Главе клана.');
			}
		}else{
			message.reply('Данная команда временно отключена.');
		}
	}
	// Команда КВ
	if(message.content == config.prefix + 'clanwar') {
		var member = message.member;
		if(member.id == config.ownerID) {
			message.delete();
			message.channel.send('[!!!!!ВНИМАНИЕ!!!!!]\nСБОР НА КВ! ВСЕ В КАНАЛ "ОБЩИЙ КАНАЛ"', {tts: true});
		}else{
			message.channel.send('Действие доступно только Главе клана.');
		}
		console.log('Применена команда информации о КВ.');
	}
	//Команда оповещений
	if(message.content == config.prefix + 'announce') {
		var member = message.member;
		if(member.id == config.ownerID) {
			message.delete();
			message.channel.send(config.announce);
		}else{
			message.channel.send('Действие доступно только Главе клана.');
		}
	}
	// Команда викторины
	if(message.content == config.prefix + 'victorine') {
		var member = message.member;
		if(member.id == config.ownerID) {
			message.delete();
			victorine(message);
		}else{
			message.channel.send('Действие доступно только Главе клана.');
		}
	}
	// Команда новотей
	if(message.content == config.prefix + 'confignews') {
		var member = message.member;
		if(member.id == config.ownerID) {
			message.delete();
			var channel = member.guild.channels.find('name', 'news');
			channel.send(config.news);
		}else{
			message.channel.send('Действие доступно только Главе клана.');
		}
	}
	// Игра
	/*if(message.content == config.prefix + 'game') {
		fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 1.txt', message.member.user.username, 'utf8');
		message.reply('Выбери противника.\n\nФормат выбора:\nМой противник: <ИмяПользователя>');
	}*/
	if(message.content.startsWith('Мой противник: ')) {
		var member = message.mentions.members.first();
		fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 2.txt', member.user.username, 'utf8');
		message.reply('Противник: ' + member.user.username);
		startGame(message);
	}

	if(message.content == '/game 1 1'){
		if(noTwo == 'Нет') {
			if(noOne == 'Нет') {
				var damage = Math.random() * (500 - 1) + 1;
				var old = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 2.txt', 'utf8');
				var hp = old-damage;
				message.channel.send(playerOne + ' нанес ' + damage + ' урона!\nОсталось прочности: ' + hp);
				fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 2.txt', hp, 'utf8');
				if(hp <= 0) {
					message.channel.send(playerOne + ' победил!');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 2.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 2.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 2.txt', 'Нет', 'utf8');
				}else{
					roundTwo(message);
				}
			}else{
				var damage = Math.random() * (250 - 1) + 1;
				var old = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 2.txt', 'utf8');
				var hp = old-damage;
				message.channel.send(playerOne + ' нанес ' + damage + ' урона!\nОсталось прочности: ' + hp);
				fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 2.txt', hp, 'utf8');
				if(hp <= 0) {
					message.channel.send(playerOne + ' победил!');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 2.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 2.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 2.txt', 'Нет', 'utf8');
				}else{
					roundTwo(message);
				}
			}
		}else{
			message.channel.send('Игрок в укрытии.');
		}
	}
	if(message.content == '/game 2 1'){
		if(noOne == 'Нет') {
			if(noTwo == 'Нет') {
				var damage = Math.random() * (500 - 1) + 1;
				var old = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 1.txt', 'utf8');
				var hp = old-damage;
				message.channel.send(playerTwo + ' нанес ' + damage + ' урона!\nОсталось прочности: ' + hp);
				fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 1.txt', hp, 'utf8');
				if(hp <= 0) {
					message.channel.send(playerTwo + ' победил!');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 2.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 2.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 2.txt', 'Нет', 'utf8');
				}else{
					roundOne(message);
				}
			}else{
				var damage = Math.random() * (250 - 1) + 1;
				var old = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 1.txt', 'utf8');
				var hp = old-damage;
				message.channel.send(playerTwo + ' нанес ' + damage + ' урона!\nОсталось прочности: ' + hp);
				fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 1.txt', hp, 'utf8');
				if(hp <= 0) {
					message.channel.send(playerTwo + ' победил!');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 2.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 2.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 1.txt', 'Нет', 'utf8');
					fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 2.txt', 'Нет', 'utf8');
				}else{
					roundOne(message);
				}
			}
		}else{
			message.channel.send('Игрок в укрытии.');
		}
	}

	if(message.content == '/game 1 2'){
		fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 1.txt', 'Есть', 'utf8');
		message.channel.send(playerOne + ' в укрытии.');
		roundOne(message);
	}
	if(message.content == '/game 2 2'){
		fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 2.txt', 'Есть', 'utf8');
		message.channel.send(playerTwo + ' в укрытии.');
		roundTwo(message);
	}

	if(message.content == '/game 1 3'){
		fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 2.txt', 'Нет', 'utf8');
		message.channel.send(playerTwo + ' не в укрытии.');
		roundOne(message);
	}
	if(message.content == '/game 2 3'){
		fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 1.txt', 'Нет', 'utf8');
		message.channel.send(playerOne + ' не в укрытии.');
		roundTwo(message);
	}
});

function startGame(message){
	playerOne = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 1.txt', 'utf8');
	playerTwo = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Игрок 2.txt', 'utf8');
	message.channel.send('ИГРА: ' + playerOne + ' vs ' + playerTwo);
	message.channel.send(playerOne + ': крафт Gad575 ToLLIHuT (оружие: 2 тошнителя, прочность: 2000)');
	message.channel.send(playerTwo + ': крафт Gad575 aPTonAyK (оружие: 2 тошнителя, прочность: 2000)');
	fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 1.txt', '2000', 'utf8');
	fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Прочность 2.txt', '2000', 'utf8');
	roundOne(message);
}
noOne = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 1.txt', 'utf8');
noTwo = fs.readFileSync('C:/Users/Gad575/Desktop/Discord_bot/Игра/Укрытие 2.txt', 'utf8');
function roundOne(message){
	if(noTwo == 'Нет') {
		message.channel.send(playerOne + ', твой ход.\n\nВыбери действие:\n1) Атаковать врага.\n2) Спрятаться в укрытие (+1 ход).\n3) Подойти к врагу (+1 ход).\nФормат ответа: /game 1 <НомерДействия>');
	}else{
		message.channel.send(playerOne + ', твой ход.\n\nВыбери действие:\n1) Недоступно.\n2) Спрятаться в укрытие (+1 ход).\n3) Подойти к врагу (+1 ход).\nФормат ответа: /game 1 <НомерДействия>');
	}
}
function roundTwo(message){
	if(noOne == 'Нет') {
		message.channel.send(playerTwo + ', твой ход.\n\nВыбери действие:\n1) Атаковать врага.\n2) Спрятаться в укрытие (+1 ход).\n3) Отойти от врага (+1 ход).\nФормат ответа: /game 2 <НомерДействия>');
	}else{
		message.channel.send(playerTwo + ', твой ход.\n\nВыбери действие:\n1) Недоступно.\n2) Спрятаться в укрытие (+1 ход).\n3) Подойти к врагу (+1 ход).\nФормат ответа: /game 1 <НомерДействия>');
	}
}

function clear(){
	fs.writeFileSync('C:/Users/Gad575/Desktop/Discord_bot/Антиспам ' + checkMessage.member.user.username + '.txt', '1', 'utf8');
	clearInterval(temp);
}

client.login(config.token);
