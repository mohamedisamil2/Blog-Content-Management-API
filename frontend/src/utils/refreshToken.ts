


export async function refreshAccessToken():Promise<string> {
    const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            query: `
                mutation RefreshTokenMutation{
                    refreshToken {
                        accessToken
                    }
                }
            `
        })
    });

    const result = await response.json();
    if (result.errors) throw new Error("Refresh Failed");
    
    return result.data.refreshToken.accessToken;
    
}