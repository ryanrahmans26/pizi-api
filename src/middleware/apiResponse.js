function success(data, message = "Success", code = "200") {
    return [{
        code,
        message,
        data,
    }]
}