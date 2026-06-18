module.exports = {
    generateId: () => Date.now().toString() +
    Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
}

