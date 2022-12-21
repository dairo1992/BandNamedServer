const { io } = require('../index');

const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand( new Band( 'Pop' ) );
bands.addBand( new Band( 'Vallenato' ) );
bands.addBand( new Band( 'Salsa' ) );
bands.addBand( new Band( 'Regaeton' ) );
bands.addBand( new Band( 'Trap' ) );
bands.addBand( new Band( 'Rock' ) );
bands.addBand( new Band( 'Bachata' ) );

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands() );

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);
        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    });

    client.on('vote-band', (payload) => {
        bands.voteBand( payload.id );
        io.emit('active-bands', bands.getBands() );
    });

    client.on('add-band', (payload) => {
        const newBand = new Band( payload.name );
        bands.addBand( newBand );
        io.emit('active-bands', bands.getBands() );
    });

    client.on('delete-band', (payload) => {

        bands.deleteBand( payload.id );
        io.emit('active-bands', bands.getBands() );
    });

    client.on('emitir-mensaje', ( payload ) => {
        // console.log(payload);
        // io.emit('nuevo-mensaje', payload ); // emite a todos!
        client.broadcast.emit('nuevo-mensaje', payload ); // emite a todos menos el que lo emitió
    })


});
