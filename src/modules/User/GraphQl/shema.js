import * as userController from './fields.js'

const userSchema = {
    query: {
        users: userController.users,
        getUserInformation: userController.getUserInformation,
    },
    mutation: {
        
    }
};


export default userSchema;