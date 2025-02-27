import { ResponseStatus } from "@/enums/responseStatus";

function getResponseStatus(statusCode: number): ResponseStatus {
    switch (statusCode) {
        case 200:
            return ResponseStatus.SUCCESS;
        case 201:
            return ResponseStatus.CREATED
        case 400:
            return ResponseStatus.BAD_REQUEST;
        case 401:
            return ResponseStatus.UNAUTHORIZED;
        case 403:
            return ResponseStatus.FORBIDDEN
        case 404:
            return ResponseStatus.NOT_FOUND    
        case 409:
            return ResponseStatus.CONFLICT            
        default:
            return ResponseStatus.ERROR;
    }
}

export default getResponseStatus