import { ForbiddenError } from "apollo-server";
export const checkAuth = (context) => {
    if(context === 'no') {
        throw new ForbiddenError("You didn't send token in headers. You can get a token with logging");
    }
};