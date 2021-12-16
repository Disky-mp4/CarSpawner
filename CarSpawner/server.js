onNet('disky:spawnCar', (vehicleName) => {
    if(IsPlayerAceAllowed(source, 'disky.spawnVehicles')){ // if the person has permission
        emitNet('disky:spawnVehicle', source, vehicleName); // emit client function to spawn car, pass in vehicleName
    }else{ // if they don't have permission
        emitNet('chat:addMessage', source, {
            args: ['Server', 'You do not have permission to spawn vehicles!'],
            color: [255, 0, 0]
        })
    }
})