const MILLISECONDS_IN_SECOND = 1000, SECONDS_IN_MINUTE = 60, MINUTES_IN_HOUR = 60;

module.exports = {
    MaxLobbyMembers: 4,
    LobbyTTLMs: MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 4,
    FullLobbyTTLMs: MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * 30,
    UserGuildCachedTTLSeconds: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 2,
    MinGuildTagLength: 3,
    MaxGuildTagLength: 4,
    MinDiscordIDLength: 17,
    MaxDiscordIDLength: 21,  // 17-19 is the range + 3 characters for <@1>  
    UserVerificationResponseCodes: { VERIFIED: 1, NO_GUILD: 2, NOT_VERIFIED: 3, ERROR: 4 },
    Raids: [
        { raid: 'Any', emoji: '❔' },
        { raid: 'NOTG', emoji: '🪱' },
        { raid: 'NOL', emoji: '🦌' },
        { raid: 'TCC', emoji: '🗿' },
        { raid: 'TNA', emoji: '💀' },
        { raid: 'TWP', emoji: '👑' },
    ],
    BlacklistModalTypes: { ADD: 1, REMOVE: 2 }
}