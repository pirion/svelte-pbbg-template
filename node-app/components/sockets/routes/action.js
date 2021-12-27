//should be generated from database at restart.
let actionData = {
    gathering: {
        botany: [
            {name: 'BotanyItemName1', level:  1},
            {name: 'BotanyItemName2', level:  5},
            {name: 'BotanyItemName3', level: 10},
            {name: 'BotanyItemName4', level: 20},
            {name: 'BotanyItemName5', level: 35},
            {name: 'BotanyItemName6', level: 50}
        ],
        fishing: [
            {name: 'FishingItemName1', level:  1},
            {name: 'FishingItemName2', level:  5},
            {name: 'FishingItemName3', level: 10},
            {name: 'FishingItemName4', level: 20},
            {name: 'FishingItemName5', level: 35},
            {name: 'FishingItemName6', level: 50}
        ],
        forestry: [
            {name: 'ForestryItemName1', level:  1},
            {name: 'ForestryItemName2', level:  5},
            {name: 'ForestryItemName3', level: 10},
            {name: 'ForestryItemName4', level: 20},
            {name: 'ForestryItemName5', level: 35},
            {name: 'ForestryItemName6', level: 50}
        ],
        mining: [
            {name: 'MiningItemName1', level:  1},
            {name: 'MiningItemName2', level:  5},
            {name: 'MiningItemName3', level: 10},
            {name: 'MiningItemName4', level: 20},
            {name: 'MiningItemName5', level: 35},
            {name: 'MiningItemName6', level: 50}
        ]
    },
    processing: {
        alchemy: [{name: 'AlchemyItemName'}],
        blacksmithing: [{name: 'BlacksmithingItemName'}],
        cooking: [{name: 'CookingItemName'}],
        enchanting: [{name: 'EnchantingItemName'}],
        woodworking: [{name: 'WoodworkingItemName'}],
        tailoring: [{name: 'TailoringItemName'}]
    }
}

async function ConfigureChatRoutes(socket, io) {

    socket.on('LoadActionData', (callback) => {
        callback(actionData);
    });

    socket.on('LoadUserData', (callback) => {
        callback({timestamp: (new Date()).toISOString(), id: socket.user.id, username: socket.user.username, levels: {forestry: 5, mining: 1, fishing: 1, botany: 20    }});
    });

    socket.on('SendAction', (data, callback) => {
        console.log(`Action Selected: ${JSON.stringify(data)}`);
        callback({status: {success: true}});
    })

    setInterval(() => {socket.emit(`UpdateUser`, {timestamp: (new Date()).toISOString(), id: socket.user.id, username: socket.user.username, levels: {forestry: 5, mining: 1, fishing: 1, botany: 1}}); }, 60000);

}

module.exports = ConfigureChatRoutes;



