const config = require('./config/config').config;
const pg = require('pg');
const pool = new pg.Pool(config.db);
const moment = require('moment');
const fs = require('fs');

pool.on('error', (err, client) => {
  	pool.end();
  	process.exit(-1);
});

const positions = (content) => {
	content = JSON.parse(content);
	let data = [];
    data['modelo'] = 601;
    data['serie'] = content.tracker_id === undefined ? '' : content.tracker_id;
    data['fabricante'] = 11;
    data['versionid'] = '0';
    data['data_gps'] = content.gps.date === undefined ? '2000-01-01 00:00:00' : content.gps.date;
    data['data_sistema'] = moment().format('YYYY-MM-DD HH:mm:ss');
    data['erb'] = '';
    data['satelites'] = 0;
    data['latitude'] = content.gps.latitude === undefined ? 0 : parseFloat(content.gps.latitude);
    data['longitude'] = content.gps.longitude === undefined ? 0 : parseFloat(content.gps.longitude);
    data['velocidade'] = content.gps.speed === undefined ? 0 : parseFloat(content.gps.speed);
    data['tensao'] = content.car_battery === undefined ? 0 : parseFloat(content.car_battery);
    data['ignicao'] = content.input[4] === undefined ? 0 : parseInt(content.input[4]);
    data['s1'] = content.input[0] === undefined ? 0 : parseInt(content.input[0]); // SOS
    data['s2'] = content.input[1] === undefined ? 0 : parseInt(content.input[1]); // Anti-tamper
    data['s3'] = content.input[2] === undefined ? 0 : parseInt(content.input[2]); // Door? open/close
    data['s4'] = content.input[3] === undefined ? 0 : parseInt(content.input[3]); //  Engine for GT08, TK510 and TK218 
    data['s5'] = content.input[4] === undefined ? 0 : parseInt(content.input[4]); // Engine for E4
    data['s6'] = 0;
    data['s7'] = 0;
    data['s8'] = 0;
    data['a1'] = content.output[0] === undefined ? false : content.output[0] == 1? true : false; // Relat stop car
    data['a2'] = content.output[1] === undefined ? false : content.output[1] == 1? true : false; // Siren
    data['a3'] = content.output[2] === undefined ? false : content.output[2] == 1? true : false; // User-defined
    data['a4'] = content.output[3] === undefined ? false : content.output[3] == 1? true : false; // lock door
    data['a5'] = content.output[4] === undefined ? false : content.output[4] == 1? true : false; // unlock door
    data['a6'] = false;
    data['a7'] = false;
    data['a8'] = false;
    data['violacao_bateria'] = false;
    data['jammer'] = false;
    data['violacao_antena_gps'] = false;
    data['movimento_indevido'] = false;
    data['cerca'] = false;
    data['velocidade_exedida'] = false;
    data['panico'] = false;
    data['terminal'] = false;
    data['status'] = '';
    data['posicao_valida'] = content.gps.valid === undefined ? false : content.gps.valid;
    data['central_request'] = false;
    data['id_recebido'] = false;
    data['rssi'] = '';
    data['version_id'] = '0';
    data['msgtype'] = '0';
    data['ack_satelital'] = '';
    data['velocidade_tacografo'] = 0;
    data['rpm'] = 0;
    data['odometro'] = content.odometer === undefined ? 0 : parseInt(content.odometer);
    data['horimetro'] = 0;
    data['sleep'] = false;
    data['northangle'] = content.gps.direction === undefined ? '0' : validar_curso(content.gps.direction);
    data['memoria'] = false;
    data['servidor'] = 0;
    data['terminal_msg'] = '';
    data['antifurto'] = false;
    data['colisao'] = false;
    data['evento'] = false;
    data['soma_odometro'] = false;
    data['socket'] = 0;
    data['antifurto_status'] = 0;
    data['debug'] = '';
    data['bateria'] = content.tracker_battery === undefined ? '0' : content.tracker_battery;
     
    let sql  = "select insert_posicoes_e3(" + data['modelo'] + ", '" + data['serie'] + "', " + data['fabricante'] + ", '" + data['data_gps'] + "', '" + data['data_sistema'] + "', '" + data['erb'] + "', " + data['satelites'] +
        ", " + data['latitude'] + ", " + data['longitude'] + ", " + data['velocidade'] + ", '" + data['tensao'] + "', '" + data['ignicao'] + "', " + data['s1'] + ", " + data['s2'] + ", " + data['s3'] + ", " + data['s4'] + ", " + data['s5'] + ", " + data['s6'] + 
        ", " + data['s7'] + ", " + data['s8'] + ", '" + data['a1'] + "', '" + data['a2'] + "', '" +  data['a3'] + "', '" + data['a4'] + "', '" + data['a5'] + "', '" + data['a6'] + "', '" + data['a7'] + "', '" + data['a8'] + "', '" + data['violacao_bateria'] + 
        "', '" + data['jammer'] + "', '" + data['violacao_antena_gps'] + "', '" + data['movimento_indevido'] + "', '" + data['cerca'] + "', '" + data['velocidade_exedida'] + "', '" + data['panico'] + "', '" + data['terminal'] + "', '" + data['status'] +
        "', '" + data['posicao_valida'] + "', '" + data['central_request'] + "', '" + data['id_recebido'] + "', '" + data['rssi'] + "', '" + data['versionid'] + "', '" + data['msgtype'] + "', '" + data['ack_satelital'] + "', " + 
        data['velocidade_tacografo'] + ", " + data['rpm'] + ", " + data['odometro'] + ", " + data['horimetro'] + ", '" + data['sleep'] + "', '" + data['northangle'] + "', '" + data['memoria'] + "', " + data['servidor'] + ", '" + data['terminal_msg'] + 
        "', '" + data['antifurto'] + "', '" + data['colisao'] + "', '" + data['evento'] + "', '" + data['soma_odometro'] + "', " + data['socket'] + ", '" + data['antifurto_status'] + "', '" + data['debug'] + "', '" + data['bateria'] + "')";

    pool.connect((err, client, release) => {
    	client.query(sql, function (err, result) {
	        if (err) {
	          	release();
	        }
	        release();
	    });
    });
    
};

const alarms = (content) => {
	content = JSON.parse(content);
	let modelo = 601;
	let serie = content.tracker_id;
	let data = content.gps.date;
	let data_sistema =  moment().format('YYYY-MM-DD HH:mm:ss');
	let fabricante = 11;
	let lat = content.gps.latitude;
	let long = content.gps.longitude;
	let descricao = '';
	let codigo = 0;
	let v1 = ''; let v2 = ''; let v3 = ''; let v4 = ''; let msg = '';
	
	if(content.alarm.id == '01') {
		descricao = "Alerta de Pânico";
		codigo = 3;
	} else if (content.alarm.id == '10') {
		descricao = 'Baixo nível de bateria';
		codigo = 1000;
	} else if (content.alarm.id == '11') {
		descricao = 'Velocidade excedida - ' + content.gps.speed + ' Km/h';
		codigo = 5;
	} else if (content.alarm.id == '50') {
		descricao = 'Violação de Bateria';
		codigo = 1;
	} else if (content.alarm.id == '60') {
		descricao = 'Tempo máximo dirigindo excedigo';
		codigo = 21;
	} else if (content.alarm.id == '71') {
		descricao = 'Alerta de colisão';
		codigo = 2;
	} else {
		descricao = 'Evento não definido';
		codigo = 1037;
	}

	let sql = "select insert_stt( " + fabricante + " ," + modelo + ",'" + serie + "', '" + data + "','" + data_sistema + "'," + lat + "," + long + ",'" + descricao + "'," + codigo + ",'" + v1 + "','" + v2 + "','" + v3 + "','" + v4 + "','" + msg + "')";
    
   pool.connect((err, client, release) => {
    	client.query(sql, function (err, result) {
	        if (err) {
				release()	        
			}
	        release();
	    });
    });
    
};

const responses = (content) => {
	content = JSON.parse(content);
	let tracker_id = content.tracker_id;
	let status = content.status;
	let operacao = typeToOperacao(content.type);

	pool.connect((err, client, release) => {
		const query = {
			text: "SELECT codigo FROM comandos where enviado_cpr is false and fabricante=11 and status='AG' and " +
					"serie='" + tracker_id + "' and operacao=" + operacao + " order by codigo asc",
			rowMode: 'array'
		};

    	client.query(query, (err, res) => {
    		if (err) {
    			release();
    		} else {
    			res.rows.map(row => {
    				let codigo = row[0] == null ? 0 : row[0];
	    			let sql = '';
	    			if (codigo != 0) {
	    				if(status) {
		    				sql = "update comandos set enviado_cpr='t', descricao='mensagem enviada por gprs',status=Null,m7rc='f', " + 
							"data_entrega='" + moment().format('YYYY-MM-DD HH:mm:ss') + "' where codigo=" + codigo;
		    			} else {
		    				sql = "update comandos set enviado_cpr='t', descricao='Comando Recusado',status=Null,m7rc='f', " +
		    				"data_entrega='" + moment().format('YYYY-MM-DD HH:mm:ss') + "' where codigo=" + codigo;
		    			}
		    			
		    			client.query(sql, (err, res) => {
		    				if (err) {
		    					
		    				} else {

		    				}
		    			});
		    		}
    			});
    			release();
    		}
    	});
    });
};

const exceptions = (content) => {

};

const commands = () => {

	const query = {
		text: "select serie, operacao, odometro, codigo, saida1 from vwcomandos_modulos where enviado_cpr is false and fabricante='11' and status is null and serie " + 
			"not in(select serie from vwcomandos_modulos where status = 'AG' and enviado_cpr is false and fabricante='11') order by codigo asc",
		rowMode: 'array'
	};

	pool.connect((err, client, release) => {
    	client.query(query, (err, res) => {
    		if(err) {
    			release();
    		} else {
    			res.rows.map(row => {
    				let codigo = row[3];
    				let filename = randomGenerator(999999999, 99999999999999999999).toString();
					filename = str_pad(filename, 20, '0') + "_" + moment().format('YYYY-MM-DDTHH-mm-ss.SSS') + "_" + row[0] + ".json";
					let message = '';
					let type = operacaoToType(row[1]);

					if(row[2] != null) {
						message = `{ "tracker_id": ${row[0]}, "type": ${type}, "value": ${row[2]}}`;
					} else if(row[4] != null) {
						message = `{ "tracker_id": ${row[0]}, "type": ${type}, "value": ${row[4]}}`;
					} else {
						message = `{ "tracker_id": ${row[0]}, "type": ${type}}`;						
					}			
										
					fs.writeFile(config.dir.commands + filename, message, {flag: 'a'}, (err) => {
					    if(err) throw err;

					    let sql = '';
					    if(type == 2 || type == 12) {
					    	sql = "update comandos set enviado_cpr='t', descricao='mensagem enviada por gprs',status=Null,m7rc='f', data_entrega='" + moment().format('YYYY-MM-DD HH:mm:ss') + "' where codigo=" + codigo;
					    } else {
					    	sql = "update comandos set descricao='aguardando resposta do rastreador',status='AG',m7rc='f', data_entrega='" + moment().format('YYYY-MM-DD HH:mm:ss') + "' where codigo=" + codigo;
					    }
					   
					    client.query(sql, (err, result) => {
					    	if(err) {
					    		
					    	} else {
					    	
					    	}
					    });
					});
    			});
    			release();
    		}
    	});
    });
    
};

const timeout = () => {

	const query = "update comandos set status=null, descricao='Tempo Excedido',m7rc='f',enviado_cpr='t' where fabricante=11 and status='AG' and enviado_cpr is false and data_entrega is not null and data_entrega<(current_timestamp -  interval '20 second')";
	pool.connect((err, client, release) => {
    	client.query(query, (err, res) => {
    		if(err) {
    			release();
    		} else {
    			let filename = randomGenerator(999999999, 99999999999999999999).toString();
				filename = str_pad(filename, 20, '0') + "_" + moment().format('YYYY-MM-DDTHH-mm-ss.SSS') + "_" + "0" + ".json";
				let message = "Command Timeout. Please, re-send."
    			fs.writeFile(config.dir.exceptions + filename, message, {flag: 'a'}, (err) => {
					    if(err) throw err;
				});
    			release();
    		}
    	});
    });
    
};


const randomGenerator = (min, max) => {
    return Math.floor(Math.random() * (1 + max - min)) + min;
};

const str_pad = (input, length, string) => {
    string = string || '0';
    input = input + '';
    return input.length >= length ? input : new Array(length - input.length + 1).join(string) + input;
};

const operacaoToType = (operacao) => {
	// GPS7 operacao para Gateway type
	switch(operacao) {
		case 2:
			return 10;
		break;
		case 4:
			return 16;
		break;
		case 12:
			return 2;
		break;
		case 24:
			return 18;
		break;
		case 26:
			return 15;
		break;
		case 31:
			return 5;
		break;
		case 70:
			return 3;
		break;
		case 71:
			return 12;
		break;
		default: return null
	}

};

const typeToOperacao = (type) => {
	// Gateway type para operacao GPS7
	switch(type) {
		case 10:
			return 2;
		break;
		case 16:
			return 4;
		break;
		case 2:
			return 12;
		break;
		case 18:
			return 24;
		break;
		case 15:
			return 26;
		break;
		case 5:
			return 31;
		break;
		case 3:
			return 70;
		break;
		case 12:
			return 71;
		break;
		default: return null
	}
}

const validar_curso = (curso) => {
    let curso_valor = 'n';
    let curso_inteiro = parseInt(curso);

    if (curso_inteiro <= 22) { // N
        curso_valor = 'n';
    } else if (67 >= curso_inteiro) { // NE
        curso_valor = 'ne';
    } else if (112 >= curso_inteiro) { // E
        curso_valor = 'e';
    } else if (157 >= curso_inteiro) { // SE
        curso_valor = 'se';
    } else if (202 >= curso_inteiro) { // S
        curso_valor = 's';
    } else if (247 >= curso_inteiro) { // SO
        curso_valor = 'so';
    } else if (292 >= curso_inteiro) { // 0
        curso_valor = 'o';
    } else if (337 >= curso_inteiro) { // NO
        curso_valor = 'no';
    } else if (360 >= curso_inteiro) { // NO
        curso_valor = 'n';
    } else { //numero maior 360
        curso_valor = 'n';	//erro
    }
  	return curso_valor;
};

module.exports = { positions, alarms, responses, exceptions, commands, timeout };