const MILLISECONDS_IN_SECOND = 1000, SECONDS_IN_MINUTE = 60, MINUTES_IN_HOUR = 60;

module.exports = {
    MaxLobbyMembers: 4,
    LobbyTTLMs: MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 4,
    FullLobbyTTLMs: MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * 30,
    // UserGuildCachedTTLSeconds: SECONDS_IN_MINUTE * MINUTES_IN_HOUR * 2,
    UserGuildCachedTTLSeconds: SECONDS_IN_MINUTE * 1,
    MinGuildTagLength: 3,
    MaxGuildTagLength: 4,
    userVerificationResponseCodes: { VERIFIED: 1, NO_GUILD: 2, NOT_VERIFIED: 3, ERROR: 4 },
}