import { EmailAddress } from "./EmailAddress";

export interface ContactPerson extends EmailAddress {
    phone?: string;
    title?: string;
}
