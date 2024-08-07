import { Bank } from "./Bank";

export class User {
    id: number;
    username?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    email?: string;
    phone?: string;
    address?: string;
    district?: string;
    ward?: string;
    city?: string;
    yob?: string;
    cccd?: string;
    cccdFirst?: string;
    cccdLast?: string;
    cccdFrom?: string;
    avatar?: string;
    bank?: Bank;
    bankAccountNumber?: string;
    bankAccountName?: string;
    state?: string;
    banReason?: string;

    constructor(id: number, username: string, fullName: string,
        firstName: string, lastName: string, password: string, state: string,
        cccdFirst: string, cccdLast: string, cccdFrom: string, email: string, phone: string, address: string,
        district: string, ward: string, city: string, yob: string, cccd: string,
        bank: Bank, bankAccountNumber: string, bankAccountName: string, banReason: string) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.district = district;
        this.ward = ward;
        this.city = city;
        this.yob = yob;
        this.cccd = cccd;
        this.bank = bank;
        this.bankAccountNumber = bankAccountNumber;
        this.bankAccountName = bankAccountName;
        this.state = state;
        this.cccdFirst = cccdFirst;
        this.cccdLast = cccdLast;
        this.cccdFrom = cccdFrom;
        this.banReason = banReason;
    }

}