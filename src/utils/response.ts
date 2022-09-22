export default (successful: Boolean, message: String) : String => {
    return JSON.stringify({
        successful: successful,
        message: message
    });
}