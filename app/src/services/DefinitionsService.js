const SERVER_PORT = 3000;

export async function getAllDefinitions() {
    const response = await fetch(`http://localhost:${SERVER_PORT}/api/definition`);
    return await response.json();
};

export async function updateDefinitions(data) {
    const response = await fetch(`http://localhost:${SERVER_PORT}/api/definition`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    return await response;
};

export async function treatDefinitions() {
    const response = await fetch(`http://localhost:${SERVER_PORT}/api/definition/treat`);
    return await response.json();
};