function notify(message){ // notify function, creates a little message above the minimap
    BeginTextCommandThefeedPost('STRING');
    AddTextComponentSubstringPlayerName(message);
    EndTextCommandThefeedPostTicker(true, true);
}

emit('chat:addSuggestion', '/spawncar', 'Spawns the vehicle name you provide. Example: /sc adder');
emit('chat:addSuggestion' ,'/sc', 'Alias of /spawncar, spawns the vehicle name you provide. Example: /sc adder');

RegisterCommand('spawncar',  (x, y, msg) => {
    const args = msg.split(' ');
    if(!args[1]){return notify('You didn\'t provide a vehicle name to spawn!')}
    if(GetVehiclePedIsIn(GetPlayerPed(-1))){  // if the player is already in a vehicle
        DeleteEntity(GetVehiclePedIsIn(GetPlayerPed(-1))); // delete the vehicle they're currently in
    }
    emitNet('disky:spawnCar', args[1]); // execute server function (for permissions check), pass in vehicleName
})

RegisterCommand('sc', (x, y, msg) => { // same command, but abbreviated for ease
    const args = msg.split(' ');
    if(!args[1]){return notify('You didn\'t provide a vehicle name to spawn!')}
    if(GetVehiclePedIsIn(GetPlayerPed(-1))){  // if the player is already in a vehicle
        DeleteEntity(GetVehiclePedIsIn(GetPlayerPed(-1))); // delete the vehicle they're currently in
    }
    emitNet('disky:spawnCar', args[1]); // execute server function (for permissions check), pass in vehicleName
})

onNet('disky:spawnVehicle', (vehicleName) => {
    const vehHash = GetHashKey(vehicleName); // get vehicles hash of desired vehicle
    const vehNameSplit = vehicleName.split(''); // split vehicle name into individual characters
    const properVehicleName = `${vehNameSplit[0].toUpperCase()}${vehicleName.slice(1)}`; // make sure first letter is capitalized
    const desiredModel = RequestModel(vehHash); // initial model request
    if(IsModelAVehicle(desiredModel)){ // make sure the requested/desired model is a vehicle
        const ped = GetPlayerPed(-1); // players ped
        const pedL = GetEntityCoords(ped); // ped location
        const pedHeading = GetEntityHeading(ped); // direction ped/player is facing
        const loaded = setInterval(() => { // begin cycle to request model until request completes
            if(HasModelLoaded(desiredModel)){ // check if model has loaded
                const veh = CreateVehicle(vehHash, pedL[0], pedL[1], pedL[2], pedHeading, true, false); // spawn vehicle
                SetPedIntoVehicle(ped, veh, -1); // put player/ped into spawned vehicle
                SetModelAsNoLongerNeeded(vehHash); // set vehicle no longer needed
                notify(`Spawned ${properVehicleName}`); // notify the vehicle spawned
                clearInterval(loaded); // stop the request model cycle
            }else{
                RequestModel(vehHash); // request the model again
            }
        }, 20)
    }else{
        notify(`Model "${vehicleName}" not found!`); // notify the name they provided was not a vehicle
    }
})