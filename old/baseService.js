async function waiting(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
};

const responseUrl = async (page, xhr) => {
    let checkUrl = page.waitForResponse(
        (r) => r.request().url().includes(xhr) && r.request().method() != "OPTIONS"
    );
    let rawResponseUrl = await checkUrl;
    let responseUrl = await rawResponseUrl?.json();
    return responseUrl;
};

export default responseUrl;