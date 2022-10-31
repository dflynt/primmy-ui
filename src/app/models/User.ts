export interface User {

    userid: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    institution: string;
    field: string;
    focus: string
    signupdate: Date;
    avatar: string;
    deleteddate: string;
    verificationcode: string;    
    authToken: string;
    refreshToken: string;    
}