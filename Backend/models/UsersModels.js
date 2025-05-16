export class UsersModels {
    constructor(usersData) {
        this.email = usersData.email;
        this.password = usersData.password;
        this.organization = usersData.organization;
    }
}