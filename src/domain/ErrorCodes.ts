import { TypeDefinition } from "../models/generic";

export class ErrorCodes {
    public static NoError: TypeDefinition = { id: 0, name: "No error" };
    public static Error: TypeDefinition = { id: 1, name: "Error" };
    public static ValidationError: TypeDefinition = { id: 2, name: "Validation error" };

    public static NotFound: TypeDefinition = { id: 101, name: "Not found" };
    public static AccessDenied: TypeDefinition = { id: 102, name: "Access denied" };
   

    public static Values: TypeDefinition[] = [
        ErrorCodes.NoError,
        ErrorCodes.Error,
        ErrorCodes.ValidationError,
        ErrorCodes.NotFound,
        ErrorCodes.AccessDenied,        
    ];
}
