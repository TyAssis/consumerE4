const config = {
	dir: {
        positions: 'C:\\receptores\\gatewayE4\\messages\\positions\\',
        alarms: 'C:\\receptores\\gatewayE4\\messages\\alarms\\',
        commands: 'C:\\receptores\\gatewayE4\\messages\\commands\\',
        responses: 'C:\\receptores\\gatewayE4\\messages\\responses\\',
        exceptions: 'C:\\receptores\\gatewayE4\\messages\\exceptions\\'
    }/*
    dir: {
        positions: '/var/gatewayE4/messages/positions/',
        alarms: '/var/gatewayE4/messages/alarms/',
        commands: '/var/gatewayE4/messages/commands/',
        responses: '/var/gatewayE4/messages/responses/',
        exceptions: '/var/gatewayE4/messages/exceptions/'
    }*/
    ,
    db: {
    	host: "YOUR IP",
	    user: "YOUR USERNAME",
	    password: "YOUR PASSWORD",
	    database: "YOUR DB NAME",
	    port: 0000
    }
};

exports.config = config;